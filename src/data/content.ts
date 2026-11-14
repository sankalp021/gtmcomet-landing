import type { Market } from "@/lib/market";

/* Every company, person and signal below is made up for the demo. */

export const MARKET_LABEL: Record<Market, string> = {
  in: "India",
  gulf: "Gulf",
};

/* ---------------- Hero map ---------------- */

export type City = {
  id: string;
  name: string;
  lon: number;
  lat: number;
  market: Market | "next";
  /** which side of the dot the label opens on */
  side: "l" | "r";
  cluster: string;
};

export const CITIES: City[] = [
  { id: "del", name: "Delhi NCR", lon: 77.21, lat: 28.61, market: "in", side: "r", cluster: "n" },
  { id: "amd", name: "Ahmedabad", lon: 72.57, lat: 23.02, market: "in", side: "l", cluster: "w" },
  { id: "bom", name: "Mumbai", lon: 72.88, lat: 19.08, market: "in", side: "l", cluster: "w" },
  { id: "pnq", name: "Pune", lon: 73.86, lat: 18.52, market: "in", side: "r", cluster: "w" },
  { id: "hyd", name: "Hyderabad", lon: 78.49, lat: 17.39, market: "in", side: "r", cluster: "s" },
  { id: "blr", name: "Bengaluru", lon: 77.59, lat: 12.97, market: "in", side: "l", cluster: "s" },
  { id: "maa", name: "Chennai", lon: 80.27, lat: 13.08, market: "in", side: "r", cluster: "s" },
  { id: "ccu", name: "Kolkata", lon: 88.36, lat: 22.57, market: "in", side: "l", cluster: "e" },
  { id: "dxb", name: "Dubai", lon: 55.27, lat: 25.2, market: "gulf", side: "r", cluster: "uae" },
  { id: "auh", name: "Abu Dhabi", lon: 54.37, lat: 24.45, market: "gulf", side: "l", cluster: "uae" },
  { id: "rak", name: "Ras Al Khaimah", lon: 55.94, lat: 25.79, market: "gulf", side: "r", cluster: "uae" },
  { id: "aln", name: "Al Ain", lon: 55.76, lat: 24.19, market: "gulf", side: "r", cluster: "uae" },
  { id: "ruh", name: "Riyadh", lon: 46.68, lat: 24.71, market: "next", side: "l", cluster: "ksa" },
];

export type MapSignal = { city: string; what: string; where: string };

export const MAP_SIGNALS: Record<Market, MapSignal[]> = {
  in: [
    { city: "pnq", what: "Tender published", where: "GeM, Pune" },
    { city: "amd", what: "New plant subsidiary filed", where: "MCA, Ahmedabad" },
    { city: "blr", what: "Hiring a maintenance head", where: "Careers page, Bengaluru" },
    { city: "del", what: "Tender published", where: "CPPP, Delhi NCR" },
    { city: "bom", what: "Funding round announced", where: "Press release, Mumbai" },
    { city: "maa", what: "Exhibiting next month", where: "Exhibitor list, Chennai" },
    { city: "hyd", what: "Switched software", where: "Hyderabad" },
    { city: "ccu", what: "Hiring a plant head", where: "Job board, Kolkata" },
  ],
  gulf: [
    { city: "dxb", what: "On the GITEX exhibitor list", where: "Dubai" },
    { city: "auh", what: "Hiring an IT head", where: "Careers page, Abu Dhabi" },
    { city: "dxb", what: "Funding round announced", where: "Regional news, Dubai" },
    { city: "rak", what: "Switched software", where: "Ras Al Khaimah" },
    { city: "aln", what: "Hiring an operations head", where: "Job board, Al Ain" },
  ],
};

/** Corridor routes the comet flies. [from, to] when selling into the Gulf. */
export const ROUTES: [string, string][] = [
  ["bom", "dxb"],
  ["del", "dxb"],
  ["blr", "dxb"],
  ["amd", "auh"],
  ["maa", "auh"],
];

