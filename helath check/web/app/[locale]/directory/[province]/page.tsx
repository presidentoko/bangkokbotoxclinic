import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, type Locale, t } from "@/lib/i18n";
import {
  registryProvince,
  registryProvinces,
  registryHospitals,
  registrySources,
  haBadge,
  formatRegistryDate,
  type RegistryHospital,
} from "@/lib/registry";
import { getHospitals } from "@/lib/db";

export const revalidate = false;
export const dynamicParams = false;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bangkoktopclinic.com";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    registryProvinces().map((p) => ({ locale, province: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; province: string }>;
}): Promise<Metadata> {
  const { locale, province } = await params;
  const p = registryProvince(province);
  if (!p) return {};
  const title = `Hospitals in ${p.name_en} — All ${p.count} on the Official Register`;
  const description = `Every registered hospital in ${p.name_en} (${p.name_th}): hospital code, public or private, hospital type, and HA accreditation status with expiry date.`;
  const canonical = `/en/directory/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: `${SITE}${canonical}` },
    robots: locale === "en" ? undefined : { index: false, follow: true },
  };
}

const TONE: Record<string, string> = {
  green: "bg-green-100 text-green-800 border-green-300",
  blue: "bg-blue-100 text-blue-800 border-blue-300",
  amber: "bg-amber-100 text-amber-900 border-amber-300",
  gray: "bg-gray-100 text-gray-700 border-gray-300",
};

function Row({ h, locale, ourPage }: { h: RegistryHospital; locale: Locale; ourPage?: { slug: string; name: string } }) {
  const badge = haBadge(h.ha_level);
  const expiry = formatRegistryDate(h.ha_expires_on);
  return (
    <li
      id={h.hcode ? `h${h.hcode}` : undefined}
      className="border-t border-gray-200 py-3 first:border-t-0"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-lg font-semibold">{h.name_th}</span>
        {ourPage && (
          <Link href={`/${locale}/hospital/${ourPage.slug}`} className="text-blue-700 hover:underline">
            {ourPage.name} — prices &amp; details →
          </Link>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${TONE[badge.tone]}`}>
          {badge.label}
        </span>
        {h.type_en && <span className="text-gray-600">{h.type_en}</span>}
        {h.beds && <span className="text-gray-600">{h.beds} beds</span>}
        {h.hcode && <span className="text-gray-500">Hospital code {h.hcode}</span>}
        {expiry && (
          <span className={h.ha_current === false ? "text-amber-800" : "text-gray-500"}>
            {h.ha_current === false ? "Certificate expired " : "Valid to "}
            {expiry}
          </span>
        )}
      </div>
      {(h.tel || h.website || h.address_th) && (
        <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-gray-600">
          {h.tel && (
            <a href={`tel:${h.tel.replace(/\s+/g, "")}`} className="text-blue-700 hover:underline">
              {h.tel}
            </a>
          )}
          {h.website && (
            <a
              href={h.website.startsWith("http") ? h.website : `https://${h.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              {h.website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {h.address_th && <span className="text-gray-500">{h.address_th}</span>}
        </div>
      )}
    </li>
  );
}

export default async function ProvinceDirectoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; province: string }>;
}) {
  const { locale, province } = await params;
  const p = registryProvince(province);
  if (!p) notFound();

  const rows = registryHospitals(province);
  const ours = await getHospitals();

  // Link a register row to one of our pages when the matcher paired them.
  const { registryMatch } = await import("@/lib/registry");
  const ourByHcode = new Map<string, { slug: string; name: string }>();
  for (const h of ours) {
    const m = registryMatch(h.slug);
    if (m?.hcode) ourByHcode.set(m.hcode, { slug: h.slug, name: h.name });
  }

  const publicRows = rows.filter((h) => h.sector !== "private");
  const privateRows = rows.filter((h) => h.sector === "private");
  const accredited = rows.filter((h) => h.ha_level === "standard" || h.ha_level === "advanced").length;
  const withPages = rows.filter((h) => h.hcode && ourByHcode.has(h.hcode)).length;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href={`/${locale}`} className="hover:text-gray-900">
          {t(locale, "site_name")}
        </Link>
        <span className="mx-2">›</span>
        <Link href={`/${locale}/directory`} className="hover:text-gray-900">
          Directory
        </Link>
        <span className="mx-2">›</span>
        <span>{p.name_en}</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Hospitals in {p.name_en}
        </h1>
        <p className="text-gray-600">{p.name_th}</p>
        <p className="mt-3 text-lg text-gray-700">
          <strong>{rows.length}</strong> hospitals on the official register ·{" "}
          <strong>{accredited}</strong> HA-accredited · <strong>{privateRows.length}</strong> private
          {withPages > 0 && (
            <>
              {" "}
              · <strong>{withPages}</strong> with a full page here
            </>
          )}
        </p>
      </header>

      {privateRows.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">Private hospitals</h2>
          <ul className="rounded-2xl border border-gray-200 bg-white px-4">
            {privateRows.map((h) => (
              <Row
                key={`${h.hcode}-${h.name_th}`}
                h={h}
                locale={locale}
                ourPage={h.hcode ? ourByHcode.get(h.hcode) : undefined}
              />
            ))}
          </ul>
        </section>
      )}

      {publicRows.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-2">Public and university hospitals</h2>
          <ul className="rounded-2xl border border-gray-200 bg-white px-4">
            {publicRows.map((h) => (
              <Row
                key={`${h.hcode}-${h.name_th}`}
                h={h}
                locale={locale}
                ourPage={h.hcode ? ourByHcode.get(h.hcode) : undefined}
              />
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
        <h2 className="font-bold mb-2">About this list</h2>
        <p className="mb-2">
          Names are given as they appear on the register, in Thai. &quot;HA accredited&quot; means the
          Healthcare Accreditation Institute has certified the hospital against the national hospital
          standard; the expiry date is the one on the certificate. A hospital shown as on the register
          but not accredited is licensed and operating — accreditation is a separate, voluntary
          quality programme.
        </p>
        <ul className="space-y-1">
          {registrySources().map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-sm">
        <Link href={`/${locale}/directory`} className="text-blue-700 hover:underline">
          ← All {registryProvinces().length} provinces
        </Link>
      </p>
    </div>
  );
}
