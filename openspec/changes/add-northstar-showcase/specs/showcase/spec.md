# showcase

## ADDED Requirements

### Requirement: Six reference screens are reachable from the shell

The application SHALL provide the six screens from the Figma reference —
Overview, Revenue Analytics, Customers Directory, Reports Library, AI Business
Insights, Workspace Settings — and every one SHALL be reachable from the
persistent sidebar navigation.

#### Scenario: Navigating between screens

- **WHEN** the user activates a sidebar link
- **THEN** the matching screen renders, the link shows the active state, and the
  topbar breadcrumb names the current screen

#### Scenario: Product Analytics is absent

- **WHEN** the sidebar renders
- **THEN** no Product Analytics entry is present

### Requirement: Rendered screens follow the reference

Each screen SHALL reproduce the reference's hierarchy, content, typography,
spacing and colour usage. Where the reference is silent — dark theme, narrow
viewports — the existing visual language SHALL be extended rather than replaced.

#### Scenario: Comparing a screen to its reference

- **WHEN** a screen is rendered at 1280px wide
- **THEN** the sidebar width, topbar height, page header structure, card order and
  table columns match the reference

### Requirement: Every interactive control has an honest outcome

A control SHALL either perform its stated action, be disabled with a visible
reason, or be absent. Simulated operations SHALL be labelled as simulated in the
interface.

#### Scenario: Simulated dispatch

- **WHEN** the user triggers an action that would contact an external service in
  a real product
- **THEN** the interface confirms what would have happened and states that the
  operation is simulated locally

#### Scenario: Destructive action

- **WHEN** the user requests a destructive operation
- **THEN** a confirmation dialog is shown first and the operation only completes
  after explicit confirmation

### Requirement: Layouts remain usable from 375px to large desktop

Screens SHALL reflow deliberately rather than scale down: the sidebar becomes a
drawer, multi-column grids collapse, and tables gain a narrow-viewport
alternative. Horizontal page overflow SHALL NOT occur.

#### Scenario: Mobile navigation

- **WHEN** the viewport is 375px wide
- **THEN** the sidebar is hidden, a menu control opens it as a drawer, and
  selecting a destination closes the drawer

### Requirement: Accessibility and runtime cleanliness

Interactive elements SHALL be keyboard reachable with a visible focus state and
an accessible name. Pages SHALL render without console errors, React key
warnings or hydration mismatches.

#### Scenario: Keyboard traversal

- **WHEN** the user tabs through a screen
- **THEN** focus moves through every interactive element in visual order and each
  one shows a focus ring

### Requirement: Verification is evidenced, not asserted

Type checking, linting, the production build and Playwright coverage of all six
screens SHALL pass before the showcase is called complete.

#### Scenario: Release check

- **WHEN** the verification scripts run
- **THEN** `typecheck`, `lint`, `build` and `e2e` complete without errors, and the
  responsive and dark-theme passes have been inspected
