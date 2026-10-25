"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRevenueCurrency } from "@/lib/currency";
import { movementRows, type MovementRow, waterfallLegend, waterfallSteps } from "@/lib/data/revenue";
import { cn } from "@/lib/utils";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
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

const TONE: Record<MovementRow["tone"], "success" | "danger" | "neutral" | "warning"> = {
  success: "success",
  danger: "danger",
  neutral: "neutral",
  warning: "warning",
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
        dy={14}
        textAnchor="middle"
        className="fill-[var(--muted)] text-[10px] sm:text-[11px]"
      >
        {label}
      </text>
    </g>
  );
}

function BarTopLabel(props: {
  x?: number;
  y?: number;
  width?: number;
  value?: string | number;
  view?: View;
  kind?: string;
}) {
  const { x, y, width, value, view, kind } = props;
  if (value === undefined || value === null || typeof x !== "number" || typeof y !== "number") return null;
  const str = String(value);
  const isPositive = str.startsWith("+");
  const isNegative = str.startsWith("-");
  const fill = isPositive
    ? "#10b981"
    : isNegative
      ? "#ef4444"
      : "var(--ink)";

  // In Bridge view, delta labels align gracefully across the upper guide line matching Figma
  const isMovement = kind === "increase" || kind === "decrease";
  const targetY = view === "bridge" && isMovement ? 42 : y - 8;

  return (
    <text
      x={x + (width ?? 0) / 2}
      y={targetY}
      fill={fill}
      textAnchor="middle"
      className="text-[10px] font-semibold tracking-tight sm:text-[11px]"
    >
      {str}
    </text>
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

        const fromVal = acc.running;
        const nextRunning = acc.running + converted;
        const toVal = nextRunning;

        // In Figma reference, movement components anchor to the 40k baseline:
        // positive deltas rise upward from 40k, negative deltas hang downward from 40k
        const BASELINE_Y = 40_000 * currency.rate;
        const base = converted >= 0 ? BASELINE_Y : BASELINE_Y - Math.abs(converted);
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
    const formatBarValue = (val: number, isDelta = false) => {
      const abs = Math.abs(val);
      const formatted = `${currency.symbol}${(abs / 1000).toFixed(1)}k`;
      if (!isDelta) return formatted;
      return val >= 0 ? `+${formatted}` : `-${formatted}`;
    };

    if (view === "bridge") {
      return data.map((point) => {
        const isBaselineOrTotal = point.kind === "baseline" || point.kind === "total";
        return {
          ...point,
          label: point.shortLabel,
          displayValue: formatBarValue(point.convertedValue, !isBaselineOrTotal),
        };
      });
    }

    return data.map((point) => ({
      ...point,
      base: 0,
      bar: point.running,
      label: point.shortLabel,
      displayValue: formatBarValue(point.running, false),
    }));
  }, [data, view, currency.symbol]);

  const activeView = VIEWS.find((item) => item.id === view) ?? VIEWS[0];

  const yDomain: [number, number] = [0, Math.round(175_000 * currency.rate)];
  const yTicks = [0, 40_000, 80_000, 120_000, 160_000].map((t) =>
    Math.round(t * currency.rate),
  );

  const axisMoney = (val: number) => {
    if (val === 0) return `${currency.symbol}0`;
    return `${currency.symbol}${Math.round(val / 1000)}k`;
  };

  return (
    <Card className="min-w-0 w-full">
      <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>MRR Movement Waterfall</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="h-6 gap-1 rounded-full px-2.5 text-[11px] font-medium">
                  {activeView.label}
                  <ChevronDown className="size-3" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {VIEWS.map((item) => (
                  <DropdownMenuItem key={item.id} onSelect={() => setView(item.id)}>
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="mt-0.5 text-[12px] text-muted">
            Stepwise accounting from Beginning MRR ($131.9k) to Ending MRR ($148.3k)
          </p>
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
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
      </CardHeader>

      <CardContent className="pt-0 space-y-6">
        <div className="h-64 sm:h-72">
          {!mounted ? (
            <div className="flex h-full w-full items-center justify-center rounded-lg border border-border-base bg-surface-2/40 text-[12px] text-muted">
              Loading visualization...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 12, bottom: 4, left: 0 }}
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
                  <LabelList
                    dataKey="displayValue"
                    position="top"
                    content={(labelProps: any) => {
                      const item = chartData[labelProps.index];
                      return (
                        <BarTopLabel
                          {...labelProps}
                          view={view}
                          kind={item?.kind}
                        />
                      );
                    }}
                  />
                  {chartData.map((point) => (
                    <Cell key={point.id} fill={COLOR[point.kind]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="text-[11px] text-muted">
          {view === "bridge"
            ? "Bridge view: Starting MRR bridges across net expansion and churn to Ending MRR."
            : "Cumulative view: Total active MRR progression after each component."}
        </p>

        <div className="border-t border-border-base pt-4">
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border-base">
                  <th scope="col" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                    Component
                  </th>
                  <th scope="col" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                    Value ($)
                  </th>
                  <th scope="col" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                    % of Base
                  </th>
                  <th scope="col" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                    MoM delta
                  </th>
                  <th scope="col" className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                    Status impact
                  </th>
                </tr>
              </thead>
              <tbody>
                {movementRows.map((row) => {
                  const displayVal = formatMoney(row.valueUsd * currency.rate, { sign: true });
                  const isNegative = row.tone === "danger" || row.tone === "warning";

                  return (
                    <tr
                      key={row.id}
                      className="border-b border-border-base/50 last:border-0 hover:bg-surface-2/40 transition-colors"
                    >
                      <th scope="row" className="flex items-center gap-2 px-3 py-2.5 text-[12px] font-medium text-ink">
                        <span
                          className={cn("size-2 rounded-full", isNegative ? "bg-[#ef4444]" : "bg-[#10b981]")}
                          aria-hidden="true"
                        />
                        {row.component}
                      </th>
                      <td className="tnum whitespace-nowrap px-3 py-2.5 text-[12px] font-semibold text-ink">
                        {displayVal}
                      </td>
                      <td className="tnum whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-2">
                        {row.shareOfBaseline}
                      </td>
                      <td className="tnum whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-2">
                        {row.momDelta}
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge variant={TONE[row.tone]} className="text-[11px] font-medium">
                          {row.impact}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
