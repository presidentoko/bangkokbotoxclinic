import type { EntityReview, PantipThread } from '@/lib/petreviews'

function SentimentBadge({ sentiment }: { sentiment: PantipThread['sentiment'] }) {
  if (sentiment === 'positive') return <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full">👍 ดี</span>
  if (sentiment === 'negative') return <span className="text-xs text-red-700 bg-red-50 px-1.5 py-0.5 rounded-full">👎 ระวัง</span>
  return null
}

export default function PantipReviews({ review }: { review: EntityReview }) {
  if (!review || review.mention_count === 0) return null

  const posRatio = review.mention_count > 0
    ? Math.round((review.positive_count / review.mention_count) * 100)
    : 0

  return (
    <section className="mb-4 bg-white border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">
          รีวิวจาก Pantip
        </h2>
        <span className="text-xs text-gray-400">{review.mention_count} กระทู้</span>
      </div>

      {/* Sentiment bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 rounded-full"
            style={{ width: `${posRatio}%` }}
          />
        </div>
        <span className="text-xs text-green-700 font-medium w-16 text-right">
          {posRatio}% ชอบ
        </span>
      </div>

      {/* Thread list */}
      <ul className="space-y-3">
        {review.threads.slice(0, 4).map(t => (
          <li key={t.tid} className="text-sm">
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors leading-snug">
                  {t.title}
                </p>
                <SentimentBadge sentiment={t.sentiment} />
              </div>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{t.snippet}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.replies} ความคิดเห็น</p>
            </a>
          </li>
        ))}
      </ul>

      <a
        href={`https://pantip.com/search#q=${encodeURIComponent('สัตว์เลี้ยง')}&st=2`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block text-xs text-center text-orange-500 hover:underline"
      >
        ดูเพิ่มเติมใน Pantip →
      </a>
    </section>
  )
}
