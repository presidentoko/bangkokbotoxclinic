import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES, type Locale, t } from "@/lib/i18n";
import { getHospitals } from "@/lib/db";
import {
  registryHospitals,
  registryProvinces,
  registryMatch,
  isMedicalFacility,
  haBadge,
} from "@/lib/registry";

// A findable page for name lookup. The nav box was the only way to look a
// hospital up, it matched English substrings only, and there was no page behind
// it — a reader who typed a Thai name, or the same words in a different order,
// got nothing and no explanation. The index is built here and shipped with the
// page, so matching happens locally: it covers the register's Thai names, and
// the province links below work with JavaScript off.
export const revalidate = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export const metadata: Metadata = {
  title: "Find a hospital in Thailand by name",
  description:
    "Search every hospital on Thailand's official register plus every hospital we hold prices for, by English or Thai name.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const ours = (await getHospitals()).filter((h) => isMedicalFacility(h.slug));
  const provinces = registryProvinces();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href={`/${locale}`} className="hover:text-gray-900">
          {t(locale, "site_name")}
        </Link>
        <span className="mx-2">›</span>
        <span>Find a hospital</span>
      </nav>

      <h1 className="text-3xl font-bold tracking-tight mb-3">Find a hospital by name</h1>
      <p className="text-lg text-gray-600 mb-6">
        Type the hospital&apos;s name in English or Thai. Results cover the{" "}
        {ours.length} hospitals we hold details and prices for, and every hospital on the{" "}
        <Link href={`/${locale}/directory`} className="text-blue-700 hover:underline">
          national register
        </Link>
        .
      </p>

      <SearchClient locale={locale} />

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">Browse by province</h2>
        <ul className="flex flex-wrap gap-2">
          {provinces.slice(0, 24).map((p) => (
            <li key={p.slug}>
              <Link
                href={`/${locale}/directory/${p.slug}`}
                className="inline-block rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm hover:border-blue-400"
              >
                {p.name_en} <span className="text-gray-500">{p.count}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm">
          <Link href={`/${locale}/directory`} className="text-blue-700 hover:underline">
            All {provinces.length} provinces →
          </Link>
        </p>
      </section>
    </div>
  );
}

// The index is built at build time and shipped to the client as one array, so
// typing is instant and works offline once the page is loaded. It carries the
// Thai name from the register, which is what makes a Thai-language search work
// at all.
async function SearchClient({ locale }: { locale: Locale }) {
  const ours = (await getHospitals()).filter((h) => isMedicalFacility(h.slug));
  const entries: {
    n: string;
    th: string | null;
    p: string | null;
    href: string;
    sub: string;
    ha: string | null;
  }[] = [];

  const claimed = new Set<string>();
  for (const h of ours) {
    const m = registryMatch(h.slug);
    if (m?.hcode) claimed.add(m.hcode);
    entries.push({
      n: h.name,
      th: m?.name_th ?? null,
      p: h.city,
      href: `/${locale}/hospital/${h.slug}`,
      sub: [h.city, h.package_count ? `${h.package_count} packages` : null]
        .filter(Boolean)
        .join(" · "),
      ha: m ? haBadge(m.ha_level).label : null,
    });
  }

  for (const p of registryProvinces()) {
    for (const r of registryHospitals(p.slug)) {
      if (r.hcode && claimed.has(r.hcode)) continue;
      entries.push({
        n: r.name_th,
        th: r.name_th,
        p: r.province_en,
        href: `/${locale}/directory/${r.province_slug}${r.hcode ? `#h${r.hcode}` : ""}`,
        sub: [r.province_en, r.type_en].filter(Boolean).join(" · "),
        ha: haBadge(r.ha_level).label,
      });
    }
  }

  const { HospitalNameSearch } = await import("@/app/components/HospitalNameSearch");
  return <HospitalNameSearch entries={entries} />;
}
