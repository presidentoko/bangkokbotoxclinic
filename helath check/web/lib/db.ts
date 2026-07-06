import mysql from "mysql2/promise";
import { cache } from "react";

declare global {
  // eslint-disable-next-line no-var
  var _bkkPool: mysql.Pool | undefined;
}

export function getPool(): mysql.Pool {
  if (!global._bkkPool) {
    const isRemote = (process.env.DB_HOST || "127.0.0.1") !== "127.0.0.1";
    global._bkkPool = mysql.createPool({
      host:            process.env.DB_HOST || "127.0.0.1",
      port:            parseInt(process.env.DB_PORT || "3306"),
      user:            process.env.DB_USER || "root",
      password:        process.env.DB_PASS || "",
      database:        "bkkcheckup",
      connectionLimit: 10,
      connectTimeout:  20000,
      enableKeepAlive: true,
      charset:         "utf8mb4",
      // mysql2 returns DATE/DATETIME columns as JS Date objects by default;
      // every DATE/DATETIME field in this file is typed (and used) as string
      // (e.g. review_date.slice(...), snapshot_date). Force string output so
      // runtime values match the declared types instead of crashing on .slice().
      dateStrings:     true,
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
  city: string | null;
  jci: number;
  checkup_url: string | null;
  rating: string | null;
  review_count: number | null;
  package_id: number;
  package_name: string;
  category: string | null;
  price: string | null;
  currency: string;
  description: string | null;
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
  city: string | null;
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
  address: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  founded_year: number | null;
  bed_count: number | null;
  specialties: string | null;
  accreditations: string | null;
  email: string | null;
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
  rating:       "h.rating DESC, p.price ASC",
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

const categoryCache = new Map<string, { data: PackageRow[]; ts: number }>();
const CATEGORY_CACHE_TTL_MS = 60 * 60 * 1000; // matches page revalidate window

export async function getPackagesByCategory(
  cat: string,
  sort = "price",
): Promise<PackageRow[]> {
  // generateStaticParams fans out to the same (category, sort) pair once per
  // hospital × locale (~180x for a single category) — memoize to avoid
  // saturating the DB pool during static generation.
  const cacheKey = `${cat}:${sort}`;
  const cached = categoryCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CATEGORY_CACHE_TTL_MS) return cached.data;

  const pool = getPool();
  const orderBy = SORT_WHITELIST[sort] ?? SORT_WHITELIST.price;
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.name AS hospital_name, h.slug AS hospital_slug, h.area, h.city, h.jci,
       h.checkup_url,
       h.rating, h.review_count,
       p.id AS package_id, p.name AS package_name, p.category,
       p.price, p.currency, p.description,
       p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
       p.has_ecg, p.has_treadmill, p.has_cancer_marker,
       p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     WHERE p.category = ?
     ORDER BY ${orderBy}`,
    [cat],
  );
  const data = rows as PackageRow[];
  categoryCache.set(cacheKey, { data, ts: Date.now() });
  return data;
}

export async function getAllPackages(sort = "price"): Promise<PackageRow[]> {
  const pool = getPool();
  const orderBy = SORT_WHITELIST[sort] ?? SORT_WHITELIST.price;
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.name AS hospital_name, h.slug AS hospital_slug, h.area, h.city, h.jci,
       h.checkup_url,
       h.rating, h.review_count,
       p.id AS package_id, p.name AS package_name, p.category,
       p.price, p.currency, p.description,
       p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
       p.has_ecg, p.has_treadmill, p.has_cancer_marker,
       p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     ORDER BY ${orderBy}`,
  );
  return rows as PackageRow[];
}

export async function getHospitals(): Promise<HospitalSummary[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.id, h.name, h.slug, h.area, h.city, h.jci, h.checkup_url,
       h.rating, h.review_count,
       COUNT(p.id) AS package_count,
       MIN(p.price) AS min_price
     FROM hospitals h
     LEFT JOIN checkup_packages p ON p.hospital_id = h.id
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
      `SELECT h.id, h.name, h.name_th, h.slug, h.area, h.city, h.jci, h.checkup_url, h.lat, h.lng,
         h.address, h.phone, h.website, h.description, h.founded_year, h.bed_count,
         h.specialties, h.accreditations, h.email,
         h.rating, h.review_count,
         (SELECT COUNT(*) FROM checkup_packages WHERE hospital_id = h.id) AS package_count,
         (SELECT MIN(price) FROM checkup_packages WHERE hospital_id = h.id) AS min_price
       FROM hospitals h
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

export async function getPackagesByCity(city: string, sort = "price"): Promise<PackageRow[]> {
  const pool = getPool();
  const orderBy = SORT_WHITELIST[sort] ?? SORT_WHITELIST.price;
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.name AS hospital_name, h.slug AS hospital_slug, h.area, h.city, h.jci,
       h.checkup_url,
       h.rating, h.review_count,
       p.id AS package_id, p.name AS package_name, p.category,
       p.price, p.currency, p.description,
       p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
       p.has_ecg, p.has_treadmill, p.has_cancer_marker,
       p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     WHERE h.city = ?
     ORDER BY ${orderBy}
     LIMIT 600`,
    [city],
  );
  return rows as PackageRow[];
}

export async function getCities(): Promise<{ city: string; count: number }[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT h.city, COUNT(p.id) AS count
     FROM hospitals h
     JOIN checkup_packages p ON p.hospital_id = h.id
     WHERE h.city IS NOT NULL AND h.city != ''
     GROUP BY h.city
     ORDER BY count DESC`,
  );
  return rows as { city: string; count: number }[];
}

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
       h.checkup_url, h.rating, h.review_count,
       p.id AS package_id, p.name AS package_name, p.category,
       p.price, p.currency,
       p.has_blood, p.has_xray, p.has_ultrasound, p.has_ct, p.has_mri,
       p.has_ecg, p.has_treadmill, p.has_cancer_marker,
       p.has_doctor_consult, p.has_interpreter, p.results_days, p.source_url
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     WHERE h.slug = ? AND p.category = ?
     ORDER BY p.price ASC
     LIMIT 1`,
    [hospitalSlug, type],
  );
  return rows.length ? (rows[0] as PackageRow) : null;
}

