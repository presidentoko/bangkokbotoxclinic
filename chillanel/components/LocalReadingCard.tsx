// "Around here" — 이 가게를 도시 전체 데이터 안에 놓았을 때만 나오는 문장 (lib/local-reading.ts).
// 서버 컴포넌트, JS 0. 빌드타임 계산.
import Link from "next/link";
import type { Lang } from "@/lib/site";
import { cityLabel, localeFor } from "@/lib/site";
import type { Place } from "@/lib/types";
import { localReading } from "@/lib/local-reading";

const COPY: Record<Lang, { title: string; rival: string; km: string }> = {
  en: { title: "Around here", rival: "Closest higher-rated place", km: "km away" },
  th: { title: "ในย่านนี้", rival: "ร้านใกล้เคียงที่คะแนนสูงกว่า", km: "กม." },
  ko: { title: "이 동네에서는", rival: "가장 가까운 더 높은 평점 업소", km: "km" },
};

export default function LocalReadingCard({
  place, cityPlaces, lang,
}: { place: Place; cityPlaces: Place[]; lang: Lang }) {
  const reading = localReading(place, cityPlaces, cityLabel(place.city, lang), lang);
  if (!reading) return null;
  const t = COPY[lang];
  const { rival } = reading;
  return (
    <section className="rounded-2xl border border-border bg-bg-elev p-4 sm:p-5 mb-8">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <h2 className="font-bold text-lg">📍 {t.title}</h2>
        <span className="text-[11px] uppercase tracking-wide text-muted font-semibold">chillanel</span>
      </div>
      <ul className="space-y-2 text-sm leading-relaxed">
        {reading.sentences.map((s) => <li key={s}>{s}</li>)}
      </ul>
      {rival && (
        <p className="text-sm mt-3 pt-3 border-t border-border text-muted">
          {t.rival}:{" "}
          <Link href={`/${lang}/place/${rival.id}`} className="font-semibold text-accent hover:underline">
            {rival.name}
          </Link>{" "}
          (★{rival.rating.toFixed(1)}, {rival.km.toLocaleString(localeFor(lang))} {t.km})
        </p>
      )}
    </section>
  );
}
