import mysql from "mysql2/promise";
import { cache } from "react";

declare global {
  // eslint-disable-next-line no-var
  var _bkkPool: mysql.Pool | undefined;
}

function getPool(): mysql.Pool {
  if (!global._bkkPool) {
    const isRemote = (process.env.DB_HOST || "127.0.0.1") !== "127.0.0.1";
    global._bkkPool = mysql.createPool({
      host:            process.env.DB_HOST || "127.0.0.1",
      port:            parseInt(process.env.DB_PORT || "3306"),
      user:            process.env.DB_USER || "root",
      password:        process.env.DB_PASS || "",
      database:        "bkkcheckup",
      connectionLimit: 3,
      charset:         "utf8mb4",
      ssl:             isRemote ? { rejectUnauthorized: false } : undefined,
    });
  }
  return global._bkkPool;
}

// ── Types ────────────────────────────────────────────────────────────────────

export type CategoryCount = { category: string; count: number };

export type PackageRow = {
  hospital_name: string;
  hospital_slug: string;
  area: string | null;
  jci: number;
  checkup_url: string | null;
  rating: string | null;
  review_count: number | null;
  package_id: number;
  package_name: string;
  category: string | null;
  price: string | null;
  currency: string;
  has_blood: number | null;
  has_xray: number | null;
  has_ultrasound: number | null;
  has_ct: number | null;
  has_mri: number | null;
  has_ecg: number | null;
  has_treadmill: number | null;
  has_cancer_marker: number | null;
  has_doctor_consult: number | null;
  has_interpreter: number | null;
  results_days: number | null;
  source_url: string | null;
};

export type HospitalSummary = {
  id: number;
  name: string;
  slug: string;
  area: string | null;
  jci: number;
  checkup_url: string | null;
  rating: string | null;
  review_count: number | null;
  package_count: number;
  min_price: string | null;
};

export type HospitalDetail = HospitalSummary & {
  name_th: string | null;
  lat: string | null;
  lng: string | null;
  packages: PackageRow[];
};

export type SnapshotRow = {
  snapshot_date: string;
  price: string | null;
};

// ── Queries ──────────────────────────────────────────────────────────────────

const SORT_WHITELIST: Record<string, string> = {
  price:        "p.price ASC, h.name ASC",
  price_desc:   "p.price DESC, h.name ASC",
  hospital:     "h.name ASC, p.price ASC",
  results_days: "p.results_days ASC, p.price ASC",
  rating:       "r.rating DESC, p.price ASC",
};

export async function getCategories(): Promise<CategoryCount[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT category, COUNT(*) AS count
     FROM checkup_packages
     WHERE category IS NOT NULL
     GROUP BY category
     ORDER BY count DESC`,
  );
  return rows as CategoryCount[];
}

export async function getPackagesByCategory(
  cat: string,
  sort = "price",
): Promise<PackageRow[]> {
  const pool = getPool();
  const orderBy = SORT_WHITELIST[sort] ?? SORT_WHITELIST.price;
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.name AS hospital_name, h.slug AS hospital_slug, h.area, h.jci,
       h.checkup_url,
       r.rating, r.review_count,
       p.id AS package_id, p.name AS package_name, p.category,
       p.price, p.currency,
       p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
       p.has_ecg, p.has_treadmill, p.has_cancer_marker,
       p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     LEFT JOIN (
       SELECT hospital_id, rating, review_count
       FROM hospital_reviews
       WHERE id IN (SELECT MAX(id) FROM hospital_reviews GROUP BY hospital_id)
     ) r ON r.hospital_id = h.id
     WHERE p.category = ?
     ORDER BY ${orderBy}`,
    [cat],
  );
  return rows as PackageRow[];
}

export async function getAllPackages(sort = "price"): Promise<PackageRow[]> {
  const pool = getPool();
  const orderBy = SORT_WHITELIST[sort] ?? SORT_WHITELIST.price;
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.name AS hospital_name, h.slug AS hospital_slug, h.area, h.jci,
       h.checkup_url,
       r.rating, r.review_count,
       p.id AS package_id, p.name AS package_name, p.category,
       p.price, p.currency,
       p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
       p.has_ecg, p.has_treadmill, p.has_cancer_marker,
       p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     LEFT JOIN (
       SELECT hospital_id, rating, review_count
       FROM hospital_reviews
       WHERE id IN (SELECT MAX(id) FROM hospital_reviews GROUP BY hospital_id)
     ) r ON r.hospital_id = h.id
     ORDER BY ${orderBy}`,
  );
  return rows as PackageRow[];
}

export async function getHospitals(): Promise<HospitalSummary[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.id, h.name, h.slug, h.area, h.jci, h.checkup_url,
       r.rating, r.review_count,
       COUNT(p.id) AS package_count,
       MIN(p.price) AS min_price
     FROM hospitals h
     LEFT JOIN checkup_packages p ON p.hospital_id = h.id
     LEFT JOIN (
       SELECT hospital_id, rating, review_count
       FROM hospital_reviews
       WHERE id IN (SELECT MAX(id) FROM hospital_reviews GROUP BY hospital_id)
     ) r ON r.hospital_id = h.id
     GROUP BY h.id
     ORDER BY h.tier DESC, h.name ASC`,
  );
  return rows as HospitalSummary[];
}

