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
import { ProvinceFacts } from "@/app/components/ProvinceFacts";
import { provinceStats } from "@/lib/provinceStats";
import { CITY_ROUTE_SLUGS } from "@/lib/citySlug";

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
  const rows = registryHospitals(province);
  const withContact = rows.filter((h) => h.tel || h.address_th).length;
  // Only claim addresses and phone numbers where the province has them: 438
  // hospitals gained them on 2026-10-23, the community hospitals did not.
  const description = withContact
    ? `Every registered hospital in ${p.name_en} (${p.name_th}) — address and phone for ${withContact} of ${rows.length}, public or private, hospital type, and HA accreditation status with expiry date.`
    : `Every registered hospital in ${p.name_en} (${p.name_th}): hospital code, public or private, hospital type, and HA accreditation status with expiry date.`;
  const canonical = `/en/directory/${p.slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: `${SITE}${canonical}` },
    // Canonical only. This used to add noindex on the five other locales as
    // well, which tells Google both "this is a copy of /en" and "drop this
    // page" at once — a contradiction it resolves by ignoring the canonical,
    // so the signal the copy earned goes nowhere.
  };
}

const TONE: Record<string, string> = {
  green: "bg-green-100 text-green-800 border-green-300",
  blue: "bg-blue-100 text-blue-800 border-blue-300",
  amber: "bg-amber-100 text-amber-900 border-amber-300",
  gray: "bg-gray-100 text-gray-700 border-gray-300",
};

/**
 * The English half of a bilingual Google title — "Benjarom Hospital
 * โรงพยาบาลเบญจรมย์" — which the register, Thai-only, does not have. Null when
 * Google's title is Thai alone.
 */
function latinName(title: string | null | undefined): string | null {
  if (!title) return null;
  // The longest run that starts and ends on a letter or digit, so the
  // separators Google puts between the halves ("... - Bangkok Hospital
  // Surat", "Thungsong Hospital (") stay out of it. Six letters minimum: a
  // bracketed initialism like "(CAH" is not a name a reader can use.
  const runs = title.match(/[A-Za-z0-9][A-Za-z0-9 .,&'’-]*[A-Za-z0-9.]/g) ?? [];
  const best = runs.sort((a, b) => b.length - a.length)[0]?.trim();
  return best && (best.match(/[A-Za-z]/g)?.length ?? 0) >= 6 ? best : null;
}

/**
 * One line for a week of opening hours, or null when one line would misstate
 * it. Most hospitals on the register are open around the clock; the ones that
 * are not differ by day, and those say nothing here rather than something
 * wrong.
 */
function hoursSummary(oh: RegistryHospital["opening_hours"]): string | null {
  if (!oh || oh.length < 7) return null;
  const all = new Set(oh.map((d) => d.hours));
  if (all.size !== 1) return null;
  const only = [...all][0];
  return /24/.test(only) ? "Open 24 hours" : null;
}

function Row({ h, locale, ourPage }: { h: RegistryHospital; locale: Locale; ourPage?: { slug: string; name: string } }) {
  const badge = haBadge(h.ha_level);
  const expiry = formatRegistryDate(h.ha_expires_on);
  const lapsed =
    h.ha_current === false &&
    (h.ha_level === "none" || h.ha_level === "renewing" || h.ha_level === "in-progress");
  return (
    <li
      id={h.hcode ? `h${h.hcode}` : undefined}
      className="border-t border-gray-200 py-3 first:border-t-0"
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-lg font-semibold">{h.name_th}</span>
        {latinName(h.name_google) && <span className="text-gray-600">{latinName(h.name_google)}</span>}
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
          <span className={lapsed ? "text-amber-800" : "text-gray-500"}>
            {/* See VerifiedStrip: the register's status and its certificate
                date can disagree, and the status is the one to trust. */}
            {lapsed ? "Certificate lapsed " : h.ha_current === false ? "Last certificate " : "Valid to "}
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
          {h.google_place_id && (
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${h.google_place_id}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-blue-700 hover:underline"
            >
              Map
            </a>
          )}
          {hoursSummary(h.opening_hours) && (
            <span className="text-gray-500">{hoursSummary(h.opening_hours)}</span>
          )}
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
  const pstats = await provinceStats(province);
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

      {pstats && (
        <ProvinceFacts
          stats={pstats}
          locale={locale}
          cityHref={CITY_ROUTE_SLUGS.has(province) ? `/${locale}/city/${province}` : null}
        />
      )}

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
        <p className="mb-2">
          Addresses, phone numbers and map links were added on 23 October 2026 from Google Maps for the
          private, regional, general and university hospitals on the register, each checked against the
          register&apos;s own name and province before it was kept. Where a hospital shows none, its
          Google listing could not be matched with confidence, or it has not been looked up yet.
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

      {/*
        The list as data. Until 2026-10-23 these 77 pages carried no
        structured data at all — a page whose whole content is a list of
        hospitals told a crawler nothing about any of them. Only rows with an
        address or a phone become Hospital nodes; a node with a name and
        nothing else is a claim with no content.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Hospitals in ${p.name_en} on Thailand's national register`,
            url: `${SITE}/en/directory/${p.slug}`,
            numberOfItems: rows.length,
            itemListElement: rows
              .filter((h) => h.tel || h.address_th)
              .map((h, i) => {
                const page = h.hcode ? ourByHcode.get(h.hcode) : undefined;
                const url = page
                  ? `${SITE}/en/hospital/${page.slug}`
                  : h.website
                    ? (h.website.startsWith("http") ? h.website : `https://${h.website}`)
                    : null;
                return {
                  "@type": "ListItem",
                  position: i + 1,
                  item: {
                    "@type": "Hospital",
                    name: latinName(h.name_google) ?? h.name_th,
                    alternateName: h.name_th,
                    ...(url ? { url } : {}),
                    ...(h.address_th
                      ? { address: { "@type": "PostalAddress", streetAddress: h.address_th, addressRegion: p.name_en, addressCountry: "TH" } }
                      : {}),
                    ...(h.tel ? { telephone: h.tel } : {}),
                    ...(h.lat && h.lng ? { geo: { "@type": "GeoCoordinates", latitude: h.lat, longitude: h.lng } } : {}),
                    ...(h.beds ? { numberOfBeds: h.beds } : {}),
                    ...(h.google_place_id ? { hasMap: `https://www.google.com/maps/place/?q=place_id:${h.google_place_id}` } : {}),
                  },
                };
              }),
          }),
        }}
      />

      <p className="mt-6 text-sm">
        <Link href={`/${locale}/directory`} className="text-blue-700 hover:underline">
          ← All {registryProvinces().length} provinces
        </Link>
      </p>
    </div>
  );
}
