import Link from "next/link";
import { ArrowRight, CircleDollarSign, CreditCard, Sparkles, UserMinus } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { activityFeed, type ActivityEntry } from "@/lib/data/overview";
import { cn } from "@/lib/utils";

const TONE: Record<ActivityEntry["tone"], { ring: string; icon: typeof Sparkles }> = {
  success: { ring: "bg-success-soft text-success", icon: CircleDollarSign },
  warning: { ring: "bg-warning-soft text-warning", icon: UserMinus },
  primary: { ring: "bg-primary-soft text-primary", icon: Sparkles },
  accent: { ring: "bg-accent-soft text-accent", icon: CreditCard },
};

export function ActivityFeed() {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div>
          <h3 className="text-[14px] font-semibold text-ink">Live activity feed</h3>
          <p className="text-[12px] text-muted">Revenue events across connected systems</p>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-success" />
          Auto-refresh
        </span>
      </CardHeader>

      <CardContent className="flex-1 pt-0">
        <ul className="space-y-3">
          {activityFeed.map((entry) => {
            const tone = TONE[entry.tone];
            const Icon = tone.icon;

            return (
              <li key={entry.id} className="flex gap-2.5">
                <span
                  className={cn("mt-0.5 grid size-7 shrink-0 place-items-center rounded-full", tone.ring)}
                  aria-hidden="true"
                >
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium leading-5 text-ink">{entry.title}</p>
                  <p className="text-[11px] leading-4 text-ink-2">{entry.detail}</p>
                  <p className="text-[10px] uppercase tracking-[0.44px] text-faint">{entry.meta}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted">{entry.time}</span>
              </li>
            );
          })}
        </ul>
      </CardContent>

      <div className="border-t border-border-base px-4 py-2.5">
        <Link
          href="/insights"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-accent hover:underline"
        >
          View all activity audit log
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}
