// Generates data/petfood-index.json — a slimmed-down projection of data/petfood.json
// for client bundles that only need list/card fields (no `ingredients`/`source_url`,
// which make up roughly half of the full file's size). Slugs are precomputed here
// using the exact same algorithm as lib/petfood.ts's getSlugMap() so URLs match.
const fs = require('fs')
const path = require('path')

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function baseFoodSlug(food) {
  const s = toSlug(food.id)
  if (s.length > 3) return s
  return toSlug(`${food.brand}-${food.name_en}`)
}

const srcPath = path.join(__dirname, '..', 'data', 'petfood.json')
const outPath = path.join(__dirname, '..', 'data', 'petfood-index.json')

const buyPath = path.join(__dirname, '..', 'data', 'food-buy-urls.json')

const foods = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
const counts = new Map()
const buyUrls = {}

const index = foods.map(f => {
  const base = baseFoodSlug(f)
  const n = (counts.get(base) ?? 0) + 1
  counts.set(base, n)
  const slug = n === 1 ? base : `${base}-${n}`

  buyUrls[f.id] = f.buy_url

  return {
    id: f.id,
    slug,
    brand: f.brand,
    name_en: f.name_en,
    // name_th is byte-identical to name_en on all 986 records — the scraper
    // never found a separate Thai name. Emitting it twice cost 69 KB; every
    // consumer already reads `name_th || name_en`, so omitting the duplicate
    // renders the same and leaves room for real Thai names later.
    ...(f.name_th && f.name_th !== f.name_en ? { name_th: f.name_th } : {}),
    animal: f.animal,
    life_stage: f.life_stage,
    weight_kg: f.weight_kg,
    // Omitted when zero rather than shipped as a zero. No price source is
    // wired up yet, so these are 0 on all 986 records — 30 KB of zeroes in
    // every visitor's bundle. Consumers already gate on `> 0`, and `undefined`
    // fails that test the same way.
    ...(f.price_thb > 0 ? { price_thb: f.price_thb } : {}),
    ...(f.price_per_kg > 0 ? { price_per_kg: f.price_per_kg } : {}),
    protein_pct: f.protein_pct,
    fat_pct: f.fat_pct,
    fiber_pct: f.fiber_pct,
    moisture_pct: f.moisture_pct,
    // protein_dm / fat_dm were declared on PetFoodLight but never copied here,
    // so consumers read `undefined` through a type promising a number —
    // ShareCard rendered "โปรตีน undefined%". `updated_at` is deliberately not
    // carried: nothing renders it, and it costs 35 KB in the browser bundle.
    protein_dm: f.protein_dm,
    fat_dm: f.fat_dm,
    aafco_meets: f.aafco_meets,
    green_count: f.green_count,
    yellow_count: f.yellow_count,
    red_count: f.red_count,
    black_count: f.black_count,
    // getFoodGrade() needs both to decide whether the panel is understood well
    // enough to score at all; without them the client would grade every product
    // off a handful of recognised rows.
    neutral_count: f.neutral_count,
    ing_total: f.ing_total,
    has_ingredients: Array.isArray(f.ingredients) && f.ingredients.length > 0,
  }
})

fs.writeFileSync(outPath, JSON.stringify(index))

// buy_url is 105 KB and is read by exactly one client page — /compare. Keeping
// it out of the card index means /food and its category pages stop paying for
// a field they never render.
fs.writeFileSync(buyPath, JSON.stringify(buyUrls))

const fullSize = fs.statSync(srcPath).size
const indexSize = fs.statSync(outPath).size
const buySize = fs.statSync(buyPath).size
console.log(`petfood-index.json: ${index.length} items, ${(indexSize / 1024).toFixed(0)}KB (full data is ${(fullSize / 1024).toFixed(0)}KB)`)
console.log(`food-buy-urls.json: ${(buySize / 1024).toFixed(0)}KB (loaded only by /compare)`)
