"use client";

import { CorridorMap } from "./CorridorMap";
import { setSite, useSite } from "@/lib/apply";
import { useMarket } from "@/lib/market";

const READS = {
  in: "tenders, company filings and job posts",
  gulf: "exhibitor lists, funding news and job posts",
};

export function Hero() {
  const market = useMarket();
  const site = useSite();

  function start(e: React.FormEvent) {
    e.preventDefault();
    const apply = document.getElementById("apply");
    apply?.scrollIntoView({ block: "start" });
    // Land the cursor on the first thing still to fill in
    window.setTimeout(
      () => apply?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true }),
      700,
    );
  }

  return (
    <section
      id="top"
      data-sky="night"
      className="sky-night relative isolate overflow-hidden text-ice-100"
    >
      {/* Phones: the map is its own block above the text. Desktop: it fills the hero. */}
      <CorridorMap className="enter-fade relative -z-20 h-[38svh] min-h-[260px] w-full [--delay:150ms] [--dur:1400ms] max-[899px]:[mask-image:linear-gradient(180deg,#000_72%,transparent)] min-[900px]:absolute min-[900px]:inset-0 min-[900px]:h-auto" />
      {/* keeps the headline readable where it crosses the land */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 max-[899px]:hidden min-[900px]:bg-[radial-gradient(64%_78%_at_0%_100%,rgb(13_10_52/0.9)_0%,rgb(13_10_52/0.55)_45%,rgb(13_10_52/0)_100%)]"
      />

      <div className="mx-auto flex max-w-[1240px] flex-col justify-end px-5 pt-2 pb-12 sm:px-8 min-[900px]:min-h-[100svh] min-[900px]:pt-28 min-[900px]:pb-20">
        <p className="enter-fade mb-5 flex items-center gap-2.5 text-[0.9375rem] text-ice-200 [--delay:60ms]">
          <span aria-hidden className="mt-[0.45em] h-2 w-2 shrink-0 self-start rounded-full bg-kesar-500" />
          Early access for ten teams in India and the UAE
        </p>

        <h1 className="voice enter max-w-[13ch] text-[clamp(2.75rem,5.6vw,5.25rem)] text-ice-50 [--dur:800ms] [--rise-blur:6px] [--rise:18px]">
          Who to contact this week, and why now.
        </h1>

        <p className="enter mt-6 max-w-[35rem] text-[1.125rem] leading-[1.5] text-pretty text-ice-200 [--delay:110ms] [--dur:700ms] [--rise:12px] sm:text-[1.1875rem]">
          <span className="max-sm:hidden">GtmComet is a sales copilot for founder-led B2B teams in India and the Gulf. It reads {READS[market]}, ranks</span>
          <span className="sm:hidden">A sales copilot for founder-led B2B teams in India and the Gulf. It ranks</span>{" "}
          the accounts worth your time, drafts the first message in your voice, and leaves the sending to you.
        </p>

        <form
          onSubmit={start}
          className="enter mt-8 flex max-w-[35rem] flex-col gap-2.5 [--delay:190ms] [--dur:700ms] [--rise:8px] sm:flex-row sm:rounded-[18px] sm:bg-ice-100/[0.08] sm:p-1.5 sm:ring-1 sm:ring-ice-100/20 sm:backdrop-blur-md"
        >
          <label htmlFor="hero-site" className="sr-only">
            Your company website
          </label>
          <input
            id="hero-site"
            name="website"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="yourcompany.com"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            className="h-12 w-full min-w-0 shrink-0 rounded-[14px] sm:w-auto sm:flex-1 sm:shrink bg-ice-100/[0.08] px-4 text-ice-50 ring-1 ring-ice-100/20 ring-inset placeholder:text-ice-400 focus-visible:ring-2 focus-visible:ring-kesar-500 focus-visible:outline-none sm:bg-transparent sm:ring-0 sm:focus-visible:ring-0"
          />
          <button type="submit" className="btn btn-kesar">
            Get early access
          </button>
        </form>
        <p className="enter mt-4 text-[1rem] text-ice-300 [--delay:240ms] [--dur:700ms] [--rise:6px]">
          Setup starts from your website.{" "}
          <a
            href="#list"
            className="font-medium text-ice-100 underline decoration-ice-100/40 underline-offset-4 [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-ice-100"
          >
            See a sample week
          </a>
        </p>

        <p className="enter-fade datum mt-8 text-[0.875rem] text-ice-400 [--delay:500ms] min-[900px]:absolute min-[900px]:right-8 min-[900px]:bottom-8 min-[900px]:mt-0">
          Map shows example signals, not live data
        </p>
      </div>
    </section>
  );
}
