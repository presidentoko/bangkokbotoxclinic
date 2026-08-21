/**
 * Thai → Latin transliteration, roughly following RTGS.
 *
 * 188 of the 496 clinic URLs look like `/hospital/0x30e2994f708a55310x7ded…`.
 * That is not a hash anyone chose — it is what `toSlug()` falls back to when a
 * clinic's name is Thai-only, because the slugifier strips every non-ASCII
 * character and is left with nothing. A hex URL tells a searcher nothing, gives
 * Google no keyword signal, and looks broken when shared in a chat.
 *
 * This is a character-level approximation, not a linguistic transliterator:
 * proper RTGS needs syllable segmentation to know whether a consonant is an
 * initial or a final, and Thai does not write word boundaries. The output is
 * therefore imperfect romanisation — but "rong-phyabal-sat-siriwet-hua-lamphong"
 * is a legible, stable, keyword-bearing URL, and the hex string is neither.
 */

// Consonants in initial position. Finals differ in Thai (ส → t, not s), but
// without syllable analysis the initial reading is the safer default: it keeps
// the recognisable shape of names people actually type.
const CONSONANTS: Record<string, string> = {
  'ก': 'k', 'ข': 'kh', 'ฃ': 'kh', 'ค': 'kh', 'ฅ': 'kh', 'ฆ': 'kh', 'ง': 'ng',
  'จ': 'ch', 'ฉ': 'ch', 'ช': 'ch', 'ซ': 's', 'ฌ': 'ch', 'ญ': 'y',
  'ฎ': 'd', 'ฏ': 't', 'ฐ': 'th', 'ฑ': 'th', 'ฒ': 'th', 'ณ': 'n',
  'ด': 'd', 'ต': 't', 'ถ': 'th', 'ท': 'th', 'ธ': 'th', 'น': 'n',
  'บ': 'b', 'ป': 'p', 'ผ': 'ph', 'ฝ': 'f', 'พ': 'ph', 'ฟ': 'f', 'ภ': 'ph',
  'ม': 'm', 'ย': 'y', 'ร': 'r', 'ล': 'l', 'ว': 'w',
  'ศ': 's', 'ษ': 's', 'ส': 's', 'ห': 'h', 'ฬ': 'l', 'อ': '', 'ฮ': 'h',
}

// Vowel signs. Thai writes some vowels before the consonant they follow in
// speech; handled by emitting them in written order, which reads acceptably.
const VOWELS: Record<string, string> = {
  'ะ': 'a', 'ั': 'a', 'า': 'a', 'ๅ': 'a',
  'ิ': 'i', 'ี': 'i', 'ึ': 'ue', 'ื': 'ue',
  'ุ': 'u', 'ู': 'u',
  'เ': 'e', 'แ': 'ae', 'โ': 'o', 'ใ': 'ai', 'ไ': 'ai',
  'ำ': 'am', 'ๆ': '',
  '็': '', // vowel shortener, no sound of its own
}

// Tone marks and the killer mark carry no vowel/consonant sound.
const SILENT = new Set(['่', '้', '๊', '๋', '์', '๎', 'ฺ'])

const THAI_DIGITS: Record<string, string> = {
  '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
  '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9',
}

/**
 * Words common enough in clinic names to be worth spelling the way Thai
 * speakers already romanise them. Applied before character mapping, so the
 * high-traffic terms in these URLs read correctly even though the rest is
 * approximated.
 */
const WORDS: [RegExp, string][] = [
  [/โรงพยาบาลสัตว์/g, ' rong-phayaban-sat '],
  [/โรงพยาบาล/g, ' rong-phayaban '],
  [/คลินิกสัตว์/g, ' clinic-sat '],
  [/คลินิก/g, ' clinic '],
  [/สัตวแพทย์/g, ' sattawaphaet '],
  [/สัตวแพทย/g, ' sattawaphaet '],
  [/สัตว์เลี้ยง/g, ' sat-liang '],
  [/สัตว์/g, ' sat '],
  [/ศูนย์/g, ' sun '],
  [/สาขา/g, ' sakha '],
  [/เขต/g, ' khet '],
  [/กรุงเทพ/g, ' krungthep '],
  [/แอนิมอล/g, ' animal '],
  [/เพ็ท/g, ' pet '],
  [/เวท/g, ' vet '],
]

// Thai writes these vowels to the *left* of the consonant they are spoken
// after. Transliterating in written order gives "siriewch" for ศิริเวช and
// "hawlamophng" for หัวลำโพง; swapping the pair first gives "siriwech" and
// "hawlamphong", which is what a reader expects to see in a URL.
const LEADING_VOWELS = new Set(['เ', 'แ', 'โ', 'ใ', 'ไ'])

export function romanizeThai(input: string): string {
  if (!input) return ''

  let text = input
  for (const [re, replacement] of WORDS) text = text.replace(re, replacement)

  const chars = [...text]
  let out = ''
  let prevWasConsonant = false
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]

    if (LEADING_VOWELS.has(ch)) {
      const next = chars[i + 1]
      if (next && next in CONSONANTS) {
        out += CONSONANTS[next] + VOWELS[ch]
        i++
        prevWasConsonant = false
        continue
      }
      out += VOWELS[ch]
      prevWasConsonant = false
      continue
    }

    if (SILENT.has(ch)) continue
    if (ch in THAI_DIGITS) { out += THAI_DIGITS[ch]; prevWasConsonant = false; continue }

    // อ does two jobs. At the start of a syllable it is a silent carrier for a
    // vowel; after a consonant it *is* the vowel /ɔː/. Treating it as always
    // silent turned จอมทอง into "chmthng" instead of "chomthong".
    if (ch === 'อ') {
      out += prevWasConsonant ? 'o' : ''
      prevWasConsonant = false
      continue
    }

    if (ch in CONSONANTS) { out += CONSONANTS[ch]; prevWasConsonant = true; continue }
    if (ch in VOWELS) { out += VOWELS[ch]; prevWasConsonant = false; continue }
    // Anything already Latin, a digit, or a separator passes through.
    out += /[a-zA-Z0-9]/.test(ch) ? ch : ' '
    prevWasConsonant = false
  }

  return out
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Cap a slug at a whole segment boundary so URLs stay a sane length. */
export function trimSlug(slug: string, maxLength = 60): string {
  if (slug.length <= maxLength) return slug
  const cut = slug.slice(0, maxLength)
  const lastDash = cut.lastIndexOf('-')
  return (lastDash > 20 ? cut.slice(0, lastDash) : cut).replace(/-+$/, '')
}
