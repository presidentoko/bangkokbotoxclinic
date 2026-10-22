import { registryHospitals, registryProvince, registryProvinces, provinceOf } from "./registry";
import { getAllPackages, getHospitals } from "./db";

/**
 * What we can say about a province that nobody else publishes.
 *
 * Two datasets meet here and nowhere else in English: Thailand's official
 * hospital register (1,491 hospitals, each with its accreditation level and
 * the date its certificate runs to) and 1,001 check-up prices read off
 * hospitals' own pages. Crossing them answers the question these pages are
 * actually asked — "hospitals in Krabi", "health check up package chonburi" —
 * with counts rather than prose: how many hospitals the province has, how many
 * hold current accreditation, how many let it lapse, and what a check-up
 * costs there.
 *
 * Every number is counted at build time from those two files. None is typed
 * in, which is the difference between this and the price ranges that had to be
 * deleted from the category FAQs and the city guides.
 */

export type ProvinceStats = {
  slug: string;
  nameEn: string;
  nameTh: string;
  /** Hospitals on the national register in this province. */
  registered: number;
  /** Holding a current HA certificate at standard or advanced level. */
  accredited: number;
  /** On the register with a certificate that has run out and not been renewed. */
  lapsed: number;
  private: number;
  public: number;
  /** Summed inpatient beds, only where the register publishes them. */
  beds: number | null;
  /** Hospitals with a page on this site. */
  withPage: number;
  /** Priced check-up packages we hold in this province. */
  packages: number;
  medianPrice: number | null;
  cheapest: number | null;
};

let _cache: Map<string, ProvinceStats> | null = null;

async function build(): Promise<Map<string, ProvinceStats>> {
  const out = new Map<string, ProvinceStats>();
  const ours = await getHospitals();
  const rows = (await getAllPackages()).filter((r) => r.price != null);

  const pageCount = new Map<string, number>();
  for (const h of ours) {
    const p = provinceOf(h.slug);
    if (p) pageCount.set(p, (pageCount.get(p) ?? 0) + 1);
  }

  const priceBy = new Map<string, number[]>();
  const bySlug = new Map(ours.map((h) => [h.slug, h]));
  for (const r of rows) {
    const h = bySlug.get(r.hospital_slug);
    if (!h) continue;
    const p = provinceOf(h.slug);
    if (!p) continue;
    const n = parseFloat(r.price ?? "0");
    if (!(n > 0)) continue;
    const list = priceBy.get(p);
    if (list) list.push(n);
    else priceBy.set(p, [n]);
  }

  // Province slugs come from the register, so a province with no page on this
  // site still gets its figures — that is most of the country, and saying "34
  // registered hospitals, 14 accredited, no published prices" is a real
  // answer where silence was not.
  const seen = new Set<string>();
  for (const h of ours) {
    const p = provinceOf(h.slug);
    if (p) seen.add(p);
  }
  for (const slug of new Set([...seen, ...registryProvinces().map((p) => p.slug)])) {
    const meta = registryProvince(slug);
    if (!meta) continue;
    const reg = registryHospitals(slug);
    const prices = (priceBy.get(slug) ?? []).sort((a, b) => a - b);
    const beds = reg.reduce((s, h) => s + (h.beds ?? 0), 0);
    out.set(slug, {
      slug,
      nameEn: meta.name_en,
      nameTh: meta.name_th,
      registered: reg.length,
      accredited: reg.filter((h) => h.ha_level === "standard" || h.ha_level === "advanced").length,
      lapsed: reg.filter(
        (h) =>
          h.ha_current === false &&
          (h.ha_level === "none" || h.ha_level === "renewing" || h.ha_level === "in-progress"),
      ).length,
      private: reg.filter((h) => h.sector === "private").length,
      public: reg.filter((h) => h.sector !== "private").length,
      beds: beds > 0 ? beds : null,
      withPage: pageCount.get(slug) ?? 0,
      packages: prices.length,
      medianPrice: prices.length ? prices[Math.floor(prices.length / 2)] : null,
      cheapest: prices.length ? prices[0] : null,
    });
  }
  return out;
}

export async function provinceStats(slug: string): Promise<ProvinceStats | null> {
  if (!_cache) _cache = await build();
  return _cache.get(slug) ?? null;
}

export async function allProvinceStats(): Promise<ProvinceStats[]> {
  if (!_cache) _cache = await build();
  return [..._cache.values()].sort((a, b) => b.registered - a.registered);
}

/** One sentence a page can lead with, built only from counted values. */
export function provinceSentence(s: ProvinceStats): string {
  const bits: string[] = [
    `${s.nameEn} has ${s.registered} hospital${s.registered === 1 ? "" : "s"} on Thailand's national register`,
  ];
  if (s.accredited > 0) {
    bits.push(
      `${s.accredited} of them hold a current HA accreditation certificate`,
    );
  }
  if (s.lapsed > 0) {
    bits.push(`${s.lapsed} are on the register with a certificate that has lapsed`);
  }
  if (s.packages > 0 && s.medianPrice) {
    bits.push(
      `and the ${s.packages} check-up package${s.packages === 1 ? "" : "s"} we hold prices for there run from ฿${Math.round(
        s.cheapest ?? 0,
      ).toLocaleString()} with a middle price of ฿${Math.round(s.medianPrice).toLocaleString()}`,
    );
  } else {
    bits.push("and no hospital there publishes a check-up price online that we can read");
  }
  return bits.join(", ") + ".";
}
