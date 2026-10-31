import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadMasterDb, clinicPath } from "@/lib/data";
import { applySiteFilter, getSiteConfig } from "@/lib/site";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { FaqSection } from "@/components/FaqSection";
import { GUIDES, PRICE_GUIDE_FOCUS, findGuide, guideData, ladderSentence, groupUnit, baht, type GuideGroup, type GuideItem } from "@/lib/aestheticPriceGuide";

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
  if (!t || !PRICE_GUIDE_FOCUS.has(getSiteConfig().focus)) return { title: "Not found", robots: { index: false } };
  const { headline } = guideData(t.cfg);
  const lead = headline
    ? `${t.cfg.short} in Bangkok: typical ${baht(headline.median ?? headline.min)}${groupUnit(headline)}${headline.group === "Brand not stated" ? "" : ` (${headline.group})`}. `
    : "";
  return {
    title: t.title,
    description: `${lead}Compared from ${t.proc.n_packages} published prices at ${t.proc.n_clinics} Greater Bangkok clinics (HDmall), captured ${capturedSpan(t.proc.captured_from, t.proc.captured_to, monthYear)}.`,
    alternates: { canonical: `/prices/${t.cfg.slug}` },
  };
}

function GroupRow({ g }: { g: GuideGroup }) {
  const label = g.sub ? `${g.group} · ${g.sub}` : g.group;
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
  // 보톡스 계열 사이트 전용 — 치과·모발이식 도메인에서는 존재하지 않는 페이지다.
  if (!t || !PRICE_GUIDE_FOCUS.has(getSiteConfig().focus)) notFound();
  const { cfg, proc, title } = t;
  const { headline } = guideData(cfg);

  const db = await loadMasterDb();
  const scoped = applySiteFilter(db.clinics, getSiteConfig());
  const byId = new Map(scoped.map((c) => [c.id, c]));
  const ladder = ladderSentence(proc);
  const faqs = cfg.faqs(proc, headline);
  const shown = proc.items.slice(0, 25);
  const rest = proc.items.slice(25);

  const renderRow = (r: GuideItem, i: number) => {
    const c = byId.get(r.clinic_id);
    return (
      <tr key={i} className="border-t border-[var(--border)] align-top">
        <td className="py-2 pr-3 text-right tabular-nums font-semibold whitespace-nowrap">
          {r.per_unit != null ? (
            <>
              {baht(r.per_unit)}<span className="font-normal text-[var(--muted)]">/unit</span>
              <div className="text-xs font-normal text-[var(--muted)]">{baht(r.price)} · {r.units} units</div>
            </>
          ) : (
            baht(r.price)
          )}
        </td>
        <td className="py-2 pr-3">
          {c ? (
            <a href={clinicPath(db.clinics, c)} className="font-medium hover:underline">{r.clinic}</a>
          ) : (
            <span className="font-medium">{r.clinic}</span>
          )}
          {r.district && <span className="text-xs text-[var(--muted)]"> · {r.district}</span>}
        </td>
        <td className="py-2 pr-3 text-xs text-[var(--muted)]">{r.group}{r.sub && r.sub !== "per unit" ? ` · ${r.sub}` : ""}<div className="opacity-80" lang="th">{r.name}</div></td>
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
        We compared {proc.n_packages} prices published by {proc.n_clinics} Greater Bangkok clinics for {cfg.scope}. Prices are list
        prices from HDmall, captured {capturedSpan(proc.captured_from, proc.captured_to, dateLabel)}, shown in Thai baht.
      </p>

      {headline && (
        <section className="rounded-xl border border-[var(--border)] bg-white p-5 mb-8" aria-label="Headline price">
          <div className="text-xs uppercase tracking-widest text-[var(--muted)] mb-1">
            {headline.group}{headline.sub ? ` · ${headline.sub}` : ""} · {headline.n} listings
          </div>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
            <div>
              <span className="text-3xl font-bold tabular-nums">{headline.median != null ? baht(headline.median) : baht(headline.min)}{groupUnit(headline)}</span>
              <span className="text-sm text-[var(--muted)] ml-2">{headline.median != null ? "typical listing" : "lowest listing"}</span>
            </div>
            <div className="text-sm text-[var(--muted)] tabular-nums">
              lowest {baht(headline.min)} · highest {baht(headline.max)}
              {headline.p25 != null && headline.p75 != null && <> · middle half {baht(headline.p25)}–{baht(headline.p75)}</>}
            </div>
          </div>
        </section>
      )}

      {getSiteConfig().focus === "botox" && (
        <a href="/quote" className="block rounded-xl border border-[var(--border)] bg-white p-4 mb-8 hover:border-black">
          <span className="font-semibold">Want an actual price for you?</span>{" "}
          <span className="text-[var(--muted)]">Tell us what you want done and Bangkok clinics send you their quotes to compare. Free →</span>
        </a>
      )}

      <section className="mb-8" aria-label="Prices by group">
        <h2 className="text-xl font-bold mb-3">Price by {cfg.groupBy}</h2>
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
                <GroupRow key={`${g.group}|${g.sub}`} g={g} />
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted)] mt-3">
          &ldquo;Typical&rdquo; is the median and &ldquo;middle half&rdquo; the 25th–75th percentile; both are shown only for groups with three or more listings. &ldquo;Per unit&rdquo; rows are in baht per unit; the others are package prices.{" "}
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
            Source: package prices that clinics published on HDmall, captured {capturedSpan(proc.captured_from, proc.captured_to, dateLabel)}. Only clinics that list on HDmall appear, so this is not every clinic in the city.
          </li>
          <li>These are list prices, not quotes. Promotions change them, and the final dose or shot count is set by the doctor.</li>
          <li>We compare like with like: single-treatment packages only (bundles with another treatment and multi-session courses excluded), and an identical listing repeated by the same clinic counted once. Free add-ons a package includes do not change its price.</li>
          <li>&ldquo;Greater Bangkok&rdquo; means clinics our directory files under Bangkok, which includes nearby districts of Nonthaburi, Pathum Thani and Samut Prakan.</li>
          <li>Two branches of the same chain count as separate clinics.</li>
          <li>This is general information, not medical advice. Ask a licensed doctor what you need, and which brand and product is being injected.</li>
        </ul>
        <p className="mt-3">
          <a href="/methodology" className="underline">Full methodology</a> · <a href="/disclaimer" className="underline">Medical disclaimer</a>
        </p>
      </section>

      <div className="mb-8">
        <FaqSection faqs={faqs} />
      </div>

      <section aria-label="More price guides">
        <h2 className="text-base font-bold mb-2">More price guides</h2>
        <ul className="flex flex-wrap gap-2 text-sm">
          {GUIDES.filter((g) => g.slug !== cfg.slug).map((g) => (
            <li key={g.slug}>
              <a href={`/prices/${g.slug}`} className="inline-block rounded-full border border-[var(--border)] bg-white px-3 py-1.5 hover:border-[var(--accent)]">{g.title}</a>
            </li>
          ))}
          <li>
            <a href={`/c/${cfg.procedure}`} className="inline-block rounded-full border border-[var(--border)] bg-white px-3 py-1.5 hover:border-[var(--accent)]">Best {cfg.short} clinics in Bangkok</a>
          </li>
        </ul>
      </section>
    </div>
  );
}
