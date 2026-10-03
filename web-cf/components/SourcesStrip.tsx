// SourcesStrip — 종합 데이터 소스 시각화. Hero 아래 띠로 배치.
// 사이트가 다중 플랫폼 aggregation 임을 1초 안에 인식시킴.
// Server component. 플랫폼별 색상 + 짧은 라벨.

type Lang = "en" | "ko" | "th";

type Source = {
  name: string;
  blurb: Record<Lang, string>;
  emoji: string;
  bg: string;
  fg: string;
};

const ALL_SOURCES: Source[] = [
  { name: "Google Maps", blurb: { en: "Anchor reviews", ko: "기준 리뷰", th: "รีวิวหลัก" }, emoji: "🗺️", bg: "#4285F4", fg: "white" },
  { name: "HDmall",      blurb: { en: "Package pricing", ko: "패키지 가격", th: "ราคาแพ็กเกจ" }, emoji: "💊", bg: "#FF6B35", fg: "white" },
  { name: "Pantip",      blurb: { en: "Thai forum mentions", ko: "태국 포럼 언급", th: "กระทู้ Pantip" }, emoji: "💬", bg: "#8b5cf6", fg: "white" },
];

// 2026-10-03: Wongnai·Bookimed·Reddit·Naver 를 뺐다. master_db 에 Wongnai 4회,
// 나머지 셋은 0회다 — 데이터가 없는 플랫폼을 "교차 확인한다"고 보여주고 있었다.
// 구글 리뷰는 모든 클리닉에, HDmall 가격(1,164곳)·Pantip 언급(3,404곳)은 있는
// 곳에만 있다. 문구도 그 차이를 그대로 말한다.
const HAIR_EXTRA: Source[] = [];

const COPY: Record<Lang, { badge: string; sentencePre: string; platforms: string; sentencePost: string }> = {
  en: { badge: "Where the data comes from", sentencePre: "Every clinic is ranked from its Google reviews. ", platforms: " sources", sentencePost: " in all — HDmall prices and Pantip threads are added where a clinic has them." },
  ko: { badge: "데이터 출처", sentencePre: "모든 클리닉은 구글 후기로 순위를 매깁니다. 출처는 ", platforms: "곳", sentencePost: " — HDmall 가격과 Pantip 글은 있는 클리닉에만 붙습니다." },
  th: { badge: "ที่มาของข้อมูล", sentencePre: "ทุกคลินิกจัดอันดับจากรีวิว Google · รวม ", platforms: " แหล่ง", sentencePost: " — ราคา HDmall และกระทู้ Pantip แสดงเฉพาะคลินิกที่มีข้อมูล" },
};

export function SourcesStrip({ focus, accent, lang = "en" }: { focus: string; accent: string; lang?: Lang }) {
  const sources = focus === "hair" ? [...ALL_SOURCES, ...HAIR_EXTRA] : ALL_SOURCES;
  const t = COPY[lang] ?? COPY.en;
  return (
    <section className="bg-slate-50 border-y border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded" style={{ background: `${accent}15`, color: accent }}>
            {t.badge}
          </span>
          <p className="text-sm text-[var(--muted)]">
            {t.sentencePre}<strong className="text-[var(--fg)]">{sources.length}{t.platforms}</strong>{t.sentencePost}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {sources.map((s) => (
            <div
              key={s.name}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm"
              style={{ background: s.bg, color: s.fg }}
              title={s.blurb[lang] ?? s.blurb.en}
            >
              <span aria-hidden>{s.emoji}</span>
              <span>{s.name}</span>
              <span className="opacity-75 font-normal hidden sm:inline">· {s.blurb[lang] ?? s.blurb.en}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
