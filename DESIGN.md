# GtmComet landing page: design notes

The decisions behind the page, so the next change stays consistent with them.

## What the page is for

Founders of 5 to 30 person B2B companies in India and the UAE, who sell on
WhatsApp and email. The page has one job: get them to ask for early access.

## Concept

One night across the India–Gulf corridor. The hero is the corridor at night,
with buying signals (hiring, funding, expansion) switching on like city lights.
The page then passes through dawn into daylight, where the product is shown,
returns to night for the account orbit, and ends at dusk with the application.

The comet is used twice, both times meaning something:

1. In the hero it flies the corridor toward the market you sell into.
2. In the orbit it is the account lifecycle. It comes back around, and its tail
   points away from the ICP at the centre, the way a real comet's tail points
   away from the sun.

## Tokens

| Role | Name | Hex |
| --- | --- | --- |
| Night sky, deepest | night-950 | `#090726` |
| Night sky | night-900 / 800 / 700 | `#0E0B36` / `#15114F` / `#1F1768` |
| Signal, primary action | kesar-500 (saffron) | `#FF9A1F` |
| Dawn midtone, quiet-account warning | rose | `#DB4B7F` |
| Comet, text on night | ice-100 | `#E3ECFF` |
| Daylight background | paper | `#F3F4FA` |
| Text on paper | ink | `#17143F` |
| Reply, positive state | reply-600 | `#0B8A6A` |

Indigo ink instead of black; a cool paper instead of cream. Shadows are tinted
indigo, never neutral grey.

## Type

One family: Anek Latin (Ek Type, Ahmedabad; OFL), variable on weight and width.
The width axis carries the hierarchy:

- **Expanded** (110 to 120%): GtmComet speaking. Headlines, the wordmark.
- **Normal** (100%): reading text.
- **Condensed** (75 to 85%): data. Ranks, dates, sources, prices.

No second typeface, no monospace, no all-caps labels.

## Layout

Left-aligned throughout, 12 columns, 1240px max. Product is shown as working
UI built in HTML, never as screenshots. Content that is a list or a table is
set as a list or a table, not chopped into cards.

## Motion

Follows Emil Kowalski's rules (skills are installed in `.claude/skills`).

- One orchestrated entrance: the hero. Sections below do not fade in on scroll.
- Everything else moves only in answer to an action, or to explain the product
  (the handoff demo, the orbit, the shelf-life tails).
- `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for entering and exiting,
  `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` for things moving on screen.
- Only `transform`, `opacity` and `clip-path` animate. Accordion rows use
  `grid-template-rows`, the one tolerated exception.
- Pressable things scale to 0.97 on press. Hover effects sit behind
  `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion` keeps fades and drops movement; the canvas renders a
  single still frame.

## Content rules

- Nothing on the page is sent, stored or tracked. The application form opens
  the visitor's own WhatsApp or mail app with a draft, as the product does.
- No invented customers, quotes, logos or results. Demo data is labelled as
  sample data and uses made-up company names.
- The map is physical land only. No country borders are drawn.
- Things that ship later (Arabic, Saudi Arabia, CRM sync, post-sale steps) are
  marked "next", not described as live.
