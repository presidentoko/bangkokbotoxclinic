import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES, type Locale, t } from "@/lib/i18n";
import {
  registryProvinces,
  registryTotal,
  registrySources,
  registryGeneratedAt,
} from "@/lib/registry";

export const revalidate = false;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkoktopclinic.com";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const total = registryTotal();
  const provinces = registryProvinces().length;
  const title = `Every Hospital in Thailand — ${total.toLocaleString()} on the Official Register`;
  const description = `Browse all ${total.toLocaleString()} hospitals on Thailand's official register across ${provinces} provinces, with hospital code, type, sector and HA accreditation status for each.`;
  // The directory is rendered in English for every locale, so non-English
  // locales canonicalise to /en rather than publishing duplicate English
  // bodies under six URLs.
  const canonical = `/en/directory`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: `${SITE}${canonical}` },
    robots: locale === "en" ? undefined : { index: false, follow: true },
  };
}

export default async function DirectoryPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const provinces = registryProvinces();
  const total = registryTotal();
  const sources = registrySources();

  // Bangkok first (it is what most searches mean), then the rest by size.
  const bangkok = provinces.find((p) => p.slug === "bangkok");
  const rest = provinces.filter((p) => p.slug !== "bangkok");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href={`/${locale}`} className="hover:text-gray-900">
          {t(locale, "site_name")}
        </Link>
        <span className="mx-2">›</span>
        <span>Hospital directory</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Every hospital in Thailand
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          All {total.toLocaleString()} hospitals on Thailand&apos;s official register, across{" "}
          {provinces.length} provinces. Each entry carries its Ministry of Public Health hospital
          code, its type, whether it is public or private, and its HA accreditation status with the
          date the certificate expires.
        </p>
      </header>

      {bangkok && (
        <Link
          href={`/${locale}/directory/${bangkok.slug}`}
          className="block rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 mb-6 hover:border-blue-400 transition"
        >
          <div className="text-2xl font-bold">{bangkok.name_en}</div>
          <div className="text-gray-600">{bangkok.name_th}</div>
          <div className="mt-1 text-lg">
            <strong>{bangkok.count}</strong> registered hospitals →
          </div>
        </Link>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/${locale}/directory/${p.slug}`}
              className="flex items-baseline justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-blue-400 transition"
            >
              <span>
                <span className="font-semibold">{p.name_en}</span>
                <span className="block text-xs text-gray-500">{p.name_th}</span>
              </span>
              <span className="tabular-nums text-gray-600 shrink-0">{p.count}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <h2 className="font-bold mb-2">Where this comes from</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          {sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                {s.name}
              </a>{" "}
              — {s.provides}. Downloaded {s.downloaded}.
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          Register data compiled {registryGeneratedAt()}. Accreditation is granted by the Healthcare
          Accreditation Institute and lapses on the date shown; a lapsed or absent certificate is
          reported as such rather than hidden.
        </p>
      </section>
    </div>
  );
}
