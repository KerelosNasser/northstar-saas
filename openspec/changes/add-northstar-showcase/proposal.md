# Add Northstar showcase

## Why

Northstar exists to demonstrate Figma-to-web implementation skill for a Fiverr
portfolio. A client evaluating it must see six sophisticated screens rendered
faithfully, behaving like a real product, and staying usable from a 375px phone
to a large desktop.

## What changes

- Replace the Create-Next-App scaffold with the Northstar application shell
  (288px sidebar, 64px topbar, light/dark theme).
- Implement the six reference screens: Overview, Revenue Analytics, Customers,
  Reports, AI Insights, Workspace Settings.
- Add a typed mock-data layer, shared UI primitives, and Playwright coverage of
  navigation, key interactions and responsive layouts.

## Out of scope

- Any backend, database, authentication, background job, or external AI call.
- The `Product Analytics` screen — the user asked for it to be removed from
  navigation rather than built.
- Real Stripe, Slack, Segment or HubSpot integrations. Buttons that reference
  them simulate the action and say so.