/* ---------------- Ranked list ---------------- */

export type Account = {
  name: string;
  place: string;
  fit: number;
  signal: string;
  source: string;
  seen: string;
  shelf: string;
  matchedBy: string;
  detail: string;
  contact: string;
};

export const LIST: Record<
  Market,
  { icp: string; roles: string; accounts: Account[] }
> = {
  in: {
    icp: "Mid-size manufacturers in Maharashtra and Gujarat",
    roles: "Plant heads, maintenance managers",
    accounts: [
      {
        name: "Western Heavy Fabrication",
        place: "Pune",
        fit: 94,
        signal: "Tender published",
        source: "GeM",
        seen: "2 days ago",
        shelf: "Counts until the bid closes on 28 Nov",
        matchedBy: "Company website",
        detail:
          "Annual maintenance contract for the Pune plant, published on the Government e-Marketplace.",
        contact: "Plant head, verified work email",
      },
      {
        name: "Kaveri Agro Machines",
        place: "Nashik",
        fit: 91,
        signal: "New plant subsidiary filed",
        source: "MCA filing",
        seen: "6 days ago",
        shelf: "Counts for 54 more days",
        matchedBy: "Registry number",
        detail:
          "A new wholly owned subsidiary registered for a second manufacturing unit.",
        contact: "Maintenance manager, verified work email",
      },
      {
        name: "Tapi Textile Mills",
        place: "Surat",
        fit: 88,
        signal: "Hiring a maintenance head",
        source: "Careers page",
        seen: "3 days ago",
        shelf: "Counts for 18 more days",
        matchedBy: "Company website",
        detail:
          "The role lists preventive maintenance planning as its first responsibility.",
        contact: "Plant head, WhatsApp number on company site",
      },
      {
        name: "Girnar Battery Works",
        place: "Rajkot",
        fit: 85,
        signal: "Funding round announced",
        source: "Press release",
        seen: "9 days ago",
        shelf: "Counts for 21 more days",
        matchedBy: "Company website",
        detail: "The release says the money goes into a second production line.",
        contact: "Operations head, verified work email",
      },
      {
        name: "Konkan Castings",
        place: "Kolhapur",
        fit: 83,
        signal: "Exhibiting next month",
        source: "Exhibitor list",
        seen: "1 day ago",
        shelf: "Counts for 60 days around the event",
        matchedBy: "Company name and city",
        detail: "Listed as an exhibitor at a foundry trade show in December.",
        contact: "Maintenance manager, verified work email",
      },
    ],
  },
  gulf: {
    icp: "UAE mainland and free-zone companies, 50 to 500 staff",
    roles: "IT heads, operations heads",
    accounts: [
      {
        name: "Marsa Cold Chain",
        place: "Dubai",
        fit: 93,
        signal: "On the GITEX exhibitor list",
        source: "Exhibitor list",
        seen: "1 day ago",
        shelf: "Counts for 60 days around the event",
        matchedBy: "Company website",
        detail: "Listed for the first time, in the logistics technology hall.",
        contact: "IT head, verified work email",
      },
      {
        name: "Sidra Facilities",
        place: "Abu Dhabi",
        fit: 90,
        signal: "Hiring an IT head",
        source: "Careers page",
        seen: "4 days ago",
        shelf: "Counts for 17 more days",
        matchedBy: "Company website",
        detail: "The post asks for someone to consolidate three office networks.",
        contact: "Operations head, verified work email",
      },
      {
        name: "Falcon Reef Freight",
        place: "Jebel Ali",
        fit: 87,
        signal: "Funding round announced",
        source: "Regional news",
        seen: "8 days ago",
        shelf: "Counts for 22 more days",
        matchedBy: "Company website",
        detail: "The round is reported as funding a second warehouse.",
        contact: "IT head, verified work email",
      },
      {
        name: "Liwa Building Materials",
        place: "Sharjah",
        fit: 84,
        signal: "Switched email provider",
        source: "Software data",
        seen: "5 days ago",
        shelf: "Counts for 40 more days",
        matchedBy: "Company website",
        detail: "The company moved its email to a new provider this month.",
        contact: "Operations head, WhatsApp number on company site",
      },
      {
        name: "Oryx Medical Supply",
        place: "Dubai",
        fit: 82,
        signal: "Hiring an operations head",
        source: "Job board",
        seen: "2 days ago",
        shelf: "Counts for 19 more days",
        matchedBy: "Company name and city",
        detail: "The role reports to the managing director and owns vendors.",
        contact: "Managing director, verified work email",
      },
    ],
  },
};

