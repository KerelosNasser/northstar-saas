import { Activity, ArrowLeftRight, TrendingDown, TrendingUp } from "lucide-react";

/** All values are seeded demo data — nothing here is fetched or computed from a backend. */

export type RevenueKpi = {
  id: string;
  label: string;
  value: string;
  amountUsd: number;
  delta: string;
  caption: string;
  icon: typeof Activity;
  footer:
    | { kind: "spark"; data: number[]; stroke: string }
    | { kind: "gauge"; label: string; percent: number; tone: "success" | "warning" }
    | { kind: "badge"; label: string };
};

export const revenueKpis: RevenueKpi[] = [
  {
    id: "net-mrr",
    label: "Net MRR growth",
    value: "+$16,350",
    amountUsd: 16350,
    delta: "+3.4% vs prior 30 days",
    caption: "Net new recurring revenue after churn",
    icon: TrendingUp,
    footer: { kind: "spark", data: [8, 11, 10, 14, 13, 17, 19, 18, 23, 26], stroke: "var(--chart-5)" },
  },
  {
    id: "churn",
    label: "Gross churn MRR",
    value: "-$2,180",
    amountUsd: -2180,
    delta: "1.4% churn rate",
    caption: "Down from 1.9% in the prior period",
    icon: TrendingDown,
    footer: { kind: "gauge", label: "Low risk", percent: 14, tone: "success" },
  },
  {
    id: "expansion",
    label: "Expansion MRR",
    value: "+$11,400",
    amountUsd: 11400,
    delta: "+34.2% MoM velocity",
    caption: "Seat upgrades and tier migrations",
    icon: ArrowLeftRight,
    footer: { kind: "badge", label: "Net expansion" },
  },
  {
    id: "arrpu",
    label: "Average revenue / account",
    value: "$103.82",
    amountUsd: 103.82,
    delta: "+$2.18 vs last period",
    caption: "Across 1,428 benchmark accounts",
    icon: Activity,
    footer: { kind: "spark", data: [96, 97, 98, 99, 98, 100, 101, 101, 103, 104], stroke: "var(--chart-2)" },
  },
];

export type WaterfallStep = {
  id: string;
  label: string;
  shortLabel: string;
  value: number;
  kind: "baseline" | "increase" | "decrease" | "total";
};

// Starting 131,900 + 14,200 + 11,400 + 1,300 - 4,200 - 6,350 = 148,250 (Matches Overview MRR $148,250)
export const waterfallSteps: WaterfallStep[] = [
  { id: "start", label: "Starting MRR", shortLabel: "Starting", value: 131_900, kind: "baseline" },
  { id: "new", label: "New MRR", shortLabel: "New", value: 14_200, kind: "increase" },
  { id: "expansion", label: "Expansion MRR", shortLabel: "Expansion", value: 11_400, kind: "increase" },
  { id: "reactivated", label: "Reactivated MRR", shortLabel: "Reactivated", value: 1_300, kind: "increase" },
  { id: "contraction", label: "Contraction MRR", shortLabel: "Contraction", value: -4_200, kind: "decrease" },
  { id: "churn", label: "Full churn MRR", shortLabel: "Churn", value: -6_350, kind: "decrease" },
  { id: "end", label: "Ending MRR", shortLabel: "Ending MRR", value: 148_250, kind: "total" },
];

export const waterfallLegend = [
  { label: "Baseline", color: "var(--chart-1)" },
  { label: "Expansions", color: "var(--chart-2)" },
  { label: "Contractions", color: "var(--chart-3)" },
  { label: "Final MRR", color: "var(--chart-5)" },
];

export type MovementRow = {
  id: string;
  component: string;
  valueUsd: number;
  value: string;
  shareOfBaseline: string;
  momDelta: string;
  impact: string;
  tone: "success" | "danger" | "neutral" | "warning";
};

export const movementRows: MovementRow[] = [
  { id: "new", component: "New MRR", valueUsd: 14200, value: "+$14,200", shareOfBaseline: "10.8%", momDelta: "+2.2%", impact: "Strong intake", tone: "success" },
  { id: "expansion", component: "Expansion MRR", valueUsd: 11400, value: "+$11,400", shareOfBaseline: "8.6%", momDelta: "+34.5%", impact: "Outperformer", tone: "success" },
  { id: "reactivation", component: "Reactivation MRR", valueUsd: 1300, value: "+$1,300", shareOfBaseline: "1.0%", momDelta: "-2.1%", impact: "Normal flow", tone: "neutral" },
  { id: "contraction", component: "Contraction MRR", valueUsd: -4200, value: "-$4,200", shareOfBaseline: "-3.2%", momDelta: "-12.0% (improved)", impact: "Under control", tone: "warning" },
  { id: "churn", component: "Full churn MRR", valueUsd: -6350, value: "-$6,350", shareOfBaseline: "-4.8%", momDelta: "+0.9%", impact: "Monitor", tone: "danger" },
];

export type RetentionCohort = {
  id: string;
  month: string;
  startingMrrUsd: number;
  startingMrr: string;
  /** M0..M11 net MRR retained, as percentages. */
  retention: number[];
};

