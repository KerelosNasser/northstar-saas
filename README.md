# Northstar — Revenue Cockpit & Financial Intelligence

Northstar is a frontend showcase demonstrating precision Figma-to-Web engineering. It implements an executive SaaS cockpit with six comprehensive screens, complete with responsive layouts (from 375px mobile to 1920px desktop), light/dark theming, typed interactive mock data, and end-to-end Playwright verification.

---

## 1. Implemented Screens

1. **Overview Dashboard (`/`)**
   - Executive cockpit with live revenue KPIs ($148,250 MRR, $1.78M ARR pacing, 1,428 paying accounts, 118.2% NRR).
   - Dynamic AI observation banner with evidence chips, dismiss, bookmark, and drill-down evidence dialog.
   - Interactive Revenue Trajectory area chart with metric tabs (Total Revenue, MRR Growth, ARPU, LTV) and milestone annotations.
   - Plan distribution donut chart with tier breakdown (Enterprise, Pro, Starter).
   - Account cohort flow stacked bars with peak indicators and live activity audit feed.
   - Customizable summary cards via modal dialog and browser-level CSV snapshot export.

2. **Revenue Analytics (`/revenue`)**
   - Net MRR, gross churn, expansion velocity, and ARPU stat cards with live currency switching (USD $, EUR €, GBP £).
   - Internally consistent MRR movement waterfall chart with toggle between Bridge view and Cumulative view.
   - Movement components attribution table with MoM shifts and status indicators.
   - Customer cohort retention matrix (M0 through M11) with color-coded churn/expansion risk ramp.
   - Active subscriptions table with multi-criteria search, status/plan/ARR filters, directional sorting, and client-side pagination.
   - Simulated Stripe ledger synchronization and CSV export.

3. **Customers Directory (`/customers`)**
   - High-level customer stats (total accounts, active MRR, average health score 88/100, at-risk ARR).
   - Filter tabs with live account counts (All, Enterprise, Pro, At Risk, Onboarding).
   - Multi-column sortable table with health score indicators, row selection, and bulk actions (export selected, reassign CSM).
   - Customer Detail Rail displaying account metadata, key stakeholders with mail links, expansion opportunity cards, and recent activity timeline.
   - Responsive reflow: table scrolls smoothly on small screens, and the detail rail converts to an interactive dialog modal on mobile viewports (<1024px).
   - "Add Customer" modal with comprehensive field validation that inserts new accounts into the active session.

4. **Reports Library (`/reports`)**
   - Pinned executive briefs (Monthly Revenue Brief, Weekly Churn Telemetry, Quarterly Board Deck) with key metrics and simulated execution.
   - Comprehensive reports catalog table with category badges, schedule cadences, data source chips, and format indicators (CSV, PDF, JSON).
   - Download real in-browser generated report artifacts (CSV, JSON, formatted text).
   - Report Builder dialog with input validation, data source selection, metric chip multi-toggles, and simulated email/Slack delivery channels.
   - In-session deletion with confirmation dialog.

5. **AI Business Insights (`/insights`)**
   - Intelligence cards categorized by Critical Anomaly, Expansion Opportunity, and Strategic Correlation.
   - Directional causal path graph models illustrating causal source, mediating factors, and net revenue impact.
   - Verified audit trail table logging heuristic evaluations and confidence scores.
   - Resolution toggle, drill-down telemetry evidence inspection, and structured JSON export.
   - Explicit governance notice confirming all calculations derive from local deterministic heuristics without external model API calls.

6. **Workspace Settings (`/settings`)**
   - Tabbed sections: General Profile, Team & Access, Appearance & Theme, Security & SSO, Billing & Invoices.
   - General profile form with dirty-state detection, unsaved-change warning bar, and revert/save controls.
   - Organization logo uploader with client-side file validation (max 2MB, image MIME type only) and local FileReader preview.
   - Team members management with role assignment and invitation flow.
   - Appearance switchboard wired to the core ThemeProvider with instant Light, Dark, and System switching.
   - Authentication security controls (SAML SSO enforcement, mandatory 2FA, session idle timeout).
   - Danger zone workspace deletion modal requiring exact typed workspace name confirmation.

---

## 2. Technical Stack

- **Framework**: Next.js 16.4.3 (Turbopack, App Router)
- **Language**: TypeScript 5 (Strict mode)
- **Styling**: Tailwind CSS v4 with custom design tokens in `app/globals.css`
- **UI Primitives**: Radix UI headless primitives (`@radix-ui/react-*`)
- **Icons**: Lucide React (`lucide-react`)
- **Charts**: Recharts (`recharts`) for responsive SVG charts
- **E2E Testing**: Playwright (`@playwright/test`) with desktop and mobile configurations

---

## 3. Simulated vs. Real Operations

As a portfolio demonstration, Northstar does not depend on an external database, Stripe account, authentication provider, or third-party AI APIs:

| Feature | Behavior | Disclosure |
|---|---|---|
| **Data Persistence** | Maintained in React client state and `localStorage` | Changes persist within the browser session |
| **CSV & JSON Exports** | Dynamically generated in-browser from actual rendered data | Real file downloads |
| **Theme Switching** | Persisted in `localStorage` with pre-paint script to prevent flicker | Works across the entire app |
| **Stripe / Okta Sync** | Simulated state changes and timestamps | Explicitly marked as simulated in all dialogs |
| **Email & Slack Dispatch** | UI staged locally without external network requests | Disclosed in confirmation dialogs |
| **AI Inferences** | Computed deterministically from structured mock telemetry | Governance banner clearly explains zero third-party AI dependency |

---

## 4. Development & Verification Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run TypeScript type check
pnpm typecheck

# Run ESLint
pnpm lint

# Build for production
pnpm build

# Start production server
pnpm start

# Run full end-to-end test suite
pnpm e2e
```

---

## 5. Viewport Verification

The test suite verifies zero console errors and zero horizontal overflow across six standard viewports:
- `1920px` (Desktop wide)
- `1440px` (Standard desktop)
- `1280px` (Small desktop / laptop)
- `1024px` (Tablet landscape)
- `768px` (Tablet portrait)
- `375px` (Mobile)
