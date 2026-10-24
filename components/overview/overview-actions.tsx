"use client";

import { useState } from "react";
import { CalendarDays, Check, Download, Plus, Settings2, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { overviewKpis, trajectorySeries } from "@/lib/data/overview";
import { useHiddenKpis } from "@/lib/kpi-visibility";

const RANGES = [
  { id: "30d", label: "Last 30 days (Nov 1 – Nov 30, 2025)", comparison: "vs. previous period (Oct 1 – Oct 31)" },
  { id: "7d", label: "Last 7 days (Nov 24 – Nov 30, 2025)", comparison: "vs. previous period (Nov 17 – Nov 23)" },
  { id: "90d", label: "Last 90 days (Sep 1 – Nov 30, 2025)", comparison: "vs. previous period (Jun 3 – Aug 31)" },
  { id: "qtd", label: "Quarter to date (Oct 1 – Nov 30, 2025)", comparison: "vs. previous quarter (Jul 1 – Sep 30)" },
] as const;

const CHANNELS = ["All Channels (Global)", "Direct sales", "Partner referral", "Self-serve"];

export function OverviewActions() {
  const [rangeId, setRangeId] = useState<(typeof RANGES)[number]["id"]>("30d");
  const [channel, setChannel] = useState(CHANNELS[0]);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const range = RANGES.find((item) => item.id === rangeId) ?? RANGES[0];

  return (
    <div className="flex flex-col gap-2 md:items-end">
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-auto gap-2 py-1.5">
              <CalendarDays className="size-3.5 text-muted" aria-hidden="true" />
              <span className="flex flex-col items-start leading-tight">
                <span>{range.label}</span>
                <span className="text-[10px] font-normal text-muted">{range.comparison}</span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Reporting period</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {RANGES.map((item) => (
              <DropdownMenuItem key={item.id} onSelect={() => setRangeId(item.id)}>
                <span className="flex-1">{item.label}</span>
                <Check
                  className={rangeId === item.id ? "size-3.5 opacity-100" : "size-3.5 opacity-0"}
                  aria-hidden="true"
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select value={channel} onValueChange={setChannel}>
          <SelectTrigger className="w-auto min-w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHANNELS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="secondary" onClick={() => setCustomizeOpen(true)}>
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Customize
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => exportSnapshot(range.label, channel)}>
          <Download className="size-3.5" aria-hidden="true" />
          Export
        </Button>
        <Button variant="primary" onClick={() => setReportOpen(true)}>
          <Plus className="size-3.5" aria-hidden="true" />
          Create report
        </Button>
      </div>

      <CustomizeDialog open={customizeOpen} onOpenChange={setCustomizeOpen} />
      <CreateReportDialog open={reportOpen} onOpenChange={setReportOpen} range={range.label} />
    </div>
  );
}

/** Builds a CSV in the browser from the same mock data the screen renders. */
function exportSnapshot(rangeLabel: string, channel: string) {
  const rows = [
    ["Northstar snapshot", rangeLabel, channel],
    [],
    ["Metric", "Value"],
    ...overviewKpis.map((kpi) => [kpi.label, kpi.value]),
    [],
    ["Day", "Current period", "Previous period"],
    ...trajectorySeries.map((point) => [String(point.day), String(point.current), String(point.prior)]),
  ];

  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "northstar-overview.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

function CustomizeDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { hidden, toggle, reset } = useHiddenKpis();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize dashboard</DialogTitle>
          <DialogDescription>
            Choose which summary cards appear at the top of the overview. The preference is stored in this
            browser only.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-1">
          {overviewKpis.map((kpi) => {
            const visible = !hidden.includes(kpi.id);
            return (
              <label
                key={kpi.id}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-surface-2"
              >
                <span className="flex items-center gap-2 text-[13px] text-ink">
                  <Settings2 className="size-3.5 text-muted" aria-hidden="true" />
                  {kpi.label}
                </span>
                <Switch checked={visible} onCheckedChange={() => toggle(kpi.id)} aria-label={kpi.label} />
              </label>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
          <DialogClose asChild>
            <Button variant="primary">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateReportDialog({
  open,
  onOpenChange,
  range,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  range: string;
}) {
  const [title, setTitle] = useState("");
  const [cadence, setCadence] = useState("Weekly");
  const [created, setCreated] = useState(false);
  const trimmed = title.trim();
  const valid = trimmed.length >= 3;

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setCreated(false);
      setTitle("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create report</DialogTitle>
          <DialogDescription>
            Draft a scheduled summary from the current view. This showcase has no backend — the draft is
            not stored or sent anywhere.
          </DialogDescription>
        </DialogHeader>

        {created ? (
          <div className="mt-4 space-y-2 rounded-lg border border-border-base bg-surface-2 p-3">
            <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
              <Check className="size-4 text-success" aria-hidden="true" />
              &ldquo;{trimmed}&rdquo; drafted
            </p>
            <p className="text-[12px] leading-5 text-muted">
              Simulated only. No email, PDF, or schedule was created — the Reports Library still shows the
              seeded 24 reports.
            </p>
            <Badge variant="neutral">{cadence} · {range}</Badge>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="report-title">Report title</Label>
              <Input
                id="report-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Weekly revenue review"
                aria-invalid={title.length > 0 && !valid}
              />
              {title.length > 0 && !valid ? (
                <p role="alert" className="text-[11px] font-medium text-danger">
                  Use at least 3 characters.
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="report-cadence">Cadence</Label>
              <Select value={cadence} onValueChange={setCadence}>
                <SelectTrigger id="report-cadence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Daily", "Weekly", "Monthly"].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          {created ? (
            <DialogClose asChild>
              <Button variant="primary">Close</Button>
            </DialogClose>
          ) : (
            <>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button variant="primary" disabled={!valid} onClick={() => setCreated(true)}>
                Create draft
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
