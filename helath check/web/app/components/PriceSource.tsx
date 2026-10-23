/**
 * Where this price came from.
 *
 * 857 of the 966 priced packages carry the URL they were read from (2026-10-23), and
 * until now that URL was only ever used as a "view site" button — the page
 * showed a number and asked to be believed. On a site that publishes medical
 * prices under no named author, a checkable source is the strongest honest
 * trust signal available, and it costs one line.
 *
 * The hostname is shown rather than the full URL because the full one is often
 * a 200-character query string, and the hostname is the part a reader judges.
 * `nofollow` because these are the hospitals' own commercial pages.
 */
export function PriceSource({
  url,
  asOf,
  className = "",
}: {
  url: string | null | undefined;
  /** Date the price file was generated, ISO. */
  asOf?: string | null;
  className?: string;
}) {
  const when = asOf ? formatAsOf(asOf) : null;
  // 109 priced packages have no URL. Most were read from a hospital's own
  // feed by a scraper that recorded its name instead of a page; 46 have no
  // source on file at all. Until 2026-10-23 this rendered nothing for any of
  // them, which let the editorial page imply every price was linked. Each now
  // says what is known — including, where it is the truth, that nothing is.
  if (!url || !url.startsWith("http")) {
    const feed = url ? FEEDS[url] : undefined;
    return (
      <p className={`text-[11px] leading-snug text-slate-500 ${className}`}>
        {feed ? `Price read from ${feed}` : "Source of this price was not recorded"}
        {when ? ` · file built ${when}` : ""}
      </p>
    );
  }
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  return (
    <p className={`text-[11px] leading-snug text-slate-500 ${className}`}>
      Price read from{" "}
      <a
        href={url}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="underline hover:text-slate-700"
      >
        {host}
      </a>
      {when ? ` · checked ${when}` : ""}
    </p>
  );
}

// Scraper labels that stand in for a URL, and the source each one read.
const FEEDS: Record<string, string> = {
  "phyathai-api": "Phyathai Hospitals' own price feed",
  "samitivej-web": "samitivejhospitals.com",
  "paolohospital-web": "paolohospital.com",
};

function formatAsOf(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
