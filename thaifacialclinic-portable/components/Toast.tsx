"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type ToastKind = "success" | "info" | "error";
type Toast = { id: number; kind: ToastKind; text: string };

type Ctx = { push: (kind: ToastKind, text: string) => void };
const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((kind: ToastKind, text: string) => {
    const id = Date.now() + Math.random();
    setToasts((cur) => [...cur, { id, kind, text }]);
    setTimeout(() => setToasts((cur) => cur.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => (
          <div key={t.id}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-premium-lg animate-fade-up ${
              t.kind === "success" ? "bg-mint-600 text-white"
                : t.kind === "error" ? "bg-red-600 text-white"
                : "bg-navy-900 text-white"
            }`}>
            <span>{t.kind === "success" ? "✓" : t.kind === "error" ? "⚠" : "ⓘ"}</span>
            <span>{t.text}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastCtx);
  if (!ctx) return { push: () => {} };
  return ctx;
}

// Auto-hide animation hook — re-renders when toasts change.
export function useToastAutoclear() {
  useEffect(() => {}, []);
}
