// Focus-aware "Why us vs them" differentiation grid.
// 5 items × 2 columns (Us / Them). Designed for botox + dental + all other focus deploys.

import type { SiteFocus } from "@/lib/site";

const FOCUS_NOUN: Record<SiteFocus, string> = {
  all:    "clinic",
  botox:  "botox",
  filler: "filler",
  hifu:   "HIFU",
  facial: "skincare",
  laser:  "laser",
  dental: "dental",
  hair:   "hair-transplant",
};

const BASE_ITEMS = (noun: string) => [
  {
    good: `We aggregate Google + HDmall + Wongnai + Pantip + Reddit reviews — every ${noun} clinic checked across multiple sources`,
    bad:  "Most directories show only what clinics tell them",
  },
  {
    good: "We can NOT delete or hide bad reviews — even for paying partner clinics",
    bad:  "Other sites bury negative reviews for advertisers",
  },
  {
    good: "Suspected viral-marketing clinics get flagged (visible via opt-in toggle)",
    bad:  "Other sites give viral clinics the same trust as legit ones",
  },
  {
    good: "Trust Score is a transparent formula you can audit — published publicly",
    bad:  "Other 'top-rated' lists are opaque pay-to-play",
  },
  {
    good: "Partner clinics pay for placement priority — never for review manipulation",
    bad:  "Many sites quietly sell 'reputation management' services",
  },
];

export default function WhyUs({ focus = "all" }: { focus?: SiteFocus }) {
  const noun = FOCUS_NOUN[focus] || FOCUS_NOUN.all;
  const items = BASE_ITEMS(noun);

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-white p-6 sm:p-12 border" style={{ borderColor: "var(--border)" }}>
      <div className="relative">
        <div className="text-center mb-10">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Why we&apos;re different</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">What other directories won&apos;t admit</h2>
          <p className="mt-3 text-sm text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
            {noun.charAt(0).toUpperCase() + noun.slice(1)} decisions are too important for paid-placement directories. Here&apos;s what makes us different.
          </p>
        </div>

        <div className="grid gap-3">
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 rounded-2xl border bg-[var(--bg)] p-4 sm:grid-cols-2 sm:p-5"
              style={{ borderColor: "var(--border)" }}>
              <div className="flex items-start gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Us</div>
                  <div className="mt-0.5 text-sm font-semibold leading-snug">{it.good}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"
                style={{ borderColor: "var(--border)" }}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-100 text-red-700">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-red-700">Them</div>
                  <div className="mt-0.5 text-sm leading-snug text-[var(--muted)]">{it.bad}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
