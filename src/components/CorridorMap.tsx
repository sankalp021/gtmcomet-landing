"use client";

import { useEffect, useRef } from "react";
import { LAND } from "@/data/land";
import { CITIES, MAP_SIGNALS, ROUTES, type City } from "@/data/content";
import { useMarket, type Market } from "@/lib/market";

/*
 * The India–Gulf corridor at night, drawn on one canvas.
 *
 * - Land is a dot lattice (physical coastlines only, no borders).
 * - Public signals switch on around the cities of the market you sell into.
 * - A comet flies the corridor toward that market.
 *
 * Everything is written straight to the canvas inside one rAF loop; React
 * state is never touched per frame. The loop stops when the hero is off
 * screen or the tab is hidden, and under reduced motion a single still frame
 * is drawn instead.
 */

const TAU = Math.PI * 2;
const K = Math.cos((LAND.lat0 * Math.PI) / 180);

// Lattice points as [lon, lat, lon, lat, ...]
const DOTS = (() => {
  const out: number[] = [];
  LAND.rows.forEach((row, r) => {
    const lat = LAND.latMax - r * LAND.stepLat;
    const off = r % 2 ? LAND.stepLon / 2 : 0;
    for (let i = 0; i < row.length; i += 2) {
      for (let c = row[i]; c < row[i] + row[i + 1]; c++) {
        out.push(LAND.lonMin + c * LAND.stepLon + off, lat);
      }
    }
  });
  return new Float32Array(out);
})();
const N = DOTS.length / 2;

const cityById = new Map(CITIES.map((c) => [c.id, c]));

// How strongly each dot is "lit" by the cities of each market: 0, 1, 2 or 3.
function litBuckets(market: Market) {
  const cities = CITIES.filter((c) => c.market === market);
  const radius = market === "in" ? 5.2 : 4.4; // degrees
  const out = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const lon = DOTS[i * 2];
    const lat = DOTS[i * 2 + 1];
    let best = 0;
    for (const c of cities) {
      const d = Math.hypot((lon - c.lon) * K, lat - c.lat);
      const w = Math.max(0, 1 - d / radius);
      if (w > best) best = w;
    }
    out[i] = best > 0.72 ? 3 : best > 0.42 ? 2 : best > 0.12 ? 1 : 0;
  }
  return out;
}
const LIT: Record<Market, Uint8Array> = { in: litBuckets("in"), gulf: litBuckets("gulf") };

type Cam = { lon: number; lat: number; ppd: number; ax: number; ay: number };

function fit(
  w: number,
  h: number,
  box: [number, number, number, number], // lonMin, lonMax, latMin, latMax
  fracW: number,
  fracH: number,
  ax: number,
  ay: number,
): Cam {
  const [l0, l1, a0, a1] = box;
  const ppd = Math.min((w * fracW) / ((l1 - l0) * K), (h * fracH) / (a1 - a0));
  return { lon: (l0 + l1) / 2, lat: (a0 + a1) / 2, ppd, ax, ay };
}

function camFor(market: Market, w: number, h: number): Cam {
  if (w >= 900) {
    // Desktop: the headline owns the lower left, so the corridor sits up and
    // to the right. Selling into the Gulf pans west until the UAE clears the headline.
    const ppd = Math.min(h * 0.0267, w / 60);
    return market === "in"
      ? { lon: 78.5, lat: 21.5, ppd, ax: 0.785, ay: 0.38 }
      : { lon: 55.3, lat: 25.2, ppd, ax: 0.63, ay: 0.33 };
  }
  // Phones: the map has its own block above the text.
  return market === "in"
    ? fit(w, h, [54, 90, 7, 34], 0.96, 0.8, 0.5, 0.56)
    : fit(w, h, [44, 77, 11, 33], 1.02, 0.8, 0.5, 0.56);
}

// cubic-bezier(0.77, 0, 0.175, 1) is close to this; used for the camera and comet
const easeInOut = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

type Sig = { city: City; born: number; big: boolean };
type Flight = { from: City; to: City; born: number; landed: boolean };

