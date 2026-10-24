"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Check, ChevronsUpDown, LifeBuoy } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav, type NavItem } from "@/lib/nav";

const WORKSPACES = [
  { id: "production", name: "Acme Corp (Production)", plan: "Growth Plan", initials: "AC" },
  { id: "staging", name: "Acme Corp (Staging)", plan: "Sandbox", initials: "AC" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors",
        active
          ? "bg-primary text-on-primary shadow-[0_1px_2px_rgba(11,28,48,0.12)]"
          : "text-ink-2 hover:bg-surface-3 hover:text-ink",
      )}
    >
      <Icon className="size-[15px] shrink-0" strokeWidth={active ? 2.2 : 1.9} />
      <span className="truncate">{item.label}</span>
      {item.badge ? (
        <span
          className={cn(
            "ml-auto rounded-md px-1.5 py-px text-[10px] font-semibold tnum",
            active ? "bg-on-primary/20 text-on-primary" : "bg-primary-soft text-primary",
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

/** Shared sidebar body — used by both the desktop rail and the mobile drawer. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [workspaceId, setWorkspaceId] = useState<(typeof WORKSPACES)[number]["id"]>("production");
  const workspace = WORKSPACES.find((item) => item.id === workspaceId) ?? WORKSPACES[0];

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-4">
        <Logo />
        <span className="text-[18px] font-semibold tracking-[-0.45px] text-ink">Northstar</span>
      </div>

      <div className="px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Switch workspace"
              className="flex w-full items-center gap-2.5 rounded-xl bg-surface-3 p-2 text-left transition-colors hover:bg-primary-soft"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold text-primary">
                {workspace.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium tracking-[0.13px] text-ink">
                  {workspace.name}
                </span>
                <span className="block truncate text-[11px] font-medium tracking-[0.44px] text-accent">
                  {workspace.plan}
                </span>
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[15rem]">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {WORKSPACES.map((item) => (
              <DropdownMenuItem key={item.id} onSelect={() => setWorkspaceId(item.id)}>
                <Check className={cn("size-3.5", item.id === workspace.id ? "opacity-100" : "opacity-0")} />
                <span className="truncate">{item.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="px-5 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.55px] text-muted">
        Platform
      </div>

      <nav aria-label="Primary" className="flex flex-col gap-1 px-4">
        {primaryNav.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-auto px-4 pb-4">
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-border-base px-2.5 py-2">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full rounded-full bg-success/40" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          <span className="text-[11px] font-medium text-ink-2">All systems normal</span>
        </div>

        <div className="flex flex-col gap-1">
          <Link
            href="/settings"
            onClick={onNavigate}
            className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] font-medium text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
          >
            <LifeBuoy className="size-[15px] shrink-0" strokeWidth={1.9} />
            Documentation &amp; Help
          </Link>
          {secondaryNav.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border-base lg:block">
      <div className="fixed inset-y-0 left-0 w-72">
        <SidebarContent />
      </div>
    </aside>
  );
}
