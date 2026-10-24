"use client";

import { ArrowRight, Network } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { initialInsights } from "@/lib/data/insights";
import { cn } from "@/lib/utils";

export function CausalGraphCards() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.55px] text-ink">
            Causal Inference Models
          </h3>
          <p className="text-[12px] text-muted">
            Directional dependencies derived from product events and revenue outcomes.
          </p>
        </div>
        <span className="text-[11px] font-medium text-accent">p &lt; 0.001 validated</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {initialInsights.map((insight) => {
          const isPositive = insight.correlationWeight > 0;
          return (
            <Card key={insight.id} className="min-w-0 flex flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.44px] text-muted">
                    <Network className="size-3.5 text-primary" aria-hidden="true" />
                    Path Model
                  </span>
                  <Badge
                    variant={
                      insight.category === "Critical Anomaly"
                        ? "danger"
                        : insight.category === "Expansion Opportunity"
                        ? "primary"
                        : "success"
                    }
                  >
                    Weight {insight.correlationWeight > 0 ? `+${insight.correlationWeight}` : insight.correlationWeight}
                  </Badge>
                </div>

                <h4 className="mt-2.5 text-[13px] font-semibold text-ink line-clamp-1">
                  {insight.headline}
                </h4>

                {/* Graph Node Flow */}
                <div className="mt-3.5 space-y-2 rounded-lg border border-border-base bg-surface-2 p-3 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="grid size-5 shrink-0 place-items-center rounded bg-surface font-mono text-[9px] font-bold text-ink">
                      A
                    </span>
                    <span className="font-medium text-ink">{insight.causalFlow.source}</span>
                  </div>

                  <div className="flex items-center gap-2 pl-2 text-muted">
                    <ArrowRight className="size-3 text-faint" />
                    <span className="text-[10px] text-ink-2">Mediated through</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="grid size-5 shrink-0 place-items-center rounded bg-surface font-mono text-[9px] font-bold text-ink">
                      B
                    </span>
                    <span className="font-medium text-ink">{insight.causalFlow.mediator}</span>
                  </div>

                  <div className="flex items-center gap-2 pl-2 text-muted">
                    <ArrowRight className="size-3 text-faint" />
                    <span className="text-[10px] text-ink-2">Yields revenue shift</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="grid size-5 shrink-0 place-items-center rounded bg-primary text-white font-mono text-[9px] font-bold">
                      C
                    </span>
                    <span className={cn("font-semibold", isPositive ? "text-success" : "text-danger")}>
                      {insight.causalFlow.outcome}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex items-center justify-between border-t border-border-base pt-2.5 text-[11px] text-muted">
                <span>Confidence: {insight.confidence}%</span>
                <span className="font-medium text-ink">n = 1,428 accounts</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
