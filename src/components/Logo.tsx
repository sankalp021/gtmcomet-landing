import clsx from "clsx";

/** The mark: a comet with its two tails. Straight ion tail, curved dust tail. */
export function CometMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <path d="M24.2 6.2 2 15.4l19.6-3.2z" fill="currentColor" opacity="0.5" />
      <path
        d="M25.6 9.4C16 11.6 8.6 18 5 29c5.2-7.8 11.6-12.6 20-14.4z"
        fill="var(--color-kesar-500)"
      />
      <circle cx="24.6" cy="7.6" r="5" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-2", className)}>
      <CometMark className="h-7 w-7" />
      <span className="text-[1.25rem] leading-none font-[680] tracking-[-0.02em] [font-stretch:114%]">
        GtmComet
      </span>
    </span>
  );
}
