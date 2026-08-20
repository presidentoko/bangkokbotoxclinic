// Pricing-vs-market widget. Shows clinic's published price against district median per service.
// Extracted from DashboardView.

import type { Clinic } from "@/lib/types";
import { Card } from "./parts";

const SERVICE_LABELS: Record<string, string> = {
  botox: "Botox", filler: "Filler", hifu: "HIFU", facial: "Facial",
  laser: "Laser", dental: "Dental", hair_transplant: "Hair transplant", eye: "Eye / LASIK",
};

type Stat = {
  svc: string;
  mine: { price_min_thb: number; price_max_thb: number } | undefined;
  median: number | null;
  myMid: number | null;
  deltaPct: number | null;
  sampleSize: number;
};

function PriceLevel({ stat }: { stat: Stat }) {
  const { svc, mine, median, deltaPct, sampleSize } = stat;
  const label = SERVICE_LABELS[svc] ?? svc;
  const status: "high" | "low" | "fair" | "unknown" =
    deltaPct === null ? "unknown" : deltaPct > 20 ? "high" : deltaPct < -15 ? "low" : "fair";
  const statusMeta = {
    high:    { color: "#dc2626", bg: "#fee2e2", note: "above market — may lose price-sensitive leads" },
    low:     { color: "#0891b2", bg: "#cffafe", note: "below market — leaving money on table" },
    fair:    { color: "#16a34a", bg: "#dcfce7", note: "competitive — within ±15% of median" },
    unknown: { color: "#737373", bg: "#f5f5f5", note: "no price published yet" },
  }[status];

  return (
    <div className="border border-[var(--border)] rounded-lg p-3" style={{ background: statusMeta.bg + "30" }}>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="font-bold text-sm">{label}</span>
        {deltaPct !== null && (
          <span className="text-xs font-bold tabular-nums" style={{ color: statusMeta.color }}>
            {deltaPct > 0 ? "+" : ""}{deltaPct}% vs market
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 text-xs">
        <div className="flex-1">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">Your price</div>
          <div className="tabular-nums font-bold">
            {mine ? `฿${mine.price_min_thb.toLocaleString()}–${mine.price_max_thb.toLocaleString()}` : <span className="text-[var(--muted)] font-normal">not on website</span>}
          </div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">District median</div>
          <div className="tabular-nums font-bold">
            {median !== null ? `฿${Math.round(median).toLocaleString()}` : <span className="text-[var(--muted)] font-normal">collecting (n={sampleSize})</span>}
          </div>
        </div>
      </div>
      <div className="text-[11px] mt-2" style={{ color: statusMeta.color }}>
        {statusMeta.note}
      </div>
    </div>
  );
}

// Demo prices for sales pitch — realistic Bangkok ranges (THB).
const DEMO_PRICES: Record<string, { min: number; max: number; median: number; sampleSize: number }> = {
  botox:           { min: 4500,  max: 12000,  median: 7500,  sampleSize: 28 },
  filler:          { min: 8000,  max: 18000,  median: 11500, sampleSize: 22 },
  hifu:            { min: 12000, max: 38000,  median: 22000, sampleSize: 14 },
  facial:          { min: 1500,  max: 6500,   median: 3200,  sampleSize: 41 },
  laser:           { min: 3500,  max: 15000,  median: 7800,  sampleSize: 19 },
  dental:          { min: 800,   max: 4500,   median: 1800,  sampleSize: 53 },
  hair_transplant: { min: 60000, max: 250000, median: 145000,sampleSize: 11 },
  eye:             { min: 35000, max: 95000,  median: 58000, sampleSize: 8  },
};

export function PricingIntelCard({ clinic: c, competitors, isDemo = false }: { clinic: Clinic; competitors: Clinic[]; isDemo?: boolean }) {
  const myPricing = c.pricing ?? [];
  const allPricing = [c, ...competitors].flatMap((x) => x.pricing ?? []);
  const services = Array.from(new Set([
    ...myPricing.map((p) => p.service),
    ...c.categories.slice(0, 4),
  ]));

  const serviceStats: Stat[] = services.map((svc) => {
    let mine = myPricing.find((p) => p.service === svc);
    const market = allPricing.filter((p) => p.service === svc);
    let marketMid = market.length
      ? market.map((p) => (p.price_min_thb + p.price_max_thb) / 2).sort((a, b) => a - b)
      : [];
    let median = marketMid.length ? marketMid[Math.floor(marketMid.length / 2)] : null;
    let sampleSize = market.length;

    // Demo fallback — show plausible Bangkok pricing for sales pitch
    if (isDemo && !mine && DEMO_PRICES[svc]) {
      const d = DEMO_PRICES[svc];
      mine = { service: svc, unit_label: "session", price_min_thb: d.min, price_max_thb: d.max, source_url: "", last_checked: new Date().toISOString() };
      median = d.median;
      sampleSize = d.sampleSize;
    }

    const myMid = mine ? (mine.price_min_thb + mine.price_max_thb) / 2 : null;
    const deltaPct = (myMid !== null && median !== null && median > 0) ? Math.round(((myMid - median) / median) * 100) : null;
    return { svc, mine, median, myMid, deltaPct, sampleSize };
  });

  const trackedCount = serviceStats.filter((s) => s.mine !== undefined).length;

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>💰</span> Pricing intelligence
        </h2>
        <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-amber-100 text-amber-800">
          {trackedCount > 0 ? `${trackedCount} tracked` : "Auto-scrape pending"}
        </span>
      </div>
      <p className="text-xs text-[var(--muted)] mb-3">
        Your published prices vs district median. Updated weekly from public clinic websites.
      </p>
      <div className="space-y-3 mt-4">
        {serviceStats.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center">
            <p className="text-sm font-bold">No price data yet</p>
            <p className="text-xs text-[var(--muted)] mt-1">
              We auto-scrape your website weekly. Add prices to your site or upload manually to populate.
            </p>
          </div>
        ) : serviceStats.map((s) => (
          <PriceLevel key={s.svc} stat={s} />
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs text-[var(--muted)]">
          Source: public clinic websites. We never share your prices with competitors.
        </span>
        <button className="text-xs font-bold px-3 py-2 rounded-lg border border-[var(--border)] bg-white hover:bg-gray-50">
          📊 Full price report
        </button>
      </div>
    </Card>
  );
}
