"use client";

import clsx from "clsx";
import { useState } from "react";
import { LIST, type Account } from "@/data/content";
import { useMarket } from "@/lib/market";
import { Heading, Lede, SampleNote, Wrap } from "./Section";
import { SignalShelf } from "./SignalShelf";

export function ListSection() {
  const market = useMarket();
  const data = LIST[market];
  return (
    <section id="list" data-sky="day" className="on-paper bg-paper pb-28 sm:pb-36">
      <Wrap>
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pt-6">
            <Heading>Twenty-five accounts. A reason to write to each.</Heading>
            <Lede>
              Every account on the list carries a why-now card: the public event
              that put it there, where it was seen, and how long it stays
              relevant. No card, no place on the list.
            </Lede>
            <dl className="mt-9 grid max-w-[30rem] grid-cols-[auto_1fr] gap-x-5 gap-y-3 border-t border-ink/10 pt-6 text-[1rem]">
              <dt className="datum text-ink-3">Ideal customer</dt>
              <dd key={`icp-${market}`} className="swap font-medium">
                {data.icp}
              </dd>
              <dt className="datum text-ink-3">Buyer roles</dt>
              <dd key={`roles-${market}`} className="swap font-medium">
                {data.roles}
              </dd>
              <dt className="datum text-ink-3">Starts from</dt>
              <dd className="font-medium">Your website, plus any deck or case study you add</dd>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <Ranked key={market} accounts={data.accounts} />
            <SampleNote>Sample workspace. The companies and signals are made up.</SampleNote>
          </div>
        </div>

        <SignalShelf />
      </Wrap>
    </section>
  );
}

function Ranked({ accounts }: { accounts: Account[] }) {
  const [open, setOpen] = useState(0);
  const [votes, setVotes] = useState<Record<number, "up" | "down" | undefined>>({});

  return (
    <div className="swap overflow-hidden rounded-[22px] bg-white shadow-panel">
      <div className="flex items-end justify-between gap-4 border-b border-ink/[0.08] px-5 pt-5 pb-4 sm:px-6">
        <div>
          <h3 className="voice-sm text-[1.375rem]">This week</h3>
          <p className="datum mt-1 text-[0.9375rem] text-ink-3">Ranked Monday, 9:00 am</p>
        </div>
        <p className="datum text-[0.9375rem] text-ink-2">
          <span className="font-semibold text-ink">25</span> accounts
        </p>
      </div>

      <ol>
        {accounts.map((a, i) => {
          const isOpen = open === i;
          return (
            <li key={a.name} className="border-b border-ink/[0.08] last:border-b-0">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`why-${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className={clsx(
                  "grid w-full grid-cols-[2rem_1fr_auto] items-center gap-x-3 px-5 py-3.5 text-left transition-colors duration-150 ease-[ease] sm:grid-cols-[2.25rem_minmax(0,1.1fr)_minmax(0,1fr)_auto] sm:px-6",
                  isOpen ? "bg-paper/70" : "[@media(hover:hover)_and_(pointer:fine)]:hover:bg-paper/50",
                )}
              >
                <span className="datum text-[1.125rem] font-medium text-ink-3">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[1.0625rem] font-[560]">{a.name}</span>
                  <span className="datum block truncate text-[0.875rem] text-ink-3">{a.place}</span>
                </span>
                <span className="col-start-2 row-start-2 mt-1.5 flex min-w-0 items-center gap-2 sm:col-start-3 sm:row-start-1 sm:mt-0">
                  <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-kesar-500" />
                  <span className="truncate text-[0.9375rem] text-ink-2">{a.signal}</span>
                </span>
                <span className="datum col-start-3 row-start-1 text-right text-[0.9375rem] sm:col-start-4">
                  <span className="text-ink-3">fit </span>
                  <span className="font-semibold">{a.fit}</span>
                </span>
              </button>

              <div id={`why-${i}`} className="fold" data-open={isOpen} inert={!isOpen}>
                <div>
                  <div className="fold-body px-5 pt-1 pb-5 sm:px-6 sm:pl-[4.5rem]">
                    <p className="max-w-[34rem] text-[1rem] leading-[1.5] text-ink">{a.detail}</p>
                    <dl className="datum mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.9375rem] sm:grid-cols-4">
                      <div>
                        <dt className="text-ink-3">Source</dt>
                        <dd className="font-medium">{a.source}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-3">Seen</dt>
                        <dd className="font-medium">{a.seen}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-3">Matched by</dt>
                        <dd className="font-medium">{a.matchedBy}</dd>
                      </div>
                      <div>
                        <dt className="text-ink-3">Contact</dt>
                        <dd className="font-medium">{a.contact}</dd>
                      </div>
                    </dl>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="datum text-[0.9375rem] text-kesar-800">{a.shelf}</p>
                      <div className="flex items-center gap-2">
                        <Vote
                          dir="up"
                          on={votes[i] === "up"}
                          onClick={() =>
                            setVotes((v) => ({ ...v, [i]: v[i] === "up" ? undefined : "up" }))
                          }
                        />
                        <Vote
                          dir="down"
                          on={votes[i] === "down"}
                          onClick={() =>
                            setVotes((v) => ({ ...v, [i]: v[i] === "down" ? undefined : "down" }))
                          }
                        />
                        <a href="#draft" className="btn btn-ink !min-h-9 !rounded-[10px] !px-3.5 !text-[0.9375rem]">
                          Open draft
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="datum border-t border-ink/[0.08] bg-paper/60 px-5 py-3 text-[0.9375rem] text-ink-3 sm:px-6">
        20 more below
      </p>
    </div>
  );
}

function Vote({ dir, on, onClick }: { dir: "up" | "down"; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={dir === "up" ? "Good pick" : "Not a fit"}
      onClick={onClick}
      className={clsx(
        "press flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors duration-150 ease-[ease]",
        on
          ? dir === "up"
            ? "bg-reply-100 text-reply-700"
            : "bg-rose/15 text-rose-700"
          : "text-ink-2 ring-1 ring-ink/15 ring-inset [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ink/5",
      )}
    >
      <svg
        viewBox="0 0 20 20"
        className={clsx("h-[18px] w-[18px]", dir === "down" && "rotate-180")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M6.5 9 9.6 3.2c.9 0 1.9.7 1.9 2v2.6h3.4c1 0 1.8.9 1.6 1.9l-.9 5c-.1.8-.8 1.3-1.6 1.3H6.5M6.5 9v7M6.5 9H4.2c-.4 0-.7.3-.7.7v5.6c0 .4.3.7.7.7h2.3" />
      </svg>
    </button>
  );
}
