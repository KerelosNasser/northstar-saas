"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { primaryNav, secondaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

const pages = [...primaryNav, ...secondaryNav];

/**
 * Navigational search. Only indexes the app's own routes — there is no backend
 * to query, and a field that silently does nothing would be a dead control.
 */
export function CommandSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter((page) => page.label.toLowerCase().includes(q));
  }, [query]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(href);
  };

  return (
    <div className="relative hidden md:block">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-faint" />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="command-search-results"
        aria-label="Search pages"
        placeholder="Search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "Enter" && results[0]) go(results[0].href);
        }}
        className="h-8 w-52 rounded-lg border border-border-strong bg-surface-2 pl-8 pr-14 text-[12px] text-ink placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/25"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border-base bg-surface px-1 py-px text-[10px] font-medium text-muted">
        ⌘K
      </kbd>

      {open && results.length > 0 ? (
        <ul
          id="command-search-results"
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-64 rounded-lg border border-border-base bg-surface p-1 shadow-pop"
        >
          {results.map((page) => {
            const Icon = page.icon;
            return (
              <li key={page.href} role="option" aria-selected={false}>
                <button
                  type="button"
                  // mousedown fires before the input blurs
                  onMouseDown={(event) => {
                    event.preventDefault();
                    go(page.href);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-ink-2",
                    "hover:bg-surface-3 hover:text-ink",
                  )}
                >
                  <Icon className="size-3.5" />
                  {page.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