export async function getPriceHistoryBatch(
  packageIds: number[],
): Promise<Record<number, number[]>> {
  if (!packageIds.length) return {};
  const pool = getPool();
  const placeholders = packageIds.map(() => "?").join(",");
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT package_id, price FROM package_price_snapshots
     WHERE package_id IN (${placeholders})
     ORDER BY snapshot_date ASC`,
    packageIds,
  );
  const result: Record<number, number[]> = {};
  for (const r of rows as { package_id: number; price: string | null }[]) {
    if (!r.price) continue;
    const p = parseFloat(r.price);
    if (!result[r.package_id]) result[r.package_id] = [];
    result[r.package_id].push(p);
  }
  return result;
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

export type ReviewRow = {
  id: number;
  author_name: string | null;
  rating: number | null;
  review_text: string | null;
  review_date: string | null;
  source: string | null;
};

export async function getHospitalReviews(slug: string, limit = 5): Promise<ReviewRow[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT r.id, r.author_name, r.rating, r.review_text, r.review_date, r.source
     FROM hospital_reviews r
     JOIN hospitals h ON h.id = r.hospital_id
     WHERE h.slug = ? AND r.review_text IS NOT NULL AND r.review_text != ''
     ORDER BY r.rating DESC, r.review_date DESC
     LIMIT ?`,
    [slug, limit],
  );
  return rows as ReviewRow[];
}

export async function getHospitalsForCompare(slugs: string[]): Promise<HospitalDetail[]> {
  if (!slugs.length) return [];
  const results = await Promise.all(slugs.map((s) => getHospital(s)));
  return results.filter(Boolean) as HospitalDetail[];
}

export async function getAllHospitalSlugs(): Promise<string[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    "SELECT slug FROM hospitals",
  );
  return (rows as { slug: string }[]).map((r) => r.slug);
}

export async function getCheckupCombos(): Promise<{ category: string; hospital_slug: string }[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT DISTINCT p.category, h.slug AS hospital_slug
     FROM checkup_packages p
     JOIN hospitals h ON h.id = p.hospital_id
     WHERE p.category IS NOT NULL`,
  );
  return rows as { category: string; hospital_slug: string }[];
}

export type PriceTrendRow = {
  hospital_name: string;
  hospital_slug: string;
  package_id: number;
  package_name: string;
  category: string | null;
  latest_price: number;
  prev_price: number;
  change_pct: number;
};

export async function getRecentPriceChanges(limit = 20): Promise<PriceTrendRow[]> {
  const pool = getPool();
  const [rows] = await pool.query<mysql.RowDataPacket[]>(
    `SELECT
       h.name AS hospital_name, h.slug AS hospital_slug,
       p.id AS package_id, p.name AS package_name, p.category,
       s2.price AS latest_price, s1.price AS prev_price,
       ROUND(((s2.price - s1.price) / s1.price) * 100, 1) AS change_pct
     FROM package_price_snapshots s2
     JOIN package_price_snapshots s1 ON s1.package_id = s2.package_id
       AND s1.snapshot_date = (
         SELECT MAX(snapshot_date) FROM package_price_snapshots
         WHERE package_id = s2.package_id AND snapshot_date < s2.snapshot_date
       )
     JOIN checkup_packages p ON p.id = s2.package_id
     JOIN hospitals h ON h.id = p.hospital_id
     WHERE s2.snapshot_date = (SELECT MAX(snapshot_date) FROM package_price_snapshots)
       AND s1.price IS NOT NULL AND s2.price IS NOT NULL
       AND s1.price != s2.price
     ORDER BY ABS(change_pct) DESC
     LIMIT ?`,
    [limit],
  );
  return rows as PriceTrendRow[];
}

export async function logClick(packageId: number, dest: string, ip: string): Promise<void> {
  try {
    const pool = getPool();
    await pool.query(
      `INSERT IGNORE INTO package_clicks (package_id, dest_url, clicked_at, ip_hash)
       VALUES (?, ?, NOW(), MD5(?))`,
      [packageId, dest.substring(0, 500), ip],
    );
  } catch {
    // ignore if table doesn't exist yet
  }
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
