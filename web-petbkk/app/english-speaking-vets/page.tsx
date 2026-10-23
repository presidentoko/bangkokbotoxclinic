import type { Metadata } from 'next'
import { loadHospitals, hospitalSlug, districtLabel } from '@/lib/hospitals'
import { allProfiles } from '@/lib/hospitalProfiles'
import { getSignals, SPECIAL_ANIMALS } from '@/lib/hospitalSignals'
import { getClinicPrices } from '@/lib/clinicPrices'
import { getLicense } from '@/lib/licenses'
import type { Hospital } from '@/lib/types'

/**
 * /english-speaking-vets — the one English page on a Thai site, because it
 * answers a question only foreigners ask and only this data can answer.
 *
 * "English speaking vet Bangkok / Phuket / Chiang Mai" is searched by people
 * who cannot read the Thai clinic pages, and the usual answers are a handful of
 * expat forum threads naming the same three hospitals. This list is measured
 * instead: a clinic is on it when at least 15% of the reviews we read (and at
 * least three) were written in a language other than Thai — evidence that
 * people who do not speak Thai go there and could explain what was wrong.
 * It is not a claim that the staff speak English, and the page says so.
 */

const SITE = 'https://www.thailandpethub.com'
const MIN_SHARE = 0.15
const MIN_REVIEWS = 3

export const metadata: Metadata = {
  title: 'English-speaking vets in Thailand — clinics foreign owners actually use',
  description:
    'Vets in Bangkok, Chiang Mai, Pattaya and Phuket where at least 15% of Google reviews are written by non-Thai speakers. ' +
    'Measured from 19,022 reviews, with 24-hour status, licence and published prices.',
  alternates: { canonical: `${SITE}/english-speaking-vets` },
  openGraph: {
    title: 'English-speaking vets in Thailand — measured, not guessed',
    description: '73 clinics where foreign owners leave reviews, in Bangkok, Chiang Mai, Pattaya and Phuket.',
    url: `${SITE}/english-speaking-vets`,
  },
}

const CITY_EN: Record<string, string> = { bangkok: 'Bangkok', chiangmai: 'Chiang Mai', pattaya: 'Pattaya', phuket: 'Phuket' }
const LANG_EN: Record<string, string> = {
  en: 'English', 'en-GB': 'English', ru: 'Russian', ja: 'Japanese', 'zh-Hans': 'Chinese', 'zh-Hant': 'Chinese',
  zh: 'Chinese', 'zh-CN': 'Chinese', de: 'German', ko: 'Korean', fr: 'French', nl: 'Dutch', it: 'Italian',
  my: 'Burmese', fi: 'Finnish', hu: 'Hungarian', hy: 'Armenian', fil: 'Filipino',
}
const ANIMAL_EN: Record<string, string> = {
  rabbit: 'rabbits', rodent: 'small rodents', bird: 'birds', reptile: 'reptiles', sugarglider: 'sugar gliders', exotic: 'exotics',
}

function latinName(h: Hospital): string {
  // Many listings carry a Thai name in both fields; prefer whichever has Latin letters.
  const en = h.name_en || ''
  return /[A-Za-z]{3}/.test(en) ? en : (h.name_th || en)
}

