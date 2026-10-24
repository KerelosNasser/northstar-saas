"use client";

import { Sparkline } from "@/components/charts/sparkline";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRevenueCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { revenueKpis, type RevenueKpi } from "@/lib/data/revenue";

export function RevenueKpiRow() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {revenueKpis.map((kpi) => (
        <RevenueKpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}

export function RevenueKpiCard({ kpi }: { kpi: RevenueKpi }) {
  const Icon = kpi.icon;
  const { formatMoney } = useRevenueCurrency();

  const displayValue = formatMoney(kpi.amountUsd, {
    sign: kpi.id !== "arrpu",
    decimals: kpi.id === "arrpu" ? 2 : 0,
  });

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.55px] text-muted">{kpi.label}</p>
        <Icon className="size-4 shrink-0 text-faint" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <p className="tnum text-[26px] font-semibold leading-none tracking-[-0.6px] text-ink">{displayValue}</p>
        <p className="text-[11px] font-medium text-ink-2">{kpi.delta}</p>
        <p className="text-[11px] leading-4 text-muted">{kpi.caption}</p>
      </div>

      <div className="mt-auto">
        {kpi.footer.kind === "spark" ? <Sparkline data={kpi.footer.data} stroke={kpi.footer.stroke} className="h-7 w-full" /> : null}

        {kpi.footer.kind === "gauge" ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-[0.44px] text-faint">
              <span>Risk gauge</span>
              <span className={kpi.footer.tone === "success" ? "text-success" : "text-warning"}>{kpi.footer.label}</span>
            </div>
            <div
              role="progressbar"
              aria-label={`${kpi.label} risk gauge`}
              aria-valuenow={kpi.footer.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1.5 overflow-hidden rounded-full bg-surface-3"
            >
              <div
                className={cn("h-full rounded-full", kpi.footer.tone === "success" ? "bg-success" : "bg-warning")}
                style={{ width: `${kpi.footer.percent}%` }}
              />
            </div>
          </div>
        ) : null}

        {kpi.footer.kind === "badge" ? (
          <Badge variant="success" className="w-fit">
            {kpi.footer.label}
          </Badge>
        ) : null}
      </div>
    </Card>
  );
}
