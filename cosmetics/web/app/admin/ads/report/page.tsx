import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdSlots } from "@/lib/ads";
import { getAllSlotMetrics } from "@/lib/ad-metrics";

export const dynamic = "force-dynamic";
export const metadata = { robots: "noindex" };

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

export default async function AdReportPage() {
  const jar = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || jar.get("admin_s")?.value !== expected) redirect("/admin");

  const [slots, metrics] = await Promise.all([getAdSlots(), getAllSlotMetrics()]);
  const byId = new Map(slots.map((s) => [s.id, s]));

  const grandImpressions = metrics.reduce((s, m) => s + m.totalImpressions, 0);
  const grandClicks = metrics.reduce((s, m) => s + m.totalClicks, 0);

  return (
    <main className="max-w-4xl mx-auto p-6 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/ads" className="text-sm text-gray-500 hover:underline">← Ad Slots</Link>
        <h1 className="text-2xl font-bold">Performance</h1>
        {/* A file download, not a route transition — next/link would prefetch
            the CSV and then navigate instead of saving it. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/admin/ads/report"
          className="ml-auto text-sm rounded-lg border px-3 py-1.5 hover:bg-gray-50"
        >
          Download CSV
        </a>
      </div>

      {metrics.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No impressions recorded yet. Counters start the first time a live slot is
          scrolled into view.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg border p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">Impressions</div>
              <div className="text-2xl font-bold tabular-nums">{fmt(grandImpressions)}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">Clicks</div>
              <div className="text-2xl font-bold tabular-nums">{fmt(grandClicks)}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-xs uppercase tracking-wide text-gray-500">CTR</div>
              <div className="text-2xl font-bold tabular-nums">
                {grandImpressions > 0
                  ? ((grandClicks / grandImpressions) * 100).toFixed(2) + "%"
                  : "—"}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {metrics.map((m) => {
              const slot = byId.get(m.slotId);
              return (
                <section key={m.slotId} className="rounded-lg border p-4">
                  <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                    <span className="font-semibold">
                      {slot ? slot.advertiserName : "(deleted slot)"}
                    </span>
                    <span className="text-sm text-gray-500">
                      {slot
                        ? `${slot.type}${slot.concern ? ` · ${slot.concern}` : ""} · ${slot.startsAt}→${slot.endsAt}`
                        : m.slotId}
                    </span>
                    <span className="ml-auto text-sm tabular-nums">
                      {fmt(m.totalImpressions)} imp · {fmt(m.totalClicks)} clk ·{" "}
                      {m.ctr === null ? "—" : m.ctr.toFixed(2) + "%"}
                    </span>
                  </header>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="py-1 pr-4 font-medium">Date</th>
                          <th className="py-1 pr-4 font-medium text-right">Impressions</th>
                          <th className="py-1 pr-4 font-medium text-right">Clicks</th>
                          <th className="py-1 font-medium text-right">CTR</th>
                        </tr>
                      </thead>
                      <tbody className="tabular-nums">
                        {m.days.map((d) => (
                          <tr key={d.date} className="border-b last:border-0">
                            <td className="py-1 pr-4">{d.date}</td>
                            <td className="py-1 pr-4 text-right">{fmt(d.impressions)}</td>
                            <td className="py-1 pr-4 text-right">{fmt(d.clicks)}</td>
                            <td className="py-1 text-right">
                              {d.impressions > 0
                                ? ((d.clicks / d.impressions) * 100).toFixed(2) + "%"
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