/* ---------------- Signal shelf life ---------------- */

export type Shelf = {
  name: string;
  days: number | null; // null = until bid close
  label: string;
  source: Record<Market, string | null>; // null = not yet in this market
};

export const SHELF: Shelf[] = [
  {
    name: "Government tender",
    days: null,
    label: "Until the bid closes",
    source: { in: "GeM and CPPP", gulf: null },
  },
  {
    name: "Company registry filing",
    days: 60,
    label: "60 days",
    source: { in: "MCA filings", gulf: null },
  },
  {
    name: "Trade-show exhibitor",
    days: 60,
    label: "60 days around the event",
    source: { in: "Public exhibitor lists", gulf: "Public exhibitor lists" },
  },
  {
    name: "Software switch",
    days: 45,
    label: "45 days",
    source: { in: "Licensed software data", gulf: "Licensed software data" },
  },
  {
    name: "Funding round",
    days: 30,
    label: "30 days",
    source: { in: "News and press releases", gulf: "Regional news" },
  },
  {
    name: "Hiring for a relevant role",
    days: 21,
    label: "21 days",
    source: { in: "Careers pages, job feeds", gulf: "Careers pages, job feeds" },
  },
];

/* ---------------- Drafts ---------------- */

export type Seg = { t: string; claim?: number };
export type Evidence = { n: number; kind: string; title: string; meta: string; quote?: string };
export type Draft = {
  tab: string;
  to: string;
  subject?: string;
  note?: string;
  body: Seg[][]; // paragraphs of segments
  evidence: Evidence[];
  removed: string;
};

