"use client";

import { AffiliateLink } from "@/components/AffiliateLink";
import { usePlanner } from "@/components/PlannerContext";
import type { PlanItem } from "@/lib/planner";

type Props = {
  bookingUrl: string;
  bookingProvider: string;
  bookingLabel: string;
  priceLabel: string;
  nicheSlug: string;
  placeId: string;
  planItem: PlanItem;
};

export function MobileStickyBar({ bookingUrl, bookingProvider, bookingLabel, priceLabel, nicheSlug, placeId, planItem }: Props) {
  const { add, remove, has, plan } = usePlanner();
  const inPlan = has(planItem.id, planItem.type);
  // PlannerBar renders fixed at bottom-16 (mobile) whenever the plan has items —
  // stack this bar above it instead of letting them overlap at the same offset.
  const bottomClass = plan.items.length > 0 ? "bottom-[7.5rem]" : "bottom-16";

  return (
    <div className={`fixed ${bottomClass} left-0 right-0 z-40 md:hidden p-3 bg-white border-t border-[var(--border)] shadow-lg`}>
      <div className="flex gap-2">
        <AffiliateLink
          href={bookingUrl}
          tracking={{ type: "affiliate", provider: bookingProvider, activityType: nicheSlug, surface: "detail", venueId: placeId }}
          className="flex-1 flex items-center justify-between py-3 px-4 rounded-2xl bg-orange-500 text-white font-bold active:bg-orange-600 active:scale-95 transition min-h-[44px]"
        >
          <span className="text-sm">🎟 {bookingLabel}</span>
          <span className="text-xs opacity-90">{priceLabel} →</span>
        </AffiliateLink>
        <button
          onClick={() => inPlan ? remove(planItem.id, planItem.type) : add(planItem)}
          className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl border-2 font-bold transition min-h-[44px] min-w-[44px] ${
            inPlan
              ? "bg-orange-500 border-orange-500 text-white"
              : "bg-white border-[var(--border)] text-[var(--muted)] hover:border-orange-400"
          }`}
          aria-label={inPlan ? "Remove from plan" : "Add to plan"}
        >
          {inPlan ? "✓" : "＋"}
        </button>
      </div>
    </div>
  );
}
