import { Activity, DollarSign, TrendingUp, Users, type LucideIcon } from "lucide-react";

/**
 * Mock data for the Overview screen. Values mirror the design reference so the
 * rendered page can be compared against it directly. Nothing here is fetched —
 * see README for what is simulated.
 */

export type KpiFooter =
  | { kind: "sparkline"; data: number[] }
  | { kind: "progress"; label: string; value: string; percent: number }
  | { kind: "split"; segments: { label: string; percent: number; color: string }[] }
  | { kind: "note"; note: string; badge: string };

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: string;
  caption: string;
  icon: LucideIcon;
  valueBadge?: string;
  footer: KpiFooter;
};

export const overviewKpis: Kpi[] = [
  {
    id: "mrr",
    label: "Monthly recurring rev",
    value: "$148,250",
    delta: "+12.4%",
    caption: "+16,350 net new MRR this month",
    icon: DollarSign,
    footer: {
      kind: "sparkline",
      data: [12, 14, 13, 17, 19, 18, 22, 26, 25, 29, 33, 38],
    },
  },
  {
    id: "arr",
    label: "Annual run rate",
    value: "$1.78M",
    delta: "+14.8%",
    caption: "Pacing towards $2.1M target goal",
    icon: TrendingUp,
    footer: { kind: "progress", label: "FY25 Target: $2.12M", value: "84.0%", percent: 84 },
  },
  {
    id: "customers",
    label: "Paying customers",
    value: "1,428",
    delta: "+6.4%",
    caption: "3.1% avg. churn rate (-0.4% net shift)",
    icon: Users,
    footer: {
      kind: "split",
      segments: [
        { label: "Enterprise (68%)", percent: 68, color: "var(--chart-1)" },
        { label: "Pro (32%)", percent: 32, color: "var(--chart-4)" },
      ],
    },
  },
  {
    id: "nrr",
    label: "Net retention (NRR)",
    value: "118.2%",
    delta: "+2.1% pts vs. industry benchmark",
    caption: "Top decile B2B SaaS Index",
    icon: Activity,
    valueBadge: "Healthy 118.2%",
    footer: { kind: "note", note: "Top decile B2B SaaS Index", badge: "Validated" },
  },
];

export const aiObservation = {
  confidence: "84%",
  detected: "Detected 3 hours ago via Okta audit logs",
  headline: "Expansion revenue accelerated by 28% following Enterprise SSO launch",
  body: "34 mid-market accounts upgraded to Enterprise tier in the last 14 days after adopting Okta/SAML integration. Primary revenue driver was EMEA sales cycle shortening from 42 to 19 days.",
  evidence: [
    {
      kind: "Measured fact",
      text: "34 expansions | +$41.2k added ARR",
    },
    {
      kind: "Model inference",
      text: "82% of eligible Pro accounts with +50 seats are primed for upgrade",
    },
  ],
};

const currentPeriod = [
  9000, 11500, 14200, 17000, 19800, 23000, 26500, 30000, 33800, 37500, 41200, 45000, 48800,
  52500, 56000, 59000, 61000, 59500, 66000, 78000, 92000, 106000, 122000, 138420, 143000, 145500,
  147500, 149000, 150500, 152000,
];

const previousPeriod = [
  8200, 10200, 12500, 14900, 17300, 20100, 23000, 26200, 29400, 32600, 35800, 39000, 42200, 45300,
  48200, 50800, 52600, 51500, 57000, 67000, 79000, 91000, 105000, 124150, 130000, 134000, 137000,
  139500, 141500, 143000,
];

export const trajectorySeries = currentPeriod.map((value, index) => ({
  day: index + 1,
  current: value,
  prior: previousPeriod[index],
}));

export const trajectoryVariants = {
  revenue: {
    label: "Total Revenue",
    scale: 1,
    format: (value: number) => `$${Math.round(value).toLocaleString("en-US")}`,
    axis: (value: number) => `$${Math.round(value / 1000)}K`,
  },
  mrr: {
    label: "MRR Growth",
    scale: 0.62,
    format: (value: number) => `$${Math.round(value).toLocaleString("en-US")}`,
    axis: (value: number) => `$${Math.round(value / 1000)}K`,
  },
  arpu: {
    label: "ARPU",
    scale: 0.00072,
    format: (value: number) => `$${value.toFixed(2)}`,
    axis: (value: number) => `$${value.toFixed(0)}`,
  },
  ltv: {
    label: "LTV",
    scale: 0.0072,
    format: (value: number) => `$${Math.round(value).toLocaleString("en-US")}`,
    axis: (value: number) => `$${Math.round(value / 1000)}K`,
  },
} as const;

export type TrajectoryVariant = keyof typeof trajectoryVariants;

export const planDistribution = {
  total: "$148.2k",
  tiers: [
    {
      label: "Enterprise",
      value: "$89.4k",
      arpu: "ARPU: $1,640/mo",
      percent: "59.6%",
      color: "var(--chart-1)",
    },
    { label: "Pro", value: "$44.8k", arpu: "ARPU: $148/mo", percent: "30.2%", color: "var(--chart-3)" },
    {
      label: "Starter",
      value: "$10.0k",
      arpu: "ARPU: $48/mo",
      percent: "10.2%",
      color: "var(--chart-4)",
    },
  ],
};

export const cohortWeeks = [
  { label: "Week 1 (Nov 1–7)", net: "+31 net", peak: false, new: 24, expansion: 18, contraction: 6, churn: 5 },
  { label: "Week 2 (Nov 8–14)", net: "+41 net", peak: false, new: 30, expansion: 22, contraction: 5, churn: 6 },
  { label: "Week 3 (Nov 15–21)", net: "+54 net (Peak)", peak: true, new: 38, expansion: 26, contraction: 6, churn: 5 },
  { label: "Week 4 (Nov 22–30)", net: "+47 net", peak: false, new: 33, expansion: 24, contraction: 5, churn: 6 },
];

export const cohortLegend = [
  { label: "New", color: "var(--chart-1)" },
  { label: "Expansion", color: "var(--chart-2)" },
  { label: "Contraction", color: "var(--chart-3)" },
  { label: "Churn", color: "var(--chart-4)" },
];

export type ActivityEntry = {
  id: string;
  title: string;
  detail: string;
  meta: string;
  time: string;
  tone: "success" | "warning" | "primary" | "accent";
};

export const activityFeed: ActivityEntry[] = [
  {
    id: "acme-upgrade",
    title: "Acme Corp upgraded to Enterprise",
    detail: "+$2,400 MRR",
    meta: "Stripe automated billing",
    time: "12m ago",
    tone: "success",
  },
  {
    id: "linear-seats",
    title: "Linear Labs reduced allocated seats by 4",
    detail: "High-intent churn signal",
    meta: "Seat service webhook",
    time: "1h ago",
    tone: "warning",
  },
  {
    id: "vercel-partner",
    title: "Vercel Ecosystem Partner signed Pro plan",
    detail: "$1,200/mo",
    meta: "Inbound referral",
    time: "3h ago",
    tone: "primary",
  },
  {
    id: "datadog-retry",
    title: "Datadog sub-account automated payment retry recovered",
    detail: "Billing run completed",
    meta: "Retry queue",
    time: "5h ago",
    tone: "accent",
  },
];
