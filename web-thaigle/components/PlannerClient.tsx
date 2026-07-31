"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { decodePlan, TYPE_LABELS, planUrl } from "@/lib/planner";
import type { Plan, PlanItem, PlanItemType } from "@/lib/planner";
import { usePlanner } from "@/components/PlannerContext";
import { getAffiliateLink } from "@/lib/affiliate";
import { AffiliateLink } from "@/components/AffiliateLink";
import { trackShare } from "@/lib/track";
import { DayBuilder } from "@/components/DayBuilder";

const PLAN_TYPE_TO_ACTIVITY: Partial<Record<PlanItemType, string>> = {
  restaurant: "restaurant",
  wellness: "spa",
  gym: "muay-thai",
};

function PlannerContent() {
  const params = useSearchParams();
  const { plan: localPlan, remove, setTitle, clear } = usePlanner();

  const shared = params.get("d") ? decodePlan(params.get("d")!) : null;
  const plan: Plan = shared ?? localPlan;
  const isShared = !!shared;

  const [copied, setCopied] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tab, setTab] = useState<"saved" | "day">("day");

  const grouped = (Object.keys(TYPE_LABELS) as PlanItemType[])
    .map((type) => ({
      type,
      label: TYPE_LABELS[type],
      items: plan.items.filter((i) => i.type === type),
    }))
    .filter((g) => g.items.length > 0);

  function shareableUrl(medium: string) {
    // planUrl() already encodeURIComponent's the `d` payload — safe to append further params with `&`.
    return `${window.location.origin}${planUrl(plan)}&utm_source=share&utm_medium=${medium}&utm_campaign=plan`;
  }

  function copyLink() {
    trackShare("copy", "plan");
    navigator.clipboard.writeText(shareableUrl("copy"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function kakaoShare() {
    if (typeof window === "undefined") return;
    trackShare("kakao", "plan");
    window.open(
      `https://story.kakao.com/share?url=${encodeURIComponent(shareableUrl("kakao"))}`,
      "_blank"
    );
  }

  if (plan.items.length === 0) {
    return null; // Empty state is handled by server shell
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🗺️</span>
        {editingTitle && !isShared ? (
          <input
            autoFocus
            defaultValue={plan.title}
            onBlur={(e) => { setTitle(e.target.value); setEditingTitle(false); }}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
            className="text-2xl font-black border-b-2 border-orange-500 outline-none bg-transparent flex-1"
          />
        ) : (
          <h1 className="text-2xl font-black">
            {!isShared ? (
              <button
                type="button"
                onClick={() => setEditingTitle(true)}
                title="Click to edit title"
                className="cursor-pointer hover:text-orange-600 transition text-left"
              >
                {plan.title}
                <span className="text-sm text-[var(--muted)] font-normal ml-2">✏️</span>
              </button>
            ) : (
              plan.title
            )}
          </h1>
        )}
      </div>

      {/* Tabs */}
      {!isShared && (
        <div className="flex gap-1 mb-6 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-1">
          <button
            onClick={() => setTab("day")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${tab === "day" ? "bg-white shadow text-orange-600" : "text-[var(--muted)] hover:text-black"}`}
          >
            🗓 Day Plan
          </button>
          <button
            onClick={() => setTab("saved")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition ${tab === "saved" ? "bg-white shadow text-orange-600" : "text-[var(--muted)] hover:text-black"}`}
          >
            📋 Saved ({plan.items.length})
          </button>
        </div>
      )}

      {/* Day Plan tab */}
      {(tab === "day" || isShared) && !isShared && (
        <DayBuilder />
      )}

      {/* Saved tab */}
      {(tab === "saved" || isShared) && (
        <>
          <div className="space-y-6 mb-10">
            {grouped.map(({ type, label, items }) => (
              <section key={type}>
                <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--muted)] mb-3">
                  {label} ({items.length})
                </h2>
                <div className="space-y-2">
                  {items.map((item) => (
                    <PlanItemRow
                      key={`${type}-${item.id}`}
                      item={item}
                      isShared={isShared}
                      onRemove={() => remove(item.id, item.type)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {(() => {
            const bookable = plan.items.filter((i) => PLAN_TYPE_TO_ACTIVITY[i.type]);
            if (bookable.length === 0) return null;
            const link = getAffiliateLink({
              venue: { name: bookable[0].name },
              activityType: PLAN_TYPE_TO_ACTIVITY[bookable[0].type]!,
              city: bookable[0].city ?? "Bangkok",
            });
            const bookUrl = link.url.replace(/utm_campaign=[^&]+/, "utm_campaign=planner");
            return (
              <div className="mb-6 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
                <div className="font-black mb-1">Book your day</div>
                <p className="text-sm text-[var(--muted)] mb-3">
                  {bookable.length} bookable venue{bookable.length > 1 ? "s" : ""} in your plan
                </p>
                <AffiliateLink
                  href={bookUrl}
                  tracking={{ type: "affiliate", provider: link.provider, activityType: PLAN_TYPE_TO_ACTIVITY[bookable[0].type]!, surface: "planner" }}
                  className="inline-block bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition active:scale-95 text-sm"
                >
                  🎟 Book on {link.provider} →
                </AffiliateLink>
                <p className="text-xs text-[var(--muted)] mt-2">We may earn a commission. Rankings are never paid.</p>
              </div>
            );
          })()}
        </>
      )}

      <div className="flex flex-wrap gap-3 mb-6 mt-6">
        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-black text-white font-bold px-5 py-3 rounded-full hover:bg-gray-800 transition"
        >
          {copied ? "✓ Copied!" : "🔗 Copy link"}
        </button>
        <button
          onClick={kakaoShare}
          className="flex items-center gap-2 bg-[#FEE500] text-black font-bold px-5 py-3 rounded-full hover:opacity-90 transition"
        >
          💬 Share on KakaoTalk
        </button>
      </div>

      {!isShared && (
        <button
          onClick={clear}
          className="text-sm text-[var(--muted)] hover:text-red-500 transition"
        >
          Reset planner
        </button>
      )}
    </div>
  );
}

function PlanItemRow({ item, isShared, onRemove }: { item: PlanItem; isShared: boolean; onRemove: () => void }) {
  // Prefer the canonical URL captured at add-time; older/shared items may predate it,
  // so fall back to a route that's at least guaranteed to exist (never a guessed detail page).
  const href =
    item.url ??
    (item.type === "restaurant"
      ? `/restaurants/${item.city ?? "bangkok"}`
      : item.type === "clinic"
        ? "/clinics"
        : item.type === "dental"
          ? "/dental"
          : "/activities");
  const external = href.startsWith("http");

  const activityType = PLAN_TYPE_TO_ACTIVITY[item.type];
  const bookLink = activityType
    ? getAffiliateLink({ venue: { name: item.name }, activityType, city: item.city ?? "Bangkok" })
    : null;
  const bookUrl = bookLink
    ? bookLink.url.replace(/utm_campaign=[^&]+/, "utm_campaign=planner")
    : null;

  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-[var(--border)] rounded-xl p-4 hover:border-orange-300 transition">
      <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className="min-w-0 flex-1">
        <div className="font-bold text-sm truncate">{item.name}</div>
        <div className="text-xs text-[var(--muted)]">
          {item.district && <span>📍 {item.district}</span>}
          {item.rating && <span className="ml-2">★ {item.rating.toFixed(1)}</span>}
        </div>
      </a>
      <div className="flex items-center gap-2 shrink-0">
        {bookUrl && bookLink && (
          <AffiliateLink
            href={bookUrl}
            tracking={{ type: "affiliate", provider: bookLink.provider, activityType: activityType!, surface: "planner", venueId: item.id }}
            className="text-xs font-bold bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition active:scale-95"
          >
            Book →
          </AffiliateLink>
        )}
        {!isShared && (
          <button
            onClick={onRemove}
            className="text-[var(--muted)] hover:text-red-500 text-xl leading-none transition"
            aria-label="Remove"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export function PlannerClient() {
  return (
    <Suspense>
      <PlannerContent />
    </Suspense>
  );
}
