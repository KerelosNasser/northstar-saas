"use client";

import React, { createContext, useContext, useState } from "react";

export type CurrencyCode = "USD" | "EUR" | "GBP";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number; // relative to USD (1.0)
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", label: "USD ($)", rate: 1.0 },
  EUR: { code: "EUR", symbol: "€", label: "EUR (€)", rate: 0.92 },
  GBP: { code: "GBP", symbol: "£", label: "GBP (£)", rate: 0.79 },
};

interface RevenueCurrencyContextType {
  currency: CurrencyConfig;
  setCurrencyCode: (code: CurrencyCode) => void;
  formatMoney: (amountUsd: number, options?: { compact?: boolean; decimals?: number; sign?: boolean }) => string;
}

const RevenueCurrencyContext = createContext<RevenueCurrencyContextType>({
  currency: CURRENCIES.USD,
  setCurrencyCode: () => {},
  formatMoney: (val) => `$${val.toLocaleString()}`,
});

export function RevenueCurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("USD");
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;

  const formatMoney = (
    amountUsd: number,
    options?: { compact?: boolean; decimals?: number; sign?: boolean },
  ) => {
    const converted = amountUsd * currency.rate;
    const isNegative = converted < 0;
    const absVal = Math.abs(converted);
    const signPrefix = options?.sign ? (isNegative ? "-" : "+") : isNegative ? "-" : "";

    if (options?.compact) {
      if (absVal >= 1_000_000) {
        return `${signPrefix}${currency.symbol}${(absVal / 1_000_000).toFixed(1)}M`;
      }
      if (absVal >= 1_000) {
        return `${signPrefix}${currency.symbol}${(absVal / 1_000).toFixed(1)}k`;
      }
      return `${signPrefix}${currency.symbol}${absVal.toFixed(0)}`;
    }

    const decimals = options?.decimals ?? 0;
    const formatted = absVal.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    return `${signPrefix}${currency.symbol}${formatted}`;
  };

  return (
    <RevenueCurrencyContext.Provider value={{ currency, setCurrencyCode, formatMoney }}>
      {children}
    </RevenueCurrencyContext.Provider>
  );
}

export function useRevenueCurrency() {
  return useContext(RevenueCurrencyContext);
}
