import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cohortLegend, cohortWeeks } from "@/lib/data/overview";
import { cn } from "@/lib/utils";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--warning)", "var(--danger)"] as const;

export function CohortFlow() {
  const max = Math.max(
    ...cohortWeeks.map((week) => week.new + week.expansion + week.contraction + week.churn),
  );

  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <div>
          <h3 className="text-[14px] font-semibold text-ink">Account cohort flow</h3>
          <p className="text-[12px] text-muted">Weekly net movement across the customer base</p>
        </div>
        <ul className="flex flex-wrap items-center gap-3 text-[11px] text-ink-2">
          {cohortLegend.map((item, index) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              {item.label}
            </li>
          ))}
        </ul>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex h-48 items-stretch gap-3 sm:gap-6">
          {cohortWeeks.map((week) => {
            const segments = [week.new, week.expansion, week.contraction, week.churn];
            const total = segments.reduce((sum, value) => sum + value, 0);

            return (
              <div key={week.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <div
                  className="flex w-full max-w-24 flex-col-reverse overflow-hidden rounded-md"
                  style={{ height: `${Math.round((total / max) * 100)}%` }}
                  role="img"
                  aria-label={`${week.label}: ${week.new} new, ${week.expansion} expansion, ${week.contraction} contraction, ${week.churn} churn. Net ${week.net}.`}
                >
                  {segments.map((value, index) => (
                    <span
                      key={COLORS[index]}
                      style={{
                        backgroundColor: COLORS[index],
                        flexGrow: value,
                      }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-medium text-ink">{week.label}</p>
                  <p className={cn("tnum text-[11px]", week.peak ? "text-success" : "text-muted")}>
                    {week.net}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
