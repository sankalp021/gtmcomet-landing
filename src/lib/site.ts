/**
 * Where early-access requests go. Set these in Vercel (Project → Settings →
 * Environment Variables) and redeploy. Until one is set, the application form
 * falls back to "copy the message".
 *
 * NEXT_PUBLIC_CONTACT_EMAIL     e.g. founders@yourdomain.com
 * NEXT_PUBLIC_WHATSAPP_NUMBER   digits only with country code, e.g. 9198XXXXXXXX
 */
export const CONTACT = {
  email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "").trim(),
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""),
};

export const SITE = {
  name: "GtmComet",
  title: "GtmComet: who to contact this week, and why now",
  description:
    "A sales copilot for founder-led B2B teams in India and the Gulf. It works out your ideal customer from your website or a PDF, searches the web for companies that match and are ready to buy, and drafts the first message in your voice. Your first list is free.",
};
