"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/** 입찰을 받는 동안 1분마다 새로 불러온다. 탭이 안 보이면 건너뛴다 (함수 호출·Upstash 절약). */
export function AutoRefresh({ seconds = 60 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, seconds * 1000);
    return () => clearInterval(t);
  }, [router, seconds]);
  return null;
}

export function ChooseButton({ secret, token, clinic }: { secret: string; token: string; clinic: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function choose() {
    if (!confirm(`Choose ${clinic}? We'll connect you with this clinic.`)) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/quote/choose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, token }),
    }).catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setError("Couldn't save your choice. Please try again.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button type="button" onClick={choose} disabled={busy}
        className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold disabled:opacity-50">
        {busy ? "Saving…" : "Choose this clinic"}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
