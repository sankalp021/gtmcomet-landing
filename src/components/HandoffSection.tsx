"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { HANDOFF } from "@/data/content";
import { useMarket } from "@/lib/market";
import { Heading, Lede, SampleNote, Wrap } from "./Section";

const STATUSES = ["Replied", "Positive", "Meeting", "Not interested"] as const;
type Status = (typeof STATUSES)[number];

const TOOLS: { name: string; how: string; next?: "next" | "later" }[] = [
  { name: "WhatsApp", how: "Opens a chat with the draft in the message box" },
  { name: "Gmail and Outlook", how: "Opens compose with the draft; read-only access matches replies" },
  { name: "LinkedIn", how: "Copies the draft for you to paste" },
  { name: "Your CRM", how: "CSV in and out", },
  { name: "Zoho and HubSpot", how: "Two-way sync", next: "next" },
  { name: "Claude and ChatGPT", how: "Ask about accounts, signals and drafts", next: "later" },
];

export function HandoffSection() {
  const market = useMarket();
  return (
    <section id="handoff" data-sky="day" className="on-paper bg-paper py-28 sm:py-36">
      <Wrap>
        <div className="grid gap-x-12 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Heading>You press send. Every time.</Heading>
            <Lede>
              GtmComet opens WhatsApp, Gmail or Outlook with the draft already
              in place. You read it, change a line, and send it from your own
              number and your own inbox. Nothing goes out on its own, on any
              channel.
            </Lede>

            <dl className="mt-9 space-y-6">
              <div className="border-t border-ink/15 pt-5">
                <dt className="voice-sm text-[1.1875rem]">Warm first on WhatsApp</dt>
                <dd className="prose-w mt-2 text-[1.0625rem] leading-[1.5] text-ink-2">
                  By default a WhatsApp draft is offered only after an email or
                  LinkedIn touch, an inbound lead, or an existing relationship.
                  Cold WhatsApp is a switch you turn on yourself, with a daily
                  cap.
                </dd>
              </div>
              <div className="border-t border-ink/15 pt-5">
                <dt className="voice-sm text-[1.1875rem]">Replies log themselves</dt>
                <dd className="prose-w mt-2 text-[1.0625rem] leading-[1.5] text-ink-2">
                  Connect Gmail or Outlook and replies are matched to the right
                  contact. On WhatsApp, one tap sets the outcome. Anything left
                  unmarked for two days comes back to your queue.
                </dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <Demo key={market} />
            <SampleNote>
              A working sketch of the handoff. Press the buttons; nothing leaves this page.
            </SampleNote>
          </div>
        </div>

        <div className="mt-24 sm:mt-28">
          <h3 className="voice text-[clamp(1.6rem,2.7vw,2.25rem)]">No new tab to live in.</h3>
          <p className="prose-w mt-4 text-[1.0625rem] leading-[1.55] text-ink-2">
            It works through the apps you already have open.
          </p>
          <ul className="mt-8 grid gap-x-10 border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((t) => (
              <li key={t.name} className="border-b border-ink/10 py-4">
                <p className="flex items-baseline gap-2 text-[1.0625rem] font-[560]">
                  {t.name}
                  {t.next && <NextTag label={t.next} />}
                </p>
                <p className="mt-0.5 text-[1rem] leading-[1.45] text-ink-2">{t.how}</p>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}

export function NextTag({ night, label = "next" }: { night?: boolean; label?: string }) {
  return (
    <span
      className={clsx(
        "datum rounded-full px-2 py-[1px] text-[0.8125rem] font-medium",
        night ? "bg-ice-100/12 text-ice-200" : "bg-ink/[0.07] text-ink-2",
      )}
    >
      {label}
    </span>
  );
}

/*
 * Steps: 0 draft ready → 1 handed off (draft sits in the phone's message box)
 *        → 2 you sent it → 3 they replied → 4 outcome logged
 */
function Demo() {
  const market = useMarket();
  const d = HANDOFF[market];
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (step !== 2) return;
    const t = window.setTimeout(() => setStep(3), 1500);
    return () => window.clearTimeout(t);
  }, [step]);

  function reset() {
    setStatus(null);
    setStep(0);
  }

  return (
    <div className="swap grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,18.5rem)] sm:gap-6">
      {/* GtmComet side */}
      <div className="overflow-hidden rounded-[22px] bg-white shadow-panel">
        <div className="flex items-center justify-between gap-3 border-b border-ink/[0.08] px-5 py-4">
          <div>
            <p className="datum text-[0.875rem] text-ink-3">Draft for</p>
            <p className="text-[1.0625rem] font-[560]">{d.contact}</p>
          </div>
          <span className="datum rounded-full bg-reply-100 px-2.5 py-1 text-[0.875rem] font-medium text-reply-700">
            WhatsApp
          </span>
        </div>

        <p className="px-5 py-5 text-[1.0625rem] leading-[1.6]">{d.draft}</p>

        <div className="border-t border-ink/[0.08] px-5 py-4" aria-live="polite">
          {step === 0 && (
            <button type="button" onClick={() => setStep(1)} className="btn btn-ink w-full">
              Open in WhatsApp
            </button>
          )}

          {step >= 1 && (
            <ol className="datum space-y-2 text-[0.9375rem]">
              <Log on>Handed off at 10:42. Touch logged.</Log>
              <Log on={step >= 2} wait="Waiting for you to send it">
                Sent by you.
              </Log>
              {step >= 2 && (
                <Log on={step >= 3} wait="Waiting for a reply">
                  {d.contact} replied.
                </Log>
              )}
            </ol>
          )}

          {step === 3 && (
            <div className="enter mt-4 [--dur:300ms] [--rise:6px]">
              <p className="datum text-[0.875rem] text-ink-3">One tap to log the outcome</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setStatus(s);
                      setStep(4);
                    }}
                    className="press rounded-[10px] px-3 py-2 text-[0.9375rem] font-medium ring-1 ring-ink/15 transition-colors duration-150 ease-[ease] ring-inset [@media(hover:hover)_and_(pointer:fine)]:hover:bg-ink/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && status && (
            <div className="enter mt-4 [--dur:300ms] [--rise:6px]">
              <p className="rounded-[12px] bg-reply-100 px-3.5 py-3 text-[1rem] leading-[1.45] text-reply-700">
                <span className="font-semibold">Logged: {status}.</span>{" "}
                {status === "Not interested"
                  ? "No more drafts will be offered for this contact."
                  : `Next on your queue: ${d.due}.`}
              </p>
              <button
                type="button"
                onClick={reset}
                className="press mt-3 text-[0.9375rem] font-medium text-ink-2 underline decoration-ink/30 underline-offset-4"
              >
                Play it again
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Your phone */}
      <div className="mx-auto w-full max-w-[18.5rem]">
        <div className="rounded-[34px] bg-ink p-[9px] shadow-[0_30px_60px_-28px_rgb(23_20_63/0.6)]">
          <div className="flex h-[25rem] flex-col overflow-hidden rounded-[26px] bg-[#eef3ef]">
            <div className="flex items-center gap-2.5 bg-white px-3.5 py-3 shadow-[0_1px_0_rgb(23_20_63/0.08)]">
              <span className="datum flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-3 text-[0.8125rem] font-semibold text-ink-2">
                {d.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[0.9375rem] leading-tight font-[560]">
                  {d.contact}
                </span>
                <span className="datum block text-[0.8125rem] leading-tight text-ink-3">
                  WhatsApp, your number
                </span>
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-end gap-2 px-3 py-3">
              {step >= 2 && (
                <p className="enter ml-auto max-w-[88%] rounded-[14px] rounded-br-[5px] bg-[#d7f5e3] px-3 py-2 text-[0.875rem] leading-[1.4] shadow-[0_1px_0_rgb(23_20_63/0.08)] [--dur:320ms] [--rise:14px]">
                  {d.draft}
                </p>
              )}
              {step >= 3 && (
                <p className="enter mr-auto max-w-[88%] rounded-[14px] rounded-bl-[5px] bg-white px-3 py-2 text-[0.875rem] leading-[1.4] shadow-[0_1px_0_rgb(23_20_63/0.08)] [--dur:320ms] [--rise:10px]">
                  {d.reply}
                </p>
              )}
            </div>

            <div className="flex items-end gap-2 bg-white/70 px-2.5 py-2.5">
              <div
                className={clsx(
                  "min-h-10 flex-1 rounded-[18px] bg-white px-3.5 py-2 text-[0.875rem] leading-[1.4] ring-1 ring-ink/10",
                  step === 1 ? "text-ink" : "text-ink-3",
                )}
              >
                {step === 1 ? (
                  <span className="swap line-clamp-4">
                    {d.draft}
                    <span
                      aria-hidden
                      className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-reply-600 motion-safe:animate-[caret_1s_steps(1)_infinite]"
                    />
                  </span>
                ) : (
                  "Message"
                )}
              </div>
              <button
                type="button"
                disabled={step !== 1}
                onClick={() => setStep(2)}
                aria-label="Send the message"
                className={clsx(
                  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-[ease]",
                  step === 1
                    ? "bg-reply-600 text-white motion-safe:animate-[nudge_6s_var(--ease-out)_2.4s_infinite] active:scale-95"
                    : "bg-paper-3 text-ink-3",
                )}
              >
                {step === 1 && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-reply-600 opacity-0 motion-safe:animate-[halo_6s_ease-out_2.4s_infinite]"
                  />
                )}
                <svg viewBox="0 0 20 20" className="relative h-[18px] w-[18px]" fill="currentColor" aria-hidden>
                  <path d="M3.2 3.6c-.5-.2-1 .3-.8.8l2 4.8c.1.2.3.4.6.4l5 .4-5 .4c-.3 0-.5.2-.6.4l-2 4.8c-.2.5.3 1 .8.8l14-6.1c.5-.2.5-.9 0-1.100z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <p
          className={clsx(
            "datum mt-3 text-center text-[0.9375rem] transition-opacity duration-200 ease-[ease]",
            step === 1 ? "text-ink opacity-100" : "text-ink-3 opacity-80",
          )}
        >
          {step === 0 && "Your phone. Nothing here yet."}
          {step === 1 && "Your turn. Press send."}
          {step === 2 && "Sent from your number."}
          {step >= 3 && "The reply lands in your own chat."}
        </p>
      </div>
    </div>
  );
}

function Log({
  on,
  wait,
  children,
}: {
  on: boolean;
  wait?: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={clsx(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-[ease]",
          on ? "bg-reply-600 text-white" : "bg-paper-3 text-transparent",
        )}
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2.5 6.2 2.3 2.3 4.7-5" />
        </svg>
      </span>
      <span className={on ? "text-ink" : "text-ink-3"}>{on ? children : wait}</span>
    </li>
  );
}
