import Link from "next/link";
import { topIngredientsForConcern } from "@/lib/data";
import type { Locale } from "@/lib/i18n";

const EFF_LABEL: Record<number, { th: string; en: string; color: string }> = {
  3: { th: "ประสิทธิภาพสูง", en: "Strong evidence", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  2: { th: "ประสิทธิภาพดี",  en: "Good evidence",   color: "text-amber-600  bg-amber-50  border-amber-200"  },
};

export function IngredientGuide({
  concern,
  locale,
}: {
  concern: string;
  locale: Locale;
}) {
  const items = topIngredientsForConcern(concern, 6, 2);
  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="font-serif-display text-xl sm:text-2xl font-semibold text-neutral-900">
          {locale === "th"
            ? "ส่วนผสมที่ควรมีสำหรับปัญหานี้"
            : "Key ingredients to look for"}
        </h2>
        <p className="text-sm text-neutral-500">
          {locale === "th"
            ? "งานวิจัยบอกว่าส่วนผสมเหล่านี้ได้ผลจริง — เลือกผลิตภัณฑ์ที่มีอยู่ในรายการส่วนผสม"
            : "Research-backed actives that actually work — look for these in the ingredient list."}
        </p>
      </div>

      {/* Horizontal scroll on mobile, 3-col grid on sm+ */}
      <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible snap-x snap-mandatory sm:snap-none">
        {items.map((ing) => {
          const name = locale === "th" ? ing.th_name || ing.en_name : ing.en_name || ing.th_name;
          const mechanism = locale === "th" ? ing.mechanism_th : ing.mechanism_en;
          const eff = EFF_LABEL[ing.efficacy] ?? EFF_LABEL[2];
          const stars = "★".repeat(ing.efficacy) + "☆".repeat(Math.max(0, 3 - ing.efficacy));

          return (
            <Link
              key={ing.inci}
              href={`/${locale}/ingredient/${ing.slug}`}
              className="flex-shrink-0 snap-start w-64 sm:w-auto flex flex-col rounded-2xl border border-[#efe1db] bg-white p-4 shadow-sm shadow-rose-50 hover:border-rose-300 hover:shadow-rose-100 transition-all group"
            >
              {/* Efficacy badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${eff.color}`}>
                  {locale === "th" ? eff.th : eff.en}
                </span>
                <span className="text-amber-500 text-sm font-bold">{stars}</span>
              </div>

              {/* Name */}
              <p className="font-semibold text-[#2b2222] text-sm group-hover:text-rose-600 transition-colors leading-snug mb-1.5">
                {name}
              </p>

              {/* Mechanism */}
              <p className="text-xs text-[#8a7a76] leading-relaxed flex-1 line-clamp-3">
                {mechanism}
              </p>

              {/* Footer: product count */}
              {ing.productCount > 0 && (
                <p className="mt-3 text-[10px] font-semibold text-rose-400 uppercase tracking-widest">
                  {ing.productCount} {locale === "th" ? "ผลิตภัณฑ์" : "products"} →
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
