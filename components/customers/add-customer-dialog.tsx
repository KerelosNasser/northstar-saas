"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer, CustomerPlan } from "@/lib/data/customers";

export function AddCustomerDialog({
  open,
  onOpenChange,
  onCustomerAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerAdded: (customer: Customer) => void;
}) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState<CustomerPlan>("Enterprise Core");
  const [mrrStr, setMrrStr] = useState("1200");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Company name must have at least 2 characters.";
    if (!domain.trim().includes(".")) errs.domain = "Enter a valid domain name (e.g. acme.com).";
    const mrr = Number(mrrStr);
    if (isNaN(mrr) || mrr <= 0) errs.mrr = "Enter a valid positive MRR amount.";
    if (contactEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail.trim())) {
      errs.email = "Enter a valid email address.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const mrr = Number(mrrStr);
    const initials = name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AC";

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newCust: Customer = {
      id: `cust-${slug}`,
      name: name.trim(),
      domain: domain.trim(),
      initials,
      plan,
      status: "Onboarding",
      healthScore: 85,
      mrr,
      arr: mrr * 12,
      seats: plan === "Enterprise Core" ? 30 : plan === "Pro Team" ? 15 : 5,
      joinedDate: "Today",
      renewalDate: "Oct 24, 2027",
      csm: "Alex Vance",
      billingCycle: "Annual upfront",
      stakeholders: contactName.trim()
        ? [
            {
              name: contactName.trim(),
              role: "Account Admin",
              email: contactEmail.trim() || `admin@${domain.trim()}`,
              initials: contactName[0].toUpperCase(),
            },
          ]
        : [],
      activities: [
        {
          id: `act-${slug}-init`,
          date: "Just now",
          title: "Account provisioned",
          description: `Onboarded to ${plan} with initial MRR of $${mrr.toLocaleString()}`,
          tone: "success",
        },
      ],
    };

    onCustomerAdded(newCust);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDomain("");
    setPlan("Enterprise Core");
    setMrrStr("1200");
    setContactName("");
    setContactEmail("");
    setErrors({});
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetForm();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add customer account</DialogTitle>
          <DialogDescription>
            Register a new client in the portfolio dataset. In this showcase, the customer is saved to your
            browser session.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="space-y-1.5">
            <Label htmlFor="cust-name">Company name</Label>
            <Input
              id="cust-name"
              placeholder="e.g. Apex Cybernetics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
            />
            {errors.name ? <p role="alert" className="text-[11px] text-danger">{errors.name}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cust-domain">Primary domain</Label>
              <Input
                id="cust-domain"
                placeholder="apexcyber.io"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                aria-invalid={!!errors.domain}
              />
              {errors.domain ? <p role="alert" className="text-[11px] text-danger">{errors.domain}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cust-plan">Subscription plan</Label>
              <Select value={plan} onValueChange={(val) => setPlan(val as CustomerPlan)}>
                <SelectTrigger id="cust-plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enterprise Core">Enterprise Core</SelectItem>
                  <SelectItem value="Pro Team">Pro Team</SelectItem>
                  <SelectItem value="Starter Growth">Starter Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cust-mrr">Initial monthly recurring revenue (MRR $)</Label>
            <Input
              id="cust-mrr"
              type="number"
              placeholder="1200"
              value={mrrStr}
              onChange={(e) => setMrrStr(e.target.value)}
              aria-invalid={!!errors.mrr}
            />
            {errors.mrr ? <p role="alert" className="text-[11px] text-danger">{errors.mrr}</p> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cust-contact">Lead stakeholder</Label>
              <Input
                id="cust-contact"
                placeholder="Jane Doe"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cust-email">Contact email</Label>
              <Input
                id="cust-email"
                type="email"
                placeholder="jane@apexcyber.io"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email ? <p role="alert" className="text-[11px] text-danger">{errors.email}</p> : null}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary">
              <Plus className="size-3.5" aria-hidden="true" />
              Create account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
