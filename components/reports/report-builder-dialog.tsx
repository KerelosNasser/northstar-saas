"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Input, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { ReportCadence, ReportCategory, ReportFormat, ReportItem } from "@/lib/data/reports";
import { cn } from "@/lib/utils";

const AVAILABLE_SOURCES = [
  "Stripe Billing",
  "Okta Logs",
  "Segment Telemetry",
  "Zendesk Support",
  "HubSpot CRM",
];

const AVAILABLE_METRICS = [
  "MRR",
  "ARR",
  "Churn rate",
  "Cohort retention",
  "Health scores",
  "LTV",
  "Active seats",
];

export function ReportBuilderDialog({
  open,
  onOpenChange,
  onReportCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReportCreated: (report: ReportItem) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ReportCategory>("Finance");
  const [cadence, setCadence] = useState<ReportCadence>("Weekly");
  const [format, setFormat] = useState<ReportFormat>("CSV");
  const [selectedSources, setSelectedSources] = useState<string[]>(["Stripe Billing"]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["MRR", "ARR"]);
  const [emailDispatch, setEmailDispatch] = useState(true);
  const [slackDispatch, setSlackDispatch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source],
    );
  };

  const toggleMetric = (metric: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      setError("Report title must be at least 3 characters long.");
      return;
    }
    if (selectedSources.length === 0) {
      setError("Select at least one data source.");
      return;
    }
    if (selectedMetrics.length === 0) {
      setError("Select at least one metric to track.");
      return;
    }

    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newReport: ReportItem = {
      id: `rep-${slug}`,
      title: title.trim(),
      description: description.trim() || `Automated ${cadence} summary of ${selectedMetrics.join(", ")}.`,
      category,
      cadence,
      sources: selectedSources,
      metrics: selectedMetrics,
      format,
      recipientsCount: emailDispatch ? 6 : 0,
      lastRun: "Never run",
      nextScheduled: "Upcoming next cycle",
      status: "Active",
    };

    onReportCreated(newReport);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Finance");
    setCadence("Weekly");
    setFormat("CSV");
    setSelectedSources(["Stripe Billing"]);
    setSelectedMetrics(["MRR", "ARR"]);
    setEmailDispatch(true);
    setSlackDispatch(false);
    setError(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Configure new report</DialogTitle>
          <DialogDescription>
            Assemble data sources, metric dimensions, and simulated schedule dispatch.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 space-y-4 text-[12px]">
          {error ? (
            <p role="alert" className="rounded-md bg-danger-soft p-2 font-medium text-danger">
              {error}
            </p>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="rep-title">Report Title</Label>
            <Input
              id="rep-title"
              placeholder="e.g. Weekly Retention & Churn Audit"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rep-desc">Description</Label>
            <Input
              id="rep-desc"
              placeholder="Brief summary of report purpose and audience"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as ReportCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Executive">Executive</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Retention">Retention</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="AI Intelligence">AI Intelligence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Cadence</Label>
              <Select value={cadence} onValueChange={(val) => setCadence(val as ReportCadence)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="On demand">On demand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Export format</Label>
              <Select value={format} onValueChange={(val) => setFormat(val as ReportFormat)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data Sources */}
          <div className="space-y-2">
            <Label>Data sources</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {AVAILABLE_SOURCES.map((source) => (
                <label
                  key={source}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-border-base bg-surface p-2 hover:bg-surface-2"
                >
                  <Checkbox
                    checked={selectedSources.includes(source)}
                    onCheckedChange={() => toggleSource(source)}
                  />
                  <span className="text-[11px] text-ink">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Metric Chips */}
          <div className="space-y-2">
            <Label>Tracked metrics</Label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_METRICS.map((metric) => {
                const active = selectedMetrics.includes(metric);
                return (
                  <button
                    key={metric}
                    type="button"
                    onClick={() => toggleMetric(metric)}
                    className={cn(
                      "rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-white"
                        : "border-border-base bg-surface text-ink-2 hover:bg-surface-2",
                    )}
                  >
                    {metric}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dispatch toggles */}
          <div className="space-y-2 rounded-lg border border-border-base bg-surface-2 p-3">
            <p className="font-semibold text-ink text-[11px] uppercase tracking-[0.44px]">Delivery channels</p>
            <div className="flex items-center justify-between">
              <span className="text-muted">Email summary to workspace admins</span>
              <Switch checked={emailDispatch} onCheckedChange={setEmailDispatch} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Post to #executive-metrics Slack channel</span>
              <Switch checked={slackDispatch} onCheckedChange={setSlackDispatch} />
            </div>
          </div>

          <p className="rounded-md border border-border-base bg-surface-3 p-2 text-[11px] text-muted">
            Simulated environment: No live emails or webhooks will be dispatched outside your browser.
          </p>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary">
              <Plus className="size-3.5" aria-hidden="true" />
              Create report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