export default function EnglishSpeakingVets() {
  const profiles = allProfiles()
  const hospitals = loadHospitals()
  const rows = hospitals
    .map(h => ({ h, p: profiles[h.id] }))
    .filter(({ p }) => p && p.languages.with_text && p.languages.non_thai >= MIN_REVIEWS
      && p.languages.non_thai / p.languages.with_text >= MIN_SHARE)
    .map(({ h, p }) => ({ h, p: p!, share: p!.languages.non_thai / p!.languages.with_text }))
    .sort((a, b) => b.share - a.share)

  const cities = ['bangkok', 'chiangmai', 'pattaya', 'phuket']

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'English-speaking vets in Thailand',
    numberOfItems: rows.length,
    itemListElement: rows.slice(0, 50).map((r, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${SITE}/hospital/${hospitalSlug(r.h)}`, name: latinName(r.h),
    })),
  }

  return (
    <main className="max-w-3xl mx-auto" lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl font-black text-gray-900 leading-tight mb-4">
        English-speaking vets in Thailand: the clinics foreign owners actually use
      </h1>
      <p className="text-gray-600 leading-relaxed mb-3">
        Finding a vet you can explain things to is the hard part of keeping a pet in Thailand. Most lists
        name the same three big hospitals. This one is measured: we read {Object.keys(profiles).length.toLocaleString()} clinics&apos;
        Google reviews and kept the {rows.length} where at least {Math.round(MIN_SHARE * 100)}% of reviewers wrote in a
        language other than Thai.
      </p>
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 text-sm text-amber-900 leading-relaxed">
        <strong>What this does and does not mean.</strong> Foreign owners going to a clinic and writing about it is
        good evidence they could make themselves understood. It is not a guarantee that a given vet speaks English
        on a given day — phone ahead, and for an emergency ask on the call before you drive.
      </div>

      {cities.map(c => {
        const list = rows.filter(r => r.h.city === c)
        if (!list.length) return null
        return (
          <section key={c} id={c} className="mb-10 scroll-mt-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {CITY_EN[c]} <span className="text-sm font-normal text-gray-400">{list.length} clinics</span>
            </h2>
            <ul className="bg-white border rounded-2xl divide-y">
              {list.map(({ h, p, share }) => {
                const langs = p.languages.top.map(l => LANG_EN[l] ?? l).filter((v, i, a) => a.indexOf(v) === i)
                const sig = getSignals(h.id)?.animals ?? {}
                const exotics = SPECIAL_ANIMALS.filter(k => sig[k]).map(k => ANIMAL_EN[k])
                const priced = !!getClinicPrices(h.id)
                const lic = getLicense(h.id)
                const area = districtLabel(h)
                return (
                  <li key={h.id} className="p-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <a href={`/hospital/${hospitalSlug(h)}`} className="font-semibold text-gray-900 hover:text-orange-600">{latinName(h)}</a>
                      <span className="text-xs text-gray-500 shrink-0 tabular-nums">{Math.round(share * 100)}% non-Thai reviews</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {langs.join(', ')}
                      {area ? ` · ${area}` : ''}
                      {h.google_rating != null ? ` · ${h.google_rating.toFixed(1)}★` : ''}
                      {h.is_24h ? ' · open 24 hours' : ''}
                      {lic ? ' · DLD licence on record' : ''}
                      {h.phone ? ` · ${h.phone}` : ''}
                    </p>
                    {(exotics.length > 0 || priced || p.replies.negative > 0) && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {exotics.length > 0 && <>Owners mention {exotics.join(', ')}. </>}
                        {priced && <>Publishes prices. </>}
                        {p.replies.negative > 0 && <>Answered {p.replies.negative_replied} of {p.replies.negative} one- or two-star reviews.</>}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <section className="bg-gray-50 border rounded-2xl p-5 mb-8 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-base font-bold text-gray-900 mb-2">How this list is made</h2>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Up to 30 Google reviews per clinic — the ones Google ranks most relevant, collected 16 Oct 2026 — for {Object.keys(profiles).length} clinics with at least ten reviews.</li>
          <li>A clinic is listed when at least {Math.round(MIN_SHARE * 100)}% of the reviews with text, and at least {MIN_REVIEWS} of them, were written in a language other than Thai. The languages shown are the most common ones among those reviews.</li>
          <li>“DLD licence on record” means the clinic matched an entry in the Department of Livestock Development&apos;s register of licensed animal clinics. A clinic without that note may still be licensed under a different registered name.</li>
          <li>The clinic pages are in Thai; prices, hours and review analysis on them are readable without it.</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href="/hospital/exotic" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50">🐰 Vets for rabbits, birds &amp; reptiles (Thai)</a>
        <a href="/hospital/prices" className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50">🏷️ Published prices (Thai)</a>
      </div>
    </main>
  )
}
