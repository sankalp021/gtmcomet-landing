import { Heading, Wrap } from "./Section";

const STEPS = [
  {
    title: "Send your website or a PDF",
    body: "A pitch deck, brochure or case study works too. GtmComet reads what you sell and drafts your ideal customer profile. Correct anything it got wrong.",
  },
  {
    title: "It searches the web for your buyers",
    body: "Job posts, news, company filings, exhibitor lists. It finds companies that match your ideal customer and are showing a buying signal right now.",
  },
  {
    title: "You get twenty-five a week, with drafts",
    body: "Each account comes with its reason and a first message in your voice. Open it in WhatsApp, Gmail or Outlook, and send it yourself.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" data-sky="day" className="on-paper bg-paper pt-6 pb-24 sm:pb-32">
      <Wrap>
        <Heading className="max-w-[18ch]">Tell us what you sell. We find who buys it.</Heading>
        <ol className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-5">
              <p className="datum text-[2.75rem] leading-none font-[600] text-kesar-600">{i + 1}</p>
              <h3 className="voice-sm mt-4 text-[1.375rem]">{s.title}</h3>
              <p className="mt-2 max-w-[22rem] text-[1.0625rem] leading-[1.5] text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}
