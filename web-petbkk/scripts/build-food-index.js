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

const foods = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
const counts = new Map()

const index = foods.map(f => {
  const base = baseFoodSlug(f)
  const n = (counts.get(base) ?? 0) + 1
  counts.set(base, n)
  const slug = n === 1 ? base : `${base}-${n}`

  return {
    id: f.id,
    slug,
    brand: f.brand,
    name_en: f.name_en,
    name_th: f.name_th,
    animal: f.animal,
    life_stage: f.life_stage,
    weight_kg: f.weight_kg,
    price_thb: f.price_thb,
    price_per_kg: f.price_per_kg,
    buy_url: f.buy_url,
    protein_pct: f.protein_pct,
    fat_pct: f.fat_pct,
    fiber_pct: f.fiber_pct,
    moisture_pct: f.moisture_pct,
    // protein_dm / fat_dm / updated_at are declared on PetFoodLight but were
    // never copied here, so every consumer of the light index read `undefined`
    // through a type that promised a number — ShareCard rendered
    // "โปรตีน undefined%" on any food with a protein figure.
    protein_dm: f.protein_dm,
    fat_dm: f.fat_dm,
    updated_at: f.updated_at,
    aafco_meets: f.aafco_meets,
    green_count: f.green_count,
    yellow_count: f.yellow_count,
    red_count: f.red_count,
    black_count: f.black_count,
    has_ingredients: Array.isArray(f.ingredients) && f.ingredients.length > 0,
  }
})

fs.writeFileSync(outPath, JSON.stringify(index))

const fullSize = fs.statSync(srcPath).size
const indexSize = fs.statSync(outPath).size
console.log(`petfood-index.json: ${index.length} items, ${(indexSize / 1024).toFixed(0)}KB (full data is ${(fullSize / 1024).toFixed(0)}KB)`)
