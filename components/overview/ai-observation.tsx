"use client";

import { useState } from "react";
import { ArrowRight, Bookmark, Sparkles, X } from "lucide-react";

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
import { aiObservation } from "@/lib/data/overview";
import { cn } from "@/lib/utils";

export function AiObservation() {
  const [dismissed, setDismissed] = useState(false);
  const [onBoard, setOnBoard] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  if (dismissed) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-card border border-dashed border-border-strong bg-surface px-4 py-3">
        <p className="text-[12px] text-muted">
          AI observation dismissed for this session. Nothing was deleted — the insight is still in AI
          Business Insights.
        </p>
        <Button variant="ghost" size="sm" onClick={() => setDismissed(false)}>
          Undo
        </Button>
      </div>
    );
  }

  return (
    <section
      aria-label="AI observation"
      className="rounded-card border border-primary/20 bg-primary-soft p-4 shadow-card"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-surface shadow-card">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
          </span>
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary" className="uppercase tracking-[0.55px]">
                AI observation · High confidence ({aiObservation.confidence})
              </Badge>
              <span className="text-[11px] text-muted">{aiObservation.detected}</span>
            </div>
            <h2 className="text-[15px] font-semibold leading-snug tracking-[-0.2px] text-ink">
              {aiObservation.headline}
            </h2>
            <p className="max-w-3xl text-[12px] leading-5 text-ink-2">{aiObservation.body}</p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
            <X className="size-3.5" aria-hidden="true" />
            Dismiss
          </Button>
          <Button
            variant={onBoard ? "primary" : "secondary"}
            size="sm"
            aria-pressed={onBoard}
            onClick={() => setOnBoard((value) => !value)}
          >
            <Bookmark className="size-3.5" aria-hidden="true" />
            {onBoard ? "Added to board" : "Add to board"}
          </Button>
          <Button variant="link" size="sm" className="px-0" onClick={() => setEvidenceOpen(true)}>
            Drill-down evidence
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {aiObservation.evidence.map((item) => (
          <div key={item.kind} className="rounded-lg border border-border-base bg-surface p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">{item.kind}</p>
            <p className={cn("mt-0.5 text-[12px] leading-5 text-ink")}>{item.text}</p>
          </div>
        ))}
      </div>

      <Dialog open={evidenceOpen} onOpenChange={setEvidenceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Evidence behind this observation</DialogTitle>
            <DialogDescription>
              How the model reached the conclusion. The underlying telemetry is seeded demo data, not a live
              model run.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            {aiObservation.evidence.map((item) => (
              <div key={item.kind} className="rounded-lg border border-border-base bg-surface-2 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">{item.kind}</p>
                <p className="mt-1 text-[12px] leading-5 text-ink-2">{item.text}</p>
              </div>
            ))}
            <div className="rounded-lg border border-border-base p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">Source</p>
              <p className="mt-1 text-[12px] leading-5 text-ink-2">
                Okta audit logs, Stripe subscription events, and seat-service webhooks — joined over the last
                14 days.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="primary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
