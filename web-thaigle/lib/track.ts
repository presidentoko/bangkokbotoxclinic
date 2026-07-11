"use client";

import { track } from "@vercel/analytics";

// C5: consolidated event schema — all revenue-relevant events share this shape
export type AffiliateClickEvent = {
  type: "affiliate" | "lead" | "featured";
  provider: string;       // Klook | GetYourGuide | Viator | Travelpayouts | Direct | Line | Email
  activityType: string;   // niche slug, "restaurant", "day-plan", etc.
  surface: "detail" | "list" | "planner" | "dayplan" | "hub" | "tiktok" | "relax";
  area?: string;          // AreaSlug when surface=dayplan|hub
  theme?: string;         // ThemeSlug when surface=dayplan|hub
  planId?: string;        // shared plan ID when surface=planner
  venueId?: string;
  src?: string;           // utm source (tiktok, email, etc.)
};

export function trackAffiliateClick(event: AffiliateClickEvent) {
  try {
    track("affiliate_click", event as Record<string, string>);
  } catch {
    // non-fatal — analytics must never block navigation
  }
}

export function trackPlanSlotAssign(slot: string, venueId: string, venueType: string) {
  try {
    track("plan_slot_assign", { slot, venueId, venueType });
  } catch {}
}

export function trackTikTokConversion(venueId: string, action: "book" | "add_plan" | "day_plan") {
  try {
    track("tiktok_conversion", { venueId, action, src: "tiktok" });
  } catch {}
}

export function trackShare(medium: string, campaign: string) {
  try {
    track("share_click", { medium, campaign });
  } catch {}
}
