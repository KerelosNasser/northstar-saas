import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary shadow-[0_1px_2px_rgba(11,28,48,0.12)] hover:bg-primary-hover",
        secondary:
          "border border-border-strong bg-surface text-ink hover:bg-surface-2",
        ghost: "text-ink-2 hover:bg-surface-3 hover:text-ink",
        danger: "bg-danger-solid text-on-danger hover:opacity-90",
        "danger-outline":
          "border border-danger/30 bg-danger-soft text-danger hover:bg-danger/10",
        link: "text-accent hover:underline",
      },
      size: {
        sm: "h-8 px-2.5 text-[12px]",
        md: "h-9 px-3",
        lg: "h-10 px-4",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
