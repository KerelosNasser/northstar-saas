"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { planDistribution } from "@/lib/data/overview";

const TONES = ["var(--chart-1)", "var(--chart-3)", "var(--chart-4)"];

export function PlanDistribution() {
  const data = planDistribution.tiers.map((tier, index) => ({
    name: tier.label,
    value: Number.parseFloat(tier.percent),
    color: TONES[index % TONES.length],
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <h3 className="text-[14px] font-semibold text-ink">Plan distribution</h3>
          <p className="text-[12px] text-muted">MRR split by subscription tier</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-0">
        <div className="relative mx-auto h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={54}
                outerRadius={72}
                paddingAngle={2}
                stroke="none"
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">Total MRR</p>
            <p className="tnum text-[18px] font-semibold tracking-[-0.4px] text-ink">
              {planDistribution.total}
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {planDistribution.tiers.map((tier, index) => (
            <li key={tier.label} className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: TONES[index % TONES.length] }}
                />
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-ink">{tier.label}</p>
                  <p className="text-[11px] text-muted">{tier.arpu}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="tnum text-[12px] font-medium text-ink">{tier.value}</p>
                <p className="tnum text-[11px] text-muted">{tier.percent}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
