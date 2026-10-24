import { AlertTriangle, HeartPulse, TrendingUp, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Sparkline } from "@/components/charts/sparkline";

export function CustomerStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.55px] text-muted">Total accounts</p>
          <Users className="size-4 shrink-0 text-faint" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="tnum text-[26px] font-semibold leading-none tracking-[-0.6px] text-ink">1,428</span>
            <span className="inline-flex items-center gap-0.5 rounded-md bg-success-soft px-1.5 py-0.5 text-[11px] font-medium text-success">
              +6.4%
            </span>
          </div>
          <p className="text-[11px] leading-4 text-muted">86 net new accounts this quarter</p>
        </div>
        <div className="mt-auto">
          <Sparkline data={[1200, 1240, 1280, 1310, 1350, 1390, 1428]} className="h-7 w-full" />
        </div>
      </Card>

      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.55px] text-muted">Active MRR</p>
          <TrendingUp className="size-4 shrink-0 text-faint" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="tnum text-[26px] font-semibold leading-none tracking-[-0.6px] text-ink">$148,250</span>
            <span className="inline-flex items-center gap-0.5 rounded-md bg-success-soft px-1.5 py-0.5 text-[11px] font-medium text-success">
              +12.4%
            </span>
          </div>
          <p className="text-[11px] leading-4 text-muted">Avg revenue per account: $103.82</p>
        </div>
        <div className="mt-auto">
          <Sparkline data={[131, 134, 138, 140, 143, 146, 148]} className="h-7 w-full" stroke="var(--chart-2)" />
        </div>
      </Card>

      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.55px] text-muted">Avg Health Score</p>
          <HeartPulse className="size-4 shrink-0 text-faint" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="tnum text-[26px] font-semibold leading-none tracking-[-0.6px] text-ink">88 / 100</span>
            <span className="inline-flex items-center rounded-md bg-primary-soft px-1.5 py-0.5 text-[11px] font-medium text-primary">
              Optimal
            </span>
          </div>
          <p className="text-[11px] leading-4 text-muted">94% of book categorized as healthy</p>
        </div>
        <div className="mt-auto">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-valuenow={88}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Average account health"
          >
            <div className="h-full rounded-full bg-success" style={{ width: "88%" }} />
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.55px] text-muted">At-Risk ARR</p>
          <AlertTriangle className="size-4 shrink-0 text-danger" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="tnum text-[26px] font-semibold leading-none tracking-[-0.6px] text-ink">$7,320</span>
            <span className="inline-flex items-center rounded-md bg-danger-soft px-1.5 py-0.5 text-[11px] font-medium text-danger">
              2 accounts
            </span>
          </div>
          <p className="text-[11px] leading-4 text-muted">Under CSM remediation protocol</p>
        </div>
        <div className="mt-auto">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3"
            role="progressbar"
            aria-valuenow={5}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="At-risk percentage"
          >
            <div className="h-full rounded-full bg-danger" style={{ width: "5%" }} />
          </div>
        </div>
      </Card>
    </div>
  );
}
