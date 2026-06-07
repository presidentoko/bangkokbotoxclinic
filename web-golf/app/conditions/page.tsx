// web-golf/app/conditions/page.tsx
import { loadMasterDb } from "@/lib/data";
import { fetchRainfall, drainageStatus, STATUS_EMOJI, STATUS_LABEL } from "@/lib/weather";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Golf Course Conditions — Bangkok Drainage & Weather Alert",
  description:
    "실시간 배수 현황 및 최근 강수량 기준 방콕 골프장 라운딩 가능 여부. 우기 대응 필수 정보.",
  alternates: { canonical: "/conditions" },
};

function isBangkokArea(lat: number | null, lng: number | null) {
  if (!lat || !lng) return false;
  return lat >= 13.0 && lat <= 14.5 && lng >= 99.5 && lng <= 101.5;
}

export default async function ConditionsPage() {
  const db = await loadMasterDb();

  const courses = db.restaurants
    .filter((c) => isBangkokArea(c.lat, c.lng))
    .filter((c) => c.is_golf_filtered !== false)
    .slice(0, 60);

  const weatherData = await Promise.all(
    courses.slice(0, 10).map((c) =>
      c.lat && c.lng
        ? fetchRainfall(c.lat, c.lng)
        : Promise.resolve({ rainfall7d_mm: 0, fetched_at: "" })
    )
  );

  const avgRainfall =
    weatherData.reduce((s, w) => s + w.rainfall7d_mm, 0) / (weatherData.length || 1);

  const enriched = courses.map((c, i) => {
    const rain = i < 10 ? weatherData[i].rainfall7d_mm : avgRainfall;
    const score = c.drainage_score ?? 50;
    const status = drainageStatus(score, rain);
    return { ...c, rain, status };
  });

  const sorted = [...enriched].sort((a, b) => {
    const order = { danger: 0, caution: 1, safe: 2 };
    return order[a.status] - order[b.status];
  });

  const dangerCount = sorted.filter((c) => c.status === "danger").length;
  const cautionCount = sorted.filter((c) => c.status === "caution").length;
  const safeCount = sorted.filter((c) => c.status === "safe").length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Conditions</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          골프장 날씨 & 배수 현황
        </h1>
        <p className="text-base text-[var(--muted)] max-w-2xl">
          방콕 권역 {courses.length}개 코스 · 최근 강수량 + 배수 평점 기반 라운딩 가능 여부.
          매 1시간 자동 갱신.
        </p>
        <div className="flex gap-4 mt-4 text-sm font-medium">
          <span className="text-red-600">🔴 위험 {dangerCount}</span>
          <span className="text-yellow-600">🟡 주의 {cautionCount}</span>
          <span className="text-green-600">🟢 정상 {safeCount}</span>
        </div>
      </header>

      <div className="grid gap-3">
        {sorted.map((c) => (
          <a
            key={c.id}
            href={`/course/${c.id}`}
            className="flex items-center justify-between gap-4 p-4 border border-[var(--border)] rounded-xl bg-white hover:border-emerald-400 hover:shadow-sm transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xl shrink-0">{STATUS_EMOJI[c.status]}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">{c.name}</div>
                <div className="text-xs text-[var(--muted)]">
                  {c.district || c.city_label} · 배수 점수 {c.drainage_score ?? 50}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-[var(--fg)]">
                {STATUS_LABEL[c.status]}
              </div>
              <div className="text-xs text-[var(--muted)] mt-0.5">
                최근 7일 강수 {c.rain.toFixed(0)}mm
              </div>
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] mt-6">
        배수 점수: 구글 리뷰 텍스트에서 침수/배수 관련 키워드 자동 추출. 날씨: OpenWeatherMap 5일 예보 기반.
      </p>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Conditions", url: "/conditions" },
      ]} />
    </div>
  );
}
