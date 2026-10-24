export interface WorkspaceProfile {
  name: string;
  slug: string;
  supportEmail: string;
  billingEmail: string;
  timezone: string;
  currency: string;
  logoUrl: string | null;
}

export type TeamRole = "Owner" | "Admin" | "Member" | "Viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  twoFactorEnabled: boolean;
  lastActive: string;
  initials: string;
}

export const initialWorkspaceProfile: WorkspaceProfile = {
  name: "Acme Corp (Production)",
  slug: "acme-corp",
  supportEmail: "support@acme.com",
  billingEmail: "billing@acme.com",
  timezone: "America/Los_Angeles (Pacific Time)",
  currency: "USD ($)",
  logoUrl: null,
};

export const initialTeamMembers: TeamMember[] = [
  {
    id: "mem-1",
    name: "Alex Vance",
    email: "alex@acme.com",
    role: "Owner",
    twoFactorEnabled: true,
    lastActive: "Active now",
    initials: "AV",
  },
  {
    id: "mem-2",
    name: "Sarah Chen",
    email: "sarah.chen@acme.com",
    role: "Admin",
    twoFactorEnabled: true,
    lastActive: "12m ago",
    initials: "SC",
  },
  {
    id: "mem-3",
    name: "Marcus Vance",
    email: "marcus.v@acme.com",
    role: "Admin",
    twoFactorEnabled: true,
    lastActive: "2h ago",
    initials: "MV",
  },
  {
    id: "mem-4",
    name: "Elena Rostova",
    email: "elena.r@acme.com",
    role: "Member",
    twoFactorEnabled: true,
    lastActive: "Yesterday",
    initials: "ER",
  },
  {
    id: "mem-5",
    name: "David Miller",
    email: "david.m@acme.com",
    role: "Member",
    twoFactorEnabled: false,
    lastActive: "3 days ago",
    initials: "DM",
  },
  {
    id: "mem-6",
    name: "Jordan Lee",
    email: "jordan.lee@acme.com",
    role: "Viewer",
    twoFactorEnabled: true,
    lastActive: "1 week ago",
    initials: "JL",
  },
];
