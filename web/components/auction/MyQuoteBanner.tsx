"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// 견적 요청을 낸 손님이 같은 기기로 다시 오면 비교 페이지로 가는 띠를 띄운다.
// 링크를 잃어버려도 돌아올 수 있게 — 형이 링크를 따로 보내는 일을 줄이려는 것.
const KEY = "myQuote";
const MAX_AGE_MS = 30 * 24 * 3600_000;

export default function MyQuoteBanner() {
  const path = usePathname();
  const [secret, setSecret] = useState<string | null>(null);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "null") as { secret?: string; at?: number } | null;
      if (v?.secret && v.at && Date.now() - v.at < MAX_AGE_MS) setSecret(v.secret);
    } catch {}
  }, []);

  if (!secret || path?.startsWith("/q/") || path?.startsWith("/admin") || path?.startsWith("/bid/")) return null;
  return (
    <a href={`/q/${secret}`} className="block bg-black text-white text-center text-sm py-2 px-4 hover:opacity-90">
      Your clinic quotes are here → see and compare
    </a>
  );
}
