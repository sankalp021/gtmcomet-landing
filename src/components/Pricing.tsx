"use client";

import NumberFlow from "@number-flow/react";
import clsx from "clsx";
import { PLANS } from "@/data/content";
import { setMarket, useMarket } from "@/lib/market";
import { NextTag } from "./HandoffSection";
import { Heading, Lede, Wrap } from "./Section";
import { Segmented } from "./Segmented";

export function Pricing() {
  const market = useMarket();
  return (
    <section id="pricing" data-sky="day" className="on-paper bg-paper-2 py-28 sm:py-36">
      <Wrap>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading>Pay in rupees, dirhams or dollars.</Heading>
            <Lede>
              Planned prices, {market === "in" ? "by card or UPI" : "by card"}. The
              first ten teams help us test them, so expect them to move before
              launch.
            </Lede>
          </div>
          <Segmented
            className="self-start lg:self-auto"
            label="Prices for"
            value={market}
            onChange={setMarket}
            options={[
              { value: "in", label: "India" },
              { value: "gulf", label: "Gulf" },
            ]}
          />
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[22px] bg-ink/10 shadow-panel md:grid-cols-3">
          {PLANS.map((p, i) => {
            const price = p.price[market];
            const lead = i === 1;
            return (
              <div
                key={p.name}
                className={clsx("flex flex-col px-6 py-7 sm:px-7", lead ? "bg-ink text-ice-100" : "bg-white")}
              >
                <h3 className="voice-sm text-[1.375rem]">{p.name}</h3>
                <p className={clsx("mt-1 text-[1rem]", lead ? "text-ice-300" : "text-ink-3")}>{p.who}</p>

                <p className="datum mt-6 flex h-16 items-end">
                  <span className="text-[3.25rem] leading-none font-[620] tracking-[-0.01em]">
                    {price.value === 0 ? (
                      <span className="mb-[0.24em] block">Free</span>
                    ) : (
                      <NumberFlow
                        value={price.value}
                        locales={price.currency === "INR" ? "en-IN" : "en-US"}
                        format={{
                          style: "currency",
                          currency: price.currency,
                          maximumFractionDigits: 0,
                        }}
                      />
                    )}
                  </span>
                </p>
                <p className={clsx("datum mt-1 min-h-[1.5rem] text-[1rem]", lead ? "text-ice-300" : "text-ink-3")}>
                  {price.unit}
                  {price.aside ? `, ${price.aside}` : ""}
                </p>

                <ul className={clsx("mt-6 border-t pt-4", lead ? "border-ice-100/15" : "border-ink/10")}>
                  {p.includes.map((inc) => (
                    <li key={inc.t} className="flex items-baseline gap-2 py-1.5 text-[1.0625rem] leading-snug">
                      <span
                        aria-hidden
                        className={clsx(
                          "mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full",
                          lead ? "bg-kesar-500" : "bg-ink/35",
                        )}
                      />
                      <span>
                        {inc.t} {inc.next && <NextTag night={lead} />}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="datum mt-4 max-w-[46rem] text-[0.9375rem] leading-snug text-ink-3">
          Contact lookups beyond a plan&rsquo;s cap are billed at cost plus a
          margin.
          {market === "gulf" ? " Dirham amounts are approximate." : ""}
        </p>
      </Wrap>
    </section>
  );
}
