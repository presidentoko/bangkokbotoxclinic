import type { CheckItem } from '@/components/calc/Checklist'

/**
 * Pre-purchase checks. Written as things to verify, not as "tells".
 *
 * The guides these replace contradicted themselves — one page described the
 * Chanel CC overlap one way in its FAQ and the opposite way in its body — and
 * a buyer who trusts a wrong tell walks away from a real bag or pays for a
 * fake. So a brand item goes in only if it is a structural fact (a chip
 * replaced the sticker in 2021) rather than a detail that varies by season,
 * and anything subtler is routed to a professional authenticator.
 */

export const UNIVERSAL: CheckItem[] = [
  { id: 'price', critical: true, title: 'The price is one real sales support', detail: 'Use the price check above. Counterfeits and scams have to be priced under the market to sell — a bargain is the lure.' },
  { id: 'guarantee', critical: true, title: 'You are covered if it fails authentication', detail: 'Buy through a platform that authenticates before shipping and refunds if an item fails, or pay with a method that has buyer protection. Never bank transfer, crypto or gift cards to a private seller.' },
  { id: 'photos', title: 'You have seen the details, not only the bag', detail: 'Ask for clear daylight photos of the interior stamp or label, the serial / date code or chip area, hardware engravings, stitching close-up and the corners. A seller with the real item can take them in minutes.' },
  { id: 'seller', title: 'The seller has a history', detail: 'Reviews, past sales and a name you can check. A new account with one luxury item and a story about urgency is the pattern to walk away from.' },
  { id: 'docs', title: 'Receipt and paperwork, treated as support — not proof', detail: 'An original receipt helps, but cards, boxes and dust bags are counterfeited too. Matching paperwork never outweighs a failed authentication.' },
  { id: 'pro', critical: true, title: 'A professional authentication before your return window closes', detail: 'For anything above a few hundred dollars, get an independent authentication (AI-assisted or by a human specialist) while you can still return the item.' },
  { id: 'arrival', title: 'On arrival: it matches the photos', detail: 'Same scuffs, same date code, same hardware colour. A swap between listing and delivery is a known scam.' },
]

export const BRAND_CHECKLISTS: Record<string, { brand: string; intro: string; items: CheckItem[] }> = {
  chanel: {
    brand: 'Chanel',
    intro: 'Chanel changed how it identifies bags in 2021, and that one fact settles more questions than any stitch count.',
    items: [
      { id: 'era', critical: true, title: 'The ID matches the era', detail: 'Bags made from around 2021 carry an embedded microchip and no serial sticker or authenticity card. Older bags have a serial sticker inside. A recent-season bag with a sticker, or an older bag sold as "chipped", needs an explanation.' },
      { id: 'sticker', title: 'Serial sticker intact and matching (pre-2021)', detail: 'The sticker should be undamaged and, where the authenticity card survives, carry the same number. A missing card is common and not a red flag on its own; a mismatched one is.' },
      { id: 'quilt', title: 'Quilting lines up across seams', detail: 'On quilted bags the diamonds should continue across the flap, the back pocket and the sides without jumping. Compare with photos of a verified example of the same model.' },
      { id: 'hardware', title: 'Hardware compared with a verified example', detail: 'The CC turn-lock and chain differ by season and hardware colour, so check yours against an authenticated bag of the same season rather than a generic rule.' },
    ],
  },
  'louis-vuitton': {
    brand: 'Louis Vuitton',
    intro: 'Louis Vuitton stamped date codes from the 1980s and replaced them with an NFC chip in 2021 — the first thing to establish is which one your bag should have.',
    items: [
      { id: 'era', critical: true, title: 'Date code or chip, as the era requires', detail: 'Bags from roughly the 1980s to 2021 have a stamped date code (letters for the workshop, four digits for the date). From 2021 there is an embedded NFC chip and no date code. The era must also fit when the style was actually made.' },
      { id: 'canvas', title: 'Canvas cut cleanly and symmetrically', detail: 'Monogram and Damier pieces are cut so the pattern sits symmetrically on the bag. Badly cropped or lopsided pattern at the main panels is worth a closer look.' },
      { id: 'vachetta', title: 'Leather trim ages like untreated leather', detail: 'The natural cowhide trim (vachetta) on many canvas bags darkens to honey with use and absorbs water. Trim that stays pale and plasticky on an old bag deserves scrutiny.' },
      { id: 'stamp', title: 'Heat stamp crisp and evenly spaced', detail: 'Lettering should be sharp and evenly spaced, not smudged or bleeding into the leather.' },
    ],
  },
  hermes: {
    brand: 'Hermès',
    intro: 'Hermès bags are made by hand and sold only in its own boutiques, which rules out most of the stories counterfeits are sold with.',
    items: [
      { id: 'channel', critical: true, title: 'The story fits how Hermès sells', detail: 'Birkin, Kelly and Constance bags are sold only in Hermès boutiques. "Factory direct", "staff sale" or "outlet" stories are not how these bags reach the market.' },
      { id: 'blind', title: 'Blind stamp present', detail: 'Hermès bags carry a blind stamp — a year letter, in some periods inside a shape, with a craftsman mark. Its year should be consistent with the leather and hardware offered for that model at the time.' },
      { id: 'stitch', title: 'Hand saddle-stitching', detail: 'The seams are stitched by hand, which leaves slightly angled, even stitches. Perfectly straight machine stitching on a Birkin or Kelly is a reason to stop.' },
      { id: 'lock', title: 'Lock and keys match', detail: 'Where a padlock and keys are present, the number on the lock and on the keys should match.' },
    ],
  },
}

export const CHECKLIST_BRANDS = Object.keys(BRAND_CHECKLISTS)
