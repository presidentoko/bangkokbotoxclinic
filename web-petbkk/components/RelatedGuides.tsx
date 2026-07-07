import { ALL_GUIDES } from '@/lib/guides'
import SocialShare from './SocialShare'

interface Props {
  current: string
  count?: number
}

export default function RelatedGuides({ current, count = 4 }: Props) {
  const filtered = ALL_GUIDES.filter(g => g.key !== current)
  const currentIdx = ALL_GUIDES.findIndex(g => g.key === current)
  const offset = currentIdx >= 0 ? (currentIdx * 7) % Math.max(filtered.length - count + 1, 1) : 0
  const guides = [...filtered.slice(offset, offset + count), ...filtered].slice(0, count)

  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      <SocialShare />
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 mt-6">คู่มือที่เกี่ยวข้อง</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {guides.map(g => (
          <a
            key={g.key}
            href={g.href}
            className="bg-white rounded-xl border p-3 hover:shadow-md hover:border-orange-200 hover:-translate-y-0.5 transition-all group"
          >
            <p className="text-2xl mb-1.5">{g.icon}</p>
            <p className="font-semibold text-sm text-gray-800 group-hover:text-orange-600 transition-colors leading-tight">{g.title}</p>
            <p className="text-[11px] text-gray-400 mt-1 leading-snug">{g.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
