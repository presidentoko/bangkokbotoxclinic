"use client";

import { useEffect, useState } from "react";

const SURFACES = ["detail", "list", "planner", "dayplan", "hub", "tiktok", "relax"] as const;

// C5: Internal analytics report page
// Data comes from Vercel Analytics dashboard — this page documents the event schema
// and the double-down rules so the team can act on data without a BI tool.
//
// The passcode itself never reaches this component — it's checked server-side
// by /api/admin-auth, which sets an httpOnly session cookie on success. (This
// used to compare against NEXT_PUBLIC_ADMIN_PASSCODE directly, which ships
// the real passcode in the client JS bundle for anyone to read.)

export default function AnalyticsReportPage() {
  const [code, setCode] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/admin-auth")
      .then((r) => r.json())
      .then((d) => setUnlocked(!!d.unlocked))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  async function submit() {
    setError(false);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) setUnlocked(true);
      else setError(true);
    } catch {
      setError(true);
    }
  }

  if (checking) return null;

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20 text-center">
        <h1 className="font-black text-xl mb-6">Analytics Report</h1>
        <input
          type="password"
          placeholder="Passcode"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
          className="border border-[var(--border)] rounded-xl px-4 py-3 w-full mb-3 text-center text-base"
        />
        <button
          onClick={submit}
          className="bg-black text-white font-bold px-6 py-3 rounded-xl w-full hover:bg-gray-800 transition"
        >
          Unlock
        </button>
        {error && <p className="text-xs text-red-600 mt-3">Incorrect passcode.</p>}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-2">Thaigle Analytics Report</h1>
      <p className="text-sm text-[var(--muted)] mb-8">
        Internal — C5 measurement framework. All events tracked via Vercel Analytics → <code>affiliate_click</code>.
      </p>

      {/* Event schema */}
      <section className="mb-10">
        <h2 className="font-black text-lg mb-3">Event schema</h2>
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`affiliate_click {
  type:         "affiliate" | "lead" | "featured"
  provider:     Klook | GetYourGuide | Viator | Direct | Line | Email
  activityType: niche slug | "restaurant" | "day-plan"
  surface:      ${SURFACES.join(" | ")}
  area?:        AreaSlug  (thonglor | ari | sukhumvit | old-town | riverside)
  theme?:       ThemeSlug (foodie | wellness | active | couples | first-day)
  planId?:      string    (shared plan id, surface=planner)
  venueId?:     string
  src?:         "tiktok" | "email" | ...
}

plan_slot_assign { slot, venueId, venueType }
tiktok_conversion { venueId, action: "book"|"add_plan"|"day_plan", src: "tiktok" }`}</pre>
        </div>
      </section>

      {/* Where to find data */}
      <section className="mb-10">
        <h2 className="font-black text-lg mb-3">Where to read this data</h2>
        <div className="space-y-3">
          <a
            href="https://vercel.com/xiaomi-8775s-projects/web-thaigle/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between border border-[var(--border)] rounded-xl p-4 hover:border-orange-400 transition group"
          >
            <div>
              <div className="font-bold group-hover:text-orange-600 transition">Vercel Analytics → Custom Events</div>
              <div className="text-xs text-[var(--muted)]">Filter by event: affiliate_click · Group by: surface, provider, activityType</div>
            </div>
            <span className="text-[var(--muted)]">→</span>
          </a>
        </div>
      </section>

      {/* Double-down rules */}
      <section className="mb-10">
        <h2 className="font-black text-lg mb-3">Double-down rules</h2>
        <div className="space-y-3">
          {[
            {
              condition: "Surface in top decile by affiliate_click volume",
              action: "Generate more day-plan variants (feed back to C1). Add more venue depth.",
              example: "If surface=dayplan,area=thonglor consistently tops → add rainy-day + budget themes for Thonglor",
            },
            {
              condition: "Page has traffic + zero affiliate_click",
              action: "Audit CTA placement and fold. Test above-fold booking CTA. Check if content loads SSR or CSR.",
              example: "If /day-plan/ari/wellness shows sessions but zero clicks → check BookingCTAs visible without scroll",
            },
            {
              condition: "src=tiktok sessions with zero tiktok_conversion",
              action: "Review TikTok landing page fold — score/price/book must be above fold on 375px viewport.",
              example: "Add TikTok-specific variant with price and book CTA in first 200px",
            },
            {
              condition: "Zero-traffic pages after 4 weeks",
              action: "Add noindex + remove from sitemap. Check internal links — may be orphaned.",
              example: "If /day-plan/riverside/couples never appears in Search Console → check hub links",
            },
            {
              condition: "plan_slot_assign volume high but dayplan affiliate_click low",
              action: "Day Builder engagement is strong but conversion is weak. Add inline BookingCTA to DayBuilder slots.",
              example: "If users assign slots but don't click Book → make slot cards more obviously bookable",
            },
          ].map((rule, i) => (
            <div key={i} className="border border-[var(--border)] rounded-xl p-4">
              <div className="font-bold text-sm text-green-700 mb-1">IF: {rule.condition}</div>
              <div className="text-sm font-bold mb-1">THEN: {rule.action}</div>
              <div className="text-xs text-[var(--muted)]">e.g. {rule.example}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Weekly snapshot checklist */}
      <section className="mb-10">
        <h2 className="font-black text-lg mb-3">Weekly snapshot checklist</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800 mb-3">Run weekly. Pull from Vercel Analytics → export CSV or read the dashboard.</p>
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>Top 5 surfaces by <code>affiliate_click</code> — compare to prior week</li>
            <li>Top 5 areas × themes by <code>affiliate_click</code> — which day-plan combos convert?</li>
            <li><code>tiktok_conversion</code> events — which venue IDs get TikTok bookings?</li>
            <li>Zero-click pages with &gt;50 sessions — audit CTA fold</li>
            <li><code>plan_slot_assign</code> vs <code>affiliate_click[surface=planner]</code> ratio — Day Builder conversion rate</li>
          </ol>
        </div>
      </section>

      {/* Surfaces reference */}
      <section>
        <h2 className="font-black text-lg mb-3">Surface definitions</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {SURFACES.map((s) => (
            <div key={s} className="border border-[var(--border)] rounded-lg p-3">
              <code className="font-bold text-orange-600">{s}</code>
              <div className="text-xs text-[var(--muted)] mt-1">
                {s === "detail" && "Activity/restaurant detail page"}
                {s === "list" && "Category list page (niche listing)"}
                {s === "planner" && "My Trip /plan page"}
                {s === "dayplan" && "Programmatic /day-plan/[area]/[theme] page"}
                {s === "hub" && "Area or theme hub page"}
                {s === "tiktok" && "/tiktok bio-link hub + ?src=tiktok pages"}
                {s === "relax" && "Wellness/relaxation category pages"}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
