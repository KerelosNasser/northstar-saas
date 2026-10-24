"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Download,
  Layers,
  Plus,
  Search,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCustomerDialog } from "@/components/customers/add-customer-dialog";
import { CustomerDetailRail } from "@/components/customers/customer-detail-rail";
import { CustomerStats } from "@/components/customers/customer-stats";
import { PageHeader } from "@/components/shell/page-header";
import { initialCustomers, type Customer } from "@/lib/data/customers";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "enterprise" | "pro" | "at-risk" | "onboarding";
type SortField = "name" | "healthScore" | "mrr" | "seats";

export function CustomersView() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [selectedId, setSelectedId] = useState<string>(initialCustomers[0]?.id ?? "");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("healthScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Multi-selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [segmentOpen, setSegmentOpen] = useState(false);
  const [bulkActionModal, setBulkActionModal] = useState<"csm" | "tag" | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  // Tab counts
  const counts = useMemo(
    () => ({
      all: customers.length,
      enterprise: customers.filter((c) => c.plan === "Enterprise Core").length,
      pro: customers.filter((c) => c.plan === "Pro Team").length,
      atRisk: customers.filter((c) => c.status === "At Risk" || c.status === "Churn Watch").length,
      onboarding: customers.filter((c) => c.status === "Onboarding").length,
    }),
    [customers],
  );

  // Filtered & Sorted list
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (activeTab === "enterprise") {
      result = result.filter((c) => c.plan === "Enterprise Core");
    } else if (activeTab === "pro") {
      result = result.filter((c) => c.plan === "Pro Team");
    } else if (activeTab === "at-risk") {
      result = result.filter((c) => c.status === "At Risk" || c.status === "Churn Watch");
    } else if (activeTab === "onboarding") {
      result = result.filter((c) => c.status === "Onboarding");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q) ||
          c.csm.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      const factor = sortDirection === "asc" ? 1 : -1;
      if (sortField === "name") return a.name.localeCompare(b.name) * factor;
      if (sortField === "healthScore") return (a.healthScore - b.healthScore) * factor;
      if (sortField === "mrr") return (a.mrr - b.mrr) * factor;
      if (sortField === "seats") return (a.seats - b.seats) * factor;
      return 0;
    });

    return result;
  }, [customers, activeTab, searchQuery, sortField, sortDirection]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedId) ?? filteredCustomers[0] ?? null,
    [customers, selectedId, filteredCustomers],
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredCustomers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleRowClick = (customer: Customer) => {
    setSelectedId(customer.id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileDetailOpen(true);
    }
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setSelectedId(newCustomer.id);
  };

  const exportCsv = (audience: Customer[], filename: string) => {
    const rows = [
      ["Customer Name", "Domain", "Plan", "Status", "Health Score", "MRR", "ARR", "Seats", "CSM", "Renewal"],
      ...audience.map((c) => [
        c.name,
        c.domain,
        c.plan,
        c.status,
        c.healthScore,
        c.mrr,
        c.arr,
        c.seats,
        c.csm,
        c.renewalDate,
      ]),
    ];
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-w-0 space-y-4">
      <PageHeader
        eyebrow={`${customers.length} tracked accounts`}
        title="Customers"
        description="Manage customer health scores, track revenue lifecycle retention, and surface expansion potential."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => exportCsv(filteredCustomers, "northstar-customers.csv")}
            >
              <Download className="size-3.5" aria-hidden="true" />
              Export audience
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setSegmentOpen(true)}>
              <Layers className="size-3.5" aria-hidden="true" />
              Create segment
            </Button>
            <Button variant="primary" size="sm" onClick={() => setAddCustomerOpen(true)}>
              <Plus className="size-3.5" aria-hidden="true" />
              Add customer
            </Button>
          </div>
        }
      />

      <CustomerStats />

      {/* Main Content: Directory Table + Detail Rail */}
      <div className="grid min-w-0 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {/* Left Column: Filter tabs, Search, Bulk Actions, Table */}
        <div className="min-w-0 space-y-3 lg:col-span-2 xl:col-span-3">
          <Card className="min-w-0">
            <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
              <div className="max-w-full overflow-x-auto scroll-thin pb-1 sm:pb-0">
                <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as FilterTab)}>
                  <TabsList className="h-8">
                    <TabsTrigger value="all" className="text-[12px]">
                      All ({counts.all})
                    </TabsTrigger>
                    <TabsTrigger value="enterprise" className="text-[12px]">
                      Enterprise ({counts.enterprise})
                    </TabsTrigger>
                    <TabsTrigger value="pro" className="text-[12px]">
                      Pro ({counts.pro})
                    </TabsTrigger>
                    <TabsTrigger value="at-risk" className="text-[12px]">
                      At Risk ({counts.atRisk})
                    </TabsTrigger>
                    <TabsTrigger value="onboarding" className="text-[12px]">
                      Onboarding ({counts.onboarding})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-auto">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
                  <Input
                    placeholder="Search accounts or CSM..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 w-full text-[12px] pl-8 sm:w-60"
                  />
                </div>
              </div>
            </CardHeader>

            {/* Bulk Actions Banner */}
            {selectedIds.length > 0 ? (
              <div className="mx-4 mb-3 flex items-center justify-between rounded-lg bg-surface-3 px-3 py-2 text-[12px] text-ink">
                <span className="font-medium">
                  {selectedIds.length} {selectedIds.length === 1 ? "account" : "accounts"} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const selectedAudience = customers.filter((c) => selectedIds.includes(c.id));
                      exportCsv(selectedAudience, "selected-customers.csv");
                    }}
                  >
                    <Download className="size-3" />
                    Export
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setBulkActionModal("csm")}>
                    <UserCheck className="size-3" />
                    Assign CSM
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
                    Clear
                  </Button>
                </div>
              </div>
            ) : null}

            {/* Customers Table */}
            <div className="overflow-x-auto scroll-thin border-t border-border-base">
              <table className="w-full min-w-[700px] border-collapse text-left text-[12px]">
                <thead>
                  <tr className="border-b border-border-base bg-surface-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                    <th scope="col" className="w-9 px-3 py-2.5">
                      <Checkbox
                        checked={
                          filteredCustomers.length > 0 && selectedIds.length === filteredCustomers.length
                        }
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        aria-label="Select all customers"
                      />
                    </th>
                    <th scope="col" className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleSort("name")}
                        className="inline-flex items-center gap-1 hover:text-ink"
                      >
                        Customer
                        {sortField === "name" ? (
                          sortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                        ) : null}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-2.5">Plan</th>
                    <th scope="col" className="px-3 py-2.5">Status</th>
                    <th scope="col" className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => toggleSort("healthScore")}
                        className="inline-flex items-center gap-1 hover:text-ink"
                      >
                        Health
                        {sortField === "healthScore" ? (
                          sortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                        ) : null}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort("mrr")}
                        className="inline-flex items-center gap-1 hover:text-ink ml-auto"
                      >
                        MRR
                        {sortField === "mrr" ? (
                          sortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                        ) : null}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort("seats")}
                        className="inline-flex items-center gap-1 hover:text-ink ml-auto"
                      >
                        Seats
                        {sortField === "seats" ? (
                          sortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
                        ) : null}
                      </button>
                    </th>
                    <th scope="col" className="px-3 py-2.5">CSM</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted">
                        No customers match this filter or search query.
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => {
                      const isSelected = c.id === selectedCustomer?.id;
                      const isChecked = selectedIds.includes(c.id);

                      const healthTone =
                        c.healthScore >= 80
                          ? "bg-success/15 text-success"
                          : c.healthScore >= 60
                          ? "bg-warning/15 text-warning"
                          : "bg-danger/15 text-danger";

                      return (
                        <tr
                          key={c.id}
                          onClick={() => handleRowClick(c)}
                          className={cn(
                            "cursor-pointer border-b border-border-base transition-colors hover:bg-surface-2 last:border-0",
                            isSelected && "bg-surface-3/70",
                          )}
                        >
                          <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={() => toggleSelect(c.id)}
                              aria-label={`Select ${c.name}`}
                            />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="grid size-7 shrink-0 place-items-center rounded-md bg-surface-3 text-[11px] font-semibold text-primary">
                                {c.initials}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-ink">{c.name}</p>
                                <p className="truncate text-[11px] text-muted">{c.domain}</p>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-ink-2">
                            <Badge variant={c.plan === "Enterprise Core" ? "primary" : "neutral"}>
                              {c.plan}
                            </Badge>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <Badge
                              variant={
                                c.status === "Active"
                                  ? "success"
                                  : c.status === "Onboarding"
                                  ? "neutral"
                                  : "danger"
                              }
                            >
                              {c.status}
                            </Badge>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5">
                            <span className={cn("tnum inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold", healthTone)}>
                              {c.healthScore}
                            </span>
                          </td>
                          <td className="tnum whitespace-nowrap px-3 py-2.5 text-right font-medium text-ink">
                            ${c.mrr.toLocaleString()}
                          </td>
                          <td className="tnum whitespace-nowrap px-3 py-2.5 text-right text-ink-2">
                            {c.seats}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-ink-2">
                            {c.csm}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-border-base px-4 py-2.5 text-[11px] text-muted">
              <span>
                Showing {filteredCustomers.length} of {customers.length} accounts
              </span>
              <span className="hidden sm:inline">Click an account to inspect telemetry in the detail rail</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Desktop Detail Rail */}
        <div className="hidden min-w-0 lg:block lg:col-span-1 xl:col-span-1">
          <CustomerDetailRail customer={selectedCustomer} />
        </div>
      </div>

      {/* Mobile Drawer/Dialog for Customer Detail */}
      <Dialog open={mobileDetailOpen} onOpenChange={setMobileDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto p-4 sm:max-w-lg">
          <CustomerDetailRail customer={selectedCustomer} onClose={() => setMobileDetailOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Customer Modal */}
      <AddCustomerDialog
        open={addCustomerOpen}
        onOpenChange={setAddCustomerOpen}
        onCustomerAdded={handleAddCustomer}
      />

      {/* Simulated Create Segment Dialog */}
      <Dialog open={segmentOpen} onOpenChange={setSegmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Customer Segment</DialogTitle>
            <DialogDescription>
              Define criteria to track high-expansion accounts or churn risk groups.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3 text-[12px]">
            <div className="space-y-1">
              <label className="font-medium text-ink">Segment Name</label>
              <Input placeholder="e.g. High ARR Expansion Cohort" defaultValue="Enterprise SSO Candidates" />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-ink">Filter Condition</label>
              <Select defaultValue="plan">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plan">Plan = Enterprise Core</SelectItem>
                  <SelectItem value="health">Health Score &gt; 85</SelectItem>
                  <SelectItem value="mrr">MRR &gt; $2,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="rounded-md border border-border-base bg-surface-2 p-2.5 text-[11px] text-muted">
              Simulated configuration: saved to browser session only.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="primary">Create segment</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Simulated Bulk CSM Assignment Dialog */}
      <Dialog open={!!bulkActionModal} onOpenChange={(open) => !open && setBulkActionModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Action — {selectedIds.length} accounts</DialogTitle>
            <DialogDescription>
              Assign dedicated Customer Success Manager across selected accounts.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-3 text-[12px]">
            <div className="space-y-1">
              <label className="font-medium text-ink">Assignee CSM</label>
              <Select defaultValue="sarah">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Chen (Enterprise Lead)</SelectItem>
                  <SelectItem value="david">David Miller (Strategic Accounts)</SelectItem>
                  <SelectItem value="alex">Alex Vance (Principal CSM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="rounded-md border border-border-base bg-surface-2 p-2.5 text-[11px] text-muted">
              Simulated operation. In a production workspace, account reassignments trigger automated email handoffs.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button
              variant="primary"
              onClick={() => {
                setCustomers((prev) =>
                  prev.map((c) =>
                    selectedIds.includes(c.id) ? { ...c, csm: "Sarah Chen" } : c,
                  ),
                );
                setSelectedIds([]);
                setBulkActionModal(null);
              }}
            >
              Confirm assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
