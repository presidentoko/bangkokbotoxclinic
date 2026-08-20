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
  { name: "Wongnai",     blurb: { en: "Thai reviews", ko: "태국 리뷰", th: "รีวิวไทย" }, emoji: "🍜", bg: "#FF1744", fg: "white" },
];

const HAIR_EXTRA: Source[] = [
  { name: "Bookimed", blurb: { en: "Medical tourism", ko: "의료관광", th: "ท่องเที่ยวเชิงการแพทย์" }, emoji: "🌍", bg: "#10b981", fg: "white" },
  { name: "Pantip",   blurb: { en: "Thai forums", ko: "태국 포럼", th: "ฟอรัมไทย" }, emoji: "💬", bg: "#8b5cf6", fg: "white" },
  { name: "Reddit",   blurb: { en: "Patient threads", ko: "환자 커뮤니티", th: "กระทู้ผู้ป่วย" }, emoji: "🔥", bg: "#ff4500", fg: "white" },
  { name: "Naver",    blurb: { en: "Korean blogs", ko: "한국 블로그", th: "บล็อกเกาหลี" }, emoji: "📝", bg: "#03c75a", fg: "white" },
];

const COPY: Record<Lang, { badge: string; sentencePre: string; platforms: string; sentencePost: string }> = {
  en: { badge: "Cross-platform aggregator", sentencePre: "Not just Google — we cross-reference ", platforms: " review platforms", sentencePost: " for every clinic." },
  ko: { badge: "다중 플랫폼 통합", sentencePre: "Google만이 아닙니다 — 클리닉마다 ", platforms: "개 리뷰 플랫폼", sentencePost: "을 교차 확인합니다." },
  th: { badge: "รวมข้อมูลข้ามแพลตฟอร์ม", sentencePre: "ไม่ใช่แค่ Google — เราตรวจสอบข้าม ", platforms: " แพลตฟอร์มรีวิว", sentencePost: " สำหรับทุกคลินิก" },
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
