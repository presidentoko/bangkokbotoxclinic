"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Clinic } from "@/lib/types";

const MAX_COMPARE = 3;
const STORAGE_KEY = "tfc:compare:v1";

type CompareCtx = {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  canAdd: boolean;
};

const Ctx = createContext<CompareCtx | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setIds(parsed.slice(0, MAX_COMPARE));
      }
    } catch { /* ignore */ }
  }, []);

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
  }, [ids]);

  const toggle = useCallback((id: string) => {
    setIds((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= MAX_COMPARE) return cur;
      return [...cur, id];
    });
  }, []);

  const clear = useCallback(() => setIds([]), []);
  const isSelected = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <Ctx.Provider value={{ ids, toggle, clear, isSelected, canAdd: ids.length < MAX_COMPARE }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCompare(): CompareCtx {
  const ctx = useContext(Ctx);
  if (!ctx) return { ids: [], toggle: () => {}, clear: () => {}, isSelected: () => false, canAdd: true };
  return ctx;
}

export const COMPARE_MAX = MAX_COMPARE;

// Lookup helper — given the full clinics list + selected ids, returns Clinic[] in selection order.
export function pickCompareClinics(all: Clinic[], ids: string[]): Clinic[] {
  const map = new Map(all.map((c) => [c.id, c]));
  return ids.map((id) => map.get(id)).filter((c): c is Clinic => Boolean(c));
}
