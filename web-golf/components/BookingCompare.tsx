import type { ProviderOffer } from "@/lib/providers";
import { formatScrapeDate } from "@/lib/providers";

function baht(n: number | null): string {
  return n === null ? "—" : `฿${n.toLocaleString()}`;
}

/**
 * Where to book — every source we scrape, side by side.
 *
 * This replaced a single "Green Fee (Golfdigg)" card whose weekend price was
 * the weekday price times 1.30 and whose caddy and cart lines were the
 * constants 400 and 800, printed on every course regardless of what the
 * course charges. Nothing here is derived: a blank cell means the provider
 * does not publish that number, and saying so is the point of the page.
 */
export function BookingCompare({
  offers,
  courseName,
  website,
  phone,
}: {
  offers: ProviderOffer[];
  courseName: string;
  website?: string | null;
  phone?: string | null;
}) {
  if (offers.length === 0) {
    return (
      <div className="bg-white border border-[var(--border)] rounded-xl p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-2">
          Where to book
        </div>
        <p className="text-sm text-[var(--muted)] mb-3">
          No online rate found for {courseName} on the booking sites we track. Book direct.
        </p>
        <div className="flex flex-wrap gap-2">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold hover:border-emerald-400"
            >
              Course website →
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm font-semibold hover:border-emerald-400"
            >
              Call {phone}
            </a>
          )}
        </div>
      </div>
    );
  }

  const weekdayPrices = offers.map((o) => o.weekday).filter((v): v is number => v !== null);
  const cheapestWeekday = weekdayPrices.length ? Math.min(...weekdayPrices) : null;
  const checked = formatScrapeDate(offers.map((o) => o.scrapedAt).sort().at(-1) ?? null);

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
          Where to book — compare
        </div>
        <span className="text-[10px] text-[var(--muted)]">
          {offers.length} source{offers.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="text-[11px] text-[var(--muted)] mb-3">
        Green fee per player, as published by each booking site. A dash means that site does not
        state the figure.
      </p>

      <div className="space-y-2">
        {offers.map((o) => {
          const best = cheapestWeekday !== null && o.weekday === cheapestWeekday;
          return (
            <div
              key={o.provider}
              className={`rounded-lg border p-3 bg-white ${best ? "border-emerald-500 ring-1 ring-emerald-300" : "border-emerald-100"}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-sm">{o.providerLabel}</span>
                {best && offers.length > 1 && (
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-emerald-600 text-white rounded-full px-2 py-0.5">
                    Cheapest weekday
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-4 gap-2 text-center mb-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Weekday</dt>
                  <dd className="text-sm font-bold text-emerald-900">{baht(o.weekday)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Weekend</dt>
                  <dd className="text-sm font-bold text-emerald-900">{baht(o.weekend)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Caddy</dt>
                  <dd className="text-sm font-semibold">{baht(o.caddy)}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-wide text-[var(--muted)]">Cart</dt>
                  <dd className="text-sm font-semibold">{baht(o.cart)}</dd>
                </div>
              </dl>
              {o.inclusions.length > 0 && (
                <ul className="flex flex-wrap gap-1 mb-2">
                  {o.inclusions.slice(0, 4).map((inc) => (
                    <li
                      key={inc}
                      className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-full px-2 py-0.5"
                    >
                      {inc}
                    </li>
                  ))}
                </ul>
              )}
              <a
                href={o.url}
                target="_blank"
                rel="noopener noreferrer nofollow sponsored"
                className="block w-full bg-emerald-700 text-white py-2 px-3 rounded-lg font-bold text-center hover:bg-emerald-800 text-sm transition"
              >
                Book on {o.providerLabel} →
              </a>
            </div>
          );
        })}
      </div>

      {checked && (
        <p className="text-[10px] text-[var(--muted)] mt-3">
          Rates checked {checked}. Prices change; confirm on the booking site before you travel.
        </p>
      )}
    </div>
  );
}
