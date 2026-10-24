"use client";

import { useState } from "react";
import { Check, Download, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { initialPinnedBriefs, type PinnedBrief } from "@/lib/data/reports";
import { cn } from "@/lib/utils";

export function PinnedBriefs() {
  const [briefs] = useState<PinnedBrief[]>(initialPinnedBriefs);
  const [runningBrief, setRunningBrief] = useState<PinnedBrief | null>(null);
  const [runCompleted, setRunCompleted] = useState(false);

  const handleDownload = (brief: PinnedBrief) => {
    const content = [
      `# ${brief.title}`,
      `Cadence: ${brief.cadence}`,
      `Category: ${brief.category}`,
      `Recipients: ${brief.recipients}`,
      `Generated: ${new Date().toISOString()}`,
      "",
      "## Metrics",
      ...brief.metrics.map((m) => `- ${m.label}: ${m.value} (${m.delta ?? "N/A"})`),
      "",
      "---",
      "Northstar Revenue Cockpit — Automated Executive Brief",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${brief.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-brief.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-semibold text-ink uppercase tracking-[0.55px]">
          Pinned Executive Briefs
        </h3>
        <span className="text-[11px] text-muted">Automated dispatch active</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {briefs.map((brief) => (
          <Card key={brief.id} className="min-w-0 flex flex-col justify-between p-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <Badge variant="neutral">
                  {brief.category}
                </Badge>
                <Badge
                  variant={
                    brief.status === "Dispatched"
                      ? "success"
                      : brief.status === "Scheduled"
                      ? "primary"
                      : "neutral"
                  }
                >
                  {brief.status}
                </Badge>
              </div>

              <h4 className="mt-2.5 text-[14px] font-semibold leading-tight text-ink">
                {brief.title}
              </h4>
              <p className="mt-1 text-[11px] leading-4 text-muted line-clamp-2">
                {brief.subtitle}
              </p>

              {/* Metrics grid */}
              <div className="mt-3.5 grid grid-cols-3 gap-1.5 rounded-lg border border-border-base bg-surface-2 p-2">
                {brief.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <p className="truncate text-[10px] text-muted">{m.label}</p>
                    <p className="tnum text-[13px] font-semibold text-ink">{m.value}</p>
                    {m.delta ? (
                      <p
                        className={cn(
                          "tnum text-[10px] font-medium",
                          m.tone === "success"
                            ? "text-success"
                            : m.tone === "warning"
                            ? "text-warning"
                            : "text-muted",
                        )}
                      >
                        {m.delta}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border-base">
              <div className="flex items-center justify-between text-[11px] text-muted mb-2.5">
                <span className="truncate">{brief.cadence}</span>
                <span className="truncate">{brief.lastRun}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setRunningBrief(brief);
                    setRunCompleted(false);
                  }}
                >
                  <Play className="size-3 text-primary" aria-hidden="true" />
                  Run now
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDownload(brief)}
                  title="Download latest brief artifact"
                >
                  <Download className="size-3" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Simulated Run Modal */}
      <Dialog
        open={!!runningBrief}
        onOpenChange={(open) => {
          if (!open) {
            setRunningBrief(null);
            setRunCompleted(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Run Brief — {runningBrief?.title}</DialogTitle>
            <DialogDescription>
              Execute on-demand data aggregation and dispatch pipeline.
            </DialogDescription>
          </DialogHeader>

          {runCompleted ? (
            <div className="mt-3 space-y-2 rounded-lg border border-success/30 bg-success-soft p-3">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-success">
                <Check className="size-4" />
                Brief compiled and staged
              </p>
              <p className="text-[12px] leading-5 text-muted">
                Simulated operation. In production, this generates signed PDF artifacts and posts to Slack /
                email channels. No real external dispatch occurred.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-2 text-[12px]">
              <div className="rounded-lg border border-border-base bg-surface-2 p-3 space-y-1">
                <p className="font-semibold text-ink">{runningBrief?.title}</p>
                <p className="text-muted">{runningBrief?.recipients}</p>
                <p className="tnum text-primary">Cadence: {runningBrief?.cadence}</p>
              </div>
              <p className="text-muted">
                Simulated execution computes real aggregates from the active customer &amp; revenue seed dataset.
              </p>
            </div>
          )}

          <DialogFooter className="pt-2">
            {runCompleted ? (
              <DialogClose asChild>
                <Button variant="primary">Done</Button>
              </DialogClose>
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="primary" onClick={() => setRunCompleted(true)}>
                  <Play className="size-3.5" aria-hidden="true" />
                  Execute simulated run
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
