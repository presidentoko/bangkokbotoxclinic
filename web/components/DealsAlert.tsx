"use client";
// Limited-time deal popup, BL/BR aware (avoids LiveChat + SocialProofToasts).
// Shows after 30s on first visit. Countdown is "ends in N hours" based on midnight.
// Dismiss persists 24 hours.

import { useEffect, useState } from "react";

const KEY = "deals_alert_dismissed_v1";
const DISMISS_HOURS = 24;

const DEALS = [
  { focus: "botox",  emoji: "💉", title: "Botox brand verification week", body: "Partners running verified-brand promos this week. Genuine Allergan from ฿180/unit." },
  { focus: "dental", emoji: "🦷", title: "Implant package month",         body: "Several clinics offer all-in single-implant pricing this month — flight + hotel often beats Korea." },
  { focus: "filler", emoji: "💋", title: "Filler restock window",         body: "New Juvederm/Restylane batches just arrived — get expiry-fresh syringes through April." },
  { focus: "hifu",   emoji: "⚡", title: "Ulthera promo period",          body: "Single Ulthera session bundles + free face mapping at top 3 clinics." },
  { focus: "facial", emoji: "✨", title: "HydraFacial bundle",            body: "3-session HydraFacial packages 15-20% off at participating clinics." },
  { focus: "laser",  emoji: "🔬", title: "Pico promo running",            body: "Pico laser face session bundles — buy 3 get 1 free at 5 verified clinics." },
  { focus: "hair",   emoji: "💇", title: "FUE off-season window",         body: "May/June off-season — top 3 hair clinics offer 8-12% off vs Dec/Jan peak." },
  { focus: "all",    emoji: "🎁", title: "Free consult week",             body: "All paid partners waive first consult fee — average ฿1,500 saved before procedure." },
];

function hoursUntilMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return Math.ceil((tomorrow.getTime() - now.getTime()) / 3600_000);
}

export default function DealsAlert() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.location.pathname.startsWith("/dashboard") || window.location.pathname.startsWith("/admin")) return;
    const ts = localStorage.getItem(KEY);
    if (ts) {
      const hoursAgo = (Date.now() - Number(ts)) / 3600_000;
      if (hoursAgo < DISMISS_HOURS) return;
    }
    const t = setTimeout(() => setOpen(true), 30_000);
    return () => clearTimeout(t);
  }, []);

  if (!mounted || !open) return null;

  // Pick deal — try to match URL focus, else "all"
  const path = window.location.pathname.toLowerCase();
  const deal = DEALS.find((d) => path.includes(d.focus)) || DEALS.find((d) => d.focus === "all")!;
  const remaining = hoursUntilMidnight();

  function dismiss() {
    localStorage.setItem(KEY, String(Date.now()));
    setOpen(false);
  }

  return (
    <div className="fixed bottom-24 right-6 z-30 w-[92vw] max-w-sm rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-400 shadow-2xl overflow-hidden toast-fade-up print:hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-between">
        <span>⏰ Ends in {remaining}h</span>
        <span>Limited</span>
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl shrink-0 leading-none">{deal.emoji}</span>
          <div className="flex-1">
            <div className="font-black text-sm leading-snug">{deal.title}</div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">{deal.body}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <a href="#booking" onClick={dismiss}
            className="flex-1 rounded-lg bg-amber-700 text-white text-xs font-black px-3 py-2 text-center hover:bg-amber-800">
            Claim — free
          </a>
          <button onClick={dismiss}
            className="rounded-lg bg-white border border-amber-400 text-amber-900 text-xs font-bold px-3 py-2 hover:bg-amber-50">
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
