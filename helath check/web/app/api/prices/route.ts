import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";
import { getPool } from "@/lib/db";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") ?? "";
  const city = searchParams.get("city") ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 200);

  const conditions: string[] = [];
  const qParams: (string | number)[] = [];

  if (category) {
    conditions.push("p.category = ?");
    qParams.push(category);
  }
  if (city) {
    conditions.push("h.city = ?");
    qParams.push(city);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const pool = getPool();
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT h.name AS hospital, h.slug, h.city, h.jci, h.rating,
              p.id AS package_id, p.name AS package_name, p.category,
              p.price, p.currency,
              p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
              p.has_ecg, p.has_cancer_marker, p.has_doctor_consult, p.has_interpreter,
              p.results_days, p.source_url
       FROM checkup_packages p
       JOIN hospitals h ON h.id = p.hospital_id
       ${where}
       ORDER BY CAST(p.price AS DECIMAL) ASC
       LIMIT ?`,
      [...qParams, limit],
    );

    return NextResponse.json(
      {
        source: "bangkoktopclinic.com",
        note: "Prices scraped from hospital websites. Verify with hospital before booking.",
        count: rows.length,
        packages: rows,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }
}
