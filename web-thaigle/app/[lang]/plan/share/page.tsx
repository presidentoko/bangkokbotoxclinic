import type { Metadata } from "next";
import type { PlanItem } from "@/lib/plan/store";
import { CATEGORY_COLORS } from "@/lib/plan/store";
import { localsScoreColor } from "@/lib/localsScoreColor";
import { placeHref } from "@/lib/placeIndexing";

export const dynamic = "force-dynamic";

interface SharePageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ d?: string }>;
}

function parsePlanItems(d: string): PlanItem[] {
  try {
    const data = JSON.parse(Buffer.from(d, "base64").toString());
    if (!Array.isArray(data?.items)) return [];
    return data.items.filter(
      (it: unknown): it is PlanItem =>
        !!it && typeof it === "object" && (it as PlanItem).category in CATEGORY_COLORS
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ searchParams }: SharePageProps): Promise<Metadata> {
  const { d } = await searchParams;
  let title = "Bangkok Day Plan — Thaigle";
  let description = "A curated Bangkok day itinerary from Thaigle.";

  if (d) {
    const items = parsePlanItems(d);
    if (items.length > 0) {
      const names = items.slice(0, 4).map((it) => it.name).join(" → ");
      title = `Bangkok Day: ${names} — Thaigle`;
      description = `${items.length}-stop Bangkok day plan: ${names}. Each place verified by real reviews.`;
    }
  }

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: { title, description },
  };
}

export default async function SharePage({ params, searchParams }: SharePageProps) {
  const { lang: rawLang } = await params;
  const { d } = await searchParams;
  const items: PlanItem[] = d ? parsePlanItems(d) : [];

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-4xl mb-3">📋</div>
        <h1 className="font-black text-xl mb-2">Plan not found</h1>
        <p className="text-sm text-[var(--muted)] mb-5">This plan link may be invalid or expired.</p>
        <a href="/activities" className="px-4 py-2.5 rounded-full bg-orange-500 text-white font-bold text-sm">
          Build your own →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1 block">Shared plan</span>
        <h1 className="text-2xl font-black mb-1">Bangkok Day — {items.length} stops</h1>
        <p className="text-sm text-[var(--muted)]">Verified by real reviews · No sponsored picks</p>
      </div>

      {/* Readonly timeline */}
      <div className="space-y-3 mb-8">
        {items.map((item, i) => {
          const colors = CATEGORY_COLORS[item.category];
          const scoreColor = localsScoreColor(item.localsScore);
          return (
            <div key={item.slug} className="flex gap-3 bg-white border border-[var(--border)] rounded-2xl p-4">
              <div className="text-xs font-black text-[var(--muted)] w-6 shrink-0 pt-0.5">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <span
                  className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
                  style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  {item.category}
                </span>
                <div className="flex items-center justify-between gap-2">
                  <a href={placeHref(rawLang, item.slug)} className="font-black text-sm hover:text-orange-700 truncate">
                    {item.name}
                  </a>
                  <span className="font-black text-sm shrink-0" style={{ color: scoreColor }}>
                    {item.localsScore}
                  </span>
                </div>
                {item.dataSays && (
                  <p className="text-xs text-[var(--muted)] mt-1 line-clamp-2">{item.dataSays}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clone CTA */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 text-center">
        <div className="font-black mb-1">Build your own plan</div>
        <p className="text-sm text-[var(--muted)] mb-3">Browse verified places, add to your timeline, optimize route.</p>
        <a
          href="/activities"
          className="inline-block px-5 py-2.5 rounded-full bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition"
        >
          Start planning →
        </a>
      </div>
    </div>
  );
}
