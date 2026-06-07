import { TOPIC_LABELS } from "@/lib/types";

const POSITIVE_TOPICS = new Set([
  "high_quality", "on_time", "export_ready", "oem_odm", "responsive",
  "competitive_price", "low_moq", "iso_certified", "food_safety",
  "english_support", "chinese_support", "korean_support", "japanese_support",
  "modern_machinery", "clean_facility", "bulk_orders", "samples_available",
  "factory_tour", "experienced", "warehouse_large", "good_packaging",
  "good_location", "friendly_staff",
]);

const WARNING_TOPICS = new Set([
  "poor_quality", "delayed", "unresponsive", "expensive", "outdated",
]);

type Props = {
  topics: { topic: string; count: number }[];
  totalReviews: number;
};

export function BuyerSignals({ topics, totalReviews }: Props) {
  const active = topics.filter((t) => t.count > 0);
  if (active.length === 0) return null;

  const positives = active.filter((t) => POSITIVE_TOPICS.has(t.topic));
  const warnings = active.filter((t) => WARNING_TOPICS.has(t.topic));

  return (
    <section>
      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-widest font-bold text-amber-700 mb-1">From buyers</div>
        <h2 className="text-xl md:text-2xl font-bold text-stone-900 font-display">
          Buyer signals
          <span className="text-sm font-normal text-stone-500 ml-2">
            · from {totalReviews.toLocaleString()} reviews
          </span>
        </h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {positives.map((t) => (
          <span
            key={t.topic}
            className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            {TOPIC_LABELS[t.topic] ?? t.topic}
            <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
              {t.count}
            </span>
          </span>
        ))}
        {warnings.map((t) => (
          <span
            key={t.topic}
            className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-800 border border-orange-200 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            ⚠ {TOPIC_LABELS[t.topic] ?? t.topic}
            <span className="bg-orange-200 text-orange-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums">
              {t.count}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
