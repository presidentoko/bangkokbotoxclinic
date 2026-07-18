import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, LOCALES } from "@/lib/i18n";
import { getRecentPriceChanges, type PriceTrendRow } from "@/lib/db";

export const revalidate = 86400;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  return {
    title: "Health Checkup Price Trends — Which Packages Got Cheaper?",
    description: "See which health check-up packages in Thailand have recently changed price. Track price drops and increases across Bangkok, Phuket, Chiang Mai hospitals.",
    alternates: {
      canonical: `${BASE}/${locale}/trends`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/trends`])),
    },
  };
}

export default async function TrendsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let trends: PriceTrendRow[] = [];
  try {
    trends = await getRecentPriceChanges(30);
  } catch {
    // DB not ready
  }

  const drops = trends.filter((t) => t.change_pct < 0).sort((a, b) => a.change_pct - b.change_pct);
  const rises = trends.filter((t) => t.change_pct > 0).sort((a, b) => b.change_pct - a.change_pct);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">Price Trends</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Health Checkup Price Trends</h1>
      <p className="text-slate-500 mb-8">Prices updated weekly by our scrapers. Last checked: today.</p>

      {trends.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <p className="text-4xl mb-3">📊</p>
          <h2 className="font-bold text-slate-800 mb-2">Price history building up</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            We track prices daily. Price trend data will appear here once we have multiple snapshots for comparison.
            Check back in a few days to see which packages have moved.
          </p>
          <Link href={`/${locale}/compare`}
            className="mt-4 inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">
            Browse current prices →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Price drops */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📉</span>
              <h2 className="text-lg font-bold text-slate-800">Price Drops</h2>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{drops.length}</span>
            </div>
            {drops.length === 0 ? (
              <p className="text-slate-400 text-sm">No price drops detected recently.</p>
            ) : (
              <div className="space-y-3">
                {drops.map((t) => (
                  <div key={t.package_id} className="bg-white border border-emerald-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/${locale}/hospital/${t.hospital_slug}`}
                          className="font-semibold text-slate-800 hover:text-blue-700 text-sm">
                          {t.hospital_name}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">{t.package_name}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="text-emerald-600 font-bold text-sm">{t.change_pct}%</p>
                        <p className="text-xs text-slate-400 line-through">฿{t.prev_price.toLocaleString()}</p>
                        <p className="text-sm font-bold text-slate-800">฿{t.latest_price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Price rises */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📈</span>
              <h2 className="text-lg font-bold text-slate-800">Price Increases</h2>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{rises.length}</span>
            </div>
            {rises.length === 0 ? (
              <p className="text-slate-400 text-sm">No price increases detected recently.</p>
            ) : (
              <div className="space-y-3">
                {rises.map((t) => (
                  <div key={t.package_id} className="bg-white border border-red-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/${locale}/hospital/${t.hospital_slug}`}
                          className="font-semibold text-slate-800 hover:text-blue-700 text-sm">
                          {t.hospital_name}
                        </Link>
                        <p className="text-xs text-slate-500 mt-0.5">{t.package_name}</p>
                      </div>
                      <div className="text-end shrink-0">
                        <p className="text-red-500 font-bold text-sm">+{t.change_pct}%</p>
                        <p className="text-xs text-slate-400 line-through">฿{t.prev_price.toLocaleString()}</p>
                        <p className="text-sm font-bold text-slate-800">฿{t.latest_price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <div className="mt-10 bg-slate-50 rounded-2xl p-6 text-sm text-slate-500 border border-slate-200">
        <h3 className="font-semibold text-slate-700 mb-2">About our price tracking</h3>
        <p className="leading-relaxed">
          BangkokCheckup scrapes prices directly from hospital websites weekly. We snapshot prices every day
          and compare them to detect changes. This page shows packages where the officially listed price has
          changed since our last snapshot. Prices shown may differ slightly from the hospital website due to
          timing of updates. Always confirm the price directly with the hospital before booking.
        </p>
      </div>
    </div>
  );
}
