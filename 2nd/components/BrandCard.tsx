import Link from 'next/link'
import { BrandSummary } from '@/lib/data'

interface BrandCardProps extends BrandSummary {
  savingsPct?: number
}

export function BrandCard({ brand, slug, count, savingsPct }: BrandCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="group relative overflow-hidden block border border-[#E8E2D9] bg-white hover:border-[#B8954A] hover:shadow-lg transition-all duration-300"
    >
      {/* Top accent bar */}
      <div className="h-0.5 bg-[#E8E2D9] group-hover:bg-[#B8954A] transition-colors duration-300" />
      {/* Monogram watermark */}
      <div
        className="absolute -bottom-4 -right-2 text-[7rem] font-serif leading-none select-none pointer-events-none transition-transform duration-300 group-hover:scale-110"
        style={{ fontFamily: 'var(--font-playfair)', color: '#F0EBE3' }}
        aria-hidden="true"
      >
        {brand[0]}
      </div>
      <div className="relative p-6 pb-8">
        <div className="w-6 h-px bg-[#B8954A] mb-4" />
        <h2 className="font-serif text-xl text-[#1A1A1A] group-hover:text-[#8C7355] transition-colors mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
          {brand}
        </h2>
        <p className="text-xs text-[#9C8B7A] tracking-wide uppercase mt-1">{count} model{count !== 1 ? 's' : ''}</p>
        {savingsPct !== undefined && savingsPct > 0 && (
          <span className="inline-block mt-4 text-xs px-2.5 py-1 bg-[#F5F0E8] text-[#8C7355] rounded-full">
            avg {savingsPct}% below retail
          </span>
        )}
      </div>
    </Link>
  )
}
