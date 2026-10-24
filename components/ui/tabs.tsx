"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

function TabsList({
  className,
  variant = "pill",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & {
  variant?: "pill" | "underline";
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex items-center",
        variant === "pill" && "gap-1 rounded-lg bg-surface-3 p-1",
        variant === "underline" && "gap-4 border-b border-border-base",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  variant = "pill",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger> & {
  variant?: "pill" | "underline";
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        "disabled:pointer-events-none disabled:opacity-50",
        variant === "pill" && [
          "rounded-md px-2.5 py-1.5 text-muted",
          "hover:text-ink",
          "data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-card",
        ],
        variant === "underline" && [
          "-mb-px border-b-2 border-transparent px-0.5 pb-2.5 text-muted",
          "hover:text-ink",
          "data-[state=active]:border-primary data-[state=active]:text-ink",
        ],
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("focus-visible:outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
