import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

function getPool() {
  const g = global as typeof global & { _bkkPool?: mysql.Pool };
  if (!g._bkkPool) {
    const isRemote = (process.env.DB_HOST || "127.0.0.1") !== "127.0.0.1";
    g._bkkPool = mysql.createPool({
      host: process.env.DB_HOST || "127.0.0.1",
      port: parseInt(process.env.DB_PORT || "3306"),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: "bkkcheckup",
      connectionLimit: 3,
      charset: "utf8mb4",
      ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    });
  }
  return g._bkkPool;
}

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids") ?? "";
  const parsed = ids.split(",").map(Number).filter((n) => n > 0).slice(0, 100);
  if (!parsed.length) return NextResponse.json([]);

  try {
    const pool = getPool();
    const placeholders = parsed.map(() => "?").join(",");
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      `SELECT h.name AS hospital_name, h.slug AS hospital_slug, h.city, h.jci, h.checkup_url,
              h.rating, h.review_count,
              p.id AS package_id, p.name AS package_name, p.category,
              p.price, p.currency,
              p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
              p.has_ecg, p.has_treadmill, p.has_cancer_marker, p.has_doctor_consult,
              p.has_interpreter, p.results_days, p.source_url
       FROM checkup_packages p
       JOIN hospitals h ON h.id = p.hospital_id
       WHERE p.id IN (${placeholders})`,
      parsed,
    );
    return NextResponse.json(rows, { headers: { "Cache-Control": "private, max-age=300" } });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
