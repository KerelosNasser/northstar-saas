import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

/** Primary navigation. Matches the Figma sidebar (Product Analytics intentionally omitted). */
export const primaryNav: NavItem[] = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/revenue", label: "Revenue", icon: BarChart3 },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/insights", label: "AI Insights", icon: Sparkles, badge: "3" },
];

export const secondaryNav: NavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
];
