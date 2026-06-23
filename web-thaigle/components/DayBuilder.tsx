"use client";

import { useState } from "react";
import { usePlanner } from "@/components/PlannerContext";
import { AffiliateLink } from "@/components/AffiliateLink";
import { getAffiliateLink } from "@/lib/affiliate";
import { trackAffiliateClick } from "@/lib/track";
import { track } from "@vercel/analytics";
import {
  SLOT_DEFS, SLOT_ORDER, TYPE_LABELS, TYPE_PRICE_ESTIMATE,
  getSlottedItems, getUnslottedItems, estimateSpend,
} from "@/lib/planner";
import type { SlotKey, PlanItem, PlanItemType } from "@/lib/planner";

const PLAN_TYPE_TO_ACTIVITY: Partial<Record<PlanItemType, string>> = {
  restaurant: "restaurant",
  wellness: "spa",
  gym: "muay-thai",
};

function itemBookLink(item: PlanItem, surface: "planner") {
  const activityType = PLAN_TYPE_TO_ACTIVITY[item.type];
  if (!activityType) return null;
  const link = getAffiliateLink({ venue: { name: item.name }, activityType, city: item.city ?? "Bangkok" });
  const url = link.url.replace(/utm_campaign=[^&]+/, "utm_campaign=planner");
  return { ...link, url };
}

