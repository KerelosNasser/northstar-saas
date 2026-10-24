"use client";

import { useMemo, useState } from "react";
import { Download, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PinnedBriefs } from "@/components/reports/pinned-briefs";
import { ReportBuilderDialog } from "@/components/reports/report-builder-dialog";
import { PageHeader } from "@/components/shell/page-header";
import {
  initialReportItems,
  type ReportCategory,
  type ReportItem,
} from "@/lib/data/reports";

type CategoryFilter = "all" | ReportCategory;

export function ReportsView() {
  const [reports, setReports] = useState<ReportItem[]>(initialReportItems);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [builderOpen, setBuilderOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReportItem | null>(null);

  const filteredReports = useMemo(() => {
    let result = reports;
    if (category !== "all") {
      result = result.filter((r) => r.category === category);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.sources.some((s) => s.toLowerCase().includes(q)),
      );
    }
    return result;
  }, [reports, category, searchQuery]);

  const handleCreateReport = (newReport: ReportItem) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleDeleteReport = () => {
    if (!deleteTarget) return;
    setReports((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleDownloadReport = (rep: ReportItem) => {
    let content = "";
    let mimeType = "text/plain";
    const filename = `${rep.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.${rep.format.toLowerCase()}`;

    if (rep.format === "JSON") {
      content = JSON.stringify(
        {
          report: rep.title,
          category: rep.category,
          cadence: rep.cadence,
          sources: rep.sources,
          metrics: rep.metrics,
          generatedAt: new Date().toISOString(),
          simulatedPayload: {
            mrrRunRate: 148250,
            activeAccounts: 1428,
            nrrPercentage: 118.2,
          },
        },
        null,
        2,
      );
      mimeType = "application/json";
    } else {
      // CSV format
      const rows = [
        ["Report Title", "Category", "Cadence", "Format", "Status"],
        [rep.title, rep.category, rep.cadence, rep.format, rep.status],
        [],
        ["Tracked Metrics", ...rep.metrics],
        ["Data Sources", ...rep.sources],
        [],
        ["Date Generated", new Date().toISOString()],
      ];
      content = rows
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\r\n");
      mimeType = "text/csv;charset=utf-8;";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAllLibraryCsv = () => {
    const rows = [
      ["Title", "Category", "Cadence", "Format", "Sources", "Metrics", "Status", "Last Run"],
      ...reports.map((r) => [
        r.title,
        r.category,
        r.cadence,
        r.format,
        r.sources.join("; "),
        r.metrics.join("; "),
        r.status,
        r.lastRun,
      ]),
    ];
    const content = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "northstar-reports-library.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-w-0 space-y-5">
      <PageHeader
        eyebrow={`${reports.length} scheduled automations`}
        title="Reports"
        description="Scheduled financial summaries, executive briefs, cohort retention exports, and governance telemetry."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={exportAllLibraryCsv}>
              <Download className="size-3.5" aria-hidden="true" />
              Export catalog
            </Button>
            <Button variant="primary" size="sm" onClick={() => setBuilderOpen(true)}>
              <Plus className="size-3.5" aria-hidden="true" />
              Create report
            </Button>
          </div>
        }
      />

      {/* Pinned Executive Briefs */}
      <PinnedBriefs />

      {/* Reports Library Table */}
      <Card className="min-w-0">
        <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
          <div className="max-w-full overflow-x-auto scroll-thin pb-1 sm:pb-0">
            <Tabs value={category} onValueChange={(val) => setCategory(val as CategoryFilter)}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-[12px]">All</TabsTrigger>
                <TabsTrigger value="Executive" className="text-[12px]">Executive</TabsTrigger>
                <TabsTrigger value="Finance" className="text-[12px]">Finance</TabsTrigger>
                <TabsTrigger value="Retention" className="text-[12px]">Retention</TabsTrigger>
                <TabsTrigger value="Operations" className="text-[12px]">Operations</TabsTrigger>
                <TabsTrigger value="AI Intelligence" className="text-[12px]">AI Intelligence</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="relative w-full sm:w-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
            <Input
              placeholder="Search reports or sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full text-[12px] pl-8 sm:w-56"
            />
          </div>
        </CardHeader>

        <div className="overflow-x-auto scroll-thin border-t border-border-base">
          <table className="w-full min-w-[760px] border-collapse text-left text-[12px]">
            <thead>
              <tr className="border-b border-border-base bg-surface-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                <th scope="col" className="px-3 py-2.5">Report Title</th>
                <th scope="col" className="px-3 py-2.5">Category</th>
                <th scope="col" className="px-3 py-2.5">Cadence</th>
                <th scope="col" className="px-3 py-2.5">Data Sources</th>
                <th scope="col" className="px-3 py-2.5">Format</th>
                <th scope="col" className="px-3 py-2.5">Next Run</th>
                <th scope="col" className="px-3 py-2.5">Status</th>
                <th scope="col" className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted">
                    No reports match this category or search filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="border-b border-border-base hover:bg-surface-2 last:border-0">
                    <td className="px-3 py-3">
                      <p className="font-semibold text-ink leading-tight">{r.title}</p>
                      <p className="text-[11px] text-muted truncate max-w-xs">{r.description}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <Badge variant="neutral">{r.category}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-ink-2 font-medium">
                      {r.cadence}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {r.sources.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-surface-3 px-1.5 py-0.5 text-[10px] text-ink-2 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-ink">
                      {r.format}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[11px] text-muted">
                      {r.nextScheduled}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <Badge variant={r.status === "Active" ? "success" : "neutral"}>
                        {r.status}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDownloadReport(r)}
                          title="Download report file"
                        >
                          <Download className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteTarget(r)}
                          title="Delete report"
                          className="hover:text-danger"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border-base px-4 py-2.5 text-[11px] text-muted">
          <span>
            {filteredReports.length} of {reports.length} reports displayed
          </span>
          <span>Simulated execution: files generated directly in-browser</span>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Report Automation</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove &ldquo;{deleteTarget?.title}&rdquo; from the automated library?
            </DialogDescription>
          </DialogHeader>
          <p className="mt-2 text-[12px] text-muted">
            This will cancel scheduled runs and remove the automation from the catalog for this session.
          </p>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button variant="danger" onClick={handleDeleteReport}>
              Delete report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Builder Modal */}
      <ReportBuilderDialog
        open={builderOpen}
        onOpenChange={setBuilderOpen}
        onReportCreated={handleCreateReport}
      />
    </div>
  );
}
