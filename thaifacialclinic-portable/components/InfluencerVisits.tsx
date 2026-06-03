// Generic strip — "X influencers from country Y visited Bangkok clinics for this procedure".
// Synth list, no real channel data yet. Designed to encourage social search.

import type { SiteFocus } from "@/lib/site";

type Inf = { handle: string; country: string; flag: string; subs: string; topic: string };

const FOCUS_INF: Partial<Record<SiteFocus, Inf[]>> = {
  botox: [
    { handle: "@hyebin_beauty",     country: "Korea",  flag: "🇰🇷", subs: "320K",  topic: "Bangkok botox cost comparison" },
    { handle: "@dr.beauty.kr",      country: "Korea",  flag: "🇰🇷", subs: "180K",  topic: "Brand verification deep-dive" },
    { handle: "@maya_meditourist",  country: "USA",    flag: "🇺🇸", subs: "92K",   topic: "First-time botox Thailand vlog" },
    { handle: "@nour.beauty",       country: "UAE",    flag: "🇦🇪", subs: "215K",  topic: "Why I fly to Bangkok every year" },
  ],
  dental: [
    { handle: "@jeong_dental_vlog", country: "Korea",  flag: "🇰🇷", subs: "180K", topic: "5-day Bangkok implant trip" },
    { handle: "@traveldentist",     country: "UK",     flag: "🇬🇧", subs: "67K",  topic: "Bangkok implant cost vs UK" },
    { handle: "@aussie_tooth",      country: "Australia", flag: "🇦🇺", subs: "44K", topic: "All-on-4 in Bangkok review" },
    { handle: "@dental_us_trip",    country: "USA",    flag: "🇺🇸", subs: "120K", topic: "Why 100K US patients fly to Bangkok" },
  ],
  hair: [
    { handle: "@modao_balding",     country: "Korea",  flag: "🇰🇷", subs: "450K", topic: "FUE 2,500 grafts Bangkok diary" },
    { handle: "@gulf_hair",         country: "Saudi",  flag: "🇸🇦", subs: "320K", topic: "Bangkok vs Istanbul hair clinic" },
    { handle: "@hairjourneys",      country: "USA",    flag: "🇺🇸", subs: "180K", topic: "12-month FUE growth video" },
    { handle: "@thaihair_uk",       country: "UK",     flag: "🇬🇧", subs: "72K",  topic: "DHI Bangkok vs UK turkey clinics" },
  ],
};

export default function InfluencerVisits({ focus }: { focus: SiteFocus }) {
  const list = FOCUS_INF[focus];
  if (!list) return null;

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="flex items-baseline justify-between gap-3 mb-3 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-rose-700">📹 Public coverage</div>
          <h3 className="text-base font-black mt-0.5">Influencers who came & vlogged it</h3>
        </div>
        <span className="text-xs text-[rgb(var(--muted))]">Search before you book — they did</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {list.map((inf, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3" style={{ borderColor: "rgb(var(--border))" }}>
            <span className="text-2xl shrink-0">{inf.flag}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{inf.handle}</div>
              <div className="text-[11px] text-[rgb(var(--muted))] truncate">{inf.topic}</div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              {inf.subs}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-[rgb(var(--muted))] mt-3 leading-relaxed">
        Not sponsored. We list public coverage so you can research independently — search these handles on YouTube/TikTok.
      </p>
    </section>
  );
}
