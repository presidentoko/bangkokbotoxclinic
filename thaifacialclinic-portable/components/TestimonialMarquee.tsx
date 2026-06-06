import type { Clinic, Lang } from "@/lib/types";

const HEAD: Record<Lang, string> = {
  en: "Real voices from real patients",
  ko: "진짜 환자들의 진짜 후기",
  th: "เสียงจริงจากผู้ป่วยจริง",
  zh: "真实患者的真实评价",
  ar: "أصوات حقيقية من مرضى حقيقيين",
};

const SUB: Record<Lang, string> = {
  en: "Aggregated from Google · Reddit · Naver · Pantip. We do not edit or remove negative reviews.",
  ko: "Google · Reddit · Naver · 판팁 통합. 부정 리뷰 편집/삭제 안 함.",
  th: "รวบรวมจาก Google · Reddit · Naver · Pantip",
  zh: "整合 Google · Reddit · Naver · Pantip",
  ar: "مجمعة من Google و Reddit و Naver و Pantip",
};

const SRC_COLOR: Record<string, string> = {
  google: "bg-blue-100 text-blue-800 ring-blue-200",
  reddit: "bg-orange-100 text-orange-800 ring-orange-200",
  naver: "bg-green-100 text-green-800 ring-green-200",
  pantip: "bg-violet-100 text-violet-800 ring-violet-200",
  youtube: "bg-red-100 text-red-800 ring-red-200",
  bookimed: "bg-sky-100 text-sky-800 ring-sky-200",
};

function srcKey(source: string): string {
  const s = source.toLowerCase();
  for (const k of Object.keys(SRC_COLOR)) if (s.includes(k)) return k;
  return "google";
}

export default function TestimonialMarquee({ clinics, lang }: { clinics: Clinic[]; lang: Lang }) {
  // Pick interesting reviews: 4-5 star Google + diverse sources, longer texts
  const samples: { text: string; source: string; reviewer: string; clinic: string; rating: number | null; }[] = [];
  for (const c of clinics) {
    for (const r of c.reviews_sample || []) {
      if (!r.text || r.text.length < 60 || r.text.length > 240) continue;
      if (r.rating !== null && r.rating < 4) continue;
      samples.push({ text: r.text, source: r.source, reviewer: r.reviewer || "Anon", clinic: c.name, rating: r.rating });
      if (samples.length > 30) break;
    }
    if (samples.length > 30) break;
  }
  if (samples.length === 0) return null;

  // Two rows for staggered marquee
  const row1 = samples.slice(0, Math.ceil(samples.length / 2));
  const row2 = samples.slice(Math.ceil(samples.length / 2));

  return (
    <section className="space-y-6">
      <div className="text-center">
        <div className="eyebrow justify-center">Patient voices</div>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">{HEAD[lang]}</h2>
        <p className="mt-2 text-sm muted">{SUB[lang]}</p>
      </div>

      {/* Marquee rows — overflow hidden, infinite scroll */}
      <div className="-mx-4 space-y-4 overflow-hidden">
        {[row1, row2].map((row, ri) => (
          <div key={ri} className="relative">
            <div className="marquee-track" style={{ animationDirection: ri === 1 ? "reverse" : "normal" }}>
              {[...row, ...row].map((r, i) => (
                <article key={`${ri}-${i}`} className="w-[320px] shrink-0 card p-4 sm:w-[360px]">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${SRC_COLOR[srcKey(r.source)]}`}>
                      {r.source}
                    </span>
                    {r.rating !== null && (
                      <span className="text-xs font-bold tabular-nums text-gold-600">{"★".repeat(Math.round(r.rating))}</span>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed">
                    "{r.text}"
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t pt-3 text-[11px]" style={{ borderColor: "rgb(var(--border))" }}>
                    <span className="font-semibold">— {r.reviewer}</span>
                    <span className="muted truncate max-w-[60%] text-right">{r.clinic}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
