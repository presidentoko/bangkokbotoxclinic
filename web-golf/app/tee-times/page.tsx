// web-golf/app/tee-times/page.tsx
import { promises as fs } from "node:fs";
import path from "node:path";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import type { TeeTimesJson, TeeSlot } from "@/lib/types";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Bangkok Golf Tee Times — 오늘/이번 주말 잔여 슬롯",
  description:
    "방콕 골프장 실시간 잔여 티타임. 주말 모닝 슬롯 땡처리 모아보기. ThailandGolfCentre, GolfAsian, MonkeyTravel 통합.",
  alternates: { canonical: "/tee-times" },
};

async function loadTeeTimes(): Promise<TeeTimesJson> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "public", "tee_times.json"),
      "utf-8"
    );
    return JSON.parse(raw) as TeeTimesJson;
  } catch {
    return { updated_at: "", slots: [] };
  }
}

function groupByDate(slots: TeeSlot[]): Map<string, TeeSlot[]> {
  const map = new Map<string, TeeSlot[]>();
  for (const s of slots) {
    if (!map.has(s.date)) map.set(s.date, []);
    map.get(s.date)!.push(s);
  }
  return map;
}

function isWeekend(dateStr: string): boolean {
  const d = new Date(dateStr);
  return d.getDay() === 0 || d.getDay() === 6;
}

function isMorning(time: string): boolean {
  const h = parseInt(time.split(":")[0], 10);
  return h >= 6 && h < 10;
}

const AGENCY_COLORS: Record<string, string> = {
  ThailandGolfCentre: "bg-blue-100 text-blue-800",
  GolfAsian: "bg-purple-100 text-purple-800",
  MonkeyTravel: "bg-orange-100 text-orange-800",
};

export default async function TeeTimesPage() {
  const data = await loadTeeTimes();
  const morningSlots = data.slots.filter((s) => isMorning(s.time));
  const byDate = groupByDate(morningSlots);

  const updatedAt = data.updated_at
    ? new Date(data.updated_at).toLocaleString("ko-KR", { timeZone: "Asia/Bangkok" })
    : null;

  const allDates = [...byDate.keys()];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Tee Times</span>
      </nav>

      <header className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-3">잔여 티타임</h1>
            <p className="text-base text-[var(--muted)]">
              모닝 (06:00–10:00) 슬롯 · {morningSlots.length}개 잔여 · {allDates.length}일치
            </p>
          </div>
          {updatedAt && (
            <div className="text-xs text-[var(--muted)] text-right shrink-0">
              Updated<br />
              <span className="font-medium text-[var(--fg)]">{updatedAt}</span>
            </div>
          )}
        </div>
      </header>

      {morningSlots.length === 0 && (
        <div className="p-8 text-center border border-[var(--border)] rounded-2xl text-[var(--muted)]">
          티타임 데이터 수집 중입니다. 스크래퍼 첫 실행 후 표시됩니다.
        </div>
      )}

      <div className="space-y-8">
        {allDates.map((date) => {
          const slots = byDate.get(date)!;
          const weekend = isWeekend(date);
          const label = new Date(date).toLocaleDateString("ko-KR", {
            month: "long", day: "numeric", weekday: "short",
          });
          return (
            <section key={date}>
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                {label}
                {weekend && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    주말
                  </span>
                )}
                <span className="text-xs text-[var(--muted)] font-normal">
                  {slots.length}개 슬롯
                </span>
              </h2>
              <div className="grid gap-2">
                {slots.map((s, i) => (
                  <div
                    key={`${s.course_id}-${s.time}-${i}`}
                    className="flex items-center justify-between gap-3 p-3 border border-[var(--border)] rounded-xl bg-white hover:border-emerald-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black tabular-nums text-emerald-700 w-12 shrink-0">
                        {s.time}
                      </span>
                      <div>
                        <a href={`/course/${s.course_id}`} className="font-medium text-sm hover:text-emerald-700 hover:underline">
                          {s.course_name}
                        </a>
                        <div className="mt-0.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${AGENCY_COLORS[s.agency] ?? "bg-gray-100 text-gray-700"}`}>
                            {s.agency}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {s.total_baht > 0 && (
                        <span className="text-sm font-bold tabular-nums">
                          {s.total_baht.toLocaleString()}฿
                        </span>
                      )}
                      <a
                        href={s.booking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition"
                      >
                        예약 →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Tee Times", url: "/tee-times" },
      ]} />
      <FaqJsonLd faqs={[
        { q: "방콕 골프장 주말 모닝 티타임은 얼마나 빨리 마감되나요?", a: "Alpine Golf Club, Thai Country Club, Riverdale 등 인기 코스는 1~2주 전에 마감됩니다. 이 페이지는 30분마다 에이전시 잔여 슬롯을 스캔해 실시간 현황을 보여줍니다." },
        { q: "모닝 티타임 시간대는 언제인가요?", a: "오전 6:00~10:00 슬롯을 모닝으로 분류합니다. 특히 06:00~08:00 early bird 슬롯이 가장 빠르게 마감됩니다." },
        { q: "티타임 예약 시 총 비용은 얼마인가요?", a: "표시된 총액은 그린피+캐디피+카트비를 합산한 금액입니다. 현장에서 캐디 팁(฿400~600)이 별도로 발생합니다. 클럽 렌탈은 포함되지 않습니다." },
        { q: "에이전시 예약과 코스 직접 예약 중 어느 것이 저렴한가요?", a: "그린피 단가는 코스 직접 예약이 가장 저렴합니다. 단 에이전시 패키지는 교통, 캐디, 카트를 번들로 제공해 첫 방문자에게 편의성이 높습니다. ThailandGolfCentre, GolfAsian이 태국 전문 주요 에이전시입니다." },
      ]} />
    </div>
  );
}
