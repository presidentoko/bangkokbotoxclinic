"use client";
// 클리닉 상세 페이지는 ISR로 최대 7일 캐시되므로, 서버에서 relative time을 계산해
// HTML에 굳혀버리면 "3h ago"가 최대 7일간 그대로 표시됨. 방문자 브라우저에서
// mount 시점에 계산해야 항상 정확함.

import { useEffect, useState } from "react";

function relativeTimeFromIso(iso: string, th = false): string {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return th ? "เมื่อไม่นานนี้" : "recently";
  const diff = Math.max(0, Date.now() - then);
  const min = Math.floor(diff / 60_000);
  if (min < 1) return th ? "เมื่อสักครู่" : "just now";
  if (min < 60) return th ? `${min} นาทีที่แล้ว` : `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return th ? `${hr} ชั่วโมงที่แล้ว` : `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return th ? `${day} วันที่แล้ว` : `${day}d ago`;
}

export function Freshness({ generatedAt, mode = "card", lang = "en" }: {
  generatedAt: string;
  mode?: "card" | "detail";
  lang?: "en" | "th";
}) {
  const th = lang === "th";
  const [ago, setAgo] = useState<string | null>(null);

  useEffect(() => {
    setAgo(relativeTimeFromIso(generatedAt, th));
  }, [generatedAt, th]);

  if (ago === null) return null;

  if (mode === "card") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted)]">
        <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
        {th ? `อัปเดต ${ago}` : `Updated ${ago}`}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-xs text-[var(--muted)] bg-white px-3 py-1 rounded-full border border-[var(--border)]">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      {th ? `อัปเดตล่าสุด ${ago}` : `Last updated ${ago}`}
    </span>
  );
}
