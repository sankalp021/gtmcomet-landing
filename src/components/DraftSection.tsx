"use client";

import clsx from "clsx";
import { useState } from "react";
import { DRAFTS, type Draft } from "@/data/content";
import { useMarket } from "@/lib/market";
import { Heading, Lede, SampleNote, Wrap } from "./Section";
import { Segmented } from "./Segmented";

type Channel = "email" | "whatsapp";

export function DraftSection() {
  const market = useMarket();
  const [channel, setChannel] = useState<Channel>("email");
  const drafts = DRAFTS[market];
  const draft = drafts[channel];

  return (
    <section id="draft" data-sky="day" className="on-paper bg-paper-2 py-28 sm:py-36">
      <Wrap>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Heading className="max-w-[16ch]">Drafts that show their sources.</Heading>
            <Lede>
              Each personal line in a draft is tied to the evidence behind it: a
              signal, a page on your site, one of your case studies. A second
              pass checks every claim against its source. What it cannot
              support, it removes.
            </Lede>
          </div>
          <Segmented
            className="self-start lg:self-auto"
            label="Channel"
            value={channel}
            onChange={setChannel}
            options={[
              { value: "email", label: drafts.email.tab },
              { value: "whatsapp", label: drafts.whatsapp.tab },
            ]}
          />
        </div>

        <Workbench key={`${market}-${channel}`} draft={draft} channel={channel} />
        <SampleNote>Sample draft. The people and companies are made up.</SampleNote>

        <dl className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-3">
          {[
            [
              "Never made up",
              "Metrics, customer names, mutual connections, events, or anything about the buyer's personal life.",
            ],
            [
              "Written like you",
              "Drafts are built from your own site, deck and case studies, so they read like your company and not like a template.",
            ],
            [
              "In the language they answer in",
              "English and Hinglish today. Arabic is next.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="border-t border-ink/15 pt-5">
              <dt className="voice-sm text-[1.1875rem]">{t}</dt>
              <dd className="mt-2 max-w-[24rem] text-[1.0625rem] leading-[1.5] text-ink-2">{d}</dd>
            </div>
          ))}
        </dl>
      </Wrap>
    </section>
  );
}

function Workbench({ draft, channel }: { draft: Draft; channel: Channel }) {
  const [active, setActive] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const lit = active ?? pinned;

  const claimProps = (n: number) => ({
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setActive(n),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && setActive(null),
    onFocus: () => setActive(n),
    onBlur: () => setActive(null),
    onClick: () => setPinned((p) => (p === n ? null : n)),
  });

  return (
    <div className="swap mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
      {/* The draft */}
      <div className="overflow-hidden rounded-[22px] bg-white shadow-panel lg:col-span-7">
        <div className="datum border-b border-ink/[0.08] px-5 py-4 text-[0.9375rem] sm:px-7">
          <p>
            <span className="text-ink-3">To </span>
            <span className="font-medium">{draft.to}</span>
          </p>
          {draft.subject && (
            <p className="mt-1">
              <span className="text-ink-3">Subject </span>
              <span className="font-medium">{draft.subject}</span>
            </p>
          )}
        </div>

        <div
          className={clsx(
            "px-5 py-6 sm:px-7",
            channel === "whatsapp" && "bg-[#f1f7f3]",
          )}
        >
          <div
            className={clsx(
              "space-y-4 text-[1.0625rem] leading-[1.65]",
              channel === "whatsapp" &&
                "ml-auto max-w-[30rem] rounded-[18px] rounded-br-[6px] bg-[#d7f5e3] px-4 py-3 shadow-[0_1px_0_rgb(23_20_63/0.08)]",
            )}
          >
            {draft.body.map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para.map((seg, j) =>
                  seg.claim ? (
                    <span
                      key={j}
                      role="button"
                      tabIndex={0}
                      aria-pressed={pinned === seg.claim}
                      aria-describedby={`ev-${seg.claim}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setPinned((p) => (p === seg.claim ? null : seg.claim!));
                        }
                      }}
                      {...claimProps(seg.claim)}
                      className={clsx(
                        "cursor-pointer rounded-[5px] box-decoration-clone px-[3px] py-[2px] transition-colors duration-150 ease-[ease]",
                        lit === seg.claim
                          ? "bg-kesar-400/75"
                          : "bg-kesar-300/35 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-kesar-400/60",
                      )}
                    >
                      {seg.t}
                      <sup className="datum ml-[3px] align-super text-[0.6875rem] font-semibold text-kesar-800">
                        {seg.claim}
                      </sup>
                    </span>
                  ) : (
                    <span key={j}>{seg.t}</span>
                  ),
                )}
              </p>
            ))}
          </div>
        </div>

        {draft.note && (
          <p className="datum border-t border-ink/[0.08] px-5 py-3 text-[0.9375rem] text-ink-2 sm:px-7">
            {draft.note}
          </p>
        )}

        <div className="border-t border-ink/[0.08] bg-paper/60 px-5 py-4 sm:px-7">
          <p className="datum text-[0.875rem] text-ink-3">Removed before you saw it</p>
          <p className="mt-1 text-[1rem] text-ink-2">
            <s className="decoration-rose decoration-2">{draft.removed}</s>
            <span className="datum ml-2 text-[0.9375rem] text-rose-700">No evidence on file</span>
          </p>
        </div>
      </div>

      {/* The evidence */}
      <ol className="lg:col-span-5">
        {draft.evidence.map((e) => {
          const on = lit === e.n;
          return (
            <li
              key={e.n}
              id={`ev-${e.n}`}
              onPointerEnter={(ev) => ev.pointerType === "mouse" && setActive(e.n)}
              onPointerLeave={(ev) => ev.pointerType === "mouse" && setActive(null)}
              className={clsx(
                "grid grid-cols-[2.25rem_1fr] gap-x-3 rounded-[16px] px-4 py-4 transition-[background-color,box-shadow,opacity] duration-200 ease-[ease]",
                on ? "bg-white shadow-lift" : lit !== null ? "opacity-55" : "",
              )}
            >
              <span
                className={clsx(
                  "datum flex h-9 w-9 items-center justify-center rounded-full text-[1.0625rem] font-semibold transition-colors duration-200 ease-[ease]",
                  on ? "bg-kesar-500 text-ink" : "bg-kesar-300/45 text-kesar-800",
                )}
              >
                {e.n}
              </span>
              <div className="min-w-0">
                <p className="datum text-[0.875rem] text-ink-3">{e.kind}</p>
                <p className="text-[1.0625rem] leading-snug font-[560]">{e.title}</p>
                {e.quote && (
                  <p className="mt-1.5 border-l-2 border-ink/15 pl-3 text-[1rem] leading-[1.45] text-ink-2">
                    {e.quote}
                  </p>
                )}
                <p className="datum mt-1.5 text-[0.9375rem] text-ink-2">{e.meta}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
