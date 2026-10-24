"use client";

import { useState } from "react";
import { BellPlus, CalendarRange, ChevronDown, Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRevenueCurrency, type CurrencyCode } from "@/lib/currency";
import { movementRows, retentionCohorts, subscriptions, waterfallSteps } from "@/lib/data/revenue";

const PERIODS = [
  "Jan 1 – Dec 31, 2025",
  "Q4 2025 (Oct 1 – Dec 31)",
  "Last 90 days",
  "Last 30 days",
];

const CURRENCY_OPTIONS: { code: CurrencyCode; label: string }[] = [
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
];
const FREQUENCIES = ["All frequencies", "Monthly", "Annual"];

export function RevenueActions() {
  const { currency, setCurrencyCode, formatMoney } = useRevenueCurrency();
  const [period, setPeriod] = useState(PERIODS[0]);
  const [frequency, setFrequency] = useState(FREQUENCIES[0]);
  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <CalendarRange className="size-3.5 text-muted" aria-hidden="true" />
            {period}
            <ChevronDown className="size-3.5 text-muted" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Reporting period</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PERIODS.map((item) => (
            <DropdownMenuItem key={item} onSelect={() => setPeriod(item)}>
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Select value={currency.code} onValueChange={(val) => setCurrencyCode(val as CurrencyCode)}>
        <SelectTrigger className="w-auto min-w-28" aria-label="Currency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CURRENCY_OPTIONS.map((item) => (
            <SelectItem key={item.code} value={item.code}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={frequency} onValueChange={setFrequency}>
        <SelectTrigger className="w-auto min-w-36" aria-label="Billing frequency">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FREQUENCIES.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="secondary"
        onClick={() => exportRevenueCsv(period, currency.label, frequency, formatMoney)}
      >
        <Download className="size-3.5" aria-hidden="true" />
        CSV
      </Button>

      <Button variant="secondary" onClick={() => setAlertOpen(true)}>
        <BellPlus className="size-3.5" aria-hidden="true" />
        New alert
      </Button>

      <SyncDialog period={period} currency={currency.label} frequency={frequency} />
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen} />
    </div>
  );
}

function exportRevenueCsv(
  period: string,
  currencyLabel: string,
  frequency: string,
  formatMoney: (val: number, opts?: { compact?: boolean; decimals?: number; sign?: boolean }) => string,
) {
  const rows: (string | number)[][] = [
    ["Northstar revenue export", period, currencyLabel, frequency],
    [],
    ["Waterfall component", "Value"],
    ...waterfallSteps.map((step) => [step.label, formatMoney(step.value, { sign: step.kind === "decrease" })]),
    [],
    ["Movement component", "Value", "% of baseline", "MoM delta", "Status"],
    ...movementRows.map((row) => [row.component, formatMoney(row.valueUsd, { sign: true }), row.shareOfBaseline, row.momDelta, row.impact]),
    [],
    ["Cohort", "Starting MRR", ...Array.from({ length: 12 }, (_, index) => `M${index}`)],
    ...retentionCohorts.map((cohort) => [cohort.month, formatMoney(cohort.startingMrrUsd), ...cohort.retention]),
    [],
    ["Customer", "Plan", "Cycle", "MRR", "LTV", "Movement", "Renewal"],
    ...subscriptions.map((row) => [
      row.customer,
      row.plan,
      row.cycle,
      formatMoney(row.mrr),
      formatMoney(row.ltv),
      row.movement,
      row.renewal,
    ]),
  ];

  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "northstar-revenue.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function SyncDialog({ period, currency, frequency }: { period: string; currency: string; frequency: string }) {
  const [open, setOpen] = useState(false);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  const runSync = () => {
    // Simulated: no Stripe request leaves the browser. Stamping the time is the
    // only real state change, so the button is honest about what happened.
    setSyncedAt(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="primary" onClick={() => setOpen(true)}>
        <RefreshCw className="size-3.5" aria-hidden="true" />
        Stripe sync
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stripe sync</DialogTitle>
          <DialogDescription>
            This showcase has no backend, so the sync is simulated — no request is sent to Stripe and no data
            changes.
          </DialogDescription>
        </DialogHeader>

        <dl className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-border-base bg-surface-2 p-3 text-[12px]">
          <dt className="text-muted">Period</dt>
          <dd className="text-right text-ink">{period}</dd>
          <dt className="text-muted">Currency</dt>
          <dd className="text-right text-ink">{currency}</dd>
          <dt className="text-muted">Frequency</dt>
          <dd className="text-right text-ink">{frequency}</dd>
          <dt className="text-muted">Last simulated run</dt>
          <dd className="tnum text-right text-ink">{syncedAt ?? "Not run yet"}</dd>
        </dl>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
          <Button variant="primary" onClick={runSync}>
            {syncedAt ? "Run again" : "Run simulated sync"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AlertDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [metric, setMetric] = useState("Net MRR growth");
  const [threshold, setThreshold] = useState("5");
  const [created, setCreated] = useState(false);
  const numeric = Number(threshold);
  const valid = Number.isFinite(numeric) && numeric > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setCreated(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New revenue alert</DialogTitle>
          <DialogDescription>
            Alerts are stored in this browser session only — nothing is emailed or pushed to Slack.
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <p className="mt-4 rounded-lg border border-border-base bg-surface-2 p-3 text-[12px] leading-5 text-muted">
            Simulated: an alert for <span className="font-medium text-ink">{metric}</span> at{" "}
            <span className="font-medium text-ink">{threshold}%</span> would be created here.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="alert-metric">Metric</Label>
              <Select value={metric} onValueChange={setMetric}>
                <SelectTrigger id="alert-metric">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Net MRR growth", "Gross churn MRR", "Expansion MRR", "NRR"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alert-threshold">Threshold (% change)</Label>
              <Input
                id="alert-threshold"
                inputMode="decimal"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
                aria-invalid={!valid}
              />
              {!valid ? (
                <p role="alert" className="text-[11px] font-medium text-danger">
                  Enter a number greater than zero.
                </p>
              ) : null}
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="primary" disabled={!valid} onClick={() => setCreated(true)}>
            Create alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
