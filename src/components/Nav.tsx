"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Segmented } from "./Segmented";
import { setMarket, useMarket } from "@/lib/market";

const LINKS = [
  { href: "#list", label: "The list" },
  { href: "#draft", label: "Drafts" },
  { href: "#orbit", label: "After the deal" },
  { href: "#rules", label: "Data rules" },
  { href: "#pricing", label: "Pricing" },
];

export function Nav() {
  const market = useMarket();
  const [sky, setSky] = useState<"night" | "day">("night");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Which sky is under the bar decides its colours.
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-sky]"));
    let frame = 0;
    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
      const line = 34; // px from the top: the middle of the bar
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) {
          setSky(el.dataset.sky === "day" ? "day" : "night");
          break;
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const night = sky === "night";

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-200 ease-[ease]",
        night ? "text-ice-100" : "on-paper text-ink",
        scrolled &&
          (night
            ? "bg-night-950/70 shadow-[0_1px_0_rgb(227_236_255/0.08)] backdrop-blur-lg"
            : "bg-paper/80 shadow-[0_1px_0_rgb(23_20_63/0.08)] backdrop-blur-lg"),
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-[1240px] items-center gap-4 px-5 sm:px-8">
        <a href="#top" aria-label="GtmComet, back to top" className="press shrink-0">
          <Logo />
        </a>

        <nav aria-label="Sections" className="ml-6 hidden items-center gap-6 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={clsx(
                "text-[0.9375rem] font-medium opacity-75 transition-opacity duration-150 ease-[ease]",
                "[@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
          <Segmented
            label="The market you sell into"
            tone={night ? "night" : "paper"}
            size="sm"
            value={market}
            onChange={setMarket}
            options={[
              { value: "in", label: "India" },
              { value: "gulf", label: "Gulf" },
            ]}
          />
          <a
            href="#apply"
            className={clsx("btn !min-h-10 !px-4 max-sm:hidden", night ? "btn-kesar" : "btn-ink")}
          >
            Apply
          </a>
        </div>
      </div>
    </header>
  );
}
