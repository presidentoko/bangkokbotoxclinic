// web-golf/app/conditions/page.tsx
import { loadMasterDb } from "@/lib/data";
import { fetchRainfall, drainageStatus, STATUS_EMOJI, STATUS_LABEL } from "@/lib/weather";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
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
      <FaqJsonLd faqs={[
        { q: "우기에도 태국 골프장에서 라운딩이 가능한가요?", a: "가능합니다. 하지만 배수 시설에 따라 차이가 큽니다. 배수 점수 70 이상 코스는 집중호우 후에도 24~48시간 내 정상 운영되는 경우가 많습니다. 이 페이지의 신호등을 참고해 라운딩 전 확인하세요." },
        { q: "배수 점수는 어떻게 계산되나요?", a: "구글 리뷰 텍스트에서 '물 고임', 'waterlogged', '배수 안', '침수', 'น้ำท่วม' 등 배수 관련 키워드를 자동 추출하여 점수화합니다. 부정 키워드가 많을수록 점수가 낮고, 'drains well', '배수 좋' 등 긍정 키워드는 점수를 높입니다." },
        { q: "빨간 신호(위험)인 코스는 라운딩이 불가능한가요?", a: "필수적으로 불가능한 것은 아니지만, 최근 7일 강수량 60mm 초과 또는 배수 점수 40 미만인 경우 침수·비정상 코스 상태 가능성이 높습니다. 예약 전 코스에 직접 확인을 권장합니다." },
        { q: "날씨 데이터는 얼마나 자주 업데이트되나요?", a: "OpenWeatherMap API 기반으로 1시간마다 갱신됩니다. 배수 점수는 구글 리뷰 분석 기준으로 매일 새벽 3시(방콕 시간)에 업데이트됩니다." },
      ]} />
    </div>
  );
}
