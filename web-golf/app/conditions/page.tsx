// web-golf/app/conditions/page.tsx
import { loadMasterDb } from "@/lib/data";
import { fetchRainfall, drainageStatus, STATUS_EMOJI, STATUS_LABEL } from "@/lib/weather";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";
import type { Course } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Golf Course Conditions — Thailand Drainage & Weather Alert",
  description:
    "태국 주요 골프장 실시간 배수·날씨 현황. 방콕·파타야·푸켓·후아힌·치앙마이 5개 권역. 우기 라운딩 전 필수 확인.",
  alternates: { canonical: "/conditions" },
};

const REGIONS = [
  {
    key: "bkk",
    label: "방콕 & 중부",
    en: "Bangkok & Central",
    lat: 13.75,
    lng: 100.5,
    cities: ["Bangkok", "Nonthaburi", "Pathum", "Samut", "Nakhon Pathom", "Ayutthaya", "Saraburi", "Ang Thong", "Sing Buri", "Chai Nat", "Kanchanaburi"],
  },
  {
    key: "pty",
    label: "파타야 & 동부",
    en: "Pattaya & East",
    lat: 12.93,
    lng: 100.88,
    cities: ["Chon Buri", "Chonburi", "Rayong", "Chanthaburi", "Pattaya", "Trat"],
  },
  {
    key: "phu",
    label: "푸켓 & 남부",
    en: "Phuket & South",
    lat: 7.89,
    lng: 98.35,
    cities: ["Phuket", "Krabi", "Phang Nga", "Surat", "Samui", "Nakhon Si", "Trang", "Phatthalung"],
  },
  {
    key: "hh",
    label: "후아힌 & 서부",
    en: "Hua Hin & West",
    lat: 12.57,
    lng: 99.95,
    cities: ["Prachuap", "Phetchaburi", "Cha-am", "Cha Am", "Ratchaburi", "Hua Hin"],
  },
  {
    key: "cm",
    label: "치앙마이 & 북부",
    en: "Chiang Mai & North",
    lat: 18.79,
    lng: 98.98,
    cities: ["Chiang Mai", "Chiang Rai", "Lampang", "Lamphun", "Phrae", "Nan", "Mae Hong Son", "Phayao"],
  },
] as const;

type RegionKey = typeof REGIONS[number]["key"];

function classifyRegion(c: Course): RegionKey | null {
  const city = c.city_label || c.district || "";
  for (const r of REGIONS) {
    if (r.cities.some((k) => city.includes(k))) return r.key;
  }
  return null;
}