export const retentionCohorts: RetentionCohort[] = [
  { id: "nov-24", month: "Nov 2024", startingMrrUsd: 12410, startingMrr: "$12,410", retention: [100, 96, 99, 104, 108, 112, 115, 118, 121, 119, 124, 127] },
  { id: "dec-24", month: "Dec 2024", startingMrrUsd: 14120, startingMrr: "$14,120", retention: [100, 98, 101, 105, 109, 111, 114, 116, 120, 118, 122, 125] },
  { id: "jan-25", month: "Jan 2025", startingMrrUsd: 16600, startingMrr: "$16,600", retention: [100, 97, 100, 103, 107, 110, 113, 117, 115, 119, 123, 121] },
  { id: "feb-25", month: "Feb 2025", startingMrrUsd: 15200, startingMrr: "$15,200", retention: [100, 99, 102, 106, 110, 108, 112, 116, 114, 118, 122, 120] },
  { id: "mar-25", month: "Mar 2025", startingMrrUsd: 21100, startingMrr: "$21,100", retention: [100, 101, 104, 108, 112, 115, 119, 117, 121, 125, 123, 127] },
  { id: "apr-25", month: "Apr 2025", startingMrrUsd: 18400, startingMrr: "$18,400", retention: [100, 98, 102, 105, 109, 112, 110, 114, 118, 116, 120, 124] },
];

export type Subscription = {
  id: string;
  customer: string;
  domain: string;
  initials: string;
  plan: string;
  cycle: "Annual upfront" | "Monthly";
  mrr: number;
  ltv: number;
  movement: string;
  movementTone: "success" | "neutral" | "danger";
  renewal: string;
  status: "Active" | "Past due";
};

export const subscriptions: Subscription[] = [
  { id: "pixelcraft", customer: "PixelCraft Studios", domain: "pixelforge-io.nvo", initials: "PX", plan: "Enterprise Core", cycle: "Annual upfront", mrr: 2_450, ltv: 58_800, movement: "+$350 expansion", movementTone: "success", renewal: "Nov 14, 2025", status: "Active" },
  { id: "vortex", customer: "Vortex Dynamics", domain: "vdynamics-mfg", initials: "VT", plan: "Enterprise Core", cycle: "Annual upfront", mrr: 1_800, ltv: 39_600, movement: "Stable", movementTone: "neutral", renewal: "Dec 02, 2025", status: "Active" },
  { id: "nexia", customer: "Nexia Logic Corp", domain: "nexialogic-nvo", initials: "NL", plan: "Pro Team", cycle: "Monthly", mrr: 800, ltv: 12_400, movement: "+$200 expansion", movementTone: "success", renewal: "Nov 28, 2025", status: "Active" },
  { id: "hyperscale", customer: "HyperScale Labs", domain: "hyperscale-sfo", initials: "HY", plan: "Pro Team", cycle: "Monthly", mrr: 730, ltv: 8_760, movement: "Stable", movementTone: "neutral", renewal: "Dec 15, 2025", status: "Active" },
  { id: "solaris", customer: "Solaris Logistics", domain: "solaris-logistics-992", initials: "SL", plan: "Starter Growth", cycle: "Monthly", mrr: 320, ltv: 3_840, movement: "-$150 seat drop", movementTone: "danger", renewal: "Nov 05, 2025", status: "Active" },
  { id: "cloudmesh", customer: "CloudMesh Systems", domain: "cloudmesh.tech", initials: "CM", plan: "Enterprise Core", cycle: "Annual upfront", mrr: 3_200, ltv: 76_800, movement: "+$800 expansion", movementTone: "success", renewal: "Jan 10, 2026", status: "Active" },
  { id: "lumina", customer: "Lumina Analytics", domain: "lumina-data.ai", initials: "LA", plan: "Pro Team", cycle: "Monthly", mrr: 950, ltv: 15_200, movement: "Stable", movementTone: "neutral", renewal: "Dec 20, 2025", status: "Active" },
  { id: "synthetix", customer: "Synthetix Health", domain: "synth-med.org", initials: "SH", plan: "Enterprise Core", cycle: "Annual upfront", mrr: 2_900, ltv: 69_600, movement: "+$400 expansion", movementTone: "success", renewal: "Feb 15, 2026", status: "Active" },
  { id: "quantum", customer: "Quantum Vector", domain: "q-vector.io", initials: "QV", plan: "Starter Growth", cycle: "Monthly", mrr: 290, ltv: 2_900, movement: "Stable", movementTone: "neutral", renewal: "Nov 12, 2025", status: "Past due" },
  { id: "helix", customer: "Helix Genomics", domain: "helix-bio.co", initials: "HG", plan: "Enterprise Core", cycle: "Annual upfront", mrr: 4_100, ltv: 98_400, movement: "+$650 expansion", movementTone: "success", renewal: "Mar 01, 2026", status: "Active" },
  { id: "aether", customer: "Aether Labs", domain: "aether-rnd.com", initials: "AL", plan: "Pro Team", cycle: "Monthly", mrr: 680, ltv: 8_160, movement: "-$120 seat drop", movementTone: "danger", renewal: "Nov 19, 2025", status: "Active" },
  { id: "nimbus", customer: "Nimbus Security", domain: "nimbus-sec.net", initials: "NS", plan: "Pro Team", cycle: "Monthly", mrr: 840, ltv: 10_080, movement: "+$140 expansion", movementTone: "success", renewal: "Dec 08, 2025", status: "Active" },
];
