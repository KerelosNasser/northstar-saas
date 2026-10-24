# Design

## Architecture

- App Router with a single route group `app/(app)` holding the shell layout and
  the six pages. Pages are Server Components; only Radix wrappers, charts and
  stateful widgets carry `"use client"`.
- `components/ui/*` holds unstyled-by-default primitives (button, badge, card,
  input, tabs, dialog, dropdown-menu, select, switch, checkbox, tooltip).
- `components/shell/*` holds the app chrome (sidebar, mobile drawer, topbar,
  command search, page header).
- `lib/data/*` holds typed mock records. Presentation components receive data as
  props and never import mock arrays directly, so a real API could replace them.
- `lib/tokens` does not exist: all colour and radius values live as CSS custom
  properties in `app/globals.css` and are consumed through Tailwind utilities
  (`bg-surface`, `text-ink`, `border-border-base`, `rounded-card`, ...).

## Theming

Light palette sampled from Figma. Dark palette is derived: same hue family,
inverted surface elevation, `--danger` becomes a light pink for text/borders
while `--danger-solid` keeps filled destructive buttons white-on-red. Theme is
`light | dark | system`, persisted in `localStorage["northstar-theme"]` and
applied by an inline script before paint to avoid a flash.

## Decisions

- **No shadcn CLI.** The primitives are hand-written on the same Radix packages
  shadcn uses. This avoids a generator rewriting files and keeps the components
  matched to the reference's density.
- **Recharts for charts only.** Donut, waterfall, stacked bars, sparklines and
  the retention heatmap are built from Recharts primitives; the heatmap itself is
  a CSS grid because Recharts has no matrix type.
- **Mock data is typed and colocated.** One module per domain (customers,
  revenue, reports, insights, settings) exporting `readonly` arrays plus derived
  helpers.
