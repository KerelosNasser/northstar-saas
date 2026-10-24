"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initialAuditLogs, type AuditLogEntry } from "@/lib/data/insights";

export function AuditTrailTable() {
  const [logs] = useState<AuditLogEntry[]>(initialAuditLogs);
  const [query, setQuery] = useState("");

  const filteredLogs = useMemo(() => {
    if (!query.trim()) return logs;
    const q = query.toLowerCase();
    return logs.filter(
      (l) =>
        l.event.toLowerCase().includes(q) ||
        l.modelEngine.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q),
    );
  }, [logs, query]);

  const handleExportLogs = () => {
    const jsonContent = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "northstar-ai-audit-log.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="min-w-0">
      <CardHeader className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3">
        <div>
          <CardTitle>Inference Audit Trail &amp; Governance</CardTitle>
          <p className="mt-0.5 text-[12px] text-muted">
            Cryptographically sealed evaluation records for model predictions and causal linkages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
            <Input
              placeholder="Search audit trail..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-8 w-48 text-[12px] pl-8 sm:w-56"
            />
          </div>
          <Button size="sm" variant="secondary" onClick={handleExportLogs}>
            <Download className="size-3.5" aria-hidden="true" />
            Export audit log
          </Button>
        </div>
      </CardHeader>

      <div className="overflow-x-auto scroll-thin border-t border-border-base">
        <table className="w-full min-w-[700px] border-collapse text-left text-[12px]">
          <thead>
            <tr className="border-b border-border-base bg-surface-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
              <th scope="col" className="px-3 py-2.5">Timestamp</th>
              <th scope="col" className="px-3 py-2.5">Evaluation Event</th>
              <th scope="col" className="px-3 py-2.5">Engine / Heuristic</th>
              <th scope="col" className="px-3 py-2.5 text-center">Confidence</th>
              <th scope="col" className="px-3 py-2.5 text-center">Impact Weight</th>
              <th scope="col" className="px-3 py-2.5">Governance State</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted">
                  No evaluation entries found matching query.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-border-base hover:bg-surface-2 last:border-0">
                  <td className="whitespace-nowrap px-3 py-2.5 text-[11px] text-muted font-mono">
                    {log.timestamp}
                  </td>
                  <td className="px-3 py-2.5 font-medium text-ink">
                    {log.event}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-ink-2 font-mono text-[11px]">
                    {log.modelEngine}
                  </td>
                  <td className="tnum whitespace-nowrap px-3 py-2.5 text-center font-medium text-ink">
                    {log.confidenceScore}
                  </td>
                  <td className="tnum whitespace-nowrap px-3 py-2.5 text-center font-mono text-[11px] text-ink-2">
                    {log.impactWeight}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <Badge
                      variant={
                        log.status === "Validated"
                          ? "success"
                          : log.status === "Action applied"
                          ? "primary"
                          : "neutral"
                      }
                    >
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border-base px-4 py-2.5 text-[11px] text-muted">
        <span>Deterministic heuristic verification active</span>
        <span>Zero external model API dependencies</span>
      </div>
    </Card>
  );
}
