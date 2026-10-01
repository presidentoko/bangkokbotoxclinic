import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES, type Locale, t, localeAlternates } from "@/lib/i18n";
import { DATA_GENERATED_AT } from "@/lib/db";
import { EDITORIAL_POLICY, publisher } from "@/lib/publisher";
import { registrySources, registryTotal, registryGeneratedAt } from "@/lib/registry";

export const revalidate = false;
export const dynamicParams = false;

const SITE = "https://www.bangkoktopclinic.com";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Who publishes this site, and how the prices are collected",
    description:
      "Who runs BangkokCheckup, where every price comes from, what the national-register badges mean, and what this site does not do. No sponsored listings, no paid placement.",
    // The body is English only, so the five other locales canonicalise to /en
    // (localeAlternates reads the one route table) and are kept out of the
    // index rather than published as five self-canonical copies.
    alternates: localeAlternates(locale, "/editorial"),
    robots: locale === "en" ? undefined : { index: false, follow: true },
  };
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function EditorialPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const p = publisher();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <nav className="text-sm text-slate-500 mb-4">
        <Link href={`/${locale}`} className="hover:text-slate-900">
          {t(locale, "site_name")}
        </Link>
        <span className="mx-2">›</span>
        <span>Editorial policy</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        Who publishes this site, and how the prices are collected
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        This page exists so that nothing here has to be taken on trust. Each claim below names the
        mechanism behind it, and the figures come from the data the site is built on.
      </p>

      {p.name ? (
        <section className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Publisher
          </h2>
          <p className="text-xl font-bold">{p.name}</p>
          {p.role && <p className="text-slate-700">{p.role}</p>}
          {p.location && <p className="text-slate-500 text-sm mt-0.5">{p.location}</p>}
          {p.background && <p className="mt-3 text-slate-700 leading-relaxed">{p.background}</p>}
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {p.profile && (
              <a
                href={p.profile}
                target="_blank"
                rel="noopener noreferrer me"
                className="text-blue-700 hover:underline"
              >
                Public profile →
              </a>
            )}
            {p.contact && (
              <a
                href={p.contact.includes("@") ? `mailto:${p.contact}` : p.contact}
                className="text-blue-700 hover:underline"
              >
                Contact the publisher
              </a>
            )}
          </p>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Publisher
          </h2>
          <p className="text-slate-700">
            This site is independently operated by one person and carries no advertising. Reach the
            operator through the{" "}
            <Link href={`/${locale}/enquiry`} className="text-blue-700 hover:underline">
              contact page
            </Link>
            .
          </p>
        </section>
      )}

      <div className="space-y-7">
        {EDITORIAL_POLICY.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold mb-2">{s.heading}</h2>
            <p className="text-slate-700 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="font-bold mb-3">Data on this site, and when it was built</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex flex-wrap justify-between gap-2 border-b border-slate-200 pb-1.5">
            <dt className="text-slate-600">Price and hospital dataset</dt>
            <dd className="font-semibold">{fmtDate(DATA_GENERATED_AT)}</dd>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-b border-slate-200 pb-1.5">
            <dt className="text-slate-600">
              National hospital register ({registryTotal().toLocaleString()} hospitals)
            </dt>
            <dd className="font-semibold">{fmtDate(registryGeneratedAt())}</dd>
          </div>
        </dl>
        <h3 className="font-bold mt-4 mb-2 text-sm">Register sources</h3>
        <ul className="space-y-1.5 text-sm text-slate-700">
          {registrySources().map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                {s.name}
              </a>{" "}
              — {s.provides}. Downloaded {s.downloaded}.
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-8 text-sm text-slate-600">
        See also the{" "}
        <Link href={`/${locale}/directory`} className="text-blue-700 hover:underline">
          national hospital directory
        </Link>
        , the{" "}
        <Link href={`/${locale}/about`} className="text-blue-700 hover:underline">
          about page
        </Link>{" "}
        and{" "}
        <Link href={`/${locale}/enquiry`} className="text-blue-700 hover:underline">
          contact
        </Link>
        .
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Editorial policy and publisher",
            url: `${SITE}/${locale}/editorial`,
            publisher: {
              "@type": "Organization",
              name: "BangkokCheckup",
              url: SITE,
              ...(p.name
                ? {
                    founder: {
                      "@type": "Person",
                      name: p.name,
                      ...(p.role ? { jobTitle: p.role } : {}),
                      // sameAs is the checkable half of a byline.
                      ...(p.profile ? { sameAs: [p.profile] } : {}),
                    },
                  }
                : {}),
            },
          }),
        }}
      />
    </div>
  );
}
