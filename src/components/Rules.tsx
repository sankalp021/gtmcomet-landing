import { NextTag } from "./HandoffSection";
import { Heading, Lede, Wrap } from "./Section";

/* What changes with where your buyers are. */
const MARKETS: { name: string; next?: boolean; rows: [string, string][] }[] = [
  {
    name: "India",
    rows: [
      ["Reads", "Job posts, funding news, company filings, exhibitor lists, software changes, and public tenders."],
      ["Writes in", "English and Hinglish."],
      ["Calendar", "Follow-ups skip public holidays."],
      ["You pay in", "Rupees, by card or UPI."],
    ],
  },
  {
    name: "UAE",
    rows: [
      ["Reads", "Job posts, funding news, exhibitor lists and software changes. Company filings are next."],
      ["Writes in", "English. Arabic is next."],
      ["Calendar", "Follow-ups skip the Saturday and Sunday weekend, and public holidays."],
      ["You pay in", "US dollars, by card."],
    ],
  },
  {
    name: "Saudi Arabia",
    next: true,
    rows: [
      ["Reads", "Public company signals, and the contact channels companies publish themselves."],
      ["Writes in", "Arabic."],
      ["Calendar", "Follow-ups respect the Friday and Saturday weekend, and Ramadan hours."],
    ],
  },
];

const FIELD = [
  ["Detail", "Work email"],
  ["Source", "Licensed provider"],
  ["Found", "11 Nov 2026"],
  ["Checked", "12 Nov 2026"],
  ["Country", "India"],
  ["Opt-out", "None on file"],
];

const WONT = [
  ["Send a message for you", "It opens your app with the draft in place. You send."],
  ["Run sequences or a dialer", "You get a daily list: messages to send today, follow-ups due, customers gone quiet."],
  ["Automate your LinkedIn", "LinkedIn drafts are copied for you to paste. Your account is never touched."],
  ["Invent a reason to write", "A line with no evidence behind it is not written."],
  ["Train AI models on your data", "Only the details a draft needs go to the model, and none of it is used for training."],
  ["Read your whole inbox", "Mailbox access is read-only, and limited to the conversations it helped you start."],
];

export function Rules() {
  return (
    <section id="rules" data-sky="day" className="on-paper bg-paper py-28 sm:py-36">
      <Wrap>
        <div className="max-w-[46rem]">
          <Heading>It works the way your market does.</Heading>
          <Lede>
            What it reads, the language it drafts in, the days it leaves your
            buyers alone and the currency you pay in all follow where you
            sell.
          </Lede>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {MARKETS.map((m) => (
            <div key={m.name} className="border-t-2 border-ink pt-5">
              <h3 className="voice-sm flex items-baseline gap-2.5 text-[1.5rem]">
                {m.name}
                {m.next && <NextTag />}
              </h3>
              <dl className="mt-4">
                {m.rows.map(([k, v]) => (
                  <div key={k} className="border-t border-ink/10 py-3 first:border-t-0 first:pt-0">
                    <dt className="datum text-[0.9375rem] text-ink-3">{k}</dt>
                    <dd className="mt-0.5 text-[1.0625rem] leading-[1.45] text-ink-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-24 grid items-start gap-x-12 gap-y-8 sm:mt-28 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="voice text-[clamp(1.6rem,2.7vw,2.25rem)]">
              Contact data you can account for.
            </h3>
            <p className="prose-w mt-4 text-[1.0625rem] leading-[1.55] text-ink-2">
              Every email and phone number shows where it came from and when it
              was checked. If someone asks not to be contacted, no draft is
              written for them again, by anyone on your team.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-[20px] bg-white px-5 py-4 shadow-lift">
              <p className="datum text-[0.9375rem] text-ink-3">What you see on every contact detail</p>
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
