import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadMasterDb, clinicPath } from "@/lib/data";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { GUIDES, findGuide, guideData, ladderSentence, sourceLabel, baht, type GuideGroup, type GuideItem } from "@/lib/dentalPriceGuide";

// 가격 가이드는 데이터에 있는 시술만(GUIDES). 임의 param 의 온디맨드 렌더·캐시 write 를 막는다.
export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ procedure: g.slug }));
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dateLabel = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
const monthYear = (iso: string) => {
  const [y, m] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

// 같은 날 하루에 모은 데이터(클리닉 홈페이지)는 "August 2026" 한 번만 쓴다.
function capturedSpan(from: string, to: string, fmt: (iso: string) => string): string {
  return from === to || fmt(from) === fmt(to) ? fmt(to) : `${fmt(from)}–${fmt(to)}`;
}

function titleFor(slug: string) {
  const cfg = findGuide(slug);
  if (!cfg) return null;
  const { proc } = guideData(cfg);
  return { cfg, proc, title: `${cfg.title} (${proc.captured_to.slice(0, 4)}): ${proc.n_packages} Listed Prices Compared` };
}

export async function generateMetadata({ params }: { params: Promise<{ procedure: string }> }): Promise<Metadata> {
  const { procedure } = await params;
  const t = titleFor(procedure);
  if (!t || getSiteConfig().focus !== "dental") return { title: "Not found", robots: { index: false } };
  const { headline } = guideData(t.cfg);
  const lead = headline
    ? `${t.cfg.short} in Bangkok: ${baht(headline.min)}–${baht(headline.max)} for ${headline.group}${headline.sub ? ` (${headline.sub})` : ""}. `
    : "";
  return {
    title: t.title,
    description: `${lead}Compared from ${t.proc.n_packages} published prices at ${t.proc.n_clinics} Greater Bangkok clinics (${sourceLabel(t.proc)}), captured ${capturedSpan(t.proc.captured_from, t.proc.captured_to, monthYear)}.`,
    alternates: { canonical: `/prices/${t.cfg.slug}` },
  };
}

function GroupRow({ g, procedure }: { g: GuideGroup; procedure: string }) {
  const label = g.sub && procedure !== "invisalign" ? `${g.group} · ${g.sub}` : g.group;
  return (
    <tr className="border-t border-[var(--border)]">
      <td className="py-2 pr-3 font-medium">{label}</td>
      <td className="py-2 pr-3 text-right tabular-nums">{g.n}</td>
      <td className="py-2 pr-3 text-right tabular-nums">{baht(g.min)}</td>
      <td className="py-2 pr-3 text-right tabular-nums font-semibold">{g.median != null ? baht(g.median) : "—"}</td>
      <td className="py-2 pr-3 text-right tabular-nums text-[var(--muted)]">
        {g.p25 != null && g.p75 != null ? `${baht(g.p25)}–${baht(g.p75)}` : "—"}
      </td>
      <td className="py-2 text-right tabular-nums">{baht(g.max)}</td>
    </tr>
  );
}

export default async function PriceGuidePage({ params }: { params: Promise<{ procedure: string }> }) {
  const { procedure } = await params;
  const t = titleFor(procedure);
  // 치과 사이트 전용 — 다른 도메인에서는 존재하지 않는 페이지다.
  if (!t || getSiteConfig().focus !== "dental") notFound();
  const { cfg, proc, title } = t;
  const { headline } = guideData(cfg);

  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, getSiteConfig());
  const byId = new Map(scoped.map((c) => [c.id, c]));
  const ladder = ladderSentence(cfg, proc);
  const faqs = cfg.faqs(proc, headline);
  const shown = proc.items.slice(0, 25);
  const rest = proc.items.slice(25);

  const renderRow = (r: GuideItem, i: number) => {
    const c = byId.get(r.clinic_id);
    return (
      <tr key={i} className="border-t border-[var(--border)] align-top">
        <td className="py-2 pr-3 text-right tabular-nums font-semibold whitespace-nowrap">
          {baht(r.price)}
          {/* 클리닉 홈페이지 가격표의 범위(최소~최대). HDmall 의 listed 는 할인 전 정가라 뜻이 달라 쓰지 않는다. */}
          {r.listed != null && proc.source !== "HDmall" && <span className="font-normal text-[var(--muted)]">–{baht(r.listed)}</span>}
        </td>
        <td className="py-2 pr-3">
          {c ? (
            <a href={clinicPath(db.clinics, c)} className="font-medium hover:underline">{r.clinic}</a>
          ) : (
            <span className="font-medium">{r.clinic}</span>
          )}
          {r.district && <span className="text-xs text-[var(--muted)]"> · {r.district}</span>}
        </td>
        <td className="py-2 pr-3 text-xs text-[var(--muted)]">{r.group}{r.sub ? ` · ${r.sub}` : ""}</td>
        <td className="py-2 text-xs">
          {r.url ? <a href={r.url} rel="nofollow noopener" target="_blank" className="underline text-[var(--muted)]">{r.source}</a> : null}
        </td>
      </tr>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Price guides", url: "/prices" },
          { name: cfg.title, url: `/prices/${cfg.slug}` },
        ]}
      />
      <FaqJsonLd faqs={faqs} />

      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <a href="/prices" className="hover:text-[var(--fg)]">Price guides</a>
        <span className="mx-2">›</span>
        <span>{cfg.short}</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{title}</h1>
      <p className="text-[var(--muted)] mb-6 max-w-2xl">
        We compared {proc.n_packages} prices published by {proc.n_clinics} Greater Bangkok dental clinics for {cfg.scope}. Prices are list
        prices from {sourceLabel(proc)}, captured {capturedSpan(proc.captured_from, proc.captured_to, dateLabel)}, shown in Thai baht {cfg.unit}.
      </p>

      {headline && (
        <section className="rounded-xl border border-[var(--border)] bg-white p-5 mb-8" aria-label="Headline price">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
            {headline.group}{headline.sub ? ` · ${headline.sub}` : ""} · {headline.n} listings
          </div>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <div>
              <span className="text-3xl font-bold tabular-nums">{headline.median != null ? baht(headline.median) : baht(headline.min)}</span>
              <span className="text-sm text-[var(--muted)] ml-2">{headline.median != null ? "typical listing" : "lowest listing"}</span>
            </div>
            <div className="text-sm text-[var(--muted)] tabular-nums">
              lowest {baht(headline.min)} · highest {baht(headline.max)}
              {headline.p25 != null && headline.p75 != null && <> · middle half {baht(headline.p25)}–{baht(headline.p75)}</>}
            </div>
          </div>
        </section>
      )}

      <section className="mb-8" aria-label="Prices by group">
        <h2 className="text-xl font-bold mb-3">Price by {cfg.procedure === "implants" ? "brand" : cfg.procedure === "invisalign" ? "tier" : cfg.procedure === "veneers" ? "material" : "system"}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                <th className="font-semibold pb-2 pr-3">Group</th>
                <th className="font-semibold pb-2 pr-3 text-right">Listings</th>
                <th className="font-semibold pb-2 pr-3 text-right">Lowest</th>
                <th className="font-semibold pb-2 pr-3 text-right">Typical</th>
                <th className="font-semibold pb-2 pr-3 text-right">Middle half</th>
                <th className="font-semibold pb-2 text-right">Highest</th>
              </tr>
            </thead>
            <tbody>
              {proc.groups.map((g) => (
                <GroupRow key={`${g.group}|${g.sub}`} g={g} procedure={cfg.procedure} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)] mt-3">
          &ldquo;Typical&rdquo; is the median and &ldquo;middle half&rdquo; the 25th–75th percentile; both are shown only for groups with three or more listings.{" "}
          {cfg.caveat}
        </p>
        {ladder && <p className="text-sm mt-3">{ladder}</p>}
      </section>

      <section className="mb-8" aria-label="All listings">
        <h2 className="text-xl font-bold mb-3">Every listing, cheapest first</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                <th className="font-semibold pb-2 pr-3 text-right">Price</th>
                <th className="font-semibold pb-2 pr-3">Clinic</th>
                <th className="font-semibold pb-2 pr-3">Type</th>
                <th className="font-semibold pb-2">Source</th>
              </tr>
            </thead>
            <tbody>{shown.map(renderRow)}</tbody>
          </table>
          {rest.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-[var(--accent)] font-semibold">Show the other {rest.length} listings</summary>
              <table className="w-full text-sm mt-2">
                <tbody>{rest.map(renderRow)}</tbody>
              </table>
            </details>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-white p-5 mb-8 text-sm leading-relaxed" aria-label="How we got these numbers">
        <h2 className="text-base font-bold mb-2">How we got these numbers</h2>
        <ul className="list-disc pl-5 space-y-1 text-[var(--muted)]">
          <li>
            {proc.source === "HDmall"
              ? <>Source: package prices that clinics published on HDmall, captured {capturedSpan(proc.captured_from, proc.captured_to, dateLabel)}. Only clinics that list on HDmall appear, so this is not every clinic in the city.</>
              : <>Source: price tables clinics publish on their own websites, collected {capturedSpan(proc.captured_from, proc.captured_to, dateLabel)}. Only clinics that publish a price table appear, so this is not every clinic in the city.</>}
          </li>
          <li>These are list prices, not quotes. Promotions change them, and the final bill depends on your exam.</li>
          <li>We compare like with like: one treatment type per group, exams, X-rays and consultations excluded, and an identical listing repeated by the same clinic counted once.</li>
          <li>&ldquo;Greater Bangkok&rdquo; means clinics our directory files under Bangkok, which includes nearby districts of Nonthaburi, Pathum Thani and Samut Prakan.</li>
          <li>Two branches of the same chain count as separate clinics.</li>
          <li>This is general information, not dental advice. Ask a licensed dentist what you need.</li>
        </ul>
        <p className="mt-3">
          <a href="/methodology" className="underline">Full methodology</a> · <a href="/disclaimer" className="underline">Medical disclaimer</a>
        </p>
      </section>

      <div className="mb-8">
        <FaqSection faqs={faqs} />
      </div>

      <section aria-label="More price guides">
        <h2 className="text-base font-bold mb-2">More dental price guides</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {GUIDES.filter((g) => g.slug !== cfg.slug).map((g) => (
            <li key={g.slug}>
              <a href={`/prices/${g.slug}`} className="inline-block rounded-full border border-[var(--border)] bg-white px-3 py-1.5 hover:border-[var(--accent)]">{g.title}</a>
            </li>
          ))}
          <li>
            <a href="/c/dental" className="inline-block rounded-full border border-[var(--border)] bg-white px-3 py-1.5 hover:border-[var(--accent)]">Best dental clinics in Bangkok</a>
          </li>
        </ul>
      </section>
    </div>
  );
}
