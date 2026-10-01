/**
 * Where this price came from.
 *
 * 955 of the 1,001 priced packages carry the URL they were read from, and
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
  if (!url) return null;
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  const when = asOf ? formatAsOf(asOf) : null;
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

function formatAsOf(iso: string): string | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
