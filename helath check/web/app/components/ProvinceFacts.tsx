import Link from "next/link";
import { provinceSentence, type ProvinceStats } from "@/lib/provinceStats";

/**
 * The province, in counted facts.
 *
 * This is the one thing on the site no competitor has: Thailand's official
 * hospital register crossed with the check-up prices we read off hospitals'
 * own pages. A reader asking "hospitals in Krabi" gets how many the province
 * actually has, how many hold a current accreditation certificate, how many
 * let one lapse, and what a check-up costs — all counted at build time from
 * the two source files, with the register named and linked.
 *
 * Where a figure is absent it says so. "No hospital there publishes a price we
 * can read" is a real answer; a made-up range is what had to be deleted from
 * the category FAQs and the city guides.
 */
export function ProvinceFacts({
  stats,
  locale,
  cityHref,
}: {
  stats: ProvinceStats;
  locale: string;
  /** Link to the priced city page, when one exists for this province. */
  cityHref?: string | null;
}) {
  const cells: { label: string; value: string; note?: string }[] = [
    { label: "On the national register", value: stats.registered.toLocaleString() },
    {
      label: "Holding current HA accreditation",
      value: stats.accredited.toLocaleString(),
      note: stats.registered
        ? `${Math.round((stats.accredited / stats.registered) * 100)}% of the province`
        : undefined,
    },
  ];
  if (stats.lapsed > 0) {
    cells.push({
      label: "Certificate lapsed",
      value: stats.lapsed.toLocaleString(),
      note: "on the register, not currently accredited",
    });
  }
  cells.push({
    label: "Private / public",
    value: `${stats.private} / ${stats.public}`,
  });
  if (stats.beds) {
    cells.push({
      label: "Inpatient beds",
      value: stats.beds.toLocaleString(),
      note: "where the register publishes a count",
    });
  }
  if (stats.packages > 0 && stats.medianPrice) {
    cells.push({
      label: "Check-up packages priced here",
      value: stats.packages.toLocaleString(),
      note: `middle price ฿${Math.round(stats.medianPrice).toLocaleString()}`,
    });
  }

  return (
    <section
      aria-labelledby="province-facts"
      className="rounded-2xl border border-slate-200 bg-white p-5 my-8"
    >
      <h2 id="province-facts" className="text-lg font-bold text-slate-900 mb-1">
        {stats.nameEn} by the numbers
      </h2>
      <p className="text-sm text-slate-600 mb-4">{provinceSentence(stats)}</p>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cells.map((c) => (
          <div key={c.label} className="rounded-xl bg-slate-50 px-4 py-3">
            <dd className="text-2xl font-bold tabular-nums text-slate-900">{c.value}</dd>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 mt-0.5">
              {c.label}
            </dt>
            {c.note && <p className="text-xs text-slate-500 mt-1">{c.note}</p>}
          </div>
        ))}
      </dl>

      <p className="mt-4 text-xs text-slate-500">
        Register figures from the Healthcare Accreditation Institute (Public Organisation); bed
        counts, where shown, from Bangkok Metropolitan Administration open data. Prices are read
        from each hospital&apos;s own page and linked under the price.{" "}
        <Link href={`/${locale}/directory/${stats.slug}`} className="text-blue-700 hover:underline">
          Every registered hospital in {stats.nameEn} →
        </Link>
        {cityHref && (
          <>
            {" · "}
            <Link href={cityHref} className="text-blue-700 hover:underline">
              Compare prices in {stats.nameEn} →
            </Link>
          </>
        )}
      </p>
    </section>
  );
}
