"use client";

import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  CreditCard,
  KeyRound,
  Lock,
  Moon,
  RotateCcw,
  Save,
  ShieldAlert,
  Sun,
  Trash2,
  Upload,
  UserPlus,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shell/page-header";
import { useTheme } from "@/components/theme-provider";
import {
  initialTeamMembers,
  initialWorkspaceProfile,
  type TeamMember,
  type TeamRole,
  type WorkspaceProfile,
} from "@/lib/data/settings";
import { cn } from "@/lib/utils";

type SettingsTab = "profile" | "team" | "appearance" | "security" | "billing";

export function SettingsView() {
  const { theme, setTheme } = useTheme();

  // Saved workspace state
  const [savedProfile, setSavedProfile] = useState<WorkspaceProfile>(initialWorkspaceProfile);
  // Form working state
  const [profile, setProfile] = useState<WorkspaceProfile>(initialWorkspaceProfile);

  // Team state
  const [team, setTeam] = useState<TeamMember[]>(initialTeamMembers);

  // Security switches
  const [ssoEnforced, setSsoEnforced] = useState(true);
  const [require2Fa, setRequire2Fa] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("12h");

  // Tab & feedback states
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [savedNotice, setSavedNotice] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [logoError, setLogoError] = useState<string | null>(null);

  // Modals
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamRole>("Member");
  const [inviteError, setInviteError] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deletedNotice, setDeletedNotice] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dirty state detection
  const isDirty = useMemo(() => {
    return (
      profile.name !== savedProfile.name ||
      profile.slug !== savedProfile.slug ||
      profile.supportEmail !== savedProfile.supportEmail ||
      profile.billingEmail !== savedProfile.billingEmail ||
      profile.timezone !== savedProfile.timezone ||
      profile.currency !== savedProfile.currency ||
      profile.logoUrl !== savedProfile.logoUrl
    );
  }, [profile, savedProfile]);

  const validateProfile = () => {
    const errs: Record<string, string> = {};
    if (!profile.name.trim() || profile.name.trim().length < 3) {
      errs.name = "Workspace name must be at least 3 characters.";
    }
    if (!profile.slug.trim()) {
      errs.slug = "Workspace slug cannot be empty.";
    }
    if (!profile.supportEmail.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profile.supportEmail)) {
      errs.supportEmail = "Enter a valid support email address.";
    }
    if (!profile.billingEmail.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(profile.billingEmail)) {
      errs.billingEmail = "Enter a valid billing email address.";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validateProfile()) return;
    setSavedProfile(profile);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleRevert = () => {
    setProfile(savedProfile);
    setFormErrors({});
    setLogoError(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Type validation
    if (!file.type.startsWith("image/")) {
      setLogoError("Invalid file type. Please upload a PNG, JPEG, SVG or WebP image.");
      return;
    }

    // Size validation: max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("File size exceeds 2MB limit. Please choose a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => ({ ...prev, logoUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setProfile((prev) => ({ ...prev, logoUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inviteEmail)) {
      setInviteError("Enter a valid email address.");
      return;
    }

    const namePart = inviteEmail.split("@")[0].replace(/[._]/g, " ");
    const formattedName = namePart
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: formattedName,
      email: inviteEmail.trim(),
      role: inviteRole,
      twoFactorEnabled: true,
      lastActive: "Invited",
      initials: formattedName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U",
    };

    setTeam((prev) => [newMember, ...prev]);
    setInviteEmail("");
    setInviteError(null);
    setInviteOpen(false);
  };

  const handleUpdateRole = (memberId: string, newRole: TeamRole) => {
    setTeam((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    );
  };

  const handleRemoveMember = (memberId: string) => {
    setTeam((prev) => prev.filter((m) => m.id !== memberId));
  };

  return (
    <div className="min-w-0 space-y-5">
      <PageHeader
        eyebrow="Workspace settings &amp; permissions"
        title="Settings"
        description="Manage organization profile, team members, visual theme appearance, and authentication security."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!isDirty}
              onClick={handleRevert}
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Revert changes
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={!isDirty}
              onClick={handleSave}
            >
              <Save className="size-3.5" aria-hidden="true" />
              Save preferences
            </Button>
          </div>
        }
      />

      {/* Dirty state warning notice */}
      {isDirty ? (
        <div className="flex items-center justify-between rounded-card border border-warning/30 bg-warning-soft p-3 text-[12px] text-warning shadow-card">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0" />
            <span className="font-medium">You have unsaved changes in your workspace preferences.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleRevert}>
              Revert
            </Button>
            <Button size="sm" variant="primary" onClick={handleSave}>
              Save now
            </Button>
          </div>
        </div>
      ) : null}

      {/* Save Success Banner */}
      {savedNotice ? (
        <div className="flex items-center gap-2 rounded-card border border-success/30 bg-success-soft p-3 text-[12px] text-success shadow-card">
          <Check className="size-4 shrink-0" />
          <span className="font-medium">Workspace preferences saved successfully in browser state.</span>
        </div>
      ) : null}

      {/* Tabs navigation */}
      <div className="max-w-full overflow-x-auto scroll-thin pb-1 sm:pb-0">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as SettingsTab)}>
          <TabsList className="h-8">
            <TabsTrigger value="profile" className="text-[12px]">General Profile</TabsTrigger>
            <TabsTrigger value="team" className="text-[12px]">Team &amp; Access ({team.length})</TabsTrigger>
            <TabsTrigger value="appearance" className="text-[12px]">Appearance</TabsTrigger>
            <TabsTrigger value="security" className="text-[12px]">Security &amp; SSO</TabsTrigger>
            <TabsTrigger value="billing" className="text-[12px]">Billing &amp; Invoices</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab 1: General Profile */}
      {activeTab === "profile" ? (
        <div className="space-y-4">
          <Card className="min-w-0 p-5">
            <CardHeader className="p-0 pb-4">
              <div>
                <CardTitle>Organization Identity</CardTitle>
                <p className="mt-0.5 text-[12px] text-muted">
                  Basic identifying details visible across reports, invoices, and audit exports.
                </p>
              </div>
            </CardHeader>

            <div className="space-y-4 text-[12px]">
              {/* Logo Upload Section */}
              <div className="space-y-2">
                <Label>Workspace Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="grid size-16 shrink-0 place-items-center rounded-xl border border-border-base bg-surface-2 overflow-hidden">
                    {profile.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.logoUrl} alt="Workspace Logo Preview" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-[16px] font-bold text-primary">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="size-3.5" aria-hidden="true" />
                        Upload new logo
                      </Button>
                      {profile.logoUrl ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          type="button"
                          onClick={handleRemoveLogo}
                          className="text-danger hover:text-danger"
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                    <p className="text-[11px] text-muted">PNG, JPG, or SVG up to 2MB. Minimum 128x128px recommended.</p>
                    {logoError ? (
                      <p role="alert" className="text-[11px] font-medium text-danger">
                        {logoError}
                      </p>
                    ) : null}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-name">Workspace name</Label>
                  <Input
                    id="prof-name"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    aria-invalid={!!formErrors.name}
                  />
                  {formErrors.name ? <p role="alert" className="text-[11px] text-danger">{formErrors.name}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-slug">Custom URL slug</Label>
                  <div className="flex items-center rounded-md border border-border-base bg-surface-2 px-2.5">
                    <span className="text-[11px] text-muted select-none">app.northstar.io/</span>
                    <input
                      id="prof-slug"
                      value={profile.slug}
                      onChange={(e) => setProfile((prev) => ({ ...prev, slug: e.target.value }))}
                      className="h-8 w-full bg-transparent px-1 text-[12px] text-ink focus:outline-none"
                    />
                  </div>
                  {formErrors.slug ? <p role="alert" className="text-[11px] text-danger">{formErrors.slug}</p> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-support">Support contact email</Label>
                  <Input
                    id="prof-support"
                    type="email"
                    value={profile.supportEmail}
                    onChange={(e) => setProfile((prev) => ({ ...prev, supportEmail: e.target.value }))}
                    aria-invalid={!!formErrors.supportEmail}
                  />
                  {formErrors.supportEmail ? <p role="alert" className="text-[11px] text-danger">{formErrors.supportEmail}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-billing">Billing notification email</Label>
                  <Input
                    id="prof-billing"
                    type="email"
                    value={profile.billingEmail}
                    onChange={(e) => setProfile((prev) => ({ ...prev, billingEmail: e.target.value }))}
                    aria-invalid={!!formErrors.billingEmail}
                  />
                  {formErrors.billingEmail ? <p role="alert" className="text-[11px] text-danger">{formErrors.billingEmail}</p> : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Workspace Timezone</Label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(val) => setProfile((prev) => ({ ...prev, timezone: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles (Pacific Time)">America/Los Angeles (Pacific Time - UTC-8)</SelectItem>
                      <SelectItem value="America/New_York (Eastern Time)">America/New York (Eastern Time - UTC-5)</SelectItem>
                      <SelectItem value="Europe/London (GMT/BST)">Europe/London (GMT/BST - UTC+0)</SelectItem>
                      <SelectItem value="Europe/Berlin (CET)">Europe/Berlin (Central European Time - UTC+1)</SelectItem>
                      <SelectItem value="Asia/Tokyo (JST)">Asia/Tokyo (JST - UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Primary Currency</Label>
                  <Select
                    value={profile.currency}
                    onValueChange={(val) => setProfile((prev) => ({ ...prev, currency: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD ($)">USD ($) — United States Dollar</SelectItem>
                      <SelectItem value="EUR (€)">EUR (€) — Euro</SelectItem>
                      <SelectItem value="GBP (£)">GBP (£) — British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="min-w-0 border-danger/30 p-5 bg-danger-soft/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="flex items-center gap-1.5 text-[14px] font-semibold text-danger">
                  <ShieldAlert className="size-4" />
                  Danger Zone
                </h4>
                <p className="mt-0.5 text-[12px] text-muted">
                  Irreversible deletion of this workspace, accounts, telemetry and reports history.
                </p>
              </div>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  setDeleteConfirmationText("");
                  setDeleteModalOpen(true);
                  setDeletedNotice(false);
                }}
              >
                Delete workspace
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Tab 2: Team & Access */}
      {activeTab === "team" ? (
        <Card className="min-w-0">
          <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
            <div>
              <CardTitle>Team Members &amp; Permissions</CardTitle>
              <p className="mt-0.5 text-[12px] text-muted">
                {team.length} members with role-based governance access.
              </p>
            </div>
            <Button size="sm" variant="primary" onClick={() => setInviteOpen(true)}>
              <UserPlus className="size-3.5" aria-hidden="true" />
              Invite teammate
            </Button>
          </CardHeader>

          <div className="overflow-x-auto scroll-thin border-t border-border-base">
            <table className="w-full min-w-[650px] border-collapse text-left text-[12px]">
              <thead>
                <tr className="border-b border-border-base bg-surface-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                  <th scope="col" className="px-3 py-2.5">Member</th>
                  <th scope="col" className="px-3 py-2.5">Role</th>
                  <th scope="col" className="px-3 py-2.5">2FA State</th>
                  <th scope="col" className="px-3 py-2.5">Last Active</th>
                  <th scope="col" className="px-3 py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => (
                  <tr key={member.id} className="border-b border-border-base hover:bg-surface-2 last:border-0">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface-3 text-[11px] font-semibold text-primary">
                          {member.initials}
                        </span>
                        <div className="min-w-0">
                          <p className="font-semibold text-ink leading-tight">{member.name}</p>
                          <p className="text-[11px] text-muted">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Select
                        value={member.role}
                        onValueChange={(val) => handleUpdateRole(member.id, val as TeamRole)}
                        disabled={member.role === "Owner"}
                      >
                        <SelectTrigger className="h-7 w-28 text-[11px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Owner">Owner</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Member">Member</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <Badge variant={member.twoFactorEnabled ? "success" : "neutral"}>
                        {member.twoFactorEnabled ? "2FA Active" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[11px] text-muted font-mono">
                      {member.lastActive}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right">
                      {member.role !== "Owner" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveMember(member.id)}
                          className="hover:text-danger"
                          title="Remove member"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {/* Tab 3: Appearance & Theme */}
      {activeTab === "appearance" ? (
        <Card className="min-w-0 p-5 space-y-4">
          <CardHeader className="p-0 pb-2">
            <div>
              <CardTitle>Appearance &amp; Theme</CardTitle>
              <p className="mt-0.5 text-[12px] text-muted">
                Choose the visual tone for the Northstar application interface.
              </p>
            </div>
          </CardHeader>

          <div className="grid gap-3 sm:grid-cols-3">
            {/* Light Mode Card */}
            <div
              onClick={() => setTheme("light")}
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-surface-2",
                theme === "light"
                  ? "border-primary bg-primary-soft/30 shadow-card"
                  : "border-border-base bg-surface",
              )}
            >
              <div className="flex items-center justify-between">
                <Sun className="size-5 text-warning" />
                {theme === "light" ? <Badge variant="primary">Active</Badge> : null}
              </div>
              <h4 className="mt-3 text-[14px] font-semibold text-ink">Light Mode</h4>
              <p className="mt-1 text-[11px] text-muted leading-4">
                Clean, crisp high-contrast daylight palette sampled from the Figma master.
              </p>
            </div>

            {/* Dark Mode Card */}
            <div
              onClick={() => setTheme("dark")}
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-surface-2",
                theme === "dark"
                  ? "border-primary bg-primary-soft/30 shadow-card"
                  : "border-border-base bg-surface",
              )}
            >
              <div className="flex items-center justify-between">
                <Moon className="size-5 text-accent" />
                {theme === "dark" ? <Badge variant="primary">Active</Badge> : null}
              </div>
              <h4 className="mt-3 text-[14px] font-semibold text-ink">Dark Mode</h4>
              <p className="mt-1 text-[11px] text-muted leading-4">
                Low-eyestrain dark navy elevation with glowing telemetry highlights.
              </p>
            </div>

            {/* System Default */}
            <div
              onClick={() => setTheme("system")}
              className={cn(
                "cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-surface-2",
                theme === "system"
                  ? "border-primary bg-primary-soft/30 shadow-card"
                  : "border-border-base bg-surface",
              )}
            >
              <div className="flex items-center justify-between">
                <RotateCcw className="size-5 text-primary" />
                {theme === "system" ? <Badge variant="primary">Active</Badge> : null}
              </div>
              <h4 className="mt-3 text-[14px] font-semibold text-ink">System Preference</h4>
              <p className="mt-1 text-[11px] text-muted leading-4">
                Automatically synchronize with your operating system light / dark settings.
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Tab 4: Security & SSO */}
      {activeTab === "security" ? (
        <Card className="min-w-0 p-5 space-y-4">
          <CardHeader className="p-0 pb-2">
            <div>
              <CardTitle>Authentication Governance &amp; SSO</CardTitle>
              <p className="mt-0.5 text-[12px] text-muted">
                Enterprise security controls, identity providers, and session duration.
              </p>
            </div>
          </CardHeader>

          <div className="space-y-4 text-[12px]">
            <div className="flex items-center justify-between rounded-xl border border-border-base p-4">
              <div>
                <p className="font-semibold text-ink flex items-center gap-1.5">
                  <KeyRound className="size-4 text-primary" />
                  Enforce SAML Single Sign-On (Okta / Azure AD)
                </p>
                <p className="mt-0.5 text-muted">
                  Require all organization members to sign in through your verified enterprise identity provider.
                </p>
              </div>
              <Switch checked={ssoEnforced} onCheckedChange={setSsoEnforced} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border-base p-4">
              <div>
                <p className="font-semibold text-ink flex items-center gap-1.5">
                  <Lock className="size-4 text-primary" />
                  Mandatory Two-Factor Authentication (2FA)
                </p>
                <p className="mt-0.5 text-muted">
                  Enforce hardware security keys (FIDO2) or TOTP authenticator apps for all account logins.
                </p>
              </div>
              <Switch checked={require2Fa} onCheckedChange={setRequire2Fa} />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border-base p-4">
              <div>
                <p className="font-semibold text-ink">Session Idle Timeout</p>
                <p className="mt-0.5 text-muted">
                  Automatically invalidate dormant web sessions after a period of inactivity.
                </p>
              </div>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="12h">12 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Tab 5: Billing & Plans */}
      {activeTab === "billing" ? (
        <div className="space-y-4">
          <Card className="min-w-0 p-5 space-y-4">
            <CardHeader className="p-0 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Subscription Tier</CardTitle>
                  <p className="mt-0.5 text-[12px] text-muted">
                    Enterprise Growth Plan — billed annually.
                  </p>
                </div>
                <Badge variant="primary">Growth Plan</Badge>
              </div>
            </CardHeader>

            <div className="grid gap-3 sm:grid-cols-3 text-[12px]">
              <div className="rounded-lg border border-border-base p-3">
                <span className="text-[10px] font-semibold uppercase text-muted">Monthly Rate</span>
                <p className="tnum mt-1 text-[18px] font-semibold text-ink">$1,480 / mo</p>
                <p className="text-[11px] text-muted">Billed annually ($17,760/yr)</p>
              </div>
              <div className="rounded-lg border border-border-base p-3">
                <span className="text-[10px] font-semibold uppercase text-muted">Seat Capacity</span>
                <p className="tnum mt-1 text-[18px] font-semibold text-ink">48 / 60 seats</p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
                  <div className="h-full bg-primary rounded-full" style={{ width: "80%" }} />
                </div>
              </div>
              <div className="rounded-lg border border-border-base p-3">
                <span className="text-[10px] font-semibold uppercase text-muted">Renewal Date</span>
                <p className="tnum mt-1 text-[18px] font-semibold text-ink">Nov 14, 2026</p>
                <p className="text-[11px] text-muted">Auto-renewal enabled</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border-base bg-surface-2 p-3 text-[12px]">
              <div className="flex items-center gap-2.5">
                <CreditCard className="size-5 text-primary" />
                <div>
                  <p className="font-semibold text-ink">Mastercard ending in 4242</p>
                  <p className="text-[11px] text-muted">Expires 12/2028 · Primary billing method</p>
                </div>
              </div>
              <Button size="sm" variant="secondary">
                Update card
              </Button>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Invite Teammate Modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a teammate</DialogTitle>
            <DialogDescription>
              Grant access to the Northstar analytics cockpit. Simulated locally for portfolio presentation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInvite} className="mt-3 space-y-3.5 text-[12px]">
            <div className="space-y-1.5">
              <Label htmlFor="inv-email">Email address</Label>
              <Input
                id="inv-email"
                type="email"
                placeholder="colleague@acme.com"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  setInviteError(null);
                }}
              />
              {inviteError ? <p role="alert" className="text-[11px] text-danger">{inviteError}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label>Permission Role</Label>
              <Select value={inviteRole} onValueChange={(val) => setInviteRole(val as TeamRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin (Full configuration rights)</SelectItem>
                  <SelectItem value="Member">Member (Read &amp; report builder)</SelectItem>
                  <SelectItem value="Viewer">Viewer (Read-only)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="rounded-md border border-border-base bg-surface-2 p-2.5 text-[11px] text-muted">
              Demo environment: Invite will stage in local state without dispatching real email.
            </p>

            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="primary">Send invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal (Strict typed confirmation required!) */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-danger flex items-center gap-2">
              <ShieldAlert className="size-5" />
              Delete Workspace &ldquo;{profile.name}&rdquo;
            </DialogTitle>
            <DialogDescription>
              This action is destructive and requires strict confirmation.
            </DialogDescription>
          </DialogHeader>

          {deletedNotice ? (
            <div className="mt-3 space-y-2 rounded-lg border border-danger/30 bg-danger-soft p-3 text-[12px] text-danger">
              <p className="font-semibold">Simulated Deletion Completed</p>
              <p className="text-muted leading-4">
                In production, this would trigger account deprovisioning and a 30-day recovery grace period.
                Because this is a portfolio showcase, your workspace data remains safe.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-3 text-[12px]">
              <p className="text-muted leading-5">
                To confirm deletion, please type the exact workspace name below:
                <br />
                <span className="font-mono font-semibold text-ink select-all">{profile.name}</span>
              </p>

              <Input
                placeholder="Type workspace name to confirm"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            {deletedNotice ? (
              <DialogClose asChild>
                <Button variant="primary">Close</Button>
              </DialogClose>
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button
                  variant="danger"
                  disabled={deleteConfirmationText.trim() !== profile.name.trim()}
                  onClick={() => setDeletedNotice(true)}
                >
                  I understand, delete workspace
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
