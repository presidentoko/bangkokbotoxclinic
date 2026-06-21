"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { decodePlan, TYPE_LABELS, planUrl } from "@/lib/planner";
import type { Plan, PlanItem, PlanItemType } from "@/lib/planner";
import { usePlanner } from "@/components/PlannerContext";

function PlannerContent() {
  const params = useSearchParams();
  const { plan: localPlan, remove, setTitle, clear } = usePlanner();

  const shared = params.get("d") ? decodePlan(params.get("d")!) : null;
  const plan: Plan = shared ?? localPlan;
  const isShared = !!shared;

  const [copied, setCopied] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  const grouped = (Object.keys(TYPE_LABELS) as PlanItemType[])
    .map((type) => ({
      type,
      label: TYPE_LABELS[type],
      items: plan.items.filter((i) => i.type === type),
    }))
    .filter((g) => g.items.length > 0);

  function copyLink() {
    const url = `${window.location.origin}${planUrl(plan)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function kakaoShare() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${planUrl(plan)}`;
    window.open(
      `https://sharer.kakao.com/talk/friends/picker/link?app_key=&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  }

  if (plan.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <h1 className="text-2xl font-black mb-3">플래너가 비어있어요</h1>
        <p className="text-[var(--muted)] mb-6">
          맛집, 클리닉, 웰니스 페이지에서 &quot;+ 플래너에 추가&quot;를 눌러
          여행 코스를 만들어보세요.
        </p>
        <a
          href="/"
          className="inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition"
        >
          맛집 둘러보기 →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 제목 */}
      <div className="flex items-center gap-3 mb-8">
        <span className="text-4xl">🗺️</span>
        {editingTitle && !isShared ? (
          <input
            autoFocus
            defaultValue={plan.title}
            onBlur={(e) => {
              setTitle(e.target.value);
              setEditingTitle(false);
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.target as HTMLInputElement).blur()
            }
            className="text-2xl font-black border-b-2 border-orange-500 outline-none bg-transparent"
          />
        ) : (
          <h1
            className={`text-2xl font-black ${!isShared ? "cursor-pointer hover:text-orange-600 transition" : ""}`}
            onClick={() => !isShared && setEditingTitle(true)}
            title={!isShared ? "클릭해서 제목 편집" : undefined}
          >
            {plan.title}
            {!isShared && (
              <span className="text-sm text-[var(--muted)] font-normal ml-2">
                ✏️
              </span>
            )}
          </h1>
        )}
      </div>

      {/* 카테고리별 리스트 */}
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

      {/* 공유 버튼 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={copyLink}
          className="flex items-center gap-2 bg-black text-white font-bold px-5 py-3 rounded-full hover:bg-gray-800 transition"
        >
          {copied ? "✓ 복사됨!" : "🔗 링크 복사"}
        </button>
        <button
          onClick={kakaoShare}
          className="flex items-center gap-2 bg-[#FEE500] text-black font-bold px-5 py-3 rounded-full hover:opacity-90 transition"
        >
          💬 카카오톡 공유
        </button>
      </div>

      {!isShared && (
        <button
          onClick={clear}
          className="text-sm text-[var(--muted)] hover:text-red-500 transition"
        >
          플래너 초기화
        </button>
      )}
    </div>
  );
}

function PlanItemRow({
  item,
  isShared,
  onRemove,
}: {
  item: PlanItem;
  isShared: boolean;
  onRemove: () => void;
}) {
  const href =
    item.type === "restaurant"
      ? `/restaurants/${item.city ?? "bangkok"}/${(item.district ?? "other").toLowerCase().replace(/\s+/g, "-")}/${item.id}`
      : item.type === "clinic"
        ? `/clinics/${item.id}`
        : `/dental/${item.id}`;

  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-[var(--border)] rounded-xl p-4 hover:border-orange-300 transition">
      <a href={href} className="min-w-0 flex-1">
        <div className="font-bold text-sm truncate">{item.name}</div>
        <div className="text-xs text-[var(--muted)]">
          {item.district && <span>📍 {item.district}</span>}
          {item.rating && (
            <span className="ml-2">★ {item.rating.toFixed(1)}</span>
          )}
        </div>
      </a>
      {!isShared && (
        <button
          onClick={onRemove}
          className="text-[var(--muted)] hover:text-red-500 text-xl leading-none transition"
          aria-label="제거"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense>
      <PlannerContent />
    </Suspense>
  );
}
