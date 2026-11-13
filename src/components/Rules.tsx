import { NextTag } from "./HandoffSection";
import { Heading, Lede, Wrap } from "./Section";

const COUNTRIES = [
  {
    name: "India",
    law: "DPDP Act",
    rows: [
      "Contacts from licensed providers, verified before you see them.",
      "Opt-out and deletion requests work from the first day.",
      "Follow-ups skip public holidays.",
    ],
  },
  {
    name: "UAE",
    law: "Federal PDPL, DIFC and ADGM",
    rows: [
      "Built to the stricter standard: the fewest fields a draft needs, nothing more.",
      "Contacts at DIFC and ADGM companies are flagged, since those zones run their own rules.",
      "Follow-ups skip the Saturday and Sunday weekend.",
    ],
  },
  {
    name: "Saudi Arabia",
    law: "PDPL",
    next: true,
    rows: [
      "Company-level data only, and the channels a company publishes itself.",
      "No personal-contact enrichment for people in the Kingdom.",
      "Arabic drafting and Ramadan hours arrive with it.",
    ],
  },
];

const FIELD = [
  ["Field", "Work email"],
  ["Source", "Licensed provider"],
  ["Captured", "11 Nov 2026"],
  ["Verified", "12 Nov 2026"],
  ["Held under", "India"],
  ["Opt-out", "None on file"],
];

const WONT = [
  ["Send a message for you", "It opens your app with the draft in place. You send."],
  ["Run sequences or a dialer", "You get a daily queue: handoffs for today, follow-ups due, accounts gone quiet."],
  ["Scrape LinkedIn from our servers", "LinkedIn drafts are copied for you to paste. No automated actions."],
  ["Invent a reason to write", "A line with no evidence behind it is not written."],
  ["Train AI models on your data", "Only the fields a draft needs go to the model, and none of it is used for training."],
  ["Read your whole inbox", "Mailbox access is read-only: message details and the threads matched to a handoff."],
];

export function Rules() {
  return (
    <section id="rules" data-sky="day" className="on-paper bg-paper py-28 sm:py-36">
      <Wrap>
        <div className="grid gap-x-12 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Heading>Data rules are set per country, in the product.</Heading>
            <Lede>
              Every contact field records where it came from, when, and which
              country&rsquo;s rules it is held under. An opt-out blocks every
              draft to that person across your workspace, and it survives
              deletion so it stays blocked.
            </Lede>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[20px] bg-white px-5 py-4 shadow-lift">
              <p className="datum text-[0.875rem] text-ink-3">What one field carries</p>
              <dl className="datum mt-2 grid grid-cols-[6.5rem_1fr] gap-y-1.5 text-[1rem]">
                {FIELD.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-ink-3">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {COUNTRIES.map((c) => (
            <div key={c.name} className="border-t-2 border-ink pt-5">
              <h3 className="voice-sm flex items-baseline gap-2.5 text-[1.5rem]">
                {c.name}
                {c.next && <NextTag />}
              </h3>
              <p className="datum mt-1 text-[0.9375rem] text-ink-3">{c.law}</p>
              <ul className="mt-4">
                {c.rows.map((r) => (
                  <li
                    key={r}
                    className="border-t border-ink/10 py-3 text-[1.0625rem] leading-[1.45] text-ink-2 first:border-t-0 first:pt-0"
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="datum mt-6 text-[0.9375rem] text-ink-3">
          This describes how the product behaves. It is not legal advice.
        </p>

        <div className="mt-24 sm:mt-28">
          <h3 className="voice text-[clamp(1.6rem,2.7vw,2.25rem)]">What it will not do.</h3>
          <dl className="mt-8 border-t border-ink/15">
            {WONT.map(([no, yes]) => (
              <div
                key={no}
                className="grid gap-x-10 gap-y-1 border-b border-ink/10 py-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
              >
                <dt className="text-[1.1875rem] leading-snug font-[560] [font-stretch:108%]">
                  <s className="decoration-rose decoration-2">{no}</s>
                </dt>
                <dd className="text-[1.0625rem] leading-[1.5] text-ink-2">{yes}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Wrap>
    </section>
  );
}