export const DRAFTS: Record<Market, { email: Draft; whatsapp: Draft }> = {
  in: {
    email: {
      tab: "Email, English",
      to: "Plant head, Western Heavy Fabrication",
      subject: "Your maintenance contract tender on GeM",
      body: [
        [{ t: "Dear Mr. Kulkarni," }],
        [
          {
            t: "I saw the tender your Pune plant published on GeM this week for an annual maintenance contract.",
            claim: 1,
          },
          { t: " " },
          {
            t: "We build maintenance scheduling software for mid-size manufacturers,",
            claim: 2,
          },
          { t: " and " },
          {
            t: "at a forging plant in Chakan unplanned downtime fell within two quarters of rollout.",
            claim: 3,
          },
        ],
        [
          {
            t: "Would 20 minutes next week be useful? I can show you how the scheduling works before your bid closes.",
          },
        ],
        [{ t: "Regards," }, { t: "\nNeha" }],
        [{ t: "If this is not relevant, tell me and I will not write again." }],
      ],
      evidence: [
        {
          n: 1,
          kind: "Signal",
          title: "Tender published",
          meta: "GeM, seen 12 Nov 2026. Bid closes 28 Nov",
        },
        {
          n: 2,
          kind: "Your website",
          title: "What we do",
          meta: "Read at onboarding",
          quote: "Maintenance scheduling for mid-size manufacturers.",
        },
        {
          n: 3,
          kind: "Your case study",
          title: "Forging plant, Chakan",
          meta: "Uploaded by you",
          quote: "Unplanned downtime fell in the first two quarters after rollout.",
        },
      ],
      removed: "We already work with several plants near you.",
    },
    whatsapp: {
      tab: "WhatsApp, Hinglish",
      to: "Plant head, Western Heavy Fabrication",
      note: "Offered because you have already emailed this person. WhatsApp comes second by default.",
      body: [
        [
          { t: "Namaste Kulkarni ji, Neha this side. " },
          {
            t: "Tuesday ko maine aapko ek email bheja tha, aapke GeM maintenance tender ke baare mein.",
            claim: 1,
          },
          { t: " " },
          {
            t: "Hum mid-size manufacturers ke liye maintenance scheduling software banate hain.",
            claim: 2,
          },
        ],
        [
          {
            t: "Agar yeh abhi priority hai, toh is week 15 minute baat kar sakte hain? Jab convenient ho, bata dijiye.",
          },
        ],
      ],
      evidence: [
        {
          n: 1,
          kind: "Earlier message",
          title: "Email sent by you",
          meta: "Tue 10 Nov, 10:42. Matched from your Gmail",
        },
        {
          n: 2,
          kind: "Your website",
          title: "What we do",
          meta: "Read at onboarding",
          quote: "Maintenance scheduling for mid-size manufacturers.",
        },
      ],
      removed: "Aapke competitors already use kar rahe hain.",
    },
  },
  gulf: {
    email: {
      tab: "Email, English",
      to: "IT head, Marsa Cold Chain",
      subject: "Saw you on the GITEX exhibitor list",
      body: [
        [{ t: "Hello Ms. Rahman," }],
        [
          {
            t: "I saw Marsa Cold Chain on this year's GITEX exhibitor list.",
            claim: 1,
          },
          { t: " " },
          {
            t: "We run managed IT for UAE companies of 50 to 500 people,",
            claim: 2,
          },
          { t: " and " },
          {
            t: "we moved a Jebel Ali logistics firm to a new office without losing a working day.",
            claim: 3,
          },
        ],
        [
          {
            t: "Would a short call on Monday or Tuesday be useful? I can tell you how we would handle a team your size.",
          },
        ],
        [{ t: "Best regards," }, { t: "\nRahul" }],
        [{ t: "If this is not relevant, tell me and I will not write again." }],
      ],
      evidence: [
        {
          n: 1,
          kind: "Signal",
          title: "On the GITEX exhibitor list",
          meta: "Public exhibitor list, seen 13 Nov 2026",
        },
        {
          n: 2,
          kind: "Your website",
          title: "Services",
          meta: "Read at onboarding",
          quote: "Managed IT for UAE companies of 50 to 500 people.",
        },
        {
          n: 3,
          kind: "Your case study",
          title: "Logistics firm, Jebel Ali",
          meta: "Uploaded by you",
          quote: "Office move completed over one weekend. No working day lost.",
        },
      ],
      removed: "Several of your neighbours in the free zone are our clients.",
    },
    whatsapp: {
      tab: "WhatsApp, English",
      to: "IT head, Marsa Cold Chain",
      note: "Cold WhatsApp is switched on for this team, with a daily limit. 6 new chats used today.",
      body: [
        [
          { t: "Hello Ms. Rahman, Rahul here. " },
          {
            t: "I emailed you on Monday after seeing Marsa Cold Chain on the GITEX exhibitor list.",
            claim: 1,
          },
          { t: " " },
          { t: "We run managed IT for UAE companies your size.", claim: 2 },
        ],
        [{ t: "Would a quick call this week be useful? Any time that suits you." }],
      ],
      evidence: [
        {
          n: 1,
          kind: "Earlier message",
          title: "Email sent by you",
          meta: "Mon 9 Nov, 09:15. Matched from your Outlook",
        },
        {
          n: 2,
          kind: "Your website",
          title: "Services",
          meta: "Read at onboarding",
          quote: "Managed IT for UAE companies of 50 to 500 people.",
        },
      ],
      removed: "Everyone at GITEX is switching providers this year.",
    },
  },
};

/* ---------------- Handoff demo ---------------- */

export const HANDOFF: Record<
  Market,
  { contact: string; initials: string; draft: string; reply: string; me: string; due: string }
