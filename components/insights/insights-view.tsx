"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Download,
  Info,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuditTrailTable } from "@/components/insights/audit-trail-table";
import { CausalGraphCards } from "@/components/insights/causal-graph-cards";
import { PageHeader } from "@/components/shell/page-header";
import {
  initialInsights,
  type InsightItem,
  type InsightStatus,
} from "@/lib/data/insights";
import { cn } from "@/lib/utils";

type FilterTab = "all" | "critical" | "expansion" | "correlation" | "resolved";

export function InsightsView() {
  const [insights, setInsights] = useState<InsightItem[]>(initialInsights);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [evidenceModalInsight, setEvidenceModalInsight] = useState<InsightItem | null>(null);
  const [actionModalInsight, setActionModalInsight] = useState<InsightItem | null>(null);
  const [actionConfirmed, setActionConfirmed] = useState(false);
  const [governanceOpen, setGovernanceOpen] = useState(false);

  // Tab counts
  const counts = useMemo(
    () => ({
      all: insights.filter((i) => i.status !== "Dismissed").length,
      critical: insights.filter((i) => i.category === "Critical Anomaly" && i.status === "Active").length,
      expansion: insights.filter((i) => i.category === "Expansion Opportunity" && i.status === "Active").length,
      correlation: insights.filter((i) => i.category === "Strategic Correlation" && i.status === "Active").length,
      resolved: insights.filter((i) => i.status === "Resolved").length,
    }),
    [insights],
  );

  const filteredInsights = useMemo(() => {
    return insights.filter((item) => {
      if (item.status === "Dismissed") return false;
      if (activeTab === "resolved") return item.status === "Resolved";
      if (item.status === "Resolved") return false; // don't show resolved in active tabs
      if (activeTab === "critical") return item.category === "Critical Anomaly";
      if (activeTab === "expansion") return item.category === "Expansion Opportunity";
      if (activeTab === "correlation") return item.category === "Strategic Correlation";
      return true;
    });
  }, [insights, activeTab]);

  const handleToggleResolve = (id: string) => {
    setInsights((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: InsightStatus = item.status === "Resolved" ? "Active" : "Resolved";
        return {
          ...item,
          status: nextStatus,
          resolvedAt: nextStatus === "Resolved" ? "Just now" : undefined,
        };
      }),
    );
  };

  const handleDismiss = (id: string) => {
    setInsights((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Dismissed" } : item)),
    );
  };

  const handleExportJson = () => {
    const payload = {
      project: "Northstar SaaS",
      module: "AI Business Insights Engine",
      exportedAt: new Date().toISOString(),
      governanceNotice: "Computed entirely via deterministic local heuristic telemetry. Zero external AI calls.",
      activeInsightsCount: insights.filter((i) => i.status === "Active").length,
      insights: insights.map((i) => ({
        id: i.id,
        category: i.category,
        headline: i.headline,
        confidenceScore: i.confidence,
        correlationWeight: i.correlationWeight,
        metric: i.primaryMetric,
        metricDelta: i.metricDelta,
        status: i.status,
        evidence: i.evidence,
        causalPath: i.causalFlow,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "northstar-ai-insights.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-w-0 space-y-5">
      <PageHeader
        eyebrow="Business intelligence telemetry · Deterministic"
        title="AI Business Insights"
        description="Autonomous metric correlation, causal inference modeling, and churn anomaly detection synthesized from local platform telemetry."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setGovernanceOpen(true)}>
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Governance &amp; Privacy
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportJson}>
              <Download className="size-3.5" aria-hidden="true" />
              Export JSON
            </Button>
          </div>
        }
      />

      {/* Governance & Authenticity Notice */}
      <div className="flex items-start gap-3 rounded-card border border-primary/20 bg-primary-soft p-3.5 text-[12px] text-ink-2 shadow-card">
        <Info className="size-4 shrink-0 text-primary mt-0.5" aria-hidden="true" />
        <div className="min-w-0">
          <p className="font-semibold text-ink">Deterministic local intelligence assurance</p>
          <p className="mt-0.5 text-[11px] leading-4 text-muted">
            All inferences, confidence scores, and causal weights are computed deterministically from active
            workspace telemetry. No third-party LLM APIs, cloud models, or external services are contacted.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-full overflow-x-auto scroll-thin pb-1 sm:pb-0">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as FilterTab)}>
          <TabsList className="h-8">
            <TabsTrigger value="all" className="text-[12px]">
              All Insights ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="critical" className="text-[12px]">
              Critical ({counts.critical})
            </TabsTrigger>
            <TabsTrigger value="expansion" className="text-[12px]">
              Expansion ({counts.expansion})
            </TabsTrigger>
            <TabsTrigger value="correlation" className="text-[12px]">
              Strategic ({counts.correlation})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-[12px]">
              Resolved ({counts.resolved})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Insight Cards Grid */}
      <div className="space-y-3">
        {filteredInsights.length === 0 ? (
          <Card className="p-8 text-center text-muted">
            <Sparkles className="mx-auto size-6 text-faint mb-2" />
            <p className="text-[13px] font-medium text-ink">No insights in this category</p>
            <p className="text-[11px]">All observations have either been resolved or filtered out.</p>
          </Card>
        ) : (
          filteredInsights.map((insight) => {
            const isResolved = insight.status === "Resolved";
            const isCritical = insight.category === "Critical Anomaly";
            const isExpansion = insight.category === "Expansion Opportunity";

            return (
              <Card
                key={insight.id}
                className={cn(
                  "min-w-0 p-4 transition-all shadow-card",
                  isResolved && "opacity-75 bg-surface-2",
                  isCritical && !isResolved && "border-danger/30 bg-danger-soft/10",
                  isExpansion && !isResolved && "border-primary/20",
                )}
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <span
                      className={cn(
                        "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full shadow-card",
                        isCritical
                          ? "bg-danger-soft text-danger"
                          : isExpansion
                          ? "bg-primary-soft text-primary"
                          : "bg-success-soft text-success",
                      )}
                    >
                      {isCritical ? (
                        <AlertTriangle className="size-4" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                    </span>

                    <div className="min-w-0 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            isCritical ? "danger" : isExpansion ? "primary" : "success"
                          }
                        >
                          {insight.category} · {insight.confidence}% confidence
                        </Badge>
                        <span className="text-[11px] text-muted">{insight.detected}</span>
                        {isResolved ? (
                          <Badge variant="neutral">Resolved</Badge>
                        ) : null}
                      </div>

                      <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.2px] text-ink">
                        {insight.headline}
                      </h3>
                      <p className="max-w-3xl text-[12px] leading-5 text-ink-2">
                        {insight.summary}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Metric Tag */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
                    <div className="rounded-lg border border-border-base bg-surface px-3 py-1.5 text-right">
                      <p className="text-[10px] uppercase tracking-[0.44px] text-muted">
                        {insight.primaryMetric}
                      </p>
                      <p
                        className={cn(
                          "tnum text-[14px] font-semibold",
                          isCritical ? "text-danger" : "text-success",
                        )}
                      >
                        {insight.metricDelta}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <Button
                        size="sm"
                        variant={isResolved ? "primary" : "secondary"}
                        onClick={() => handleToggleResolve(insight.id)}
                      >
                        <Check className="size-3.5" />
                        {isResolved ? "Reopen" : "Mark resolved"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDismiss(insight.id)}
                        title="Dismiss for session"
                      >
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Evidence & Action Row */}
                <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                  {insight.evidence.map((ev, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-border-base bg-surface p-2.5 text-[11px]"
                    >
                      <span className="font-semibold uppercase tracking-[0.44px] text-muted">
                        {ev.type}
                      </span>
                      <p className="mt-0.5 text-ink leading-4">{ev.detail}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border-base pt-3 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Recommendation:</span>
                    <span className="font-medium text-ink">{insight.suggestedAction}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEvidenceModalInsight(insight)}
                    >
                      Inspect evidence
                      <ArrowRight className="size-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setActionModalInsight(insight);
                        setActionConfirmed(false);
                      }}
                    >
                      {insight.actionButtonLabel}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Causal Inference Section */}
      <CausalGraphCards />

      {/* Audit Trail Section */}
      <AuditTrailTable />

      {/* Evidence Drill-down Modal */}
      <Dialog
        open={!!evidenceModalInsight}
        onOpenChange={(open) => !open && setEvidenceModalInsight(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Telemetry Evidence &amp; Model Correlation</DialogTitle>
            <DialogDescription>
              Detailed data lineage for: &ldquo;{evidenceModalInsight?.headline}&rdquo;
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3 text-[12px]">
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border-base bg-surface-2 p-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.44px] text-muted">Confidence</span>
                <p className="text-[14px] font-semibold text-ink">{evidenceModalInsight?.confidence}%</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.44px] text-muted">Path Correlation</span>
                <p className="text-[14px] font-semibold text-primary">
                  {evidenceModalInsight?.correlationWeight && evidenceModalInsight.correlationWeight > 0
                    ? `+${evidenceModalInsight.correlationWeight}`
                    : evidenceModalInsight?.correlationWeight}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-semibold text-ink uppercase tracking-[0.44px] text-[10px]">
                Underlying Telemetry Records
              </h5>
              {evidenceModalInsight?.evidence.map((ev, i) => (
                <div key={i} className="rounded-lg border border-border-base p-2.5">
                  <span className="font-semibold text-muted text-[10px] uppercase">{ev.type}</span>
                  <p className="mt-0.5 text-ink leading-4">{ev.detail}</p>
                </div>
              ))}
            </div>

            <div className="rounded-md border border-border-base bg-surface-3 p-2.5 text-[11px] text-muted">
              Source telemetry is gathered from Okta SAML logs, gateway timeout counters, and Stripe billing events.
            </div>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="primary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Modal */}
      <Dialog
        open={!!actionModalInsight}
        onOpenChange={(open) => {
          if (!open) {
            setActionModalInsight(null);
            setActionConfirmed(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionModalInsight?.actionButtonLabel}</DialogTitle>
            <DialogDescription>
              Execute recommended intervention for this telemetry cluster.
            </DialogDescription>
          </DialogHeader>

          {actionConfirmed ? (
            <div className="mt-3 space-y-2 rounded-lg border border-success/30 bg-success-soft p-3 text-[12px]">
              <p className="flex items-center gap-2 font-semibold text-success">
                <Check className="size-4" />
                Intervention staged successfully
              </p>
              <p className="text-muted leading-4">
                Simulated operation. In production, this queues automated emails via HubSpot or creates tickets
                in Zendesk. No external systems were contacted.
              </p>
            </div>
          ) : (
            <div className="mt-3 space-y-2 text-[12px]">
              <div className="rounded-lg border border-border-base bg-surface-2 p-3 space-y-1">
                <p className="font-semibold text-ink">{actionModalInsight?.headline}</p>
                <p className="text-muted">{actionModalInsight?.suggestedAction}</p>
              </div>
              <p className="text-muted">
                Action requires explicit operator sign-off before simulated execution.
              </p>
            </div>
          )}

          <DialogFooter className="pt-2">
            {actionConfirmed ? (
              <DialogClose asChild>
                <Button variant="primary">Done</Button>
              </DialogClose>
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="primary" onClick={() => setActionConfirmed(true)}>
                  Confirm &amp; execute
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Governance & Privacy Info Modal */}
      <Dialog open={governanceOpen} onOpenChange={setGovernanceOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI &amp; Heuristic Governance Charter</DialogTitle>
            <DialogDescription>
              Transparency standards governing Northstar&apos;s predictive and correlation calculations.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 space-y-3 text-[12px] leading-5 text-ink-2">
            <div className="rounded-lg border border-border-base bg-surface-2 p-3 space-y-1.5">
              <h5 className="font-semibold text-ink">Zero External AI Dependencies</h5>
              <p className="text-muted">
                Northstar does not transmit any customer, financial, or workspace telemetry to third-party
                LLM providers (e.g. OpenAI, Anthropic, Google Cloud Vertex). All heuristics, causal matrices,
                and confidence scores are computed locally within deterministic boundaries.
              </p>
            </div>

            <div className="rounded-lg border border-border-base bg-surface-2 p-3 space-y-1.5">
              <h5 className="font-semibold text-ink">Auditable Data Lineage</h5>
              <p className="text-muted">
                Every inference maps directly to verifiable telemetry metrics (Okta SAML authentication timestamps,
                Stripe payment retries, seat allocation changes). Operators can inspect the underlying evidence
                records at any time.
              </p>
            </div>

            <div className="rounded-lg border border-border-base bg-surface-2 p-3 space-y-1.5">
              <h5 className="font-semibold text-ink">Explicit Operator Confirmation</h5>
              <p className="text-muted">
                Automated mitigations and expansion workflows never trigger autonomously without explicit
                operator review and confirmation.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="primary">Understood</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
