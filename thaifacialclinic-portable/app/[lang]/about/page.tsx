import type { Metadata } from "next";
import type { Lang } from "@/lib/types";
import { SUPPORTED_LANGS, SITE } from "@/lib/i18n";
import { CONTACT, fullAddress } from "@/lib/contact";
import Header from "@/components/Header";
import ContactBlock from "@/components/ContactBlock";
import CertificationsBar from "@/components/CertificationsBar";
import PartnerLogosWall from "@/components/PartnerLogosWall";
import TransparencyBadge from "@/components/TransparencyBadge";
import PatientCommunityCount from "@/components/PatientCommunityCount";

export const dynamicParams = false;
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: `About — ${SITE.name}`,
    description: `${SITE.name} aggregates verified clinic data from 6+ public sources. We never delete reviews. ${fullAddress() || "Bangkok, Thailand"}.`,
    alternates: {
      canonical: `${SITE.origin}/${lang}/about/`,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/about/`])),
        "x-default": `${SITE.origin}/en/about/`,
      },
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const addr = fullAddress();

  return (
    <>
      <Header lang={lang} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Hero */}
        <header className="mb-10">
          <div className="text-xs font-black uppercase tracking-widest text-clinic">About us</div>
          <h1 className="mt-1 font-display text-4xl sm:text-5xl font-bold tracking-tighter-display leading-tight">
            Independent hair-transplant directory for Thailand
          </h1>
          <p className="mt-3 text-base text-[rgb(var(--muted))] leading-relaxed">
            We aggregate Google Maps, Bookimed, Reddit, Naver, YouTube, Pantip across 230+ Thai hair clinics. Every clinic ranked by our public Trust Score formula — never by who paid us.
          </p>
        </header>

        {/* Owner profile card */}
        <section className="mb-10 rounded-3xl border-2 bg-[rgb(var(--bg-elev))] p-5 sm:p-7" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="grid sm:grid-cols-[auto_1fr] gap-5 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CONTACT.owner.photo}
              alt={CONTACT.owner.name}
              className="h-32 w-32 sm:h-36 sm:w-36 rounded-2xl object-cover ring-2 ring-gold-400/40 shadow-md mx-auto sm:mx-0"
            />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-gold-700 dark:text-gold-400">Meet the founder</div>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tighter-display">{CONTACT.owner.name}</h2>
              <p className="text-sm text-[rgb(var(--muted))]">{CONTACT.owner.title}</p>
              <p className="mt-3 text-sm leading-relaxed">{CONTACT.owner.bio}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <a href={CONTACT.line.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#06c755] text-white px-3 py-1.5 font-bold hover:opacity-90">💬 LINE {CONTACT.line.id}</a>
                <a href={`https://wa.me/${CONTACT.whatsapp.number}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#25d366] text-white px-3 py-1.5 font-bold hover:opacity-90">📱 WhatsApp</a>
                {CONTACT.instagram && (
                  <a href={`https://instagram.com/${CONTACT.instagram}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white px-3 py-1.5 font-bold hover:opacity-90">📷 Instagram @{CONTACT.instagram}</a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Our story */}
        <section className="mb-12 space-y-4 text-[15px] leading-relaxed">
          <h2 className="font-display text-2xl font-bold tracking-tighter-display">Why we built this</h2>
          <p>
            Bangkok has hundreds of hair-transplant clinics. Korean YouTubers, Saudi influencers, and Singapore tourists all fly here for procedures that cost 1/3 of their home country. But the existing &quot;top 10&quot; lists are pay-to-play. Negative reviews vanish. Clinics buy 5-star reviews in bulk.
          </p>
          <p>
            <strong>{SITE.name}</strong> aggregates real data from sources clinics can&apos;t edit — Google, Reddit, Naver, Pantip, YouTube, Bookimed. We compute a Trust Score from the actual review pattern. Clinics earn placement priority by passing verification, never by paying us to hide things.
          </p>
          <p className="text-sm text-[rgb(var(--muted))]">
            {SITE.parentSubtext}
          </p>
        </section>

        {/* Pledges */}
        <section className="mb-12">
          <TransparencyBadge lang={lang} />
        </section>

        {/* Patient count */}
        <section className="mb-12">
          <PatientCommunityCount />
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <CertificationsBar />
        </section>

        {/* Press */}
        <section className="mb-12 -mx-4">
          <PartnerLogosWall />
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold tracking-tighter-display mb-4">Reach us</h2>
          <ContactBlock />
        </section>

        {/* Address line */}
        {addr && CONTACT.address.line1 && (
          <p className="text-xs text-[rgb(var(--muted))] text-center">
            📍 {addr}
          </p>
        )}
      </main>
    </>
  );
}
