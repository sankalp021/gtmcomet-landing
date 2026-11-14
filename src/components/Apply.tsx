"use client";

import clsx from "clsx";
import { useId, useState } from "react";
import { setSite, setSource, useSite, useSource, type Source } from "@/lib/apply";
import { CONTACT } from "@/lib/site";
import { Segmented } from "./Segmented";
import { Wrap } from "./Section";

type Where = "India" | "the UAE" | "India and the Gulf";

const STEPS = [
  "Send us your website or a PDF, with the message this form writes.",
  "We work out your ideal customer, search the web for companies that match, and send back 25 accounts with drafts. Free.",
  "If you stay, you keep today's price for as long as you are a customer. That holds for the first ten teams.",
];

function compose(name: string, company: string, source: Source, where: Where, what: string) {
  const sells = what.trim()
    ? `We sell ${what.trim().replace(/\.$/, "")} to buyers in ${where}.`
    : `Our buyers are in ${where}.`;
  const read = source === "pdf" ? " I'm attaching a PDF about what we sell." : "";
  return `Hi, this is ${name.trim()} from ${company.trim()}. ${sells}${read} I'd like my free first list from GtmComet.`;
}

export function Apply() {
  const id = useId();
  const site = useSite();
  const source = useSource();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [what, setWhat] = useState("");
  const [where, setWhere] = useState<Where>("India");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function write(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Add your name so we know who is writing.");
    if (source === "website" && !site.trim())
      return setError("Add your company website, or choose PDF if you would rather send a document.");
    if (source === "pdf" && !company.trim()) return setError("Add your company name.");
    setError(null);
    setMessage(compose(name, source === "pdf" ? company : site, source, where, what));
  }

  async function copy() {
    if (!message) return;
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Copying was blocked by the browser. Select the text and copy it by hand.");
    }
  }

  const text = encodeURIComponent(message ?? "");
  const wa = CONTACT.whatsapp ? `https://wa.me/${CONTACT.whatsapp}?text=${text}` : null;
  const mail = CONTACT.email
    ? `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Free first list: ${(source === "pdf" ? company : site).trim()}`)}&body=${text}`
    : null;

  const field =
    "mt-1.5 h-12 w-full rounded-[12px] bg-ice-100/[0.07] px-3.5 text-ice-50 ring-1 ring-ice-100/20 ring-inset placeholder:text-ice-400 focus-visible:ring-2 focus-visible:ring-kesar-500 focus-visible:outline-none";

  return (
    <>
      {/* Day into night. The two halves tell the nav which colours to wear. */}
      <div className="sky-dusk relative overflow-hidden" aria-hidden>
        <div data-sky="day" className="h-[24vh] min-h-[160px]" />
        <div data-sky="night" className="h-[38vh] min-h-[260px]" />
        <Comet />
      </div>

      <section id="apply" data-sky="night" className="relative bg-night-950 pt-4 pb-28 text-ice-100 sm:pb-36">
        <Wrap className="relative">
          <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 className="voice text-[clamp(2.4rem,5.4vw,4.75rem)] text-ice-50">
                Your first list is free.
              </h2>
              <p className="prose-w mt-6 text-[1.1875rem] leading-[1.5] text-ice-200">
                Somewhere in your market this week, a company is hiring for
                the problem you solve. Send us your website or a PDF, and we
                send back the twenty-five companies most worth your time, each
                with its reason and a draft.
              </p>

              <ol className="mt-10 max-w-[30rem]">
                {STEPS.map((s, i) => (
                  <li key={s} className="grid grid-cols-[2.5rem_1fr] border-t border-ice-100/15 py-4">
                    <span className="datum text-[1.25rem] font-medium text-kesar-400">{i + 1}</span>
                    <span className="text-[1.0625rem] leading-[1.45] text-ice-100">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[24px] bg-night-800/70 p-5 ring-1 ring-ice-100/15 backdrop-blur-md sm:p-7">
                {message === null ? (
                  <form onSubmit={write} noValidate>
                    <div className="mb-5">
                      <p className="mb-1.5 text-[0.9375rem] text-ice-200">What should we read?</p>
                      <Segmented
                        label="What should we read?"
                        tone="night"
                        value={source}
                        onChange={(v) => {
                          setError(null);
                          setSource(v);
                        }}
                        options={[
                          { value: "website", label: "Website" },
                          { value: "pdf", label: "Deck or PDF" },
                        ]}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-[0.9375rem] text-ice-200" htmlFor={`${id}-name`}>
                        Your name
                        <input
                          id={`${id}-name`}
                          name="name"
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={field}
                        />
                      </label>
                      {source === "website" ? (
                        <label className="block text-[0.9375rem] text-ice-200" htmlFor={`${id}-site`}>
                          Company website
                          <input
                            id={`${id}-site`}
                            name="website"
                            inputMode="url"
                            autoComplete="url"
                            autoCapitalize="none"
                            spellCheck={false}
                            placeholder="yourcompany.com"
                            value={site}
                            onChange={(e) => setSite(e.target.value)}
                            className={field}
                          />
                        </label>
                      ) : (
                        <label className="block text-[0.9375rem] text-ice-200" htmlFor={`${id}-company`}>
                          Company name
                          <input
                            id={`${id}-company`}
                            name="company"
                            autoComplete="organization"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className={field}
                          />
                        </label>
                      )}
                    </div>
                    {source === "pdf" && (
                      <p className="mt-3 text-[0.9375rem] leading-snug text-ice-300">
                        A pitch deck, brochure or case study works. You attach it in the chat or
                        email that opens next.
                      </p>
                    )}

                    <label className="mt-4 block text-[0.9375rem] text-ice-200" htmlFor={`${id}-what`}>
                      What you sell, in a line <span className="text-ice-400">(optional)</span>
                      <input
                        id={`${id}-what`}
                        name="what"
                        placeholder="plant-maintenance software"
                        value={what}
                        onChange={(e) => setWhat(e.target.value)}
                        className={field}
                      />
                    </label>

                    <div className="mt-4">
                      <p className="mb-1.5 text-[0.9375rem] text-ice-200">Where your buyers are</p>
                      <Segmented
                        label="Where your buyers are"
                        tone="night"
                        value={where}
                        onChange={setWhere}
                        options={[
                          { value: "India", label: "India" },
                          { value: "the UAE", label: "UAE" },
                          { value: "India and the Gulf", label: "Both" },
                        ]}
                      />
                    </div>

                    {error && (
                      <p role="alert" className="mt-4 text-[0.9375rem] text-kesar-300">
                        {error}
                      </p>
                    )}

                    <button type="submit" className="btn btn-kesar mt-6 w-full">
                      Write my message
                    </button>
                    <p className="datum mt-3 text-[0.9375rem] leading-snug text-ice-400">
                      Nothing is sent or stored by this page. It writes a message and hands it
                      to your own app, the way the product does.
                    </p>
                  </form>
                ) : (
                  <div className="swap">
                    <label className="block text-[0.9375rem] text-ice-200" htmlFor={`${id}-msg`}>
                      Your message. Change anything you like.
                      <textarea
                        id={`${id}-msg`}
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className={clsx(field, "h-auto resize-y py-3 leading-[1.5]")}
                      />
                    </label>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {wa && (
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-kesar">
                          Open in WhatsApp
                        </a>
                      )}
                      {mail && (
                        <a href={mail} className={clsx("btn", wa ? "btn-ghost-night" : "btn-kesar")}>
                          Open in email
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={copy}
                        className={clsx("btn", wa || mail ? "btn-ghost-night" : "btn-kesar")}
                      >
                        <span aria-live="polite">{copied ? "Copied" : "Copy message"}</span>
                      </button>
                    </div>

                    {error && (
                      <p role="alert" className="mt-4 text-[0.9375rem] text-kesar-300">
                        {error}
                      </p>
                    )}

                    {source === "pdf" && (
                      <p className="mt-4 rounded-[12px] bg-kesar-500/15 px-3.5 py-3 text-[0.9375rem] leading-snug text-kesar-300">
                        Attach your PDF in the chat or email before you send.
                      </p>
                    )}
                    <p className="datum mt-4 text-[0.9375rem] leading-snug text-ice-400">
                      {wa || mail
                        ? "You press send. Your free list comes back on the same channel."
                        : "Send it to the founder who shared this page with you."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setMessage(null)}
                      className="press mt-3 text-[0.9375rem] font-medium text-ice-200 underline decoration-ice-100/30 underline-offset-4"
                    >
                      Start over
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Wrap>
      </section>
    </>
  );
}

/* The comet on its way back. A still drawing; nothing here needs to move. */
function Comet() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 900 520"
      className="pointer-events-none absolute bottom-[-3rem] left-[38%] w-[58rem] max-w-none rotate-180 max-md:left-[8%] max-md:w-[40rem]"
    >
      <defs>
        <linearGradient id="a-ion" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e3ecff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e3ecff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="a-dust" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9a1f" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#db4b7f" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#db4b7f" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="a-head">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="30%" stopColor="#e3ecff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#e3ecff" stopOpacity="0" />
        </radialGradient>
        <filter id="a-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path d="M742 84 C 560 150 330 300 60 500 C 320 360 560 230 760 122 Z" fill="url(#a-dust)" filter="url(#a-soft)" />
      <path d="M748 86 L 150 300 L 754 104 Z" fill="url(#a-ion)" />
      <circle cx="752" cy="94" r="54" fill="url(#a-head)" />
      <circle cx="752" cy="94" r="9" fill="#fff" />
    </svg>
  );
}
