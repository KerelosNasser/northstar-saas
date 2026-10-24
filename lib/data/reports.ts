export type ReportCategory = "Executive" | "Finance" | "Retention" | "Operations" | "AI Intelligence";
export type ReportCadence = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "On demand";
export type ReportFormat = "PDF" | "CSV" | "JSON";

export interface PinnedBrief {
  id: string;
  title: string;
  subtitle: string;
  category: ReportCategory;
  cadence: ReportCadence;
  metrics: { label: string; value: string; delta?: string; tone?: "success" | "warning" | "neutral" }[];
  recipients: string;
  lastRun: string;
  status: "Dispatched" | "Scheduled" | "Draft";
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  cadence: ReportCadence;
  sources: string[];
  metrics: string[];
  format: ReportFormat;
  recipientsCount: number;
  lastRun: string;
  nextScheduled: string;
  status: "Active" | "Paused" | "Draft";
}

export const initialPinnedBriefs: PinnedBrief[] = [
  {
    id: "brief-1",
    title: "Monthly Executive Revenue Brief",
    subtitle: "Consolidated MRR, cohort retention, and burn performance for leadership.",
    category: "Executive",
    cadence: "Monthly",
    metrics: [
      { label: "Net MRR", value: "$148,250", delta: "+12.4%", tone: "success" },
      { label: "Net Retention", value: "118.2%", delta: "+2.1%", tone: "success" },
      { label: "Gross Churn", value: "1.4%", delta: "-0.5%", tone: "success" },
    ],
    recipients: "Board of Directors, Executive Team (8 members)",
    lastRun: "Dispatched 2 days ago",
    status: "Dispatched",
  },
  {
    id: "brief-2",
    title: "Weekly Cohort & Churn Telemetry",
    subtitle: "Early warning indicators, downscale flags, and CSM watchlist summary.",
    category: "Retention",
    cadence: "Weekly",
    metrics: [
      { label: "At-Risk ARR", value: "$7,320", delta: "2 accounts", tone: "warning" },
      { label: "Avg Health", value: "88/100", delta: "Optimal", tone: "success" },
      { label: "M1 Retention", value: "96.4%", delta: "MoM stable", tone: "neutral" },
    ],
    recipients: "CSM Leads, Product Ops (14 members)",
    lastRun: "Yesterday at 08:00 UTC",
    status: "Scheduled",
  },
  {
    id: "brief-3",
    title: "Quarterly Board Investor Deck",
    subtitle: "Full GAAP run rate bridge, customer count tiers, and unit economics index.",
    category: "Finance",
    cadence: "Quarterly",
    metrics: [
      { label: "Annualized ARR", value: "$1.78M", delta: "84% pacing", tone: "success" },
      { label: "Total Accounts", value: "1,428", delta: "+6.4%", tone: "success" },
      { label: "ARPU", value: "$103.82", delta: "+$2.18", tone: "success" },
    ],
    recipients: "General Partners, Audit Committee (5 members)",
    lastRun: "Scheduled for Nov 30",
    status: "Draft",
  },
];

export const initialReportItems: ReportItem[] = [
  {
    id: "rep-1",
    title: "Enterprise SSO Expansion Telemetry",
    description: "Tracks Okta SAML adoption correlated with seat growth and upgrades.",
    category: "AI Intelligence",
    cadence: "Weekly",
    sources: ["Okta Logs", "Stripe Billing"],
    metrics: ["SSO Adoptions", "Expansion ARR", "Seat Delta"],
    format: "CSV",
    recipientsCount: 12,
    lastRun: "3 hours ago",
    nextScheduled: "Nov 01, 2025",
    status: "Active",
  },
  {
    id: "rep-2",
    title: "GAAP Recurring Revenue Waterfall",
    description: "Component breakdown: new, expansion, reactivation, contraction, and full churn.",
    category: "Finance",
    cadence: "Monthly",
    sources: ["Stripe Billing", "Ledger Core"],
    metrics: ["Starting MRR", "Gross New", "Contraction", "Ending MRR"],
    format: "PDF",
    recipientsCount: 6,
    lastRun: "Nov 01, 2025",
    nextScheduled: "Dec 01, 2025",
    status: "Active",
  },
  {
    id: "rep-3",
    title: "Account Health & CSM Remediation Log",
    description: "Accounts scoring <70 with open intervention tickets and churn probability.",
    category: "Retention",
    cadence: "Daily",
    sources: ["Telemetry API", "Zendesk", "HubSpot"],
    metrics: ["Health Score", "Ticket Velocity", "Contract Renewal"],
    format: "JSON",
    recipientsCount: 18,
    lastRun: "Today at 06:00 UTC",
    nextScheduled: "Tomorrow at 06:00 UTC",
    status: "Active",
  },
  {
    id: "rep-4",
    title: "Tier Migration & Seat Utilization Index",
    description: "Pro-to-Enterprise upgrade velocities grouped by seat count thresholds.",
    category: "Operations",
    cadence: "Weekly",
    sources: ["Seat Service", "Segment"],
    metrics: ["Allocated Seats", "Active Contributor Rate", "Seat Expansion"],
    format: "CSV",
    recipientsCount: 8,
    lastRun: "Oct 22, 2025",
    nextScheduled: "Oct 29, 2025",
    status: "Active",
  },
  {
    id: "rep-5",
    title: "Global Currency & Tax Exposure Audit",
    description: "Multi-currency reconciliation across USD, EUR, and GBP invoices.",
    category: "Finance",
    cadence: "Monthly",
    sources: ["Stripe Tax", "Exchange Core"],
    metrics: ["FX Realized Gain", "EUR Revenue", "GBP Revenue"],
    format: "CSV",
    recipientsCount: 4,
    lastRun: "Oct 15, 2025",
    nextScheduled: "Nov 15, 2025",
    status: "Paused",
  },
  {
    id: "rep-6",
    title: "Executive Cockpit Snapshot Digest",
    description: "High-level visual summary mirroring the real-time Overview Dashboard.",
    category: "Executive",
    cadence: "Daily",
    sources: ["Telemetry Core", "Stripe Billing"],
    metrics: ["MRR", "ARR", "Customer Count", "NRR"],
    format: "PDF",
    recipientsCount: 24,
    lastRun: "Today at 07:00 UTC",
    nextScheduled: "Tomorrow at 07:00 UTC",
    status: "Active",
  },
];
