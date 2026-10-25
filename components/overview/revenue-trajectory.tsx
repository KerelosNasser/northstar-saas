"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trajectorySeries, trajectoryVariants, type TrajectoryVariant } from "@/lib/data/overview";

const VARIANTS = Object.keys(trajectoryVariants) as TrajectoryVariant[];
const X_TICKS = [1, 6, 12, 18, 24, 30];

export function RevenueTrajectory() {
  const [variant, setVariant] = useState<TrajectoryVariant>("revenue");
  const active = trajectoryVariants[variant];

  const scaledSeries = useMemo(() => {
    return VARIANTS.reduce<Record<TrajectoryVariant, { day: number; current: number; prior: number }[]>>(
      (acc, key) => {
        const scale = trajectoryVariants[key].scale;
        acc[key] = trajectorySeries.map((pt) => ({
          day: pt.day,
          current: Number((pt.current * scale).toFixed(2)),
          prior: Number((pt.prior * scale).toFixed(2)),
        }));
        return acc;
      },
      {} as Record<TrajectoryVariant, { day: number; current: number; prior: number }[]>,
    );
  }, []);

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold text-ink">Revenue trajectory</h3>
          <p className="text-[12px] text-muted">Realized daily run rate vs projected trajectory</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Legend />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Tabs value={variant} onValueChange={(value) => setVariant(value as TrajectoryVariant)}>
          <TabsList aria-label="Chart metric">
            {VARIANTS.map((key) => (
              <TabsTrigger key={key} value={key}>
                {trajectoryVariants[key].label}
              </TabsTrigger>
            ))}
          </TabsList>

          {VARIANTS.map((key) => (
            <TabsContent key={key} value={key} className="mt-3">
              <div className="h-64 w-full sm:h-72">
                <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                  <AreaChart data={scaledSeries[key]} margin={{ top: 18, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id={`trajectory-fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={0.22} />
                        <stop offset="100%" stopColor="var(--chart-5)" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />

                    <XAxis
                      dataKey="day"
                      ticks={X_TICKS}
                      tickFormatter={(value: number) => `Day ${value}`}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 11 }}
                      dy={6}
                    />
                    <YAxis
                      domain={trajectoryVariants[key].domain}
                      ticks={trajectoryVariants[key].ticks}
                      tickFormatter={(value: number) => trajectoryVariants[key].axis(value)}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                      tick={{ fill: "var(--muted)", fontSize: 11 }}
                    />

                    {key === "revenue" ? (
                      <ReferenceLine
                        x={18}
                        stroke="var(--muted)"
                        strokeDasharray="4 4"
                        label={{
                          value: "Day 18: $80K launch",
                          position: "insideTopLeft",
                          fill: "var(--ink-2)",
                          fontSize: 10,
                        }}
                      />
                    ) : null}

                    <Tooltip content={<TrajectoryTooltip variant={key} />} cursor={{ stroke: "var(--border-strong)" }} />

                    <Area
                      type="monotone"
                      dataKey="prior"
                      stroke="var(--chart-6)"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="transparent"
                      dot={false}
                      activeDot={false}
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="current"
                      stroke="var(--chart-5)"
                      strokeWidth={2}
                      fill={`url(#trajectory-fill-${key})`}
                      dot={false}
                      activeDot={{ r: 3, strokeWidth: 0, fill: "var(--chart-5)" }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-[11px] text-muted">
                {active.label} · hover any day to compare against the previous period.
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-2">
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-0.5 w-4 rounded-full bg-[var(--chart-5)]" />
        Current period (Nov 2025)
      </span>
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="h-0.5 w-4 rounded-full border-t border-dashed border-[var(--chart-6)]"
        />
        Previous period (Oct 2025)
      </span>
    </div>
  );
}

type TooltipPayload = { payload?: { day: number; current: number; prior: number } };

function TrajectoryTooltip({
  active,
  payload,
  variant,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  variant: TrajectoryVariant;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  const format = trajectoryVariants[variant].format;

  return (
    <div className="rounded-lg border border-border-base bg-surface px-2.5 py-2 text-[11px] shadow-pop">
      <p className="font-medium text-ink">
        Day {point.day} · Nov {point.day}
      </p>
      <p className="mt-1 flex items-center justify-between gap-4 text-ink-2">
        <span>Actual</span>
        <span className="tnum font-medium text-ink">{format(point.current)}</span>
      </p>
      <p className="flex items-center justify-between gap-4 text-ink-2">
        <span>Prior period</span>
        <span className="tnum font-medium text-ink">{format(point.prior)}</span>
      </p>
    </div>
  );
}
