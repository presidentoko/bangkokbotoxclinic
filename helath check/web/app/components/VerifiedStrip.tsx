import Link from "next/link";
import { haBadge, formatRegistryDate, type RegistryMatch } from "@/lib/registry";

const TONE: Record<string, string> = {
  green: "bg-green-100 text-green-900 border-green-400",
  blue: "bg-blue-100 text-blue-900 border-blue-400",
  amber: "bg-amber-100 text-amber-900 border-amber-400",
  gray: "bg-slate-100 text-slate-700 border-slate-300",
};

/**
 * What can actually be checked about this hospital, and where it came from.
 *
 * The page previously carried a JCI badge and a Google star rating and nothing
 * else — no way for a reader to tell a licensed hospital from a clinic that
 * happens to have good reviews. This strip is the register: the Ministry of
 * Public Health hospital code, whether it is public or private, its hospital
 * type, and its HA accreditation with the date the certificate lapses. Every
 * line names its source; a hospital with no register match shows nothing here
 * rather than an implied endorsement.
 */
export function VerifiedStrip({
  match,
  jci,
  locale,
}: {
  match: RegistryMatch;
  jci: boolean;
  locale: string;
}) {
  const badge = haBadge(match.ha_level);
  const granted = formatRegistryDate(match.ha_accredited_on);
  const expires = formatRegistryDate(match.ha_expires_on);

  return (
    <section
      aria-labelledby="verified-heading"
      className="rounded-xl border-2 border-slate-200 bg-slate-50 p-4 mt-4"
    >
      <h2
        id="verified-heading"
        className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3"
      >
        Verified against the official register
      </h2>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`rounded-full border px-3 py-1 text-sm font-bold ${TONE[badge.tone]}`}>
          {badge.label}
        </span>
        {jci && (
          <span className="rounded-full border border-blue-400 bg-blue-100 px-3 py-1 text-sm font-bold text-blue-900">
            JCI accredited
          </span>
        )}
        <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold capitalize text-slate-700">
          {match.sector === "private" ? "Private" : match.sector === "public" ? "Public" : match.sector}
        </span>
      </div>

      <dl className="grid gap-x-6 gap-y-2 text-base sm:grid-cols-2">
        <div className="flex justify-between gap-3 border-b border-slate-200 pb-1.5">
          <dt className="text-slate-600">Registered name</dt>
          <dd className="text-right font-semibold">{match.name_th}</dd>
        </div>
        {match.hcode && (
          <div className="flex justify-between gap-3 border-b border-slate-200 pb-1.5">
            <dt className="text-slate-600">Hospital code</dt>
            <dd className="text-right font-semibold tabular-nums">{match.hcode}</dd>
          </div>
        )}
        {match.type_en && (
          <div className="flex justify-between gap-3 border-b border-slate-200 pb-1.5">
            <dt className="text-slate-600">Type</dt>
            <dd className="text-right font-semibold">{match.type_en}</dd>
          </div>
        )}
        {match.beds != null && (
          <div className="flex justify-between gap-3 border-b border-slate-200 pb-1.5">
            <dt className="text-slate-600">Inpatient beds</dt>
            <dd className="text-right font-semibold tabular-nums">{match.beds}</dd>
          </div>
        )}
        {granted && (
          <div className="flex justify-between gap-3 border-b border-slate-200 pb-1.5">
            <dt className="text-slate-600">Accredited on</dt>
            <dd className="text-right font-semibold">{granted}</dd>
          </div>
        )}
        {expires && (
          <div className="flex justify-between gap-3 border-b border-slate-200 pb-1.5">
            <dt className="text-slate-600">
              {match.ha_current === false ? "Certificate expired" : "Certificate valid to"}
            </dt>
            <dd
              className={`text-right font-semibold ${match.ha_current === false ? "text-amber-800" : ""}`}
            >
              {expires}
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-3 text-xs text-slate-500">
        Source: Healthcare Accreditation Institute (Public Organisation) and, for bed counts, the
        Bangkok Metropolitan Administration.{" "}
        <Link href={`/${locale}/directory/${match.province_slug}`} className="text-blue-700 hover:underline">
          All registered hospitals in {match.province_en} →
        </Link>
      </p>
    </section>
  );
}
