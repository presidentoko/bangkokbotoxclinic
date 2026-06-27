import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 3,
  ssl: { rejectUnauthorized: false },
});

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim().slice(0, 100);
  if (q.length < 2) return NextResponse.json([]);

  const like = `%${q}%`;
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT h.slug, h.name, h.city, h.jci,
            MIN(p.price) min_price, COUNT(p.id) pkg_count
     FROM hospitals h
     LEFT JOIN checkup_packages p ON p.hospital_id = h.id AND p.price IS NOT NULL
     WHERE h.name LIKE ? OR h.city LIKE ? OR h.area LIKE ?
     GROUP BY h.id
     ORDER BY h.jci DESC, pkg_count DESC
     LIMIT 10`,
    [like, like, like],
  );

  return NextResponse.json(
    rows.map((r) => ({
      slug: r.slug,
      name: r.name,
      city: r.city,
      jci: r.jci,
      min_price: r.min_price,
      pkg_count: r.pkg_count,
    })),
    { headers: { "Cache-Control": "public, s-maxage=60" } },
  );
}
