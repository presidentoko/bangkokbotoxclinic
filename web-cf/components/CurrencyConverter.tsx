"use client";
// Multi-currency toggle. Picks user's preference, persists, exposes useCurrency() hook
// for any component to format THB amounts.

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type CCY = "THB" | "USD" | "KRW" | "SAR" | "GBP" | "AED" | "AUD" | "SGD";

// THB → other (rough rates Apr 2026)
const RATE: Record<CCY, { symbol: string; per: number; locale: string }> = {
  THB: { symbol: "฿",   per: 1,       locale: "th-TH" },
  USD: { symbol: "$",   per: 1 / 35,  locale: "en-US" },
  KRW: { symbol: "₩",   per: 38,      locale: "ko-KR" },
  SAR: { symbol: "ر.س", per: 1 / 9.5, locale: "ar-SA" },
  GBP: { symbol: "£",   per: 1 / 44,  locale: "en-GB" },
  AED: { symbol: "د.إ", per: 1 / 9.6, locale: "en-AE" },
  AUD: { symbol: "A$",  per: 1 / 23,  locale: "en-AU" },
  SGD: { symbol: "S$",  per: 1 / 26,  locale: "en-SG" },
};

const KEY = "ccy_v1";

const Ctx = createContext<{ ccy: CCY; setCcy: (c: CCY) => void }>({ ccy: "THB", setCcy: () => {} });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [ccy, setCcy] = useState<CCY>("THB");

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as CCY | null;
    if (saved && RATE[saved]) setCcy(saved);
  }, []);

  const setAndSave = useCallback((c: CCY) => {
    setCcy(c);
    localStorage.setItem(KEY, c);
  }, []);

  return <Ctx.Provider value={{ ccy, setCcy: setAndSave }}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  return useContext(Ctx);
}

export function formatPrice(thb: number, ccy: CCY): string {
  const r = RATE[ccy];
  const v = thb * r.per;
  if (ccy === "KRW") return `${r.symbol}${Math.round(v).toLocaleString()}`;
  if (v >= 1_000_000) return `${r.symbol}${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10_000)    return `${r.symbol}${Math.round(v / 1000).toLocaleString()}K`;
  return `${r.symbol}${Math.round(v).toLocaleString()}`;
}

export default function CurrencyConverterButton() {
  const { ccy, setCcy } = useCurrency();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50"
      >
        {RATE[ccy].symbol} {ccy}
        <span className="text-[var(--muted)] text-[10px]">▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 right-0 z-40 w-40 rounded-xl bg-white border-2 shadow-xl py-1 overflow-hidden" style={{ borderColor: "var(--border)" }}>
            {(Object.keys(RATE) as CCY[]).map((c) => (
              <button key={c}
                onClick={() => { setCcy(c); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 ${c === ccy ? "bg-emerald-50 text-emerald-900 font-black" : ""}`}>
                <span className="w-5">{RATE[c].symbol}</span>
                <span>{c}</span>
                {c === ccy && <span className="ml-auto text-emerald-600">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
