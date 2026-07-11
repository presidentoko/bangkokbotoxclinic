import { NextRequest, NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2/promise";
import { getPool } from "@/lib/db";

// Uses the shared pool from lib/db — a previous standalone pool here read
// MYSQL_* env vars that don't exist in this deployment (the real ones are
// DB_*), so every search silently failed. Response shape must stay
// { hospitals, packages } to match app/components/SiteSearch.tsx.

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 100);
  if (q.length < 2) return NextResponse.json({ hospitals: [], packages: [] });

  const like = `%${q}%`;
  const pool = getPool();

  const [hospitalRows] = await pool.query<RowDataPacket[]>(
    `SELECT h.slug, h.name, h.city, h.jci,
            MIN(p.price) min_price, COUNT(p.id) pkg_count
     FROM hospitals h
     LEFT JOIN checkup_packages p ON p.hospital_id = h.id AND p.price IS NOT NULL
     WHERE h.name LIKE ? OR h.city LIKE ? OR h.area LIKE ?
     GROUP BY h.id
     ORDER BY h.jci DESC, pkg_count DESC
     LIMIT 6`,
    [like, like, like],
  );

  const [packageRows] = await pool.query<RowDataPacket[]>(
    `SELECT p.id package_id, p.name package_name, p.category, p.price,
            h.slug hospital_slug, h.name hospital_name, h.jci
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     WHERE p.name LIKE ? AND p.price IS NOT NULL
     ORDER BY h.jci DESC, p.price ASC
     LIMIT 6`,
    [like],
  );

  return NextResponse.json(
    { hospitals: hospitalRows, packages: packageRows },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } },
  );
}