export default async function ConditionsPage() {
  const db = await loadMasterDb();
  const golfCourses = db.restaurants.filter((c) => c.is_golf_filtered !== false);

  // Group courses by region
  const byRegion = new Map<RegionKey, Course[]>();
  for (const r of REGIONS) byRegion.set(r.key, []);
  for (const c of golfCourses) {
    const rk = classifyRegion(c);
    if (rk) byRegion.get(rk)!.push(c);
  }

  // Fetch one weather reading per region in parallel
  const weatherByRegion = await Promise.all(
    REGIONS.map((r) => fetchRainfall(r.lat, r.lng))
  );
  const rainfallMap = Object.fromEntries(
    REGIONS.map((r, i) => [r.key, weatherByRegion[i].rainfall7d_mm])
  );

  // Enrich and sort courses within each region
  const enrichedByRegion = REGIONS.map((reg) => {
    const courses = (byRegion.get(reg.key) ?? []).slice(0, 40).map((c) => {
      const score = c.drainage_score ?? 50;
      const rain = rainfallMap[reg.key];
      const status = drainageStatus(score, rain);
      return { ...c, rain, status };
    });
    const sorted = [...courses].sort((a, b) => {
      const order = { danger: 0, caution: 1, safe: 2 };
      return order[a.status] - order[b.status];
    });
    const rain = rainfallMap[reg.key];
    const dangerCount = sorted.filter((c) => c.status === "danger").length;
    const cautionCount = sorted.filter((c) => c.status === "caution").length;
    return { reg, sorted, rain, dangerCount, cautionCount };
  });

  const totalCourses = enrichedByRegion.reduce((s, r) => s + r.sorted.length, 0);
  const totalDanger = enrichedByRegion.reduce((s, r) => s + r.dangerCount, 0);
  const totalCaution = enrichedByRegion.reduce((s, r) => s + r.cautionCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Conditions</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          골프장 날씨 & 배수 현황
        </h1>
        <p className="text-sm text-[var(--muted)] max-w-2xl">
          태국 5개 권역 {totalCourses}개 코스 · 최근 강수량 + 배수 평점 기반 라운딩 가능 여부. 매 1시간 자동 갱신.
        </p>
        <div className="flex gap-4 mt-3 text-sm font-medium">
          {totalDanger > 0 && <span className="text-red-600">🔴 위험 {totalDanger}</span>}
          {totalCaution > 0 && <span className="text-yellow-600">🟡 주의 {totalCaution}</span>}
          <span className="text-green-600">🟢 정상 {totalCourses - totalDanger - totalCaution}</span>
        </div>
      </header>

      <div className="space-y-10">
        {enrichedByRegion.filter((r) => r.sorted.length > 0).map(({ reg, sorted, rain, dangerCount, cautionCount }) => (
          <section key={reg.key}>
            <div className="flex items-baseline justify-between mb-3 border-b border-[var(--border)] pb-2">
              <h2 className="text-lg font-bold">{reg.label}</h2>
              <div className="text-xs text-[var(--muted)] flex gap-3">
                <span>7일 강수 {rain.toFixed(0)}mm</span>
                {dangerCount > 0 && <span className="text-red-600">위험 {dangerCount}</span>}
                {cautionCount > 0 && <span className="text-yellow-600">주의 {cautionCount}</span>}
                <span>{sorted.length}개 코스</span>
              </div>
            </div>
            <div className="grid gap-2">
              {sorted.map((c) => (
                <a
                  key={c.id}
                  href={`/course/${c.id}`}
                  className="flex items-center justify-between gap-4 p-3.5 border border-[var(--border)] rounded-xl bg-white hover:border-emerald-400 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg shrink-0">{STATUS_EMOJI[c.status]}</span>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{c.name}</div>
                      <div className="text-xs text-[var(--muted)]">
                        {c.district || c.city_label} · 배수 {c.drainage_score ?? 50}점
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold">{STATUS_LABEL[c.status]}</div>
                    <div className="text-xs text-[var(--muted)] mt-0.5">7일 {c.rain.toFixed(0)}mm</div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="text-xs text-[var(--muted)] mt-8 border-t border-[var(--border)] pt-4">
        배수 점수: 구글 리뷰 텍스트 키워드 분석 (매일 03:00 갱신). 날씨: OpenWeatherMap API 권역 대표 좌표 기준 (1시간 갱신).
      </p>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Conditions", url: "/conditions" },
      ]} />
      <FaqJsonLd faqs={[
        { q: "우기에도 태국 골프장에서 라운딩이 가능한가요?", a: "가능합니다. 하지만 배수 시설에 따라 차이가 큽니다. 배수 점수 70 이상 코스는 집중호우 후에도 24~48시간 내 정상 운영되는 경우가 많습니다. 이 페이지의 신호등을 참고해 라운딩 전 확인하세요." },
        { q: "배수 점수는 어떻게 계산되나요?", a: "구글 리뷰 텍스트에서 '물 고임', 'waterlogged', '배수 안', '침수', 'น้ำท่วม' 등 배수 관련 키워드를 자동 추출하여 점수화합니다. 부정 키워드가 많을수록 점수가 낮고, 'drains well', '배수 좋' 등 긍정 키워드는 점수를 높입니다." },
        { q: "빨간 신호(위험)인 코스는 라운딩이 불가능한가요?", a: "최근 7일 강수량 60mm 초과 또는 배수 점수 40 미만인 경우 침수·비정상 코스 상태 가능성이 높습니다. 예약 전 코스에 직접 확인을 권장합니다." },
        { q: "날씨 데이터는 얼마나 자주 업데이트되나요?", a: "OpenWeatherMap API 기반으로 1시간마다 갱신됩니다. 배수 점수는 매일 새벽 3시(방콕 시간)에 업데이트됩니다." },
      ]} />
    </div>
  );
}
