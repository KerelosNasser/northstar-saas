# Tasks

## 1. Foundation (done)

- [x] 1.1 Design tokens, light + dark palettes, base layer in `app/globals.css`
- [x] 1.2 UI primitives under `components/ui`
- [x] 1.3 App shell: sidebar (no Product Analytics), mobile drawer, topbar, command search
- [x] 1.4 Theme provider with pre-paint init script
- [x] 1.5 Route group with six pages and page headers
- [x] 1.6 `typecheck` and `e2e` scripts; build, lint and tsc green

## 2. Overview Dashboard

- [x] 2.1 Typed mock data for KPIs, revenue trajectory, plan distribution, cohorts, activity
- [x] 2.2 KPI card component with delta, sparkline and progress variants
- [x] 2.3 AI observation banner with evidence chips and actions
- [x] 2.4 Revenue trajectory chart with period tabs, milestone annotation and tooltip
- [x] 2.5 Plan distribution donut with centre total and legend breakdown
- [x] 2.6 Account cohort stacked bars and live activity feed
- [x] 2.7 Responsive reflow to 1 column below `lg`

## 3. Revenue Analytics

- [x] 3.1 KPI row with gauge and mini-chart variants
- [x] 3.2 MRR movement waterfall with bridge-view control
- [x] 3.3 Movement component table
- [x] 3.4 Cohort retention heatmap with legend
- [x] 3.5 Active subscriptions table: search, status/plan/ARR filters, sorting, pagination

## 4. Customers Directory

- [x] 4.1 Stat cards row
- [x] 4.2 Filter tabs with counts, search, sort
- [x] 4.3 Customer table with health-score indicator and selection
- [x] 4.4 Detail rail: header, metrics, stakeholders, activity timeline
- [x] 4.5 Expansion-potential card with proposal action
- [x] 4.6 Mobile: table collapses to cards, rail becomes a dialog

## 5. Reports Library

- [x] 5.1 Pinned brief cards with per-card metrics and footer actions
- [x] 5.2 Report library table with category chips, filter, sort, export
- [x] 5.3 Report builder panel: title, data sources, metric chips, delivery toggles
- [x] 5.4 Create-report dialog and simulated deploy confirmation

## 6. AI Business Insights

- [x] 6.1 Insight card variants: critical, expansion, correlation
- [x] 6.2 Filter tabs with counts
- [x] 6.3 Causal inference graph cards
- [x] 6.4 Audit trail table
- [x] 6.5 Governance notice; actions require explicit confirmation

## 7. Workspace Settings

- [x] 7.1 Tabbed sections
- [x] 7.2 Workspace profile form with validation, save and revert
- [x] 7.3 Team members table with roles and 2FA state
- [x] 7.4 Appearance control wired to the real theme provider
- [x] 7.5 Danger zone with typed confirmation dialogs
- [x] 7.6 Billing, security and audit log panels

## 8. Verification

- [x] 8.1 Playwright: navigation across all six screens, no console errors
- [x] 8.2 Playwright: representative interaction per screen
- [x] 8.3 Responsive viewports verified at 375 / 768 / 1024 / 1280 / 1440 / 1920 (0 horizontal overflow)
- [x] 8.4 Dark theme pass across all six screens
- [x] 8.5 README: setup, scripts, deployment, simulated functionality
