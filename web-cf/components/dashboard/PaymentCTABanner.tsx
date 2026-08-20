"use client";
// Sticky payment CTA — first thing partner sees. Shows ROI math, free-trial CTA, monthly price.
// Hidden for already-paying partners. Persists dismiss for 7 days via localStorage.

import { useEffect, useState } from "react";

const DISMISS_KEY = "dash_cta_dismissed_at";
const DISMISS_DAYS = 7;
const MONTHLY_THB = 8_000;
const FACEBOOK_CAC_THB = 2_800; // Bangkok beauty-clinic CAC industry avg

export function PaymentCTABanner({
  clinicName,
  isPartner = false,
  recentLeadsCount = 0,
}: {
  clinicName: string;
  isPartner?: boolean;
  recentLeadsCount?: number;
}) {
  const [dismissed, setDismissed] = useState(true); // hidden until we check localStorage

  useEffect(() => {
    if (isPartner) return;
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (!dismissedAt) { setDismissed(false); return; }
    const daysAgo = (Date.now() - Number(dismissedAt)) / 86_400_000;
    if (daysAgo > DISMISS_DAYS) setDismissed(false);
  }, [isPartner]);

  if (isPartner || dismissed) return null;

  // ROI math — assumes ฿15K avg ticket, 40% close rate from form-lead → procedure
  const leadsNeededToBreakeven = Math.ceil(MONTHLY_THB / (15_000 * 0.4));

  return (
    <div className="sticky top-14 z-20 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="hidden sm:grid h-10 w-10 place-items-center rounded-xl bg-white/20 text-xl shrink-0">⚡</span>
          <div className="min-w-0">
            <div className="text-sm font-black truncate">
              You&apos;re seeing the live dashboard for <span className="underline decoration-2">{clinicName}</span>
            </div>
            <div className="text-xs opacity-90 leading-snug">
              {recentLeadsCount > 0
                ? <>You already received <strong>{recentLeadsCount}</strong> lead{recentLeadsCount === 1 ? "" : "s"} this period — claim them before they expire.</>
                : <>Claim this dashboard to keep AI reply tool, lead inbox, and weekly intel report.</>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="hidden md:block text-right text-[10px] leading-tight opacity-90 pr-1">
            <div className="font-bold">฿{MONTHLY_THB.toLocaleString()}/mo</div>
            <div>Breaks even at {leadsNeededToBreakeven} leads</div>
          </div>
          <a
            href="/for-clinics#pricing"
            className="rounded-xl bg-white text-emerald-800 px-4 py-2 text-sm font-black shadow hover:bg-emerald-50 whitespace-nowrap"
          >
            Start 30-day free trial →
          </a>
          <button
            onClick={() => {
              localStorage.setItem(DISMISS_KEY, String(Date.now()));
              setDismissed(true);
            }}
            className="text-white/70 hover:text-white text-xs px-2 py-1 whitespace-nowrap"
            aria-label="Dismiss for a week"
          >
            Later
          </button>
        </div>
      </div>
      {/* Stripe-style breakdown — only desktop */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 pb-2 text-[11px] flex gap-6 text-white/85">
        <span>✓ Cancel anytime · no contract</span>
        <span className="ml-6">✓ Free until you get 5 leads</span>
        <span className="ml-6">✓ Bangkok Facebook ad CAC ≈ ฿{FACEBOOK_CAC_THB.toLocaleString()}/lead — we charge once</span>
      </div>
    </div>
  );
}
