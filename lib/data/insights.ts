export type InsightCategory = "Critical Anomaly" | "Expansion Opportunity" | "Strategic Correlation";
export type InsightStatus = "Active" | "Resolved" | "Dismissed";

export interface EvidenceItem {
  type: "Measured telemetry" | "Model inference" | "Cohort signal";
  detail: string;
}

export interface InsightItem {
  id: string;
  category: InsightCategory;
  headline: string;
  summary: string;
  confidence: number; // percentage, e.g. 94
  correlationWeight: number; // e.g. 0.84
  detected: string;
  primaryMetric: string;
  metricDelta: string;
  evidence: EvidenceItem[];
  suggestedAction: string;
  actionButtonLabel: string;
  status: InsightStatus;
  resolvedAt?: string;
  causalFlow: {
    source: string;
    mediator: string;
    outcome: string;
  };
}

export const initialInsights: InsightItem[] = [
  {
    id: "ins-1",
    category: "Expansion Opportunity",
    headline: "Expansion revenue accelerated by 28% following Enterprise SSO launch",
    summary: "34 mid-market accounts upgraded to Enterprise tier in the last 14 days after adopting Okta/SAML integration. Primary revenue driver was EMEA sales cycle shortening from 42 to 19 days.",
    confidence: 94,
    correlationWeight: 0.84,
    detected: "Detected 3 hours ago via Okta audit logs",
    primaryMetric: "Added ARR",
    metricDelta: "+$41,200",
    evidence: [
      { type: "Measured telemetry", detail: "34 customer accounts connected Okta SAML in the past 14 days." },
      { type: "Model inference", detail: "82% of eligible Pro accounts with +50 seats are primed for enterprise upgrade." },
      { type: "Cohort signal", detail: "Zero seat contraction observed among accounts with SAML enforced." },
    ],
    suggestedAction: "Launch in-app SSO prompt to 58 Pro tier accounts approaching the 50-seat threshold.",
    actionButtonLabel: "Stage upgrade campaign",
    status: "Active",
    causalFlow: {
      source: "SAML SSO Adoption",
      mediator: "Security Approval Velocity",
      outcome: "+28% Expansion MRR",
    },
  },
  {
    id: "ins-2",
    category: "Critical Anomaly",
    headline: "Early churn cluster detected in Starter tier following webhook v2 deprecation",
    summary: "Accounts receiving webhook 504 timeouts demonstrated a 4.2x higher likelihood of seat reduction within 7 days. Two accounts have already transitioned to the At-Risk cohort.",
    confidence: 89,
    correlationWeight: -0.76,
    detected: "Detected 12 hours ago via Gateway Telemetry",
    primaryMetric: "At-Risk ARR",
    metricDelta: "$7,320 at risk",
    evidence: [
      { type: "Measured telemetry", detail: "Solaris Logistics and Quantum Vector logged repeated retry exhaustion." },
      { type: "Cohort signal", detail: "Net health scores for affected accounts dropped below 60/100." },
      { type: "Model inference", detail: "Preventable churn estimated at $12,400 ARR if latency is stabilized within 48h." },
    ],
    suggestedAction: "Automatically adjust retry backoff policy and dispatch technical CSM outreach.",
    actionButtonLabel: "Initiate CSM mitigation",
    status: "Active",
    causalFlow: {
      source: "Webhook 504 Timeouts",
      mediator: "Integration Failure Rate",
      outcome: "Seat Downgrades",
    },
  },
  {
    id: "ins-3",
    category: "Strategic Correlation",
    headline: "Partner referral ARPU outperforming organic self-serve by 3.2x",
    summary: "Accounts acquired via cloud marketplace partnerships (AWS & Vercel) maintain $1,200/mo average MRR with 120%+ cohort retention through Month 6.",
    confidence: 91,
    correlationWeight: 0.72,
    detected: "Detected 1 day ago via Stripe Billing Attribution",
    primaryMetric: "Benchmark ARPU",
    metricDelta: "$1,200 vs $103.82 avg",
    evidence: [
      { type: "Measured telemetry", detail: "Zero churn recorded in 12 months across verified partner-referred accounts." },
      { type: "Cohort signal", detail: "Average initial seat allocation is 42 seats compared to 8 seats for self-serve." },
    ],
    suggestedAction: "Expand co-sell listing and allocate partner co-op marketing budget.",
    actionButtonLabel: "Approve co-sell expansion",
    status: "Active",
    causalFlow: {
      source: "Partner Channel Attribution",
      mediator: "Higher Initial Team Scale",
      outcome: "3.2x ARPU Multiplier",
    },
  },
];

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: string;
  modelEngine: string;
  confidenceScore: string;
  impactWeight: string;
  status: "Validated" | "Under review" | "Action applied";
}

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: "aud-1",
    timestamp: "Today at 18:32 UTC",
    event: "Okta SAML expansion telemetry evaluated across 1,428 accounts",
    modelEngine: "Northstar Causal Engine v2.4 (Simulated)",
    confidenceScore: "94%",
    impactWeight: "+0.84",
    status: "Validated",
  },
  {
    id: "aud-2",
    timestamp: "Today at 09:14 UTC",
    event: "Webhook 504 timeout churn risk cluster flagged for 2 accounts",
    modelEngine: "Anomaly Detection Kernel v1.9 (Simulated)",
    confidenceScore: "89%",
    impactWeight: "-0.76",
    status: "Under review",
  },
  {
    id: "aud-3",
    timestamp: "Yesterday at 14:00 UTC",
    event: "Partner attribution ARPU multiplier validated against GAAP ledger",
    modelEngine: "Cohort Regression Model v3.1 (Simulated)",
    confidenceScore: "91%",
    impactWeight: "+0.72",
    status: "Action applied",
  },
  {
    id: "aud-4",
    timestamp: "Oct 22 at 11:20 UTC",
    event: "Quarterly churn prediction baseline calibrated against M1-M11 matrix",
    modelEngine: "Retention Matrix Estimator (Simulated)",
    confidenceScore: "96%",
    impactWeight: "+0.65",
    status: "Validated",
  },
];
