"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRevenueCurrency } from "@/lib/currency";
import { waterfallLegend, waterfallSteps } from "@/lib/data/revenue";

const VIEWS = [
  { id: "bridge", label: "Bridge view" },
  { id: "cumulative", label: "Cumulative view" },
] as const;

type View = (typeof VIEWS)[number]["id"];

const COLOR: Record<string, string> = {
  baseline: "var(--chart-1)",
  increase: "var(--chart-2)",
  decrease: "var(--chart-3)",
  total: "var(--chart-5)",
};

const MOBILE_LABELS: Record<string, string> = {
  Starting: "Start",
  New: "New",
  Expansion: "Expand",
  Reactivated: "React.",
  Contraction: "Contr.",
  Churn: "Churn",
  "Ending MRR": "Ending",
};

function WaterfallTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value?: string };
}) {
  const label = payload?.value ?? "";
  const mobile = MOBILE_LABELS[label] ?? label;
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="middle"
        className="fill-[var(--muted)] text-[10px] sm:text-[11px]"
      >
        <tspan className="sm:hidden">{mobile}</tspan>
        <tspan className="hidden sm:inline">{label}</tspan>
      </text>
    </g>
  );
}

export function MrrWaterfall() {
  const [view, setView] = useState<View>("bridge");
  const { currency, formatMoney } = useRevenueCurrency();

  const data = useMemo(
    () =>
      waterfallSteps.reduce<{ rows: (typeof waterfallSteps[number] & { base: number; bar: number; running: number; convertedValue: number })[]; running: number }>(
        (acc, step) => {
          const converted = step.value * currency.rate;
          if (step.kind === "baseline" || step.kind === "total") {
            const nextRunning = step.kind === "baseline" ? converted : acc.running;
            acc.rows.push({ ...step, base: 0, bar: converted, running: nextRunning, convertedValue: converted });
            return { rows: acc.rows, running: nextRunning };
          }
          const base = converted >= 0 ? acc.running : acc.running + converted;
          const nextRunning = acc.running + converted;
          acc.rows.push({ ...step, base, bar: Math.abs(converted), running: nextRunning, convertedValue: converted });
          return { rows: acc.rows, running: nextRunning };
        },
        { rows: [], running: 0 },
      ).rows,
    [currency.rate],
  );

  const chartData =
    view === "bridge"
      ? data.map((point) => ({ ...point, label: point.shortLabel }))
      : data.map((point) => ({ ...point, base: 0, bar: point.running, label: point.shortLabel }));

  const activeView = VIEWS.find((item) => item.id === view) ?? VIEWS[0];

  const axisMoney = (val: number) => {
    if (val === 0) return `${currency.symbol}0`;
    return `${currency.symbol}${Math.round(val / 1000)}k`;
  };

  return (
    <Card className="min-w-0 xl:col-span-2">
      <CardHeader className="flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>MRR movement waterfall</CardTitle>
          <p className="mt-0.5 text-[12px] text-muted">Net new recurring revenue by component, current period</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">
              {activeView.label}
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {VIEWS.map((item) => (
              <DropdownMenuItem key={item.id} onSelect={() => setView(item.id)}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pt-0">
        <ul className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          {waterfallLegend.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5 text-[11px] text-muted">
              <span className="size-2 rounded-[2px]" style={{ backgroundColor: item.color }} aria-hidden="true" />
              {item.label}
            </li>
          ))}
        </ul>

        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="28%">
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={<WaterfallTick />}
                interval={0}
              />
              <YAxis
                ticks={[0, 40_000, 80_000, 120_000, 160_000].map((t) => Math.round(t * currency.rate))}
                tickFormatter={axisMoney}
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
              />
              <Tooltip cursor={{ fill: "var(--surface-3)" }} content={<WaterfallTooltip formatMoney={formatMoney} />} />
              <Bar dataKey="base" stackId="bridge" fill="transparent" isAnimationActive={false} />
              <Bar dataKey="bar" stackId="bridge" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                {chartData.map((point) => (
                  <Cell key={point.id} fill={COLOR[point.kind]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-2 text-[11px] text-muted">
          {view === "bridge"
            ? "Each bar is a movement component; hover for the exact contribution."
            : "Cumulative running MRR after each component."}
        </p>
      </CardContent>
    </Card>
  );
}

type TooltipPayload = { payload?: { label?: string; value?: number; kind?: string } };

function WaterfallTooltip({
  active,
  payload,
  formatMoney,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  formatMoney: (val: number, opts?: { compact?: boolean; decimals?: number; sign?: boolean }) => string;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  return (
    <div className="rounded-lg border border-border-base bg-surface px-2.5 py-2 shadow-pop">
      <p className="text-[11px] font-medium text-ink">{point.label}</p>
      <p className="tnum text-[11px] text-muted">
        {formatMoney(point.value ?? 0, { sign: point.kind === "decrease" })}
      </p>
    </div>
  );
}
