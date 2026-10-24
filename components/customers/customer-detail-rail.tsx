"use client";

import { useState } from "react";
import { ArrowUpRight, Check, FileText, Mail, Sparkles, User, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Customer } from "@/lib/data/customers";

export function CustomerDetailRail({
  customer,
  onClose,
}: {
  customer: Customer | null;
  onClose?: () => void;
}) {
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalSent, setProposalSent] = useState(false);

  if (!customer) {
    return (
      <Card className="flex h-full min-h-[480px] flex-col items-center justify-center p-6 text-center">
        <User className="size-8 text-faint" aria-hidden="true" />
        <h4 className="mt-3 text-[14px] font-semibold text-ink">No customer selected</h4>
        <p className="mt-1 max-w-xs text-[12px] text-muted">
          Select an account from the directory table to inspect account metrics, health scores, and stakeholders.
        </p>
      </Card>
    );
  }

  const healthColor =
    customer.healthScore >= 80
      ? "text-success bg-success-soft"
      : customer.healthScore >= 60
      ? "text-warning bg-warning-soft"
      : "text-danger bg-danger-soft";

  return (
    <div className="space-y-4">
      <Card className="min-w-0">
        <CardHeader className="flex-row items-start justify-between pb-3">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-3 text-[13px] font-semibold text-primary">
              {customer.initials}
            </span>
            <div className="min-w-0">
              <CardTitle className="truncate text-[16px] leading-tight">{customer.name}</CardTitle>
              <p className="truncate text-[12px] text-muted">{customer.domain}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant={customer.plan === "Enterprise Core" ? "primary" : "neutral"}>
                  {customer.plan}
                </Badge>
                <Badge
                  variant={
                    customer.status === "Active"
                      ? "success"
                      : customer.status === "Onboarding"
                      ? "neutral"
                      : "danger"
                  }
                >
                  {customer.status}
                </Badge>
              </div>
            </div>
          </div>
          {onClose ? (
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close detail panel">
              <X className="size-4" />
            </Button>
          ) : null}
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Health score gauge */}
          <div className="rounded-xl border border-border-base bg-surface-2 p-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold uppercase tracking-[0.55px] text-muted">Health score</span>
              <span className={cn("tnum rounded-md px-1.5 py-0.5 font-semibold", healthColor)}>
                {customer.healthScore} / 100
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  customer.healthScore >= 80 ? "bg-success" : customer.healthScore >= 60 ? "bg-warning" : "bg-danger",
                )}
                style={{ width: `${customer.healthScore}%` }}
              />
            </div>
          </div>

          {/* Core financial & contract metrics */}
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            <div className="rounded-lg border border-border-base p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.44px] text-muted">Monthly MRR</p>
              <p className="tnum mt-0.5 text-[15px] font-semibold text-ink">${customer.mrr.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border-base p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.44px] text-muted">Annual Run Rate</p>
              <p className="tnum mt-0.5 text-[15px] font-semibold text-ink">${customer.arr.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-border-base p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.44px] text-muted">Allocated seats</p>
              <p className="tnum mt-0.5 text-[15px] font-semibold text-ink">{customer.seats} seats</p>
            </div>
            <div className="rounded-lg border border-border-base p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.44px] text-muted">Assigned CSM</p>
              <p className="mt-0.5 truncate text-[13px] font-medium text-ink">{customer.csm}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border-base bg-surface p-2.5 text-[11px] text-muted">
            <div className="flex justify-between py-0.5">
              <span>Billing structure:</span>
              <span className="font-medium text-ink">{customer.billingCycle}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Customer since:</span>
              <span className="font-medium text-ink">{customer.joinedDate}</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span>Contract renewal:</span>
              <span className="font-medium text-ink">{customer.renewalDate}</span>
            </div>
          </div>

          {/* Expansion Opportunity Card */}
          {customer.expansionOpportunity ? (
            <div className="rounded-xl border border-primary/20 bg-primary-soft p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.55px] text-primary">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Expansion opportunity
              </div>
              <p className="text-[13px] font-semibold leading-tight text-ink">
                {customer.expansionOpportunity.title}
              </p>
              <p className="text-[11px] leading-4 text-ink-2">
                {customer.expansionOpportunity.description}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="tnum text-[12px] font-semibold text-primary">
                  +${customer.expansionOpportunity.arrPotential.toLocaleString()} ARR potential
                </span>
                <Button size="sm" variant="primary" onClick={() => setProposalOpen(true)}>
                  Draft proposal
                  <ArrowUpRight className="size-3" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}

          {/* Key Stakeholders */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.55px] text-muted">Key stakeholders</h5>
            {customer.stakeholders.length === 0 ? (
              <p className="text-[12px] text-muted">No contacts listed yet.</p>
            ) : (
              <div className="space-y-1.5">
                {customer.stakeholders.map((s) => (
                  <div
                    key={s.email}
                    className="flex items-center justify-between rounded-lg border border-border-base p-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="grid size-6 shrink-0 place-items-center rounded-md bg-surface-3 text-[10px] font-semibold text-ink">
                        {s.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-ink">{s.name}</p>
                        <p className="truncate text-[10px] text-muted">{s.role}</p>
                      </div>
                    </div>
                    <a
                      href={`mailto:${s.email}`}
                      className="p-1 text-muted hover:text-ink focus-visible:outline-none"
                      title={`Email ${s.name}`}
                    >
                      <Mail className="size-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Timeline */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.55px] text-muted">Account timeline</h5>
            <div className="space-y-2">
              {customer.activities.map((act) => (
                <div key={act.id} className="relative pl-3 border-l-2 border-border-base text-[11px]">
                  <p className="font-medium text-ink">{act.title}</p>
                  <p className="text-muted leading-4">{act.description}</p>
                  <span className="text-[10px] text-faint">{act.date}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulated Proposal Modal */}
      <Dialog
        open={proposalOpen}
        onOpenChange={(next) => {
          setProposalOpen(next);
          if (!next) setProposalSent(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Expansion Proposal — {customer.name}</DialogTitle>
            <DialogDescription>
              Generate an enterprise upgrade proposal based on current seat telemetry.
            </DialogDescription>
          </DialogHeader>

          {proposalSent ? (
            <div className="mt-4 rounded-lg border border-success/30 bg-success-soft p-3 space-y-1">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-success">
                <Check className="size-4" />
                Proposal queued locally
              </p>
              <p className="text-[12px] text-muted">
                Simulated operation. In a production system, this would sync with HubSpot or Salesforce and
                dispatch a quote link.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3 text-[12px]">
              <div className="rounded-lg border border-border-base bg-surface-2 p-3 space-y-1">
                <p className="font-semibold text-ink">{customer.expansionOpportunity?.title}</p>
                <p className="text-muted">{customer.expansionOpportunity?.description}</p>
                <p className="tnum font-medium text-primary">
                  Proposed target: ${((customer.arr + (customer.expansionOpportunity?.arrPotential ?? 0))).toLocaleString()}/yr
                </p>
              </div>
              <p className="text-muted">
                Target recipient: <span className="font-medium text-ink">{customer.stakeholders[0]?.name ?? customer.name}</span> ({customer.stakeholders[0]?.email ?? customer.domain})
              </p>
            </div>
          )}

          <DialogFooter className="pt-2">
            {proposalSent ? (
              <DialogClose asChild>
                <Button variant="primary">Done</Button>
              </DialogClose>
            ) : (
              <>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <Button variant="primary" onClick={() => setProposalSent(true)}>
                  <FileText className="size-3.5" aria-hidden="true" />
                  Send simulated proposal
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
