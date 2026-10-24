export type CustomerStatus = "Active" | "Onboarding" | "At Risk" | "Churn Watch";
export type CustomerPlan = "Enterprise Core" | "Pro Team" | "Starter Growth";

export interface Stakeholder {
  name: string;
  role: string;
  email: string;
  initials: string;
}

export interface CustomerActivity {
  id: string;
  date: string;
  title: string;
  description: string;
  tone: "success" | "neutral" | "warning";
}

export interface Customer {
  id: string;
  name: string;
  domain: string;
  initials: string;
  plan: CustomerPlan;
  status: CustomerStatus;
  healthScore: number;
  mrr: number;
  arr: number;
  seats: number;
  joinedDate: string;
  renewalDate: string;
  csm: string;
  billingCycle: "Annual upfront" | "Monthly";
  stakeholders: Stakeholder[];
  expansionOpportunity?: {
    title: string;
    arrPotential: number;
    description: string;
  };
  activities: CustomerActivity[];
}

export const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "PixelCraft Studios",
    domain: "pixelforge-io.nvo",
    initials: "PX",
    plan: "Enterprise Core",
    status: "Active",
    healthScore: 94,
    mrr: 2450,
    arr: 29400,
    seats: 48,
    joinedDate: "Mar 12, 2024",
    renewalDate: "Nov 14, 2025",
    csm: "Sarah Chen",
    billingCycle: "Annual upfront",
    stakeholders: [
      { name: "Elena Rostova", role: "VP of Product", email: "elena@pixelforge.io", initials: "ER" },
      { name: "Marcus Vance", role: "Head of Infrastructure", email: "marcus@pixelforge.io", initials: "MV" },
    ],
    expansionOpportunity: {
      title: "Design System Enterprise License",
      arrPotential: 12500,
      description: "Team grew from 24 to 48 contributors. SSO and audit logging enabled last week.",
    },
    activities: [
      { id: "act-1", date: "2 days ago", title: "SSO enforcement enabled", description: "Configured Okta SAML across EMEA division", tone: "success" },
      { id: "act-2", date: "1 week ago", title: "Seat tier upgrade (+12)", description: "Automated billing adjustment applied", tone: "success" },
      { id: "act-3", date: "3 weeks ago", title: "Quarterly business review", description: "CSM completed executive check-in with Elena", tone: "neutral" },
    ],
  },
  {
    id: "cust-2",
    name: "Vortex Dynamics",
    domain: "vdynamics-mfg.com",
    initials: "VT",
    plan: "Enterprise Core",
    status: "Active",
    healthScore: 91,
    mrr: 1800,
    arr: 21600,
    seats: 35,
    joinedDate: "Jan 18, 2024",
    renewalDate: "Dec 02, 2025",
    csm: "David Miller",
    billingCycle: "Annual upfront",
    stakeholders: [
      { name: "Kaelen Thorne", role: "CTO", email: "kthorne@vdynamics-mfg.com", initials: "KT" },
    ],
    expansionOpportunity: {
      title: "Predictive Analytics Add-on",
      arrPotential: 8400,
      description: "High query load on standard reporting. Prime target for dedicated pipeline.",
    },
    activities: [
      { id: "act-4", date: "Yesterday", title: "API rate limit raised", description: "Increased limit to 50k req/min for production sync", tone: "neutral" },
      { id: "act-5", date: "2 weeks ago", title: "Security compliance verified", description: "SOC2 Type II report delivered to legal", tone: "success" },
    ],
  },
  {
    id: "cust-3",
    name: "Nexia Logic Corp",
    domain: "nexialogic.com",
    initials: "NL",
    plan: "Pro Team",
    status: "Active",
    healthScore: 86,
    mrr: 800,
    arr: 9600,
    seats: 20,
    joinedDate: "May 04, 2024",
    renewalDate: "Nov 28, 2025",
    csm: "Sarah Chen",
    billingCycle: "Monthly",
    stakeholders: [
      { name: "Siddharth Nair", role: "Engineering Lead", email: "siddharth@nexialogic.com", initials: "SN" },
    ],
    activities: [
      { id: "act-6", date: "3 days ago", title: "Automated invoice paid", description: "Monthly charge of $800 settled successfully", tone: "success" },
    ],
  },
  {
    id: "cust-4",
    name: "HyperScale Labs",
    domain: "hyperscale-sfo.io",
    initials: "HY",
    plan: "Pro Team",
    status: "Onboarding",
    healthScore: 78,
    mrr: 730,
    arr: 8760,
    seats: 15,
    joinedDate: "Oct 15, 2025",
    renewalDate: "Dec 15, 2025",
    csm: "David Miller",
    billingCycle: "Monthly",
    stakeholders: [
      { name: "Claire Zhao", role: "Ops Director", email: "claire@hyperscale-sfo.io", initials: "CZ" },
    ],
    activities: [
      { id: "act-7", date: "5 days ago", title: "Telemetry webhook connected", description: "Ingesting live production events", tone: "neutral" },
    ],
  },
  {
    id: "cust-5",
    name: "Solaris Logistics",
    domain: "solaris-logistics.net",
    initials: "SL",
    plan: "Starter Growth",
    status: "At Risk",
    healthScore: 54,
    mrr: 320,
    arr: 3840,
    seats: 6,
    joinedDate: "Aug 22, 2024",
    renewalDate: "Nov 05, 2025",
    csm: "Sarah Chen",
    billingCycle: "Monthly",
    stakeholders: [
      { name: "Liam O'Connor", role: "General Manager", email: "liam@solaris-logistics.net", initials: "LO" },
    ],
    activities: [
      { id: "act-8", date: "1 week ago", title: "Seat reduction warning", description: "Downscaled from 10 to 6 seats in prior cycle", tone: "warning" },
      { id: "act-9", date: "2 weeks ago", title: "Inbound support ticket unresolved", description: "Latency complaint logged for webhooks", tone: "warning" },
    ],
  },
  {
    id: "cust-6",
    name: "CloudMesh Systems",
    domain: "cloudmesh.tech",
    initials: "CM",
    plan: "Enterprise Core",
    status: "Active",
    healthScore: 97,
    mrr: 3200,
    arr: 38400,
    seats: 65,
    joinedDate: "Feb 10, 2024",
    renewalDate: "Jan 10, 2026",
    csm: "David Miller",
    billingCycle: "Annual upfront",
    stakeholders: [
      { name: "Julian Haas", role: "Chief Architect", email: "julian@cloudmesh.tech", initials: "JH" },
    ],
    expansionOpportunity: {
      title: "Global Multi-Region Relay",
      arrPotential: 16000,
      description: "Expanding operations to APAC next quarter.",
    },
    activities: [
      { id: "act-10", date: "4 days ago", title: "Usage milestone exceeded", description: "Surpassed 10M events logged this month", tone: "success" },
    ],
  },
  {
    id: "cust-7",
    name: "Lumina Analytics",
    domain: "lumina-data.ai",
    initials: "LA",
    plan: "Pro Team",
    status: "Active",
    healthScore: 89,
    mrr: 950,
    arr: 11400,
    seats: 22,
    joinedDate: "Jun 11, 2024",
    renewalDate: "Dec 20, 2025",
    csm: "Sarah Chen",
    billingCycle: "Monthly",
    stakeholders: [
      { name: "Aria Sterling", role: "Data Product Lead", email: "aria@lumina-data.ai", initials: "AS" },
    ],
    activities: [
      { id: "act-11", date: "1 week ago", title: "Custom dashboard created", description: "Saved 4 team-wide shared views", tone: "neutral" },
    ],
  },
  {
    id: "cust-8",
    name: "Synthetix Health",
    domain: "synth-med.org",
    initials: "SH",
    plan: "Enterprise Core",
    status: "Active",
    healthScore: 92,
    mrr: 2900,
    arr: 34800,
    seats: 50,
    joinedDate: "Jan 05, 2024",
    renewalDate: "Feb 15, 2026",
    csm: "Sarah Chen",
    billingCycle: "Annual upfront",
    stakeholders: [
      { name: "Dr. Evelyn Wu", role: "Head of Medical AI", email: "ewu@synth-med.org", initials: "EW" },
    ],
    activities: [
      { id: "act-12", date: "2 weeks ago", title: "HIPAA audit passed", description: "Enterprise compliance packet archived", tone: "success" },
    ],
  },
  {
    id: "cust-9",
    name: "Quantum Vector",
    domain: "q-vector.io",
    initials: "QV",
    plan: "Starter Growth",
    status: "Churn Watch",
    healthScore: 49,
    mrr: 290,
    arr: 3480,
    seats: 5,
    joinedDate: "Sep 01, 2024",
    renewalDate: "Nov 12, 2025",
    csm: "David Miller",
    billingCycle: "Monthly",
    stakeholders: [
      { name: "Alexandre Dupont", role: "Founder", email: "adupont@q-vector.io", initials: "AD" },
    ],
    activities: [
      { id: "act-13", date: "3 days ago", title: "Payment failure recorded", description: "Credit card retry scheduled in 48 hours", tone: "warning" },
    ],
  },
  {
    id: "cust-10",
    name: "Helix Genomics",
    domain: "helix-bio.co",
    initials: "HG",
    plan: "Enterprise Core",
    status: "Active",
    healthScore: 96,
    mrr: 4100,
    arr: 49200,
    seats: 80,
    joinedDate: "Dec 14, 2023",
    renewalDate: "Mar 01, 2026",
    csm: "David Miller",
    billingCycle: "Annual upfront",
    stakeholders: [
      { name: "Miriam Al-Mansoor", role: "VP of Engineering", email: "miriam@helix-bio.co", initials: "MA" },
    ],
    activities: [
      { id: "act-14", date: "1 day ago", title: "Executive check-in", description: "Requested renewal contract draft with 3-year lock", tone: "success" },
    ],
  },
];
