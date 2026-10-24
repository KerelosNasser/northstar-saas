"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useRevenueCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { retentionCohorts } from "@/lib/data/revenue";

const MONTHS = Array.from({ length: 12 }, (_, index) => `M${index}`);

/** Buckets net MRR retention into the reference's risk ramp. */
function toneFor(value: number) {
  if (value >= 120) return "bg-[#0b1c30] text-white";
  if (value >= 110) return "bg-[#3b4f78] text-white";
  if (value >= 100) return "bg-[#7c8bb0] text-white";
  if (value >= 95) return "bg-[#c7d2fe] text-ink";
  if (value >= 85) return "bg-[#e6e9fb] text-ink";
  return "bg-[#f5d9d5] text-ink";
}

export function RetentionMatrix() {
  const { formatMoney } = useRevenueCurrency();

  return (
    <Card className="min-w-0">
      <CardHeader>
        <div>
          <CardTitle>Customer cohort retention matrix</CardTitle>
          <p className="mt-0.5 text-[12px] text-muted">Net MRR retained by cohort month, M0 through M11.</p>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="text-[10px] uppercase tracking-[0.44px] text-muted">Churn risk (&lt;85%)</span>
          <span className="flex overflow-hidden rounded-sm">
            {["bg-[#f5d9d5]", "bg-[#e6e9fb]", "bg-[#c7d2fe]", "bg-[#7c8bb0]", "bg-[#3b4f78]", "bg-[#0b1c30]"].map(
              (tone) => (
                <span key={tone} className={cn("size-3", tone)} aria-hidden="true" />
              ),
            )}
          </span>
          <span className="text-[10px] uppercase tracking-[0.44px] text-muted">Expansion (120%+)</span>
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
                      title={`${cohort.month} ${MONTHS[index]}: ${value}% net MRR retained`}
                    >
                      {value}%
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
