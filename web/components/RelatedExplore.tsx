// Auto internal backlinks — 카테고리, 지역, 카테고리×지역 콤보 long-tail.
// SEO: 페이지 간 link equity 흐름 + Google의 사이트 구조 이해 향상.
// AEO: LLM이 사이트 전체 topical authority 파악 용이.
import type { Clinic } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

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
  const cityLink = {
    href: `${prefix}/city/${citySlug}`,
    label: isTH ? `คลินิกใน ${clinic.city_label}` : `Clinics in ${clinic.city_label}`,
  };

  // 비교 페이지 (with top trust clinics in same category)
  // — similar clinics 컴포넌트가 이미 /compare/X/Y 링크 만들어줌

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
    </section>
  );
}
