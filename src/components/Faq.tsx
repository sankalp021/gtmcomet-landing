import { Wrap } from "./Section";

const QA: [string, string][] = [
  [
    "How is this different from tools that send for you?",
    "Those tools message buyers on your behalf. GtmComet sends nothing. It does the research and the first draft, then hands over to you. Replies in these markets usually need your judgment, and automated WhatsApp at volume can get a number restricted.",
  ],
  [
    "How does it find my ideal customers?",
    "It reads your website, or a deck or PDF you send, and drafts a profile of who buys from you: countries, industries, company size, buyer roles. You correct it. Then it searches the public web for companies that fit, and keeps only the ones showing a buying signal.",
  ],
  [
    "Which buying signals does it watch?",
    "Companies hiring for roles you sell to, raising funding, opening an office, plant or new entity, exhibiting at a trade show, or switching software. In India it also reads public tenders. Every signal shows where it was seen and how long it stays relevant.",
  ],
  [
    "What is free, exactly?",
    "Your first list: twenty-five accounts that match your ideal customer, each with its reason and a draft. You pay only if you stay, and then you get a fresh list every week.",
  ],
  [
    "Do I need to be on LinkedIn?",
    "No. The list is built from hiring, funding, expansion, trade shows and software switches. If your buyer is on LinkedIn, you get a draft to paste there.",
  ],
  [
    "Where do the contacts come from?",
    "From licensed data providers, and checked before you see them. Each email and phone number shows where it came from and when it was verified.",
  ],
  [
    "What access do you need to my inbox?",
    "Read-only access to Gmail or Outlook, used to match the messages you sent and the replies to them. It reads message details and the matched threads, never the whole mailbox.",
  ],
  [
    "Which languages does it write in?",
    "English, and Hinglish in Roman script. Arabic is next.",
  ],
  [
    "Does it replace my CRM?",
    "No. It keeps one timeline per account and a light pipeline. You can import and export CSV now. Zoho and HubSpot sync come next.",
  ],
  [
    "What does early access involve?",
    "Your first list is free. If you stay, we set up your workspace with you and stay close for the first weeks, and the first ten teams keep today's price for as long as they are customers.",
  ],
];

export function Faq() {
  return (
    <section id="questions" data-sky="day" className="on-paper bg-paper py-28 sm:py-36">
      <Wrap>
        <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
          <h2 className="voice text-[clamp(2rem,4.2vw,3.5rem)] lg:col-span-4">Fair questions.</h2>
          <div className="border-t border-ink/15 lg:col-span-8">
            {QA.map(([q, a]) => (
              <details key={q} className="faq group border-b border-ink/10">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.1875rem] leading-snug font-[560] [font-stretch:106%] [&::-webkit-details-marker]:hidden">
                  {q}
                  <span
                    aria-hidden
                    className="relative mt-1 h-5 w-5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-45"
                  >
                    <span className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2 rounded bg-ink" />
                    <span className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2 rounded bg-ink" />
                  </span>
                </summary>
                <p className="max-w-[40rem] pb-6 text-[1.0625rem] leading-[1.55] text-ink-2">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}
