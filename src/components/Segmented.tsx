"use client";

import clsx from "clsx";
import { useRef } from "react";

type Option<T extends string> = { value: T; label: string };

/**
 * A segmented control. The active state is a full copy of the options, styled
 * as "on" and clipped to the selected segment; moving the clip gives a clean
 * colour change that timing two separate colour transitions never does.
 */
export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
  tone = "paper",
  size = "md",
  className,
}: {
  label: string;
  value: T;
  onChange: (next: T) => void;
  options: Option<T>[];
  tone?: "night" | "paper";
  size?: "sm" | "md";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const n = options.length;
  const i = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const cols = { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` };
  const clip = `inset(0 ${((n - 1 - i) / n) * 100}% 0 ${(i / n) * 100}% round 9px)`;

  function onKeyDown(e: React.KeyboardEvent) {
    const dir =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + n) % n;
    onChange(options[next].value);
    ref.current
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [next]?.focus();
  }

  const pad = size === "sm" ? "h-8 px-3 text-[0.875rem]" : "h-9 px-4 text-[0.9375rem]";

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={clsx(
        "relative inline-grid rounded-xl p-[3px]",
        tone === "night"
          ? "bg-ice-100/10 ring-1 ring-inset ring-ice-100/15"
          : "bg-ink/[0.06] ring-1 ring-inset ring-ink/[0.06]",
        className,
      )}
      style={cols}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={clsx(
              "press relative rounded-[9px] font-medium whitespace-nowrap",
              pad,
              tone === "night" ? "text-ice-200" : "text-ink-2",
            )}
          >
            {o.label}
          </button>
        );
      })}
      <div
        aria-hidden
        className="seg-on pointer-events-none absolute inset-[3px] grid"
        style={{ ...cols, clipPath: clip }}
      >
        {options.map((o) => (
          <span
            key={o.value}
            className={clsx(
              "flex items-center justify-center font-medium whitespace-nowrap",
              pad,
              tone === "night" ? "bg-ice-50 text-ink" : "bg-ink text-ice-50",
            )}
          >
            {o.label}
          </span>
        ))}
      </div>
    </div>
  );
}
