import clsx from "clsx";

export function Wrap({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("mx-auto max-w-[1240px] px-5 sm:px-8", className)}>{children}</div>;
}

export function Heading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3";
}) {
  return (
    <Tag className={clsx("voice text-[clamp(2rem,4.2vw,3.5rem)]", className)}>{children}</Tag>
  );
}

export function Lede({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={clsx("prose-w mt-5 text-[1.125rem] leading-[1.55] text-ink-2", className)}>
      {children}
    </p>
  );
}

export function SampleNote({ children }: { children: React.ReactNode }) {
  return <p className="datum mt-3 text-[0.9375rem] text-ink-3">{children}</p>;
}
