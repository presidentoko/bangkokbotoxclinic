// /c/food_mfg 전용 깊이 블록.
//
// 왜 (2026-10-16): GSC 노출 3위 페이지 ("thailand factory food" 64회 83위,
// "food manufacturing" 8회 83위). 내용이 "식품 공장 N곳 목록" 뿐이었다. 식품 공장을
// 찾는 바이어의 첫 질문은 "내 품목(냉동·소스·과자·음료…)을 만드는 곳이 몇 곳이고
// 어디 있나" 다 — LogisticsDepth 와 같은 방식으로 우리 데이터에서 집계한다.
import type { MasterDb, Supplier } from "@/lib/types";
import { OEM_VERTICALS } from "@/lib/oemVerticals";
import { ProviderTable } from "@/components/ProviderTable";
import { liveSmeOem } from "@/lib/smeOemTh";

const SEGMENTS: { label: string; blurb: string; re: RegExp; oem?: string }[] = [
  {
    label: "Frozen food & seafood",
    blurb: "Shrimp, tuna, ready meals and frozen dim sum — Thailand's largest food export segment, concentrated around Samut Sakhon's fishing port.",
    re: /frozen|seafood|fish processing|อาหารแช่แข็ง|อาหารทะเล|ห้องเย็น/,
    oem: "frozen-seafood",
  },
  {
    label: "Meat & poultry processing",
    blurb: "Chicken, pork and processed meat (sausage, meatballs). Export plants need country-specific approvals on top of Thai GMP.",
    re: /meat processing|meat products|poultry|chicken|pork|sausage|ไก่|หมู|ไส้กรอก|ลูกชิ้น/,
  },
  {
    label: "Sauces, seasonings & spices",
    blurb: "Fish sauce, chili paste, curry paste and seasoning powders — many accept private-label orders in modest runs.",
    re: /sauce|seasoning|condiment|spice|ซอส|เครื่องปรุง|น้ำพริก|พริกแกง|น้ำปลา/,
  },
  {
    label: "Snacks, bakery & confectionery",
    blurb: "Chips, crackers, biscuits, chocolate and Thai desserts.",
    re: /snack|confection|chocolate|biscuit|cracker|cookie|ขนม/,
    oem: "chocolate-confectionery",
  },
  {
    label: "Beverages & drinking water",
    blurb: "Bottled water, juices, coffee and tea, energy drinks — co-packers usually set minimums by production-run hours.",
    re: /beverage|drink|bottled water|drinking water|juice|coffee roasters|\btea\b|น้ำดื่ม|เครื่องดื่ม/,
  },
  {
    label: "Rice, flour & starch",
    blurb: "Rice mills, tapioca starch and flour — the agricultural-processing base, spread well beyond Bangkok.",
    re: /rice mill|โรงสี|flour|starch|tapioca|มันสำปะหลัง|แป้ง/,
    oem: "rice-milling",
  },
  {
    label: "Fruit & vegetable processing",
    blurb: "Canned, dried and frozen fruit — durian, mango, pineapple, coconut products.",
    re: /fruit|vegetable|canned|dried|coconut|ผลไม้|มะพร้าว/,
  },
];

const oemTitle = new Map(OEM_VERTICALS.map((v) => [v.slug, v.title]));

function segmentsOf(s: Supplier): string[] {
  const hay = [s.primary_type || "", ...(s.raw_categories || []), s.name || ""].join(" | ").toLowerCase();
  return SEGMENTS.filter((g) => g.re.test(hay)).map((g) => g.label);
}

const TH_LINKS: [string, string][] = [["sauce-seasoning", "ซอส"], ["beverage", "เครื่องดื่ม"], ["snack-food", "ขนม"]];

export function FoodDepth({ db, suppliers }: { db: MasterDb; suppliers: Supplier[] }) {
  // 태국어 품목 페이지는 공급사 8곳 이상일 때만 생성된다 — 없는 페이지로 링크하지 않는다.
  const liveTh = new Set(liveSmeOem(db.suppliers).map((x) => x.v.slug));
  const thLinks = TH_LINKS.filter(([slug]) => liveTh.has(slug));
  const segs = SEGMENTS.map((g) => {
    const rows = suppliers.filter((s) => segmentsOf(s).includes(g.label));
    const prov = new Map<string, number>();
    for (const s of rows) if (s.city_label) prov.set(s.city_label, (prov.get(s.city_label) ?? 0) + 1);
    const top = [...prov.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([p]) => p);
    return { ...g, n: rows.length, top };
  }).filter((g) => g.n >= 5);

  return (
    <>
      <section className="mb-10">
        <h2 className="text-xl font-bold mb-1">Which food factories make what</h2>
        <p className="text-sm text-[var(--muted)] mb-4">
          Counts from the {suppliers.length.toLocaleString()} food manufacturers in this directory,
          grouped by what Google lists them as making. A plant can appear in more than one group.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {segs.map((g) => (
            <div key={g.label} className="bg-white border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <h3 className="font-bold">{g.label}</h3>
                <span className="text-sm tabular-nums text-[var(--muted)]">{g.n.toLocaleString()}</span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{g.blurb}</p>
              {g.top.length > 0 && (
                <p className="text-xs text-[var(--muted)] mt-2">Most in: {g.top.join(", ")}</p>
              )}
              {g.oem && oemTitle.has(g.oem) && (
                <a href={`/oem/${g.oem}`} className="inline-block text-xs font-bold mt-2 text-[var(--gold-deep)] hover:underline">
                  {oemTitle.get(g.oem)} →
                </a>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--muted)] mt-3 leading-relaxed">
          Private label instead of buying a finished product? See{" "}
          <a className="underline" href="/oem/food-beverage">food &amp; beverage OEM</a>.
          {thLinks.length > 0 && (
            <>
              {" "}Thai-language pages for small brands:{" "}
              {thLinks.map(([slug, label], i) => (
                <span key={slug}>
                  {i > 0 && ", "}
                  <a className="underline" href={`/th/oem/${slug}`}>{label}</a>
                </span>
              ))}
              .
            </>
          )}
        </p>
      </section>

      <ProviderTable
        title="Most-reviewed food factories"
        note="Ranked by number of public Google reviews — a rough proxy for how much business a plant does with visitors and partners. Ratings are from the same profiles."
        rows={suppliers}
        tagsOf={segmentsOf}
      />
    </>
  );
}
