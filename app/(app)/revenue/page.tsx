import type { Metadata } from "next";

import { PageHeader } from "@/components/shell/page-header";
import { MrrWaterfall } from "@/components/revenue/mrr-waterfall";
import { MovementTable } from "@/components/revenue/movement-table";
import { RetentionMatrix } from "@/components/revenue/retention-matrix";
import { RevenueKpiRow } from "@/components/revenue/revenue-kpis";
import { SubscriptionsTable } from "@/components/revenue/subscriptions-table";
import { RevenueActions } from "@/components/revenue/revenue-actions";
import { RevenueCurrencyProvider } from "@/lib/currency";

export const metadata: Metadata = { title: "Revenue Analytics" };

export default function RevenuePage() {
  return (
    <RevenueCurrencyProvider>
      <div className="min-w-0 space-y-4">
        <PageHeader
          eyebrow="Financial intelligence"
          title="Revenue Analytics"
          description="Track recurring revenue, churn, expansion and cohort retention across the active book of business."
          actions={<RevenueActions />}
        />

        <RevenueKpiRow />

        <div className="grid min-w-0 gap-4 xl:grid-cols-3">
          <MrrWaterfall />
          <MovementTable />
        </div>

        <RetentionMatrix />

        <SubscriptionsTable />
      </div>
    </RevenueCurrencyProvider>
  );
}
