import { NextRequest, NextResponse } from "next/server";
import { allProducts } from "@/lib/data";
import { checkAndSaveLinkHealth } from "@/lib/link-health";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = allProducts().map((p) => ({ product_id: p.product_id, url: p.url }));
  const results = await checkAndSaveLinkHealth(products);

  const dead = Object.entries(results).filter(([, v]) => !v.ok).length;
  return NextResponse.json({ total: products.length, dead, ok: products.length - dead });
}
