"use client";

import { overviewKpis } from "@/lib/data/overview";
import { useHiddenKpis } from "@/lib/kpi-visibility";
import { KpiCard } from "@/components/overview/kpi-card";

export function KpiRow() {
  const { hidden } = useHiddenKpis();
  const visible = overviewKpis.filter((kpi) => !hidden.includes(kpi.id));

  if (visible.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border-strong bg-surface px-4 py-6 text-center">
        <p className="text-[12px] text-muted">
          All summary cards are hidden. Use <span className="font-medium text-ink">Customize</span> to bring
          them back.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {visible.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
