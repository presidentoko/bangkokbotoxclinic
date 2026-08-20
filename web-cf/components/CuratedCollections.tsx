// Focus-aware curated mini-lists. 4 collections, deduped against actual data.
// Each collection has a filter + emoji + sub. Renders only when 2+ clinics match.

import type { Clinic } from "@/lib/types";
import type { SiteFocus } from "@/lib/site";
import { formatTrustScore } from "@/lib/utils";

type Lang = "en" | "ko" | "th";

type Collection = {
  key: string;
  title: string;
  sub: string;
  emoji: string;
  filter: (c: Clinic) => boolean;
};

const T: Record<Lang, {
  highestRatedT: string; highestRatedS: string;
  englishT: string; englishS: string;
  koreanT: string; koreanS: string;
  highTrustT: string; highTrustS: string;
  genuineBrandT: string; genuineBrandS: string;
  fillerT: string; fillerS: string;
  hifuT: string; hifuS: string;
  picoT: string; picoS: string;
  implantT: string; implantS: string;
  fueT: string; fueS: string;
  curated: string; heading: string; sub: string; reviews: string; trust: string;
}> = {
  en: {
    highestRatedT: "Highest Rated", highestRatedS: "4.8+ stars with 50+ reviews",
    englishT: "English-friendly", englishS: "English-speaking staff verified",
    koreanT: "Korean-friendly", koreanS: "Korean-speaking staff verified",
    highTrustT: "Highest Trust", highTrustS: "Trust Score 80+ — multi-source verified",
    genuineBrandT: "Genuine Brand", genuineBrandS: "Allergan/Dysport/Botulax verified in reviews",
    fillerT: "HA Filler Specialists", fillerS: "Juvederm/Restylane mentioned in reviews",
    hifuT: "Branded Machines", hifuS: "Ulthera/Thermage/Ultraformer verified",
    picoT: "Pico Laser Specialists", picoS: "Pico Pico/PicoSure verified",
    implantT: "Implant Specialists", implantS: "Straumann/Nobel/Osstem mentioned",
    fueT: "FUE Specialists", fueS: "FUE-focused in reviews + photos",
    curated: "Curated", heading: "Find by what matters to you", sub: "Hand-picked groups based on real review data. No paid placements here.",
    reviews: "reviews", trust: "Trust",
  },
  ko: {
    highestRatedT: "최고 평점", highestRatedS: "4.8점 이상, 리뷰 50개 이상",
    englishT: "영어 가능", englishS: "영어 가능 직원 확인됨",
    koreanT: "한국어 가능", koreanS: "한국어 가능 직원 확인됨",
    highTrustT: "최고 신뢰도", highTrustS: "신뢰도 점수 80+ — 다중 소스 검증",
    genuineBrandT: "정품 브랜드", genuineBrandS: "리뷰에서 확인된 Allergan/Dysport/Botulax",
    fillerT: "히알루론산 필러 전문", fillerS: "리뷰에서 언급된 Juvederm/Restylane",
    hifuT: "정품 기기 보유", hifuS: "확인된 Ulthera/Thermage/Ultraformer",
    picoT: "피코레이저 전문", picoS: "확인된 Pico Pico/PicoSure",
    implantT: "임플란트 전문", implantS: "언급된 Straumann/Nobel/Osstem",
    fueT: "FUE 전문", fueS: "리뷰 + 사진에서 FUE 중심 확인",
    curated: "큐레이션", heading: "당신에게 중요한 기준으로 찾기", sub: "실제 리뷰 데이터를 기반으로 엄선했습니다. 광고 노출은 없습니다.",
    reviews: "리뷰", trust: "신뢰도",
  },
  th: {
    highestRatedT: "คะแนนสูงสุด", highestRatedS: "4.8+ ดาว รีวิว 50+ รายการ",
    englishT: "พูดอังกฤษได้", englishS: "ยืนยันแล้วว่าเจ้าหน้าที่พูดอังกฤษได้",
    koreanT: "พูดเกาหลีได้", koreanS: "ยืนยันแล้วว่าเจ้าหน้าที่พูดเกาหลีได้",
    highTrustT: "ความน่าเชื่อถือสูงสุด", highTrustS: "คะแนนความน่าเชื่อถือ 80+ — ยืนยันจากหลายแหล่ง",
    genuineBrandT: "แบรนด์ของแท้", genuineBrandS: "ยืนยัน Allergan/Dysport/Botulax จากรีวิว",
    fillerT: "ผู้เชี่ยวชาญฟิลเลอร์ HA", fillerS: "มีการกล่าวถึง Juvederm/Restylane ในรีวิว",
    hifuT: "เครื่องแบรนด์แท้", hifuS: "ยืนยัน Ulthera/Thermage/Ultraformer",
    picoT: "ผู้เชี่ยวชาญเลเซอร์ Pico", picoS: "ยืนยัน Pico Pico/PicoSure",
    implantT: "ผู้เชี่ยวชาญรากฟันเทียม", implantS: "มีการกล่าวถึง Straumann/Nobel/Osstem",
    fueT: "ผู้เชี่ยวชาญ FUE", fueS: "เน้น FUE ในรีวิว + รูปภาพ",
    curated: "คัดสรรพิเศษ", heading: "ค้นหาตามสิ่งที่สำคัญกับคุณ", sub: "กลุ่มที่คัดสรรมาจากข้อมูลรีวิวจริง ไม่มีตำแหน่งโฆษณาที่นี่",
    reviews: "รีวิว", trust: "ความน่าเชื่อถือ",
  },
};