export const getHospital = cache(async function getHospital(slug: string): Promise<HospitalDetail | null> {
  const pool = getPool();
  // Single query: hospital info + packages via JOIN to avoid multiple connections
  const [[hospRows], [pkgRows]] = await Promise.all([
    pool.query<mysql.RowDataPacket[]>(
      `SELECT h.id, h.name, h.name_th, h.slug, h.area, h.jci, h.checkup_url, h.lat, h.lng,
         rv.rating, rv.review_count,
         (SELECT COUNT(*) FROM checkup_packages WHERE hospital_id = h.id) AS package_count,
         (SELECT MIN(price) FROM checkup_packages WHERE hospital_id = h.id) AS min_price
       FROM hospitals h
       LEFT JOIN (
         SELECT hospital_id, rating, review_count FROM hospital_reviews
         WHERE id IN (SELECT MAX(id) FROM hospital_reviews GROUP BY hospital_id)
       ) rv ON rv.hospital_id = h.id
       WHERE h.slug = ?`,
      [slug],
    ),
    pool.query<mysql.RowDataPacket[]>(
      `SELECT
         h.name AS hospital_name, h.slug AS hospital_slug, h.area, h.jci,
         h.checkup_url, NULL AS rating, NULL AS review_count,
         p.id AS package_id, p.name AS package_name, p.category,
         p.price, p.currency,
         p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
         p.has_ecg, p.has_treadmill, p.has_cancer_marker,
         p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
       FROM checkup_packages p
       JOIN hospitals h ON h.id = p.hospital_id
       WHERE h.slug = ?
       ORDER BY p.category, p.price ASC`,
      [slug],
    ),
  ]);
  if (!hospRows.length) return null;
  return { ...(hospRows[0] as HospitalSummary), packages: pkgRows as PackageRow[] } as HospitalDetail;
});

async function getPackagesForHospital(hospitalId: number): Promise<PackageRow[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.name AS hospital_name, h.slug AS hospital_slug, h.area, h.jci,
       h.checkup_url, NULL AS rating, NULL AS review_count,
       p.id AS package_id, p.name AS package_name, p.category,
       p.price, p.currency,
       p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
       p.has_ecg, p.has_treadmill, p.has_cancer_marker,
       p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     WHERE p.hospital_id = ?
     ORDER BY p.category, p.price ASC`,
    [hospitalId],
  );
  return rows as PackageRow[];
}

export async function getPackage(
  type: string,
  hospitalSlug: string,
): Promise<PackageRow | null> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.name AS hospital_name, h.slug AS hospital_slug, h.area, h.jci,
       h.checkup_url, r.rating, r.review_count,
       p.id AS package_id, p.name AS package_name, p.category,
       p.price, p.currency,
       p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
       p.has_ecg, p.has_treadmill, p.has_cancer_marker,
       p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     LEFT JOIN (
       SELECT hospital_id, rating, review_count
       FROM hospital_reviews
       WHERE id IN (SELECT MAX(id) FROM hospital_reviews GROUP BY hospital_id)
     ) r ON r.hospital_id = h.id
     WHERE h.slug = ? AND p.category = ?
     ORDER BY p.price ASC
     LIMIT 1`,
    [hospitalSlug, type],
  );
  return rows.length ? (rows[0] as PackageRow) : null;
}

export async function getPriceHistory(packageId: number): Promise<SnapshotRow[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT snapshot_date, price
     FROM package_price_snapshots
     WHERE package_id = ?
     ORDER BY snapshot_date ASC`,
    [packageId],
  );
  return rows as SnapshotRow[];
}

export async function getAllHospitalSlugs(): Promise<string[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT slug FROM hospitals",
  );
  return (rows as { slug: string }[]).map((r) => r.slug);
}

export async function getStatsForHome(): Promise<{
  jciCount: number;
  packageCount: number;
  hospitalCount: number;
}> {
  const pool = getPool();
  const [[jci], [pkg], [hosp]] = await Promise.all([
    pool.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS n FROM hospitals WHERE jci = 1"),
    pool.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS n FROM checkup_packages"),
    pool.query<mysql.RowDataPacket[]>("SELECT COUNT(*) AS n FROM hospitals"),
  ]);
  return {
    jciCount:     (jci[0] as { n: number }).n,
    packageCount: (pkg[0] as { n: number }).n,
    hospitalCount:(hosp[0] as { n: number }).n,
  };
}
