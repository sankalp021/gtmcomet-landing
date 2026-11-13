# GtmComet landing page

The marketing site for GtmComet, a sales copilot for founder-led B2B teams in
India and the Gulf. One page, built with Next.js 16 (App Router), Tailwind CSS 4
and a single canvas for the hero.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

## Where applications go

The page stores nothing and sends nothing. The application form writes a
message and hands it to the visitor's own WhatsApp or mail app, the same way
the product hands off a draft. Tell it where to send people by setting either
or both of these in Vercel (Project → Settings → Environment Variables), then
redeploy:

| Variable | Example |
| --- | --- |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `founders@yourdomain.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `9198XXXXXXXX` (digits only, with country code) |

With neither set, the form falls back to a "Copy message" button.

## Where things live

| Path | What it is |
| --- | --- |
| `src/data/content.ts` | All sample data and most copy: accounts, drafts, signals, orbit steps, plans. Edit here first. |
| `src/components/` | One file per section, in page order: `Hero`, `Dawn`, `ListSection`, `DraftSection`, `HandoffSection`, `Orbit`, `Rules`, `Pricing`, `Faq`, `Apply`, `Footer`. |
| `src/components/CorridorMap.tsx` | The hero canvas: land dots, signals, comet. |
| `src/lib/market.ts` | The India / Gulf switch. It re-skins signals, accounts, drafts and currency across the page, and starts on the Gulf for visitors in a Gulf time zone. |
| `src/app/globals.css` | Design tokens (colour, easing), type roles, skies, the few keyframes. |
| `DESIGN.md` | The design decisions and the rules the page follows. Read before changing the look. |
| `scripts/build-map.mjs` | Regenerates `src/data/land.ts`, the hero's dot lattice (`npm run build:map`). |

## Things to know before editing

- **Sample data is made up.** Company names, people and signals are invented
  and labelled as samples on the page. Keep it that way; do not add real
  customer names, logos or results until they exist.
- **"next" and "later" tags are promises.** They mark what is not live yet
  (Arabic, Saudi Arabia, CRM sync, post-sale steps). Remove a tag only when the
  thing ships.
- **Prices are the planned ones** and are described as such on the page.
- **The map draws no borders.** It is a lattice of physical land only.
- **Motion follows fixed rules** (see `DESIGN.md`): transform, opacity and
  clip-path only; hover behind a media query; reduced motion respected.

## Agent skills

Installed with the [skills CLI](https://github.com/vercel-labs/skills) into
`.claude/skills` and pinned in `skills-lock.json`:

- Emil Kowalski's design-engineering and animation skills
  (`emilkowalski/skills`), which the motion on this page was built against.
- `find-skills` from `vercel-labs/skills`.

Restore them with `npx skills experimental_install`.

## Font

Anek Latin by Ek Type, under the SIL Open Font License
(`src/app/fonts/OFL.txt`). Self-hosted through `next/font/local`.