function buildFocusCollections(lang: Lang): Record<SiteFocus, Collection[]> {
  const t = T[lang] ?? T.en;
  const HIGHEST_RATED: Collection = {
    key: "highest-rated", title: t.highestRatedT, sub: t.highestRatedS, emoji: "⭐",
    filter: (c) => (c.rating ?? 0) >= 4.8 && (c.total_reviews ?? 0) >= 50,
  };
  const ENGLISH_FRIENDLY: Collection = {
    key: "english", title: t.englishT, sub: t.englishS, emoji: "🇬🇧",
    filter: (c) => (c.language_breakdown?.en ?? 0) >= 5,
  };
  const KOREAN_FRIENDLY: Collection = {
    key: "korean", title: t.koreanT, sub: t.koreanS, emoji: "🇰🇷",
    filter: (c) => (c.language_breakdown?.ko ?? 0) >= 3,
  };
  const HIGH_TRUST: Collection = {
    key: "high-trust", title: t.highTrustT, sub: t.highTrustS, emoji: "🛡️",
    filter: (c) => c.trust_score >= 80,
  };

  return {
    all:    [HIGHEST_RATED, HIGH_TRUST, ENGLISH_FRIENDLY, KOREAN_FRIENDLY],
    botox:  [
      { key: "genuine-brand", title: t.genuineBrandT, sub: t.genuineBrandS, emoji: "🛡️", filter: (c) => /genuine|allergan|dysport|botulax/i.test(JSON.stringify(c.mentioned_topics || [])) },
      HIGH_TRUST, ENGLISH_FRIENDLY, KOREAN_FRIENDLY,
    ],
    filler: [
      { key: "filler-specialists", title: t.fillerT, sub: t.fillerS, emoji: "💉", filter: (c) => /juvederm|restylane|belotero|filler/i.test(JSON.stringify(c.mentioned_topics || [])) },
      HIGH_TRUST, ENGLISH_FRIENDLY, HIGHEST_RATED,
    ],
    hifu:   [
      { key: "hifu-machines", title: t.hifuT, sub: t.hifuS, emoji: "⚡", filter: (c) => /ulthera|thermage|ultraformer|hifu/i.test(JSON.stringify(c.mentioned_topics || [])) },
      HIGH_TRUST, HIGHEST_RATED, ENGLISH_FRIENDLY,
    ],
    facial: [HIGHEST_RATED, HIGH_TRUST, ENGLISH_FRIENDLY, KOREAN_FRIENDLY],
    laser:  [
      { key: "pico-specialists", title: t.picoT, sub: t.picoS, emoji: "🔬", filter: (c) => /pico/i.test(JSON.stringify(c.mentioned_topics || [])) },
      HIGH_TRUST, HIGHEST_RATED, ENGLISH_FRIENDLY,
    ],
    dental: [
      { key: "implant-specialists", title: t.implantT, sub: t.implantS, emoji: "🦷", filter: (c) => /implant|straumann|nobel|osstem/i.test(JSON.stringify(c.mentioned_topics || [])) },
      HIGH_TRUST, ENGLISH_FRIENDLY, HIGHEST_RATED,
    ],
    hair:   [
      { key: "fue-specialists", title: t.fueT, sub: t.fueS, emoji: "🔬", filter: (c) => /fue/i.test(JSON.stringify(c.mentioned_topics || [])) },
      HIGH_TRUST, KOREAN_FRIENDLY, HIGHEST_RATED,
    ],
  };
}

export default function CuratedCollections({ clinics, focus = "all", lang = "en" }: { clinics: Clinic[]; focus?: SiteFocus; lang?: Lang }) {
  const t = T[lang] ?? T.en;
  const FOCUS_COLLECTIONS = buildFocusCollections(lang);
  const cols = FOCUS_COLLECTIONS[focus] || FOCUS_COLLECTIONS.all;
  const items = cols.map((col) => ({
    ...col,
    clinics: clinics.filter(col.filter).sort((a, b) => b.trust_score - a.trust_score).slice(0, 3),
  })).filter((col) => col.clinics.length >= 2);

  if (items.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">{t.curated}</div>
        <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">{t.heading}</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t.sub}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((col) => (
          <div key={col.key} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3 border-b p-5" style={{ borderColor: "var(--border)" }}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-2xl">
                {col.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-black leading-tight">{col.title}</h3>
                <p className="text-xs text-[var(--muted)]">{col.sub}</p>
              </div>
              <span className="text-xs font-bold tabular-nums text-[var(--muted)] whitespace-nowrap">{col.clinics.length}+</span>
            </div>
            <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
              {col.clinics.map((c, i) => (
                <li key={c.id}>
                  <a href={`/clinic/${c.id}`} className="flex items-center gap-4 p-4 transition hover:bg-slate-50">
                    <span className="text-xl font-black tabular-nums text-[var(--muted)] w-6 text-center">{i + 1}</span>
                    <div className="h-14 w-14 rounded-xl bg-slate-100 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{c.name}</div>
                      <div className="text-xs text-[var(--muted)]">{c.district || c.city_label} · ★ {(c.rating ?? 0).toFixed(1)} · {c.total_reviews ?? 0} {t.reviews}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black tabular-nums">{formatTrustScore(c.trust_score)}</div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">{t.trust}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
