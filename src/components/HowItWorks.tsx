import { Heading, Wrap } from "./Section";

const STEPS = [
  {
    title: "Paste your website",
    body: "GtmComet reads what you sell and suggests who buys it. Correct anything it got wrong.",
  },
  {
    title: "Get twenty-five accounts a week",
    body: "Each one is there because of a buying signal, shown with where it was seen.",
  },
  {
    title: "Send from your own apps",
    body: "Open a draft in WhatsApp, Gmail or Outlook, change what you like, and send it yourself.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" data-sky="day" className="on-paper bg-paper pt-6 pb-24 sm:pb-32">
      <Wrap>
        <Heading className="max-w-[18ch]">From your website to your first list.</Heading>
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
