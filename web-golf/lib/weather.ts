// web-golf/lib/weather.ts
// OpenWeatherMap 5-day forecast API — 최근 강수량 합산

const OWM_KEY = process.env.OPENWEATHERMAP_API_KEY ?? "";

export type WeatherResult = {
  rainfall7d_mm: number;
  fetched_at: string;
};

export async function fetchRainfall(lat: number, lng: number): Promise<WeatherResult> {
  if (!OWM_KEY) return { rainfall7d_mm: 0, fetched_at: new Date().toISOString() };

  const url =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}` +
    `&appid=${OWM_KEY}&units=metric&cnt=40`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return { rainfall7d_mm: 0, fetched_at: new Date().toISOString() };

  const data = await res.json();
  const total = (data.list ?? []).slice(0, 56).reduce(
    (sum: number, slot: { rain?: { "3h"?: number } }) => sum + (slot.rain?.["3h"] ?? 0),
    0
  );

  return {
    rainfall7d_mm: Math.round(total * 10) / 10,
    fetched_at: new Date().toISOString(),
  };
}

export type DrainageStatus = "safe" | "caution" | "danger";

export function drainageStatus(
  drainageScore: number,
  rainfall7d: number
): DrainageStatus {
  if (drainageScore < 40 || rainfall7d > 60) return "danger";
  if (drainageScore < 70 || rainfall7d > 30) return "caution";
  return "safe";
}

export const STATUS_EMOJI: Record<DrainageStatus, string> = {
  safe: "🟢",
  caution: "🟡",
  danger: "🔴",
};

export const STATUS_LABEL: Record<DrainageStatus, string> = {
  safe: "정상 — 라운딩 가능",
  caution: "주의 — 일부 구간 습함",
  danger: "위험 — 침수 가능성",
};
