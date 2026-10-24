"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronRight,
  Menu,
  Plus,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FieldError, Input, Label } from "@/components/ui/input";
import { CommandSearch } from "@/components/shell/command-search";
import { MobileNav } from "@/components/shell/mobile-nav";
import { primaryNav, secondaryNav } from "@/lib/nav";

const allNav = [...primaryNav, ...secondaryNav];

function useCurrentLabel() {
  const pathname = usePathname();
  const match = allNav.find((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );
  return match?.label ?? "Overview";
}

const notifications = [
  { title: "Expansion revenue accelerated by 28%", meta: "AI observation · 3h ago" },
  { title: "Q4 board summary dispatched", meta: "Reports · 5h ago" },
  { title: "3 accounts entered churn watchlist", meta: "Retention · Yesterday" },
];

function InviteDialog() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setSent(true);
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setEmail("");
          setError(null);
          setSent(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="hidden sm:inline-flex">
          <Plus className="size-3.5" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>
            Demo workspace — no email is sent. The invite is recorded locally only.
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="rounded-lg border border-success/25 bg-success-soft p-3 text-[12px] text-success">
            Invite staged for <span className="font-medium">{email}</span>. Nothing was emailed —
            this build has no mail service configured.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Work email</Label>
              <Input
                id="invite-email"
                type="email"
                autoComplete="email"
                placeholder="teammate@acme.com"
                value={email}
                aria-invalid={Boolean(error)}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
              />
              {error ? <FieldError>{error}</FieldError> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-role">Role</Label>
              <select
                id="invite-role"
                defaultValue="member"
                className="h-9 w-full rounded-lg border border-border-strong bg-surface px-2.5 text-[13px] text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="billing">Billing admin</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="submit">Stage invite</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function Topbar() {
  const currentLabel = useCurrentLabel();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border-base bg-surface/95 px-4 backdrop-blur lg:px-6">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[12px]">
        <span className="hidden truncate text-muted sm:inline">Acme Corp</span>
        <ChevronRight className="hidden size-3 text-faint sm:inline" />
        <span className="truncate font-medium text-ink">{currentLabel}</span>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <CommandSearch />

        <span className="hidden items-center gap-1.5 rounded-lg border border-border-base px-2 py-1 text-[11px] font-medium text-ink-2 xl:inline-flex">
          <span className="size-1.5 rounded-full bg-success" />
          Live sync: 2m ago
        </span>

        <InviteDialog />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-danger" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((item) => (
              <DropdownMenuItem key={item.title} className="flex-col items-start gap-0.5">
                <span className="text-[12px] font-medium text-ink">{item.title}</span>
                <span className="text-[11px] text-muted">{item.meta}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-0.5 pr-2 text-left transition-colors hover:bg-surface-3"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
                AV
              </span>
              <span className="hidden leading-tight lg:block">
                <span className="block text-[12px] font-medium text-ink">Alex Vance</span>
                <span className="block text-[10px] text-muted">alex@acme.com</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Alex Vance · Owner</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <UserRound className="size-3.5" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="size-3.5" />
                Workspace settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <ShieldCheck className="size-3.5" />
                Security
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Sign out — not available in demo</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
