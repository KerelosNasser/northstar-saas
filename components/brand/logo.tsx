import { cn } from "@/lib/utils";

/**
 * Northstar mark. Redrawn as a vector (4-point compass star with a light
 * quadrant) so it scales cleanly and follows the theme.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Northstar"
      className={cn("size-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" className="fill-ink" />
      <path
        d="M16 6.5c.55 4.9 4.1 8.45 9 9-4.9.55-8.45 4.1-9 9-.55-4.9-4.1-8.45-9-9 4.9-.55 8.45-4.1 9-9Z"
        className="fill-surface"
      />
      <circle cx="16" cy="15.5" r="2.1" className="fill-ink" />
    </svg>
  );
}
