// Two-row marquee of patient quotes — strong "real voices" signal.
// Falls back to nothing if no usable reviews. Pure server component.

import type { Clinic } from "@/lib/types";

type Lang = "en" | "ko" | "th";
const COPY: Record<Lang, { eyebrow: string; heading: string; sub: string }> = {
  en: { eyebrow: "Patient voices", heading: "Real voices from real patients", sub: "Aggregated from Google · HDmall · Wongnai · Pantip. We do not edit or remove negative reviews." },
  ko: { eyebrow: "환자의 목소리", heading: "실제 환자들의 진짜 목소리", sub: "Google · HDmall · Wongnai · Pantip에서 수집. 부정 리뷰를 편집하거나 삭제하지 않습니다." },
  th: { eyebrow: "เสียงจากผู้ป่วย", heading: "เสียงจริงจากผู้ป่วยจริง", sub: "รวบรวมจาก Google · HDmall · Wongnai · Pantip เราไม่แก้ไขหรือลบรีวิวเชิงลบ" },
};

export default function TestimonialMarquee({ clinics, lang = "en" }: { clinics: Clinic[]; lang?: Lang }) {
  const t = COPY[lang] ?? COPY.en;
  const samples: { text: string; reviewer: string; clinic: string; rating: number }[] = [];

  for (const c of clinics) {
    for (const r of c.sample_reviews_en || []) {
      if (!r.text || r.text.length < 60 || r.text.length > 240) continue;
      if (r.rating < 4) continue;
      samples.push({ text: r.text, reviewer: r.author || "Anon", clinic: c.name, rating: r.rating });
      if (samples.length > 30) break;
    }
    if (samples.length > 30) break;
  }

  if (samples.length < 4) return null;

  const row1 = samples.slice(0, Math.ceil(samples.length / 2));
  const row2 = samples.slice(Math.ceil(samples.length / 2));

  return (
    <section className="space-y-6 py-10">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">{t.eyebrow}</div>
        <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">{t.heading}</h2>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-2xl mx-auto">
          {t.sub}
        </p>
      </div>

      <div className="-mx-4 space-y-4 overflow-hidden">
        {[row1, row2].map((row, ri) => (
          <div key={ri} className="relative">
            <div className="marquee-track" style={{ animationDirection: ri === 1 ? "reverse" : "normal" }}>
              {[...row, ...row].map((r, i) => (
                <article key={`${ri}-${i}`} className="w-[320px] shrink-0 rounded-2xl border bg-white p-4 sm:w-[360px]" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                      Google
                    </span>
                    <span className="text-xs font-bold tabular-nums text-yellow-600">{"★".repeat(Math.round(r.rating))}</span>
                  </div>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <div className="mt-3 flex items-center justify-between border-t pt-3 text-[11px]" style={{ borderColor: "var(--border)" }}>
                    <span className="font-semibold">— {r.reviewer}</span>
                    <span className="text-[var(--muted)] truncate max-w-[60%] text-right">{r.clinic}</span>
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
