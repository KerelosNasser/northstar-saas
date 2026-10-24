"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "northstar-hidden-kpis";
const EVENT = "northstar-hidden-kpis-change";

let cachedRaw: string | null = null;
let cachedValue: string[] = [];

function getSnapshot(): string[] {
  const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = raw ? raw.split(",").filter(Boolean) : [];
  }
  return cachedValue;
}

function getServerSnapshot(): string[] {
  return cachedValue;
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function setHidden(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, ids.join(","));
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Which KPI cards the user hid via "Customize". Kept in localStorage so the
 * preference survives a reload; shared through a module store to avoid a
 * context provider for a single dashboard control.
 */
export function useHiddenKpis() {
  const hidden = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = (id: string) => {
    const current = getSnapshot();
    setHidden(current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const reset = () => setHidden([]);

  return { hidden, toggle, reset };
}