> = {
  in: {
    contact: "Mr. Kulkarni",
    initials: "SK",
    me: "Neha",
    draft:
      "Namaste Kulkarni ji, Neha this side. Tuesday ko maine aapko ek email bheja tha, aapke GeM maintenance tender ke baare mein. Is week 15 minute baat kar sakte hain?",
    reply: "Haan, dekha tha. Thursday 4 baje call kar lijiye.",
    due: "Call, Thursday 4:00 pm",
  },
  gulf: {
    contact: "Ms. Rahman",
    initials: "LR",
    me: "Rahul",
    draft:
      "Hello Ms. Rahman, Rahul here. I emailed you on Monday after seeing Marsa Cold Chain on the GITEX exhibitor list. Would a quick call this week be useful?",
    reply: "Hi Rahul, yes. Tuesday after 2 works for me.",
    due: "Call, Tuesday 2:00 pm",
  },
};

/* ---------------- Orbit ---------------- */

export type OrbitStep = {
  title: string;
  body: string;
  half: "before" | "after";
  next?: boolean;
};

export const ORBIT: OrbitStep[] = [
  {
    title: "Paste your website",
    body: "You get a summary of what you sell, a first guess at your ideal customer, and a few angles to pitch. Edit any of them.",
    half: "before",
  },
  {
    title: "Ideal customer and signals",
    body: "You set countries, industries, company size and buyer roles. Public signals are ranked against them.",
    half: "before",
  },
  {
    title: "Ranked accounts",
    body: "Twenty-five accounts for the week, each with the signal that put it there.",
    half: "before",
  },
  {
    title: "Draft with sources",
    body: "One draft per person and channel. Every personal line links to its evidence.",
    half: "before",
  },
  {
    title: "You send",
    body: "One tap opens WhatsApp, Gmail or Outlook with the draft in place. It is noted on the account.",
    half: "before",
  },
  {
    title: "Reply logged",
    body: "Replies are matched from your inbox. On WhatsApp, one tap records what happened.",
    half: "after",
  },
  {
    title: "Deal won",
    body: "Stage and value in rupees or dirhams, on the same account timeline.",
    half: "after",
  },
  {
    title: "Onboarding",
    body: "A checklist starts and the renewal date goes on the calendar.",
    half: "after",
    next: true,
  },
  {
    title: "Check-ins and renewal",
    body: "When a customer goes quiet, a check-in draft appears, well before the renewal date does.",
    half: "after",
    next: true,
  },
  {
    title: "Referrals",
    body: "A happy customer prompts a referral ask, and companies like them move up your list.",
    half: "after",
    next: true,
  },
];

/* ---------------- Pricing ---------------- */

export type Plan = {
  name: string;
  price: Record<Market, { value: number; currency: "INR" | "USD"; unit: string; aside?: string }>;
  who: string;
  includes: { t: string; next?: boolean }[];
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    who: "To see your first list.",
    price: {
      in: { value: 0, currency: "INR", unit: "" },
      gulf: { value: 0, currency: "USD", unit: "" },
    },
    includes: [{ t: "50 contacts a month" }, { t: "1 mailbox" }, { t: "A simple deal pipeline" }],
  },
  {
    name: "Founder",
    who: "For the founder who does the selling.",
    price: {
      in: { value: 1999, currency: "INR", unit: "a month" },
      gulf: { value: 49, currency: "USD", unit: "a month", aside: "about AED 180" },
    },
    includes: [
      { t: "1 seat" },
      { t: "WhatsApp, email and LinkedIn drafts" },
      { t: "A monthly allowance of verified contacts and phone numbers" },
    ],
  },
  {
    name: "Team",
    who: "For the first sales hires.",
    price: {
      in: { value: 3999, currency: "INR", unit: "per seat, a month" },
      gulf: { value: 79, currency: "USD", unit: "per seat, a month", aside: "about AED 290" },
    },
    includes: [
      { t: "A shared daily list" },
      { t: "Onboarding and renewal reminders", next: true },
      { t: "Zoho and HubSpot sync", next: true },
    ],
  },
];