export function DayBuilder() {
  const { plan, assignSlot, remove, add } = usePlanner();
  const [activeSlot, setActiveSlot] = useState<SlotKey | null>(null);

  const slotted = getSlottedItems(plan);
  const unslotted = getUnslottedItems(plan);
  const allSlottedItems = SLOT_ORDER.map((s) => slotted[s]).filter(Boolean) as PlanItem[];
  const spend = estimateSpend(allSlottedItems);
  const bookableSlotted = allSlottedItems.filter((i) => PLAN_TYPE_TO_ACTIVITY[i.type]);

  function selectSlot(slot: SlotKey) {
    setActiveSlot(activeSlot === slot ? null : slot);
  }

  function placeInSlot(item: PlanItem, slot: SlotKey) {
    assignSlot(item.id, item.type, slot);
    track("plan_slot_assign", { slot, venueId: item.id, venueType: item.type });
    setActiveSlot(null);
  }

  function clearSlot(slot: SlotKey) {
    const item = slotted[slot];
    if (item) assignSlot(item.id, item.type, null);
  }

  // Summary "Book your day" — first bookable slotted item's provider
  const summaryLink = bookableSlotted.length > 0 ? itemBookLink(bookableSlotted[0], "planner") : null;

  return (
    <div className="space-y-3">
      {/* Timeline slots */}
      {SLOT_ORDER.map((slot) => {
        const def = SLOT_DEFS[slot];
        const placed = slotted[slot];
        const isActive = activeSlot === slot;
        const book = placed ? itemBookLink(placed, "planner") : null;

        return (
          <div key={slot}>
            {/* Slot card */}
            <div
              className={`rounded-2xl border-2 transition ${
                isActive
                  ? "border-orange-400 bg-orange-50"
                  : placed
                    ? "border-[var(--border)] bg-white"
                    : "border-dashed border-[var(--border)] bg-white/60"
              }`}
            >
              {placed ? (
                // Filled slot
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{def.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] shrink-0">{def.label}</span>
                    </div>
                    <button
                      onClick={() => clearSlot(slot)}
                      className="text-[var(--muted)] hover:text-red-500 text-sm transition shrink-0"
                      aria-label={`Remove ${placed.name} from ${def.label}`}
                    >
                      × Remove
                    </button>
                  </div>
                  <div className="font-black text-base leading-tight mb-1">{placed.name}</div>
                  <div className="text-xs text-[var(--muted)] mb-3 flex items-center gap-2 flex-wrap">
                    {placed.trust_score && (
                      <span className="font-bold text-green-700">Trust {Math.min(100, placed.trust_score)}</span>
                    )}
                    {placed.rating && <span>★ {placed.rating.toFixed(1)}</span>}
                    {placed.price_min_thb ? (
                      <span>฿{placed.price_min_thb.toLocaleString()}</span>
                    ) : (
                      <span className="text-[var(--muted)]">฿{TYPE_PRICE_ESTIMATE[placed.type].min.toLocaleString()}–{TYPE_PRICE_ESTIMATE[placed.type].max.toLocaleString()} est.</span>
                    )}
                  </div>
                  {book && (
                    <AffiliateLink
                      href={book.url}
                      tracking={{ type: "affiliate", provider: book.provider, activityType: PLAN_TYPE_TO_ACTIVITY[placed.type]!, surface: "planner", venueId: placed.id }}
                      className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition active:scale-95"
                    >
                      <span>🎟 {book.isDirect ? `Book on ${book.provider}` : `Find on ${book.provider}`}</span>
                      <span className="opacity-80">→</span>
                    </AffiliateLink>
                  )}
                </div>
              ) : (
                // Empty slot
                <button
                  onClick={() => selectSlot(slot)}
                  className="w-full p-4 flex items-center gap-3 text-left"
                >
                  <span className="text-xl">{def.icon}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold">{def.label}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {isActive ? "↓ Pick from saved venues below" : def.hint}
                    </div>
                  </div>
                  <span className="ml-auto text-orange-500 font-bold text-lg shrink-0">
                    {isActive ? "−" : "+"}
                  </span>
                </button>
              )}
            </div>

            {/* Venue picker tray — shown below active slot */}
            {isActive && (
              <div className="mt-2 space-y-2">
                {unslotted.length > 0 ? (
                  <>
                    <p className="text-xs text-[var(--muted)] px-1">Saved venues — tap to add to {def.label}:</p>
                    {unslotted.map((item) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        onClick={() => placeInSlot(item, slot)}
                        className="w-full flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[var(--border)] hover:border-orange-400 hover:bg-orange-50 transition text-left active:scale-98"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm truncate">{item.name}</div>
                          <div className="text-xs text-[var(--muted)]">{TYPE_LABELS[item.type]}{item.rating ? ` · ★${item.rating.toFixed(1)}` : ""}</div>
                        </div>
                        <span className="text-orange-500 font-bold shrink-0">Add →</span>
                      </button>
                    ))}
                  </>
                ) : (
                  <p className="text-xs text-[var(--muted)] px-1">No saved venues yet — browse below and save venues first.</p>
                )}
                <a
                  href={def.deepLink}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white border border-dashed border-orange-300 text-orange-600 text-xs font-bold hover:bg-orange-50 transition"
                >
                  {def.icon} Find {def.label} venues →
                </a>
              </div>
            )}
          </div>
        );
      })}

      {/* Spend summary + Book your day */}
      {allSlottedItems.length > 0 && (
        <div className="mt-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
            <div>
              <div className="font-black text-base">Your day plan</div>
              <div className="text-sm text-[var(--muted)]">
                {allSlottedItems.length} venue{allSlottedItems.length > 1 ? "s" : ""}
                {spend.min > 0 && ` · ฿${spend.min.toLocaleString()}–฿${spend.max.toLocaleString()} est.`}
              </div>
            </div>
            {summaryLink && (
              <AffiliateLink
                href={summaryLink.url}
                tracking={{ type: "affiliate", provider: summaryLink.provider, activityType: "dayplan", surface: "dayplan" }}
                className="shrink-0 text-sm font-bold bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition active:scale-95"
              >
                🎟 Book your day →
              </AffiliateLink>
            )}
          </div>
          <p className="text-xs text-[var(--muted)]">We may earn a commission. Rankings are never paid.</p>
        </div>
      )}

      {/* Unslotted items tray */}
      {unslotted.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-2">
            Saved · not yet placed ({unslotted.length})
          </p>
          <div className="space-y-2">
            {unslotted.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[var(--border)]"
              >
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{item.name}</div>
                  <div className="text-xs text-[var(--muted)]">{TYPE_LABELS[item.type]}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => selectSlot("morning")}
                    className="text-xs font-bold text-orange-600 hover:text-orange-800 transition"
                  >
                    Place →
                  </button>
                  <button
                    onClick={() => remove(item.id, item.type)}
                    className="text-[var(--muted)] hover:text-red-500 text-lg leading-none transition"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
