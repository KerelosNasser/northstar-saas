"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

const emptySubscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const VIEWS = [
  { id: "bridge", label: "Bridge view" },
  { id: "cumulative", label: "Cumulative view" },
] as const;

type View = (typeof VIEWS)[number]["id"];

const COLOR: Record<string, string> = {
  baseline: "var(--chart-1)",
  increase: "var(--chart-2)",
  decrease: "var(--danger)",
  total: "var(--chart-5)",
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
  return (
    <g transform={`translate(${x ?? 0},${y ?? 0})`}>
      <text
        x={0}
        y={0}
        dy={12}
        textAnchor="middle"
        className="fill-[var(--muted)] text-[10px] sm:text-[11px]"
      >
        {label}
      </text>
    </g>
  );
}

export function MrrWaterfall() {
  const mounted = useMounted();
  const [view, setView] = useState<View>("bridge");
  const { currency, formatMoney } = useRevenueCurrency();

  const data = useMemo(() => {
    return waterfallSteps.reduce<{
      rows: (typeof waterfallSteps[number] & {
        stepLabel: string;
        base: number;
        bar: number;
        fromVal: number;
        toVal: number;
        running: number;
        convertedValue: number;
      })[];
      running: number;
    }>(
      (acc, step) => {
        const converted = step.value * currency.rate;

        if (step.kind === "baseline" || step.kind === "total") {
          const nextRunning = step.kind === "baseline" ? converted : acc.running;
          acc.rows.push({
            ...step,
            stepLabel: step.label,
            base: 0,
            bar: converted,
            fromVal: 0,
            toVal: converted,
            running: nextRunning,
            convertedValue: converted,
          });
          return { rows: acc.rows, running: nextRunning };
        }

        // Bridge view calculation:
        // For increases: base is previous running total, bar is positive converted
        // For decreases: base is new lower running total, bar is absolute converted
        const fromVal = acc.running;
        const nextRunning = acc.running + converted;
        const toVal = nextRunning;
        const base = converted >= 0 ? fromVal : toVal;
        const bar = Math.abs(converted);

        acc.rows.push({
          ...step,
          stepLabel: step.label,
          base,
          bar,
          fromVal,
          toVal,
          running: nextRunning,
          convertedValue: converted,
        });

        return { rows: acc.rows, running: nextRunning };
      },
      { rows: [], running: 0 },
    ).rows;
  }, [currency.rate]);

  const chartData = useMemo(() => {
    if (view === "bridge") {
      return data.map((point) => ({
        ...point,
        label: point.shortLabel,
      }));
    }
    // Cumulative view: every bar starts at base 0 and goes up to running total
    return data.map((point) => ({
      ...point,
      base: 0,
      bar: point.running,
      label: point.shortLabel,
    }));
  }, [data, view]);

  const activeView = VIEWS.find((item) => item.id === view) ?? VIEWS[0];

  const yDomain: [number, number] = [0, Math.round(160_000 * currency.rate)];
  const yTicks = [0, 40_000, 80_000, 120_000, 160_000].map((t) =>
    Math.round(t * currency.rate),
  );

  const axisMoney = (val: number) => {
    if (val === 0) return `${currency.symbol}0`;
    return `${currency.symbol}${Math.round(val / 1000)}k`;
  };

  return (
    <Card className="min-w-0 xl:col-span-2">
      <CardHeader className="flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>MRR movement waterfall</CardTitle>
          <p className="mt-0.5 text-[12px] text-muted">
            Net new recurring revenue by component, current period
          </p>
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
              <span
                className="size-2 rounded-[2px]"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </li>
          ))}
        </ul>

        <div className="h-64 sm:h-72">
          {!mounted ? (
            <div className="flex h-full w-full items-center justify-center rounded-lg border border-border-base bg-surface-2/40 text-[12px] text-muted">
              Loading visualization...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
                barCategoryGap="28%"
              >
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <ReferenceLine y={0} stroke="var(--border-strong)" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={<WaterfallTick />}
                  interval={0}
                />
                <YAxis
                  domain={yDomain}
                  ticks={yTicks}
                  tickFormatter={axisMoney}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--surface-3)" }}
                  content={<WaterfallTooltip view={view} formatMoney={formatMoney} />}
                />
                {view === "bridge" ? (
                  <Bar
                    dataKey="base"
                    stackId="bridge"
                    fill="transparent"
                    isAnimationActive={false}
                  />
                ) : null}
                <Bar
                  dataKey="bar"
                  stackId={view === "bridge" ? "bridge" : undefined}
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                >
                  {chartData.map((point) => (
                    <Cell key={point.id} fill={COLOR[point.kind]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="mt-2 text-[11px] text-muted">
          {view === "bridge"
            ? "Bridge view: Starting MRR bridges across net expansion and churn to Ending MRR."
            : "Cumulative view: Total active MRR progression after each component."}
        </p>
      </CardContent>
    </Card>
  );
}

type TooltipPayload = {
  payload?: {
    stepLabel?: string;
    label?: string;
    value?: number;
    convertedValue?: number;
    fromVal?: number;
    toVal?: number;
    running?: number;
    kind?: "baseline" | "increase" | "decrease" | "total";
  };
};

function WaterfallTooltip({
  active,
  payload,
  view,
  formatMoney,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  view: View;
  formatMoney: (val: number, opts?: { compact?: boolean; decimals?: number; sign?: boolean }) => string;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;

  const isMovement = point.kind === "increase" || point.kind === "decrease";
  const displayVal = formatMoney(point.convertedValue ?? point.value ?? 0, {
    sign: isMovement,
  });

  return (
    <div className="rounded-lg border border-border-base bg-surface px-2.5 py-2 shadow-pop">
      <p className="text-[11px] font-medium text-ink">{point.stepLabel || point.label}</p>
      {view === "bridge" ? (
        <div className="mt-1 space-y-0.5">
          <p className="tnum text-[11px] font-semibold text-ink">{displayVal}</p>
          {isMovement && typeof point.fromVal === "number" && typeof point.toVal === "number" ? (
            <p className="tnum text-[10px] text-muted">
              Bridge: {formatMoney(point.fromVal)} → {formatMoney(point.toVal)}
            </p>
          ) : null}
          {typeof point.running === "number" ? (
            <p className="tnum text-[10px] text-muted">
              Running MRR: {formatMoney(point.running)}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-1 space-y-0.5">
          <p className="tnum text-[11px] font-semibold text-ink">
            {typeof point.running === "number" ? formatMoney(point.running) : displayVal}
          </p>
          {isMovement ? (
            <p className="tnum text-[10px] text-muted">Step impact: {displayVal}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
