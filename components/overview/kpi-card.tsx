import { ArrowUpRight } from "lucide-react";

import { Sparkline } from "@/components/charts/sparkline";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/lib/data/overview";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.55px] text-muted">{kpi.label}</p>
        <Icon className="size-4 shrink-0 text-faint" aria-hidden="true" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="tnum text-[26px] font-semibold leading-none tracking-[-0.6px] text-ink">
          {kpi.value}
        </span>
        {kpi.id === "nrr" ? (
          <span className="inline-flex items-center gap-1 rounded-md bg-success-soft px-1.5 py-0.5 text-[11px] font-medium text-success">
            {kpi.valueBadge}
          </span>
        ) : (
          <span className="inline-flex items-center gap-0.5 rounded-md bg-success-soft px-1.5 py-0.5 text-[11px] font-medium text-success">
            <ArrowUpRight className="size-3" aria-hidden="true" />
            {kpi.delta}
          </span>
        )}
      </div>

      <p className="text-[11px] leading-4 text-muted">
        {kpi.id === "nrr" ? kpi.delta : kpi.caption}
      </p>

      <div className="mt-auto">
        <KpiFooter footer={kpi.footer} />
      </div>
    </Card>
  );
}

function KpiFooter({ footer }: { footer: Kpi["footer"] }) {
  if (footer.kind === "sparkline") {
    return <Sparkline data={footer.data} className="h-7 w-full" />;
  }

  if (footer.kind === "progress") {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted">{footer.label}</span>
          <span className="tnum font-medium text-ink">{footer.value}</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3"
          role="progressbar"
          aria-valuenow={footer.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={footer.label}
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${footer.percent}%` }} />
        </div>
      </div>
    );
  }

  if (footer.kind === "split") {
    return (
      <div className="space-y-1.5">
        <div className="flex h-1.5 w-full overflow-hidden rounded-full">
          {footer.segments.map((segment) => (
            <span
              key={segment.label}
              className="h-full"
              style={{ width: `${segment.percent}%`, backgroundColor: segment.color }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
          {footer.segments.map((segment) => (
            <span key={segment.label} className="inline-flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              {segment.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 text-[11px]">
      <span className="text-muted">{footer.note}</span>
      <span
        className={cn(
          "rounded-md border border-border-base px-1.5 py-0.5 font-medium text-ink-2",
        )}
      >
        {footer.badge}
      </span>
    </div>
  );
}
