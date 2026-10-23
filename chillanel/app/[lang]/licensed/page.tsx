// 정부 허가 확인된 스파·마사지 목록 (2026-10-22). 구글 지도에는 없는 정보 —
// 태국 보건부(สบส.) 공개 명단과 장소를 대조한 결과(scripts/match_spa_licenses.py).
// "여기 없는 곳 = 무허가" 로 읽히지 않게 인트로에서 분명히 말한다.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tFor } from "@/lib/i18n";
import { isLang, SITE, hreflangAlternates, cityLabel, localeFor, ogLocale, type Lang } from "@/lib/site";
import { listCities, loadCity } from "@/lib/data";
import { isRelevantCategory } from "@/lib/categories";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { spaLicenseFor, SPA_LICENSE_SOURCE } from "@/components/LicenseCheck";

const COPY: Record<Lang, {
  title: string; intro: string; notListed: string; source: string; licence: string;
  spa: string; massage: string; count: string;
}> = {
  en: {
    title: "Government-licensed spas & massage shops",
    intro: "Every place below matches a record in the Ministry of Public Health's register of licensed health establishments — something no star rating tells you.",
    notListed: "A place missing from this list is not necessarily unlicensed: the register lists Thai registered names, and we only show matches we are sure of.",
    source: "Source: Department of Health Service Support open register, dated",
    licence: "Licence",
    spa: "Spa",
    massage: "Health massage",
    count: "{n} licensed places",
  },
  th: {
    title: "สปาและร้านนวดที่ได้รับอนุญาตจากกระทรวงสาธารณสุข",
    intro: "ทุกร้านในหน้านี้ตรงกับรายชื่อสถานประกอบการเพื่อสุขภาพที่ได้รับอนุญาตของกระทรวงสาธารณสุข — ข้อมูลที่ดาวรีวิวบอกไม่ได้",
    notListed: "ร้านที่ไม่อยู่ในรายการนี้ไม่ได้แปลว่าไม่มีใบอนุญาต เราแสดงเฉพาะร้านที่จับคู่ได้แน่นอนเท่านั้น",
    source: "ที่มา: ข้อมูลเปิดของกรมสนับสนุนบริการสุขภาพ ข้อมูล ณ",
    licence: "ใบอนุญาต",
    spa: "สปา",
    massage: "นวดเพื่อสุขภาพ",
    count: "{n} ร้านที่ได้รับอนุญาต",
  },
  ko: {
    title: "태국 정부 허가 확인된 스파·마사지",
    intro: "아래 업소는 모두 태국 보건부의 보건업소 허가 명단과 일치합니다 — 별점으로는 알 수 없는 정보입니다.",
    notListed: "이 목록에 없다고 무허가라는 뜻은 아닙니다. 명단은 태국어 등록 상호로 되어 있어, 확실히 일치한 곳만 보여 드립니다.",
    source: "출처: 태국 보건서비스지원국 공개 명단, 기준",
    licence: "허가",
    spa: "스파",
    massage: "건강 마사지",
    count: "허가 확인 {n}곳",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const c = COPY[lang];
  return {
    title: `${c.title} — ${SITE.name}`,
    description: c.intro,
    alternates: {
      canonical: `/${lang}/licensed`,
      languages: hreflangAlternates((l) => `/${l}/licensed`),
    },
    openGraph: { url: `${SITE.origin}/${lang}/licensed`, siteName: SITE.name, locale: ogLocale(lang), type: "website", images: [`${SITE.origin}/opengraph-image`] },
  };
}

export default async function LicensedPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = tFor(lang);
  const c = COPY[lang];
  const locale = localeFor(lang);

  const cities = listCities()
    .map((city) => ({
      city,
      rows: loadCity(city).places
        .filter((p) => isRelevantCategory(p.primaryType))
        .map((p) => ({ place: p, lic: spaLicenseFor(p.id) }))
        .filter((r): r is { place: typeof r.place; lic: NonNullable<typeof r.lic> } => r.lic != null)
        .sort((a, b) => (b.place.reviewCount ?? 0) - (a.place.reviewCount ?? 0)),
    }))
    .filter((x) => x.rows.length > 0);
  const total = cities.reduce((n, x) => n + x.rows.length, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Breadcrumbs items={[{ name: t.nav.home, href: `/${lang}` }, { name: c.title, href: `/${lang}/licensed` }]} />
      <h1 className="text-3xl sm:text-4xl font-black mb-3 tracking-tight">✅ {c.title}</h1>
      <p className="text-muted mb-2 max-w-xl leading-relaxed">{c.intro}</p>
      <p className="text-muted text-sm mb-2 max-w-xl leading-relaxed">{c.notListed}</p>
      <p className="text-xs text-muted mb-10">
        <a href={SPA_LICENSE_SOURCE.url} target="_blank" rel="noopener noreferrer" className="underline">
          {c.source} {SPA_LICENSE_SOURCE.asOf}
        </a>{" "}
        · {c.count.replace("{n}", total.toLocaleString(locale))}
      </p>

      <div className="space-y-10">
        {cities.map(({ city, rows }) => (
          <section key={city}>
            <h2 className="font-display italic text-2xl mb-4">
              {cityLabel(city)} <span className="text-base not-italic text-muted">· {rows.length}</span>
            </h2>
            <ul className="divide-y divide-border rounded-2xl border border-border">
              {rows.map(({ place, lic }) => (
                <li key={place.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/${lang}/place/${place.id}`} className="font-semibold hover:text-accent">
                      {place.name}
                    </Link>
                    <div className="text-xs text-muted mt-0.5">
                      {lic.service_type === "spa" ? c.spa : c.massage} · {c.licence}{" "}
                      <span className="font-mono">{lic.license_no}</span>
                    </div>
                  </div>
                  {place.rating != null && (
                    <div className="text-sm tabular-nums text-right shrink-0">
                      ★ {place.rating.toFixed(1)}
                      <div className="text-xs text-muted">{(place.reviewCount ?? 0).toLocaleString(locale)}</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
