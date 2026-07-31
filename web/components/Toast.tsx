"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

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
      {/* bottom-24: 모바일 하단 내비/연락 바(z-30~40)보다 위에 겹쳐서 예약 버튼을
          가리던 것 수정 — z-50이라 z 순서상으론 위지만 위치를 아예 바 위로 올림
          (2026-07-31 감사). sm 이상은 그런 하단 바가 없어 기존 위치 유지. */}
      <div className="fixed bottom-24 sm:bottom-4 right-4 z-50 flex flex-col gap-2 max-w-[calc(100vw-2rem)] pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl pointer-events-auto toast-fade-up ${
              t.kind === "success" ? "bg-emerald-600 text-white"
                : t.kind === "error" ? "bg-red-600 text-white"
                : "bg-slate-900 text-white"
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
