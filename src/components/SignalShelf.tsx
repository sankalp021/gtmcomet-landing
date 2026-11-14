"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { MARKET_LABEL, SHELF } from "@/data/content";
import { useMarket } from "@/lib/market";

const SPAN = 60; // days on the axis
const TICKS = [0, 15, 30, 45, 60];

/**
 * How long each kind of signal keeps counting toward an account's rank.
 * Drawn as comet tails: bright the day it is seen, gone when it expires.
 */
export function SignalShelf() {
  const market = useMarket();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-28 grid gap-x-12 gap-y-10 sm:mt-36 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h3 className="voice text-[clamp(1.6rem,2.7vw,2.25rem)]">Signals have a shelf life.</h3>
        <p className="prose-w mt-4 text-[1.0625rem] leading-[1.55] text-ink-2">
          A funding round is a reason to write for about a month. A tender is a
          reason until the bid closes. When a signal goes stale it stops counting
          toward the account&rsquo;s rank, so last quarter&rsquo;s news never reaches this
          week&rsquo;s list.
        </p>
        <p className="prose-w mt-4 text-[1.0625rem] leading-[1.55] text-ink-2">
          Each signal is tied to the right company by its website or registry
          number, not just a similar name. If the match is shaky, the account
          stays off your list.
        </p>
      </div>

      <div ref={ref} data-seen={seen} className="lg:col-span-8">
        <div className="datum grid grid-cols-1 text-[0.875rem] text-ink-3 sm:grid-cols-[14rem_1fr]">
          <span className="max-sm:hidden" />
          <div className="relative h-6">
            {TICKS.map((t) => (
              <span
                key={t}
                className={clsx(
                  "absolute top-0",
                  t === 0 ? "left-0" : t === SPAN ? "right-0" : "-translate-x-1/2",
                )}
                style={t !== 0 && t !== SPAN ? { left: `${(t / SPAN) * 100}%` } : undefined}
              >
                {t === 0 ? "Day seen" : t === SPAN ? "Day 60" : t}
              </span>
            ))}
          </div>
        </div>

        <ul className="border-t border-ink/10">
          {SHELF.map((s, i) => {
            const source = s.source[market];
            const live = source !== null;
            const pct = s.days === null ? 100 : (s.days / SPAN) * 100;
            return (
              <li
                key={s.name}
                className="grid grid-cols-1 items-center gap-y-2 border-b border-ink/10 py-4 sm:grid-cols-[14rem_1fr]"
              >
                <div className={clsx("transition-opacity duration-200 ease-[ease]", !live && "opacity-55")}>
                  <p className="text-[1.0625rem] leading-tight font-[560]">{s.name}</p>
                  <p className="datum mt-0.5 text-[0.875rem] text-ink-3">
                    {live ? source : `Next for the ${MARKET_LABEL[market]}`}
                  </p>
                </div>
                <div className="relative h-7">
                  {/* tick guides */}
                  {TICKS.slice(1, -1).map((t) => (
                    <span
                      key={t}
                      aria-hidden
                      className="absolute inset-y-[-1rem] w-px bg-ink/[0.06]"
                      style={{ left: `${(t / SPAN) * 100}%` }}
                    />
                  ))}
                  <div
                    className="absolute inset-y-0 left-0 flex items-center"
                    style={{ width: `${pct}%` }}
                  >
                    <div
                      className={clsx(
                        "tail relative h-3 w-full rounded-full transition-opacity duration-200 ease-[ease]",
                        live ? "opacity-100" : "opacity-30",
                      )}
                      style={{
                        ["--delay" as string]: `${[0, 60, 110, 150, 180, 200][i] ?? 200}ms`,
                        background:
                          s.days === null
                            ? "linear-gradient(90deg, var(--color-kesar-500) 0%, var(--color-kesar-400) 55%, var(--color-kesar-300) 100%)"
                            : "linear-gradient(90deg, var(--color-kesar-500) 0%, var(--color-kesar-400) 35%, rgb(255 196 112 / 0.55) 70%, rgb(255 196 112 / 0.12) 100%)",
                      }}
                    />
                    <span
                      aria-hidden
                      className={clsx(
                        "absolute left-0 h-[18px] w-[18px] -translate-x-[3px] rounded-full bg-white shadow-[0_0_0_3px_var(--color-kesar-500),0_0_14px_2px_rgb(255_154_31/0.55)] transition-opacity duration-200 ease-[ease]",
                        !live && "opacity-40",
                      )}
                    />
                  </div>
                  <span
                    className={clsx(
                      "datum absolute top-1/2 -translate-y-1/2 text-[0.9375rem] font-medium whitespace-nowrap",
                      pct > 70 ? "right-2 text-ink" : "pl-3 text-ink-2",
                      !live && "opacity-55",
                    )}
                    style={pct > 70 ? undefined : { left: `${pct}%` }}
                  >
                    {s.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="datum mt-3 text-[0.875rem] text-ink-3">
          Starting values. They get adjusted as we learn which signals lead to replies.
        </p>
      </div>
    </div>
  );
}