export function CorridorMap({ className }: { className?: string }) {
  const market = useMarket();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const marketRef = useRef<Market>(market);
  const kick = useRef<() => void>(() => {});

  useEffect(() => {
    marketRef.current = market;
    kick.current();
  }, [market]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let clock = 0; // seconds of animation time; only advances while running

    // Camera
    let current: Market = marketRef.current;
    let cam = camFor(current, 1, 1);
    let camFrom = cam;
    let camTo = cam;
    let camT = 1;
    // 0 = India lit, 1 = Gulf lit
    let mix = current === "gulf" ? 1 : 0;

    // Pointer, smoothed so the glow trails the cursor instead of snapping to it
    const pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: false };

    let signals: Sig[] = [];
    let flight: Flight | null = null;
    let nextSignal = 0.5;
    let nextFlight = 1.1;
    let signalCursor = 0;
    let routeCursor = 0;
    const labels: { until: number; cluster: string }[] = [
      { until: 0, cluster: "" },
      { until: 0, cluster: "" },
    ];

    // Projected dot positions, reused every frame
    const xs = new Float32Array(N);
    const ys = new Float32Array(N);

    const px = (lon: number) => cam.ax * w + (lon - cam.lon) * K * cam.ppd;
    const py = (lat: number) => cam.ay * h - (lat - cam.lat) * cam.ppd;

    function resize() {
      const r = wrap!.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      const target = camFor(current, w, h);
      cam = camFrom = camTo = target;
      camT = 1;
      hideLabels();
      if (!running) draw();
    }

    function hideLabels() {
      labels.forEach((l, i) => {
        l.until = 0;
        l.cluster = "";
        labelRefs.current[i]?.setAttribute("data-show", "false");
      });
    }

    function showLabel(slot: number, city: City, what: string, where: string, hold: number) {
      const el = labelRefs.current[slot];
      if (!el) return;
      const x = px(city.lon);
      const y = py(city.lat);
      // Keep the label inside the canvas on narrow screens
      const side = x > w - 190 ? "l" : x < 190 ? "r" : city.side;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.dataset.side = side;
      (el.querySelector("[data-what]") as HTMLElement).textContent = what;
      (el.querySelector("[data-where]") as HTMLElement).textContent = where;
      el.setAttribute("data-show", "true");
      labels[slot].until = clock + hold;
      labels[slot].cluster = city.cluster;
    }

    function spawnSignal(forceCity?: City) {
      const pool = MAP_SIGNALS[current];
      let pick = pool[signalCursor % pool.length];
      if (forceCity) {
        pick = pool.find((s) => s.city === forceCity.id) ?? pick;
      } else {
        signalCursor++;
      }
      const city = cityById.get(pick.city)!;
      signals.push({ city, born: clock, big: Boolean(forceCity) });
      // Label it if a slot is free and nothing nearby is already labelled
      const maxSlots = current === "gulf" || w < 900 ? 1 : 2;
      for (let s = 0; s < maxSlots; s++) {
        const busy = labels[s].until > clock;
        const clash = labels.some((l) => l.until > clock && l.cluster === city.cluster);
        if (!busy && !clash) {
          showLabel(s, city, pick.what, pick.where, 3.6);
          break;
        }
      }
    }

    function launch() {
      const [a, b] = ROUTES[routeCursor++ % ROUTES.length];
      const india = cityById.get(a)!;
      const gulf = cityById.get(b)!;
      flight =
        current === "gulf"
          ? { from: india, to: gulf, born: clock, landed: false }
          : { from: gulf, to: india, born: clock, landed: false };
    }

    function bezier(f: Flight) {
      const x0 = px(f.from.lon);
      const y0 = py(f.from.lat);
      const x2 = px(f.to.lon);
      const y2 = py(f.to.lat);
      const mx = (x0 + x2) / 2;
      const my = (y0 + y2) / 2;
      const dx = x2 - x0;
      const dy = y2 - y0;
      const len = Math.hypot(dx, dy) || 1;
      // Bow the path south, over the Arabian Sea
      let nx = -dy / len;
      let ny = dx / len;
      if (ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      const x1 = mx + nx * len * 0.24;
      const y1 = my + ny * len * 0.24;
      return (t: number) => {
        const u = 1 - t;
        return [
          u * u * x0 + 2 * u * t * x1 + t * t * x2,
          u * u * y0 + 2 * u * t * y1 + t * t * y2,
        ] as const;
      };
    }

    function draw() {
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);

      const r = Math.max(1, Math.min(2.4, cam.ppd * 0.082));

      // ---- Land ----
      ctx!.beginPath();
      for (let i = 0; i < N; i++) {
        const x = (xs[i] = px(DOTS[i * 2]));
        const y = (ys[i] = py(DOTS[i * 2 + 1]));
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
        ctx!.moveTo(x + r, y);
        ctx!.arc(x, y, r, 0, TAU);
      }
      ctx!.fillStyle = "rgba(150,170,240,0.33)";
      ctx!.fill();

      // ---- Lit zones, cross-faded between markets ----
      const zones: [Uint8Array, number][] = [
        [LIT.in, 1 - mix],
        [LIT.gulf, mix],
      ];
      for (const [lit, amount] of zones) {
        if (amount < 0.01) continue;
        for (let b = 1; b <= 3; b++) {
          ctx!.beginPath();
          for (let i = 0; i < N; i++) {
            if (lit[i] !== b) continue;
            const x = xs[i];
            const y = ys[i];
            if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
            ctx!.moveTo(x + r * 1.1, y);
            ctx!.arc(x, y, r * 1.1, 0, TAU);
          }
          ctx!.fillStyle = `rgba(255,${196 - b * 10},${136 - b * 24},${(0.2 + b * 0.22) * amount})`;
          ctx!.fill();
        }
      }

      // ---- Flight path and comet ----
      let headX = -9999;
      let headY = -9999;
      if (flight) {
        const at = bezier(flight);
        const u = (clock - flight.born) / 2.5; // 0..1 flying, then the tail catches up
        const head = easeInOut(Math.min(1, Math.max(0, u)));
        const tailStart = easeInOut(Math.min(1, Math.max(0, u - 0.34)));

        // the route, faintly
        ctx!.beginPath();
        for (let s = 0; s <= 40; s++) {
          const [x, y] = at(s / 40);
          if (s === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.setLineDash([2, 7]);
        ctx!.lineWidth = 1;
        ctx!.strokeStyle = `rgba(227,236,255,${0.2 * Math.min(1, Math.max(0, 1.5 - u))})`;
        ctx!.stroke();
        ctx!.setLineDash([]);

        if (head > tailStart) {
          ctx!.globalCompositeOperation = "lighter";
          ctx!.lineCap = "round";
          const steps = 26;
          let [qx, qy] = at(tailStart);
          for (let s = 1; s <= steps; s++) {
            const f = s / steps;
            const t = tailStart + (head - tailStart) * f;
            const [x, y] = at(t);
            // dust tail: wider, warmer, drifts off the path as it ages
            const drift = (1 - f) * (1 - f) * 12;
            ctx!.beginPath();
            ctx!.moveTo(qx + drift, qy + drift * 0.6);
            ctx!.lineTo(x + drift * 0.9, y + drift * 0.54);
            ctx!.lineWidth = 1 + f * 5;
            ctx!.strokeStyle = `rgba(255,154,31,${f * f * 0.34})`;
            ctx!.stroke();
            // ion tail: thin, cold, on the path
            ctx!.beginPath();
            ctx!.moveTo(qx, qy);
            ctx!.lineTo(x, y);
            ctx!.lineWidth = 0.6 + f * 2.4;
            ctx!.strokeStyle = `rgba(227,236,255,${f * f * 0.9})`;
            ctx!.stroke();
            qx = x;
            qy = y;
          }
          [headX, headY] = at(head);
          const glow = ctx!.createRadialGradient(headX, headY, 0, headX, headY, 22);
          glow.addColorStop(0, "rgba(255,255,255,0.95)");
          glow.addColorStop(0.18, "rgba(227,236,255,0.6)");
          glow.addColorStop(1, "rgba(227,236,255,0)");
          ctx!.fillStyle = glow;
          ctx!.beginPath();
          ctx!.arc(headX, headY, 22, 0, TAU);
          ctx!.fill();
          ctx!.globalCompositeOperation = "source-over";
        }
      }

      // ---- Dots near the cursor and the comet brighten ----
      const glowAt = (gx: number, gy: number, radius: number, strength: number) => {
        if (gx < -500) return;
        const r2 = radius * radius;
        for (let i = 0; i < N; i++) {
          const dx = xs[i] - gx;
          const dy = ys[i] - gy;
          const d2 = dx * dx + dy * dy;
          if (d2 > r2) continue;
          const f = 1 - Math.sqrt(d2) / radius;
          ctx!.beginPath();
          ctx!.arc(xs[i], ys[i], r * (1 + f * 0.5), 0, TAU);
          ctx!.fillStyle = `rgba(227,236,255,${f * f * strength})`;
          ctx!.fill();
        }
      };
      if (pointer.on) glowAt(pointer.sx, pointer.sy, 92, 0.85);
      glowAt(headX, headY, 60, 0.7);

      // ---- Cities ----
      for (const c of CITIES) {
        const x = px(c.lon);
        const y = py(c.lat);
        if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue;
        if (c.market === "next") continue;
        const on = c.market === "gulf" ? mix : 1 - mix;
        ctx!.beginPath();
        ctx!.arc(x, y, 1.6 + on * 1.2, 0, TAU);
        ctx!.fillStyle = `rgba(${Math.round(227 + 28 * on)},${Math.round(236 - 40 * on)},${Math.round(255 - 140 * on)},${0.55 + on * 0.45})`;
        ctx!.fill();
      }

      // ---- Signals: a light switching on, then two rings ----
      ctx!.globalCompositeOperation = "lighter";
      for (const s of signals) {
        const age = clock - s.born;
        const x = px(s.city.lon);
        const y = py(s.city.lat);
        const reach = s.big ? 44 : 30;
        for (const lag of [0, 0.45]) {
          const p = (age - lag) / 1.7;
          if (p <= 0 || p >= 1) continue;
          ctx!.beginPath();
          ctx!.arc(x, y, 3 + easeOut(p) * reach, 0, TAU);
          ctx!.lineWidth = 1.4;
          ctx!.strokeStyle = `rgba(255,170,60,${(1 - p) * 0.9})`;
          ctx!.stroke();
        }
        const core = Math.max(0, 1 - age / 3.2);
        const halo = ctx!.createRadialGradient(x, y, 0, x, y, 16);
        halo.addColorStop(0, `rgba(255,214,150,${0.9 * core})`);
        halo.addColorStop(0.3, `rgba(255,154,31,${0.5 * core})`);
        halo.addColorStop(1, "rgba(255,154,31,0)");
        ctx!.fillStyle = halo;
        ctx!.beginPath();
        ctx!.arc(x, y, 16, 0, TAU);
        ctx!.fill();
      }
      ctx!.globalCompositeOperation = "source-over";
    }

    function step(now: number) {
      raf = requestAnimationFrame(step);
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      clock += dt;

      // camera
      if (camT < 1) {
        camT = Math.min(1, camT + dt / 1.1);
        const e = easeInOut(camT);
        cam = {
          lon: camFrom.lon + (camTo.lon - camFrom.lon) * e,
          lat: camFrom.lat + (camTo.lat - camFrom.lat) * e,
          ppd: camFrom.ppd + (camTo.ppd - camFrom.ppd) * e,
          ax: camTo.ax,
          ay: camTo.ay,
        };
      }
      const target = current === "gulf" ? 1 : 0;
      mix += (target - mix) * (1 - Math.exp(-dt * 4));

      // pointer smoothing
      const k = 1 - Math.exp(-dt * 12);
      pointer.sx += (pointer.x - pointer.sx) * k;
      pointer.sy += (pointer.y - pointer.sy) * k;

      // schedule
      const settled = camT >= 1;
      if (settled && clock > nextSignal) {
        spawnSignal();
        nextSignal = clock + 1.5 + ((signalCursor * 37) % 9) / 10;
      }
      if (settled && !flight && clock > nextFlight) launch();
      if (flight) {
        const u = (clock - flight.born) / 2.5;
        if (u >= 1 && !flight.landed) {
          flight.landed = true;
          spawnSignal(flight.to);
        }
        if (u >= 1.5) {
          flight = null;
          nextFlight = clock + 3.8;
        }
      }
      signals = signals.filter((s) => clock - s.born < 3.4);
      labels.forEach((l, i) => {
        if (l.until && l.until < clock) {
          l.until = 0;
          l.cluster = "";
          labelRefs.current[i]?.setAttribute("data-show", "false");
        }
      });

      draw();
    }

    function still() {
      // One composed frame for reduced motion: lights on, comet mid-flight.
      clock = 10;
      mix = current === "gulf" ? 1 : 0;
      cam = camTo = camFrom = camFor(current, w, h);
      camT = 1;
      const pool = MAP_SIGNALS[current];
      signals = pool.slice(0, 3).map((s) => ({ city: cityById.get(s.city)!, born: clock - 0.9, big: false }));
      const [a, b] = ROUTES[0];
      flight =
        current === "gulf"
          ? { from: cityById.get(a)!, to: cityById.get(b)!, born: clock - 1.75, landed: true }
          : { from: cityById.get(b)!, to: cityById.get(a)!, born: clock - 1.75, landed: true };
      draw();
      hideLabels();
      const first = pool[0];
      showLabel(0, cityById.get(first.city)!, first.what, first.where, Infinity);
    }

    function start() {
      if (running || reduce.matches || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }
    function sync() {
      if (reduce.matches) {
        stop();
        still();
      } else {
        start();
      }
    }

    // Market switch: move the camera, retire what was on screen
    kick.current = () => {
      const next = marketRef.current;
      if (next === current) return;
      current = next;
      hideLabels();
      signals = [];
      flight = null;
      camFrom = cam;
      camTo = camFor(current, w, h);
      camT = 0;
      nextSignal = clock + 1.25;
      nextFlight = clock + 1.6;
      signalCursor = 0;
      if (reduce.matches) still();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = wrap.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (!pointer.on) {
        pointer.sx = pointer.x;
        pointer.sy = pointer.y;
        pointer.on = true;
      }
    };
    const onLeave = () => {
      pointer.on = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) sync();
      else stop();
    });
    io.observe(wrap);
    const onVis = () => (document.hidden ? stop() : sync());
    document.addEventListener("visibilitychange", onVis);
    reduce.addEventListener("change", sync);
    const host = wrap.parentElement ?? wrap;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    resize();
    sync();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      reduce.removeEventListener("change", sync);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      kick.current = () => {};
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className={className}>
      <canvas ref={canvasRef} className="block h-full w-full" />
      {[0, 1].map((i) => (
        <div
          key={i}
          ref={(el) => {
            labelRefs.current[i] = el;
          }}
          data-show="false"
          data-side="r"
          className="group pointer-events-none absolute top-0 left-0 h-0 w-0"
        >
          <div className="absolute top-0 w-max -translate-y-1/2 group-data-[side=l]:right-4 group-data-[side=r]:left-4">
            <div className="sig-label rounded-xl bg-night-950/75 px-3 py-2 ring-1 ring-ice-100/15 backdrop-blur-md group-data-[side=l]:origin-right group-data-[side=r]:origin-left">
              <div data-what className="text-[0.875rem] leading-tight font-[560] text-ice-50" />
              <div data-where className="datum mt-0.5 text-[0.8125rem] leading-tight text-ice-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
