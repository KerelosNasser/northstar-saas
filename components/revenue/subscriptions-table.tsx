"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRevenueCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { subscriptions, type Subscription } from "@/lib/data/revenue";

type SortKey = "customer" | "mrr" | "ltv" | "renewal";
type StatusFilter = "all" | Subscription["status"];
type PlanFilter = "all" | "enterprise" | "pro" | "starter";

const PLAN_MATCH: Record<Exclude<PlanFilter, "all">, (plan: string) => boolean> = {
  enterprise: (plan) => plan.startsWith("Enterprise"),
  pro: (plan) => plan.startsWith("Pro"),
  starter: (plan) => plan.startsWith("Starter"),
};

const COLUMNS: { key: SortKey | null; label: string; align?: "right" }[] = [
  { key: "customer", label: "Customer" },
  { key: null, label: "Plan" },
  { key: null, label: "Billing cycle" },
  { key: "mrr", label: "MRR", align: "right" },
  { key: "ltv", label: "LTV", align: "right" },
  { key: null, label: "Net movement" },
  { key: "renewal", label: "Renewal" },
];

const PAGE_SIZE = 5;

export function SubscriptionsTable() {
  const { formatMoney } = useRevenueCurrency();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [plan, setPlan] = useState<PlanFilter>("all");
  const [minArr, setMinArr] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; direction: "asc" | "desc" }>({
    key: "mrr",
    direction: "desc",
  });
  const [page, setPage] = useState(1);

  const filteredAndSortedRows = useMemo(() => {
    const threshold = minArr === "all" ? 0 : Number(minArr);
    const needle = query.trim().toLowerCase();

    const filtered = subscriptions.filter((row) => {
      if (status !== "all" && row.status !== status) return false;
      if (plan !== "all" && !PLAN_MATCH[plan](row.plan)) return false;
      if (row.mrr * 12 < threshold) return false;
      if (!needle) return true;
      return `${row.customer} ${row.domain} ${row.plan}`.toLowerCase().includes(needle);
    });

    return [...filtered].sort((a, b) => {
      const factor = sort.direction === "asc" ? 1 : -1;
      switch (sort.key) {
        case "customer":
          return a.customer.localeCompare(b.customer) * factor;
        case "mrr":
          return (a.mrr - b.mrr) * factor;
        case "ltv":
          return (a.ltv - b.ltv) * factor;
        case "renewal":
          return (Date.parse(a.renewal) - Date.parse(b.renewal)) * factor;
      }
    });
  }, [query, status, plan, minArr, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedRows.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedRows, currentPage]);

  const toggleSort = (key: SortKey) =>
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "desc" },
    );

  return (
    <Card className="min-w-0">
      <CardHeader className="flex-col items-stretch gap-3 sm:flex-row sm:items-start">
        <div>
          <CardTitle>Active subscriptions &amp; run-rate</CardTitle>
          <p className="mt-0.5 text-[12px] text-muted">
            {filteredAndSortedRows.length} of {subscriptions.length} seeded accounts match the current filters.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Filter by customer, domain..."
              aria-label="Filter subscriptions"
              className="w-full pl-8 sm:w-56"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as StatusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-auto min-w-28" aria-label="Status filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Past due">Past due</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={plan}
            onValueChange={(value) => {
              setPlan(value as PlanFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-auto min-w-28" aria-label="Plan filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All plans</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="starter">Starter</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={minArr}
            onValueChange={(value) => {
              setMinArr(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-auto min-w-32" aria-label="Minimum ARR filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any ARR</SelectItem>
              <SelectItem value="10000">Min ARR $10k</SelectItem>
              <SelectItem value="25000">Min ARR $25k</SelectItem>
              <SelectItem value="50000">Min ARR $50k</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {paginatedRows.length === 0 ? (
        <p className="border-t border-border-base px-4 py-10 text-center text-[12px] text-muted">
          No subscriptions match these filters. Widen the search or reset the plan and ARR filters.
        </p>
      ) : (
        <div className="overflow-x-auto scroll-thin border-t border-border-base">
          <table className="w-full min-w-[880px] border-collapse text-left">
            <thead>
              <tr className="bg-surface-2">
                {COLUMNS.map((column) => (
                  <th
                    key={column.label}
                    scope="col"
                    aria-sort={
                      column.key && sort.key === column.key
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className={cn(
                      "whitespace-nowrap px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted",
                      column.align === "right" && "text-right",
                    )}
                  >
                    {column.key ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key as SortKey)}
                        className="inline-flex items-center gap-1 rounded-sm hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        {column.label}
                        {sort.key === column.key ? (
                          sort.direction === "asc" ? (
                            <ArrowUp className="size-3" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="size-3" aria-hidden="true" />
                          )
                        ) : null}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => (
                <tr key={row.id} className="border-b border-border-base last:border-0 hover:bg-surface-2">
                  <th scope="row" className="px-3 py-2.5 text-left font-normal">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="grid size-7 shrink-0 place-items-center rounded-md bg-surface-3 text-[10px] font-semibold text-ink-2"
                      >
                        {row.initials}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12px] font-medium text-ink">{row.customer}</span>
                        <span className="block truncate text-[11px] text-muted">{row.domain}</span>
                      </span>
                    </span>
                  </th>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-2">{row.plan}</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-2">{row.cycle}</td>
                  <td className="tnum whitespace-nowrap px-3 py-2.5 text-right text-[12px] text-ink">
                    {formatMoney(row.mrr, { decimals: 0 })}
                  </td>
                  <td className="tnum whitespace-nowrap px-3 py-2.5 text-right text-[12px] text-ink-2">
                    {formatMoney(row.ltv, { decimals: 0 })}
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge variant={row.movementTone === "success" ? "success" : row.movementTone === "danger" ? "danger" : "neutral"}>
                      {row.movement}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-2">{row.renewal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-base px-4 py-3">
        <p className="text-[11px] text-muted">
          Showing {paginatedRows.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0} to{" "}
          {Math.min(currentPage * PAGE_SIZE, filteredAndSortedRows.length)} of {filteredAndSortedRows.length} subscriptions
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="size-3.5" aria-hidden="true" />
            Prev
          </Button>
          <span className="tnum text-[11px] text-muted">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
