"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRevenueCurrency } from "@/lib/currency";
import { movementRows, type MovementRow } from "@/lib/data/revenue";

const TONE: Record<MovementRow["tone"], "success" | "danger" | "neutral" | "warning"> = {
  success: "success",
  danger: "danger",
  neutral: "neutral",
  warning: "warning",
};

const IMPACT_ICON = {
  success: ArrowUpRight,
  danger: ArrowDownRight,
  neutral: Minus,
  warning: Minus,
} as const;

export function MovementTable() {
  const { formatMoney } = useRevenueCurrency();

  return (
    <Card className="min-w-0 flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Movement components</CardTitle>
          <p className="mt-0.5 text-[12px] text-muted">Contribution of each component to net MRR change.</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-y border-border-base bg-surface-2">
                {["Component", "Value", "% of baseline", "MoM delta", "Status"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="whitespace-nowrap px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.55px] text-muted"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {movementRows.map((row) => {
                const Icon = IMPACT_ICON[row.tone];
                const displayVal = formatMoney(row.valueUsd, { sign: true });

                return (
                  <tr key={row.id} className="border-b border-border-base last:border-0">
                    <th scope="row" className="px-3 py-2.5 text-[12px] font-medium text-ink">
                      {row.component}
                    </th>
                    <td className="tnum whitespace-nowrap px-3 py-2.5 text-[12px] text-ink">{displayVal}</td>
                    <td className="tnum whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-2">
                      {row.shareOfBaseline}
                    </td>
                    <td className="tnum whitespace-nowrap px-3 py-2.5 text-[12px] text-ink-2">{row.momDelta}</td>
                    <td className="px-3 py-2.5">
                      <Badge variant={TONE[row.tone]} className="gap-1">
                        <Icon className="size-3" aria-hidden="true" />
                        {row.impact}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
