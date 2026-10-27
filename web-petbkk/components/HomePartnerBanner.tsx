import { homeBanners } from '@/lib/clinicProvided'
import { hospitalSlug, loadHospitals } from '@/lib/hospitals'

/**
 * A slim partner strip on the home page for clinics that worked with us
 * (data/clinic-provided.json, `home_banner`). Labelled "พาร์ทเนอร์" so it is
 * never mistaken for a ranking, and it links to the clinic's page on this
 * site, where the clinic's own information is marked as its own.
 */
export default function HomePartnerBanner() {
  const byId = new Map(loadHospitals().map(h => [h.id, h]))
  const banners = homeBanners()
    .map(b => ({ ...b, h: byId.get(b.id) }))
    .filter(b => b.h)
  if (!banners.length) return null

  return (
    <div className="max-w-2xl mx-auto px-4 mb-6 space-y-2">
      {banners.map(b => (
        <a
          key={b.id}
          href={`/hospital/${hospitalSlug(b.h!)}`}
          className="flex items-center gap-3 bg-white border border-blue-100 rounded-2xl px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all group"
        >
          <span className="text-2xl shrink-0">🏥</span>
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-bold text-gray-900 group-hover:text-blue-700 truncate">{b.name}</span>
            <span className="block text-xs text-gray-500 truncate">{b.line}</span>
          </span>
          <span className="shrink-0 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">พาร์ทเนอร์</span>
        </a>
      ))}
    </div>
  )
}
