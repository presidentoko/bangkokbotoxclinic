import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdSlots } from "@/lib/ads";
import { getAllSlotMetrics } from "@/lib/ad-metrics";

/** Per-day, per-slot performance as CSV — the file an advertiser is sent. */
export async function GET() {
  const pw = process.env.ADMIN_PASSWORD;
  const jar = await cookies();
  if (!pw || jar.get("admin_s")?.value !== pw) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [slots, metrics] = await Promise.all([getAdSlots(), getAllSlotMetrics()]);
  const byId = new Map(slots.map((s) => [s.id, s]));

  const esc = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const rows = [
    ["date", "slot_id", "advertiser", "type", "concern", "product_id", "impressions", "clicks", "ctr_pct"],
  ];
  for (const m of metrics) {
    const slot = byId.get(m.slotId);
    for (const d of m.days) {
      rows.push([
        d.date,
        m.slotId,
        slot?.advertiserName ?? "",
        slot?.type ?? "",
        slot?.concern ?? "",
        slot?.productId ?? "",
        String(d.impressions),
        String(d.clicks),
        d.impressions > 0 ? ((d.clicks / d.impressions) * 100).toFixed(2) : "",
      ]);
    }
  }

  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const today = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bangkokfillers-ad-report-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
