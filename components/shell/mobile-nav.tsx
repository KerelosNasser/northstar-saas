"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { SidebarContent } from "@/components/shell/sidebar";

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0b1c30]/40 backdrop-blur-[1px] lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-border-base shadow-pop focus:outline-none lg:hidden">
          <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
          <SidebarContent onNavigate={() => onOpenChange(false)} />
          <DialogPrimitive.Close
            aria-label="Close navigation"
            className="absolute right-3 top-4 flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-3 hover:text-ink"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
