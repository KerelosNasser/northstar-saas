"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRevenueCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { retentionCohorts } from "@/lib/data/revenue";

const MONTHS = Array.from({ length: 12 }, (_, index) => `M${index}`);

/** Buckets net MRR retention into Figma reference color scale. */
function toneFor(value: number | null) {
  if (value === null) return "bg-surface-2/40 text-muted/50 dark:bg-surface-2/20 dark:text-muted/40";
  if (value >= 100) return "bg-[#3843d0] text-white dark:bg-[#4338ca] dark:text-white";
  if (value >= 95) return "bg-[#818cf8] text-white dark:bg-[#4f46e5] dark:text-white";
  if (value >= 85) return "bg-[#c7d2fe] text-[#1e1b4b] dark:bg-[#312e81] dark:text-[#e0e7ff]";
  return "bg-[#e0e7ff] text-[#3730a3] dark:bg-[#1e1b4b]/60 dark:text-[#c7d2fe]";
}

const LEGEND_ITEMS = [
  { label: "<80%", tone: "bg-[#e0e7ff] dark:bg-[#1e1b4b]/60" },
  { label: "85%", tone: "bg-[#c7d2fe] dark:bg-[#312e81]" },
  { label: "95%", tone: "bg-[#818cf8] dark:bg-[#4f46e5]" },
  { label: "100%+", tone: "bg-[#3843d0] dark:bg-[#4338ca]" },
];

export function RetentionMatrix() {
  const { formatMoney } = useRevenueCurrency();

  return (
    <Card className="min-w-0">
      <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>Customer Cohort Retention Matrix</CardTitle>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-[10px] font-medium text-primary">
              Net MRR Retained
            </Badge>
          </div>
          <p className="mt-0.5 text-[12px] text-muted">
            Tracking retained ARR percentage by monthly subscription cohort over 12 billing periods.
          </p>
        </div>
        <div className="hidden items-center gap-2 sm:flex text-[11px] text-muted">
          <span>Heat Map Range:</span>
          {LEGEND_ITEMS.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1">
              <span className={cn("size-2.5 rounded-[2px]", item.tone)} aria-hidden="true" />
              <span className="text-[10px] text-muted">{item.label}</span>
            </span>
          ))}
        </div>
      </CardHeader>

      <div className="overflow-x-auto scroll-thin px-4 pb-4">
        <table className="w-full min-w-[720px] border-separate border-spacing-1">
          <caption className="sr-only">Net MRR retention percentages by cohort month</caption>
          <thead>
            <tr>
              <th scope="col" className="px-1 pb-1 text-left text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                Cohort
              </th>
              <th scope="col" className="px-1 pb-1 text-right text-[10px] font-semibold uppercase tracking-[0.55px] text-muted">
                Starting MRR
              </th>
              {MONTHS.map((month) => (
                <th
                  key={month}
                  scope="col"
                  className="px-1 pb-1 text-center text-[10px] font-semibold uppercase tracking-[0.55px] text-muted"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {retentionCohorts.map((cohort) => (
              <tr key={cohort.id}>
                <th scope="row" className="whitespace-nowrap px-1 text-left text-[12px] font-medium text-ink">
                  {cohort.month}
                </th>
                <td className="tnum whitespace-nowrap px-1 text-right text-[12px] text-ink-2">
                  {formatMoney(cohort.startingMrrUsd)}
                </td>
                {cohort.retention.map((value, index) => (
                  <td key={`${cohort.id}-${MONTHS[index]}`} className="p-0">
                    <span
                      className={cn(
                        "tnum flex h-8 items-center justify-center rounded-[4px] text-[11px] font-medium",
                        toneFor(value),
                      )}
                      title={
                        value !== null
                          ? `${cohort.month} ${MONTHS[index]}: ${value}% net MRR retained`
                          : `${cohort.month} ${MONTHS[index]}: Unelapsed period`
                      }
                    >
                      {value !== null ? `${value}%` : "—"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
