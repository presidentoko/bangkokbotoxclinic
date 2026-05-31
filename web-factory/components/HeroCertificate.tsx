// Gold-bordered "official certificate" hero — Alibaba Gold Supplier 분위기.

import { photoUrl } from "@/lib/photoUrl";
import { AnimatedCounter } from "./AnimatedCounter";
import { HeroPhotoCollage } from "./HeroPhotoCollage";

type Props = {
  name: string;
  legalNameTh?: string | null;
  primaryType?: string;
  city?: string;
  district?: string;
  province?: string;
  regNo?: string | null;
  founded?: string | null;
  capital?: number | null;
  tsicCode?: string | null;
  yearsInBusiness?: number | null;
  confidence?: "verified" | "likely" | null;
  heroPhoto?: string | null;
  photos?: string[];               // multi-photo collage
  rating?: number;
  totalReviews?: number;
  phone?: string;
  mapsUrl?: string;
  website?: string;
};

function formatCap(thb: number | null | undefined): string {
  if (!thb) return "—";
  if (thb >= 1_000_000_000) return `฿${(thb / 1_000_000_000).toFixed(2)}B`;
  if (thb >= 1_000_000) return `฿${(thb / 1_000_000).toFixed(1)}M`;
  if (thb >= 1_000) return `฿${(thb / 1_000).toFixed(0)}K`;
  return `฿${thb.toFixed(0)}`;
}

function formatPhoneTel(p?: string): string {
  return (p || "").replace(/[^+\d]/g, "");
}

function whatsAppLink(phone?: string, name?: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return null;
  const intl = digits.startsWith("66") ? digits : (digits.startsWith("0") ? "66" + digits.slice(1) : digits);
  const msg = encodeURIComponent(`Hello ${name || ""}, I found you on thaisupplyhub.com and would like to request a quote.`);
  return `https://wa.me/${intl}?text=${msg}`;
}

export function HeroCertificate(p: Props) {
  const location = [p.district, p.city, p.province].filter(Boolean).join(" · ");
  const yearStr = p.founded ? p.founded.slice(0, 4) : null;
  const isVerified = p.confidence === "verified";
  const isLikely   = p.confidence === "likely";

  // Multi-photo collage if 2+ photos, else single bg photo
  const usableCollage = (p.photos && p.photos.length >= 2) ? p.photos : null;

  return (
    <header className="relative isolate overflow-hidden rounded-3xl mb-6 cert-frame-dark min-h-[480px]">
      {/* Multi-photo collage background */}
      {usableCollage && (
        <div aria-hidden className="absolute inset-0 opacity-40">
          <HeroPhotoCollage photos={usableCollage} ariaLabel={p.name} />
        </div>
      )}
      {/* Fallback single-photo blurred background */}
      {!usableCollage && p.heroPhoto && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl(p.heroPhoto)}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-25 scale-110 blur-sm"
            aria-hidden
          />
        </>
      )}
      {/* Dark gradient overlay */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-stone-900/90 via-stone-900/75 to-stone-900/95" />

      <div className="relative z-10 p-6 md:p-10">
        {/* Top row — DBD stamp + meta */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          {isVerified && (
            <span className="dbd-stamp">
              <span aria-hidden>✓</span> DBD Verified · Cert.
            </span>
          )}
          {isLikely && (
            <span className="dbd-stamp dbd-stamp-likely">
              <span aria-hidden>≈</span> DBD-listed · Likely match
            </span>
          )}
          <span className="text-[11px] uppercase tracking-widest text-amber-300/80 font-bold font-mono-data">
            {p.tsicCode ? `TSIC ${p.tsicCode}` : ""} {p.primaryType ? `· ${p.primaryType}` : ""}
          </span>
        </div>

        {/* Headline name */}
        <h1 className="font-display text-3xl md:text-5xl font-bold text-amber-50 leading-tight tracking-tight mb-1">
          {p.name}
        </h1>
        {p.legalNameTh && (
          <p className="text-sm md:text-base text-amber-200/80 font-medium mb-4">
            {p.legalNameTh}
          </p>
        )}
        {location && (
          <p className="text-xs md:text-sm text-stone-300 mb-6 flex items-center gap-2 flex-wrap">
            <span aria-hidden>📍</span> {location}
            {p.rating && p.rating > 0 && (
              <>
                <span aria-hidden className="text-stone-500">·</span>
                <span className="text-amber-300 font-bold">★ {p.rating.toFixed(1)}</span>
                <span className="text-stone-400">({(p.totalReviews ?? 0).toLocaleString()} reviews)</span>
              </>
            )}
          </p>
        )}

        {/* Big stats — established / capital / reg no */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6 border-y border-amber-700/30 py-5">
          <StatCol
            label="Established"
            value={yearStr || "—"}
            sub={p.yearsInBusiness ? `${p.yearsInBusiness} years` : undefined}
          />
          <StatCol
            label="Reg. Capital"
            value={formatCap(p.capital)}
            sub="THB"
            animateValue={p.capital ?? undefined}
            format="capital_thb"
          />
          <StatCol
            label="DBD Reg. No."
            value={p.regNo || "—"}
            sub={isVerified ? "Match 90+" : isLikely ? "Match 80–89" : ""}
            mono
          />
        </div>

        {/* Multi-channel CTAs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <CtaPrimary href="#rfq">
            <span aria-hidden>✉</span> Send RFQ
          </CtaPrimary>
          {p.phone && (
            <CtaSecondary href={`tel:${formatPhoneTel(p.phone)}`}>
              <span aria-hidden>📞</span> {p.phone}
            </CtaSecondary>
          )}
          {p.mapsUrl && (
            <CtaSecondary href={p.mapsUrl} target="_blank" rel="noopener noreferrer">
              <span aria-hidden>📍</span> Google Maps
            </CtaSecondary>
          )}
          {p.phone && whatsAppLink(p.phone, p.name) && (
            <CtaSecondary href={whatsAppLink(p.phone, p.name)!} target="_blank" rel="noopener">
              <span aria-hidden>💬</span> WhatsApp
            </CtaSecondary>
          )}
          {!p.phone && p.website && (
            <CtaSecondary href={p.website} target="_blank" rel="noopener nofollow">
              <span aria-hidden>🌐</span> Website
            </CtaSecondary>
          )}
        </div>
      </div>
    </header>
  );
}


function StatCol({
  label, value, sub, mono, animateValue, format,
}: {
  label: string; value: string; sub?: string; mono?: boolean;
  animateValue?: number; format?: "int" | "capital_thb" | "years" | "score" | "comma";
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest font-bold text-amber-400 mb-1.5">{label}</div>
      <div className={`text-xl md:text-3xl font-bold counter-pop text-amber-50 ${mono ? "font-mono-data" : "font-display"}`}>
        {animateValue !== undefined ? (
          <AnimatedCounter value={animateValue} format={format} />
        ) : value}
      </div>
      {sub && <div className="text-[10px] text-stone-400 mt-0.5 uppercase tracking-wider">{sub}</div>}
    </div>
  );
}

function CtaPrimary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-base bg-amber-500 text-stone-900 hover:bg-amber-400 transition shadow-lg shadow-amber-900/40">
      {children}
    </a>
  );
}

function CtaSecondary(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { children, className, ...rest } = props;
  return (
    <a {...rest} className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-stone-800/80 text-amber-100 border border-amber-700/40 hover:bg-stone-700 hover:border-amber-500 transition ${className || ""}`}>
      {children}
    </a>
  );
}
