/**
 * What a catalogue entry actually is: a meal, a treat, or not food at all.
 *
 * `sub_category` only records physical form (dry / wet / milk replacer), so a
 * 125 g bag of dried sheep ears and a 12 kg sack of kibble were the same kind of
 * thing to every comparison on the site. The consequences were visible on the
 * live pages: a dog chew was offered air-dried tripe dinners as "better
 * alternatives", a Royal Canin renal formula as a "similar food", and was told
 * it failed AAFCO — a standard for complete diets that a treat never claims to
 * meet. The retailer import also brought in a silicone treat dispenser.
 *
 * The patterns are deliberately narrow. A false "treat" hides a real meal from
 * comparisons, which is worse than the occasional treat slipping through, so
 * words that also describe complete wet food (broth, soup, purée) are left out.
 */

export type FoodKind = 'meal' | 'treat' | 'nonfood'

const NON_FOOD = /dispenser|\btoys?\b|\bbowls?\b|feeder|leash|collar|shampoo|แชมพู|ของเล่น|ชามอาหาร/i

const TREAT = new RegExp(
  [
    'ขนม', 'ขัดฟัน', 'แมวเลีย',
    '\btreats?\b', '\bsnacks?\b', '\bchews?\b', 'jerky', 'lickables?',
    '\btoppers?\b', 'dinner dust', '\bbiscuits?\b',
  ].join('|'),
  'i',
)

export function foodKind(food: { name_en: string; name_th?: string }): FoodKind {
  const hay = `${food.name_en} ${food.name_th ?? ''}`
  if (NON_FOOD.test(hay)) return 'nonfood'
  if (TREAT.test(hay)) return 'treat'
  return 'meal'
}
