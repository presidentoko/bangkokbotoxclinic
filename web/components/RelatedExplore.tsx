// Auto internal backlinks — 카테고리, 지역, 카테고리×지역 콤보 long-tail.
// SEO: 페이지 간 link equity 흐름 + Google의 사이트 구조 이해 향상.
// AEO: LLM이 사이트 전체 topical authority 파악 용이.
import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import { findGuide } from "@/lib/guides";

// 클리닉 카테고리 → 관련 가이드 슬러그 목록. 가이드 당 최대 2개 노출.
const CAT_TO_GUIDES: Record<string, string[]> = {
  botox:  ["bangkok-botox-guide", "botox-price-bangkok-2026"],
  filler: ["bangkok-filler-guide"],
  hifu:   ["hifu-ultherapy-bangkok-cost"],
  dental: ["dental-implants-bangkok-cost", "veneers-bangkok-price", "teeth-whitening-bangkok"],
  hair:   ["fue-hair-transplant-bangkok-cost", "dhi-vs-fue-bangkok"],
};

export function RelatedExplore({ clinic, lang = "en" }: {
  clinic: Clinic;
  lang?: "en" | "th";
}) {
  const isTH = lang === "th";
  const prefix = isTH ? "/th" : "";

  const districtSlug = clinic.district
    ? clinic.district.toLowerCase().replace(/\s+/g, "-")
    : null;
  const citySlug = clinic.city_slug || (clinic.city_label || "bangkok").toLowerCase().replace(/\s+/g, "-");

  // 카테고리 × 지역 콤보 long-tail links — 가장 SEO 가치 높음
  const comboLinks = clinic.categories.slice(0, 4).flatMap((cat) => {
    const links = [{
      href: `${prefix}/c/${cat}`,
      label: isTH
        ? `${CATEGORY_LABELS[cat] ?? cat} ในกรุงเทพ`
        : `${CATEGORY_LABELS[cat] ?? cat} clinics in Bangkok`,
    }];
    if (districtSlug) {
      links.push({
        href: `${prefix}/c/${cat}/${districtSlug}`,
        label: isTH
          ? `${CATEGORY_LABELS[cat] ?? cat} ใน ${clinic.district}`
          : `${CATEGORY_LABELS[cat] ?? cat} in ${clinic.district}`,
      });
    }
    return links;
  });

  // 지역 페이지
  const districtLink = districtSlug ? {
    href: `${prefix}/d/${districtSlug}`,
    label: isTH ? `คลินิกทั้งหมดใน ${clinic.district}` : `All clinics in ${clinic.district}`,
  } : null;

  // 도시 페이지
  const cityLabel = clinic.city_label || "Bangkok";
  const cityLink = {
    href: `${prefix}/city/${citySlug}`,
    label: isTH ? `คลินิกใน ${cityLabel}` : `Clinics in ${cityLabel}`,
  };

  // 관련 가이드 — 클리닉 카테고리 기반, 중복 제거, 최대 3개
  const guideLinks: { href: string; title: string }[] = [];
  const seenSlugs = new Set<string>();
  for (const cat of clinic.categories) {
    for (const slug of CAT_TO_GUIDES[cat] ?? []) {
      if (seenSlugs.has(slug)) continue;
      const g = findGuide(slug);
      if (!g) continue;
      seenSlugs.add(slug);
      guideLinks.push({ href: `/guide/${slug}`, title: g.title });
      if (guideLinks.length >= 3) break;
    }
    if (guideLinks.length >= 3) break;
  }

  return (
    <section
      className="bg-white border border-[var(--border)] rounded-xl p-5"
      aria-label={isTH ? "ดูเพิ่มเติม" : "Explore more"}
    >
      <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
        <span aria-hidden>🔍</span>
        {isTH ? "ดูเพิ่มเติม" : "Explore more"}
      </h2>

      <div className="grid sm:grid-cols-2 gap-2">
        {comboLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm text-[var(--accent)] hover:underline py-1.5 flex items-center gap-1.5"
          >
            <span aria-hidden className="text-[var(--muted)] text-xs">→</span>
            {l.label}
          </a>
        ))}
        {districtLink && (
          <a
            href={districtLink.href}
            className="text-sm text-[var(--accent)] hover:underline py-1.5 flex items-center gap-1.5"
          >
            <span aria-hidden className="text-[var(--muted)] text-xs">→</span>
            {districtLink.label}
          </a>
        )}
        <a
          href={cityLink.href}
          className="text-sm text-[var(--accent)] hover:underline py-1.5 flex items-center gap-1.5"
        >
          <span aria-hidden className="text-[var(--muted)] text-xs">→</span>
          {cityLink.label}
        </a>
      </div>

      {guideLinks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)] mb-2">
            {isTH ? "คู่มือที่เกี่ยวข้อง" : "Related guides"}
          </div>
          <div className="space-y-1.5">
            {guideLinks.map((g) => (
              <a
                key={g.href}
                href={g.href}
                className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1.5"
              >
                <span aria-hidden className="text-[var(--muted)] text-xs">📖</span>
                {g.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
