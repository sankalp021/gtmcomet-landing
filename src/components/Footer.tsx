"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Wrap } from "./Section";

const ZONES = [
  ["Pune", "Asia/Kolkata"],
  ["Dubai", "Asia/Dubai"],
] as const;

function Clocks() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = window.setTimeout(tick, 0);
    const every = window.setInterval(tick, 20_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, []);
  return (
    <dl className="datum flex gap-8 text-[1rem]">
      {ZONES.map(([city, zone]) => (
        <div key={city}>
          <dt className="text-ice-400">{city}</dt>
          <dd className="text-[1.375rem] font-medium text-ice-100">
            {now
              ? new Intl.DateTimeFormat("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: zone,
                }).format(now)
              : "--:--"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

const LINKS = [
  ["#list", "The list"],
  ["#draft", "Drafts"],
  ["#handoff", "Sending"],
  ["#orbit", "After the deal"],
  ["#rules", "Data rules"],
  ["#pricing", "Pricing"],
  ["#questions", "Questions"],
  ["#apply", "Early access"],
];

export function Footer() {
  return (
    <footer data-sky="night" className="bg-night-950 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-ice-200">
      <Wrap>
        <div className="grid gap-10 border-t border-ice-100/12 pt-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="text-ice-50" />
            <p className="mt-4 max-w-[22rem] text-[1.0625rem] leading-[1.5]">
              A sales copilot for founder-led B2B teams in India and the Gulf.
              A human sends every message.
            </p>
          </div>
          <nav aria-label="Footer" className="md:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[1rem]">
              {LINKS.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="opacity-80 transition-opacity duration-150 ease-[ease] [@media(hover:hover)_and_(pointer:fine)]:hover:opacity-100"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3 md:justify-self-end">
            <Clocks />
          </div>
        </div>
        <p className="datum mt-12 text-[0.9375rem] text-ice-400">
          © 2026 GtmComet. Sample accounts, people and signals on this page are made up for
          illustration.
        </p>
      </Wrap>
    </footer>
  );
}
