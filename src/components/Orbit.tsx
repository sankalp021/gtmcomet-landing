"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { ORBIT } from "@/data/content";
import { NextTag } from "./HandoffSection";
import { Wrap } from "./Section";

/*
 * The account lifecycle as a comet's orbit: ten steps, one loop.
 * The ICP sits at the focus. The comet's tail always points away from it,
 * as a real comet's tail points away from the sun.
 */

const W = 1000;
const H = 560;
const CX = 520;
const CY = 282;
const RX = 392;
const RY = 186;
const TILT = (-7 * Math.PI) / 180;
const SUN = { x: 250, y: 318 };

// Parametric angle of each step, clockwise on screen from the upper left.
const ANGLES = [208, 238, 270, 302, 334, 22, 54, 90, 126, 158].map((d) => (d * Math.PI) / 180);

function at(theta: number) {
  const x = RX * Math.cos(theta);
  const y = RY * Math.sin(theta);
  return {
    x: CX + x * Math.cos(TILT) - y * Math.sin(TILT),
    y: CY + x * Math.sin(TILT) + y * Math.cos(TILT),
  };
}

const NODES = ANGLES.map(at);
// Percentages are rounded so the server and the browser print the same string.
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(2)}%`;
const easeInOut = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

export function Orbit() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<SVGGElement>(null);
  const theta = useRef(ANGLES[0]);
  const raf = useRef(0);

  // Place the comet. Written straight to the DOM; no state per frame.
  function place(t: number) {
    const g = cometRef.current;
    if (!g) return;
    const p = at(t);
    const away = (Math.atan2(p.y - SUN.y, p.x - SUN.x) * 180) / Math.PI;
    g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${away.toFixed(1)})`);
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = theta.current;
    let to = ANGLES[active];
    while (to < from - 0.001) to += Math.PI * 2; // always travel forward round the orbit
    cancelAnimationFrame(raf.current);
    if (reduce || to - from < 0.001) {
      theta.current = ANGLES[active];
      place(theta.current);
      return;
    }
    const dur = 700 + Math.min(900, (to - from) * 260);
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const cur = from + (to - from) * easeInOut(p);
      theta.current = cur;
      place(cur);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else theta.current = ANGLES[active];
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Walk the orbit on its own until someone takes over.
  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % ORBIT.length), 3400);
    return () => window.clearInterval(t);
  }, [inView, paused]);

  const step = ORBIT[active];
  const pick = (i: number) => {
    setPaused(true);
    setActive(i);
  };

  return (
    <section id="orbit" data-sky="night" className="sky-orbit overflow-hidden py-28 text-ice-100 sm:py-36">
      <Wrap>
        <div className="max-w-[46rem]">
          <h2 className="voice text-[clamp(2rem,4.2vw,3.5rem)] text-ice-50">
            Winning the deal is the halfway point.
          </h2>
          <p className="prose-w mt-5 text-[1.125rem] leading-[1.55] text-ice-200">
            Onboarding, renewal dates and check-ins sit on the same account
            timeline as the first signal. Your healthiest customers then sharpen
            who gets ranked next, so each time round the list is better aimed.
          </p>
        </div>

        <div
          ref={rootRef}
          className="mt-10 grid items-center gap-x-10 gap-y-8 lg:mt-4 lg:grid-cols-12"
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
        >
          <div className="relative lg:col-span-8 lg:-ml-10">
            <div className="relative" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                <defs>
                  <radialGradient id="sun" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffd08a" stopOpacity="0.95" />
                    <stop offset="35%" stopColor="#ff9a1f" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#ff9a1f" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="ion" x1="0" x2="1">
                    <stop offset="0%" stopColor="#e3ecff" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#e3ecff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="dust" x1="0" x2="1">
                    <stop offset="0%" stopColor="#ff9a1f" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ff9a1f" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <g transform={`rotate(-7 ${CX} ${CY})`}>
                  <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#e3ecff" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="2 9" strokeLinecap="round" />
                </g>

                {/* the ICP at the focus */}
                <circle cx={SUN.x} cy={SUN.y} r="92" fill="url(#sun)" />
                <circle cx={SUN.x} cy={SUN.y} r="13" fill="#ffd08a" />

                {/* the loop closing: referral and lookalikes refine the ICP */}
                <path
                  d={`M ${NODES[9].x.toFixed(1)} ${NODES[9].y.toFixed(1)} Q ${(NODES[9].x + 30).toFixed(1)} ${SUN.y + 30} ${SUN.x - 24} ${SUN.y + 18}`}
                  fill="none"
                  stroke="#ff9a1f"
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                  strokeDasharray="5 6"
                  strokeLinecap="round"
                />

                <g ref={cometRef} transform={`translate(${NODES[0].x.toFixed(1)} ${NODES[0].y.toFixed(1)})`}>
                  <path d="M0 -3.2 L118 0 L0 3.2 Z" fill="url(#ion)" />
                  <path d="M0 -6 C 40 -4 76 10 104 34 C 70 22 36 14 0 7 Z" fill="url(#dust)" />
                  <circle r="20" fill="#e3ecff" opacity="0.14" />
                  <circle r="8.5" fill="#f1f5ff" />
                </g>
              </svg>

              <p
                className="datum absolute -translate-x-1/2 text-center text-[0.875rem] leading-tight font-medium text-kesar-300 sm:text-[0.9375rem]"
                style={{ left: pct(SUN.x, W), top: pct(SUN.y + 26, H) }}
              >
                Your ICP
              </p>

              {NODES.map((n, i) => {
                const top = n.y < CY;
                const on = i === active;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={on}
                    aria-label={`Step ${i + 1}: ${ORBIT[i].title}`}
                    onClick={() => pick(i)}
                    onFocus={() => setPaused(true)}
                    className="group absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: pct(n.x, W), top: pct(n.y, H) }}
                  >
                    <span
                      className={clsx(
                        "datum absolute top-1/2 left-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.875rem] font-semibold transition-[background-color,color,transform] duration-200 ease-[ease]",
                        on
                          ? "scale-110 bg-ice-50 text-ink"
                          : "bg-night-700 text-ice-200 ring-1 ring-ice-100/30 [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-night-600",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={clsx(
                        "datum pointer-events-none absolute left-1/2 w-max max-w-[9.5rem] -translate-x-1/2 text-center text-[1rem] leading-[1.15] [text-shadow:0_1px_10px_#090726,0_0_3px_#090726] transition-colors duration-200 ease-[ease] max-md:hidden",
                        top ? "bottom-[calc(100%+2px)]" : "top-[calc(100%+2px)]",
                        on ? "font-semibold text-ice-50" : "text-ice-300",
                      )}
                    >
                      {ORBIT[i].title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4" aria-live="polite">
            <div key={active} className="swap">
              <p className="datum flex items-center gap-2.5 text-[1rem] text-ice-300">
                <span>
                  Step {active + 1} of {ORBIT.length}
                </span>
                <span className="text-ice-400">{step.half === "before" ? "Before the deal" : "After the deal"}</span>
                {step.next && <NextTag night />}
              </p>
              <h3 className="voice-sm mt-2 text-[1.75rem] text-ice-50">{step.title}</h3>
              <p className="mt-3 max-w-[26rem] text-[1.125rem] leading-[1.5] text-ice-200">{step.body}</p>
            </div>
            <div className="mt-7 flex items-center gap-2">
              <button
                type="button"
                onClick={() => pick((active - 1 + ORBIT.length) % ORBIT.length)}
                className="btn btn-ghost-night !min-h-10 !px-4"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => pick((active + 1) % ORBIT.length)}
                className="btn btn-ghost-night !min-h-10 !px-4"
              >
                Next step
              </button>
            </div>
            <p className="datum mt-6 max-w-[24rem] text-[0.9375rem] leading-snug text-ice-400">
              Steps 8 to 10 reach early-access teams after the prospecting core.
            </p>
          </div>
        </div>
      </Wrap>
    </section>
  );
}
