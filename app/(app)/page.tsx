import type { Metadata } from "next";

import { ActivityFeed } from "@/components/overview/activity-feed";
import { AiObservation } from "@/components/overview/ai-observation";
import { CohortFlow } from "@/components/overview/cohort-flow";
import { KpiRow } from "@/components/overview/kpi-row";
import { OverviewActions } from "@/components/overview/overview-actions";
import { PlanDistribution } from "@/components/overview/plan-distribution";
import { RevenueTrajectory } from "@/components/overview/revenue-trajectory";
import { PageHeader } from "@/components/shell/page-header";

export const metadata: Metadata = {
  title: "Overview",
};

export default function OverviewPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Executive cockpit · Live production"
        title="Good morning, Alex."
        description="Here's what's happening across your business today."
        actions={<OverviewActions />}
      />

      <KpiRow />
      <AiObservation />

      <div className="grid gap-4 xl:grid-cols-3">
        <RevenueTrajectory />
        <PlanDistribution />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <CohortFlow />
        <ActivityFeed />
      </div>
    </div>
  );
}
