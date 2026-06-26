'use client'

interface Props {
  title?: string
  url?: string
}

export default function SocialShare({ title = '', url = '' }: Props) {
  const pageTitle = title || (typeof document !== 'undefined' ? document.title : 'ThailandPetHub')
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://www.thailandpethub.com')
  const encodedTitle = encodeURIComponent(pageTitle)
  const encodedUrl = encodeURIComponent(pageUrl)

  return (
    <div className="flex items-center gap-2 flex-wrap mt-6 pt-5 border-t border-gray-100">
      <span className="text-xs text-gray-400 font-medium">แชร์:</span>
      <a
        href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06C755] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
        aria-label="แชร์ทาง LINE"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.89c.50 0 .866.402.866.899 0 .497-.366.899-.866.899H17.59v1.11h1.775c.5 0 .866.401.866.898s-.366.899-.866.899H16.69a.866.866 0 0 1-.866-.899V8.991c0-.497.366-.899.866-.899h2.675zm-7.425 3.807c0 .497-.37.899-.87.899a.858.858 0 0 1-.715-.373l-2.02-2.677v2.15a.866.866 0 0 1-.866.9.866.866 0 0 1-.866-.9V8.99c0-.497.367-.9.866-.9.28 0 .53.13.695.334l2.021 2.677V8.99c0-.497.367-.899.866-.899.499 0 .866.402.866.899v4.707zM7.12 13.697H5.345a.866.866 0 0 1-.866-.899V8.99c0-.497.367-.9.866-.9.499 0 .866.403.866.9v3.807H7.12c.499 0 .866.401.866.898s-.367.899-.866.899zm14.548-1.797C21.668 6.95 16.908 3 11.1 3S.532 6.95.532 11.9c0 4.457 3.972 8.181 9.337 8.89.363.077.858.238.984.545.113.28.074.717.036 1.001l-.159 1.006c-.049.28-.225 1.097.96.598 1.186-.499 6.39-3.765 8.72-6.45 1.61-1.77 2.38-3.563 2.38-5.59z"/></svg>
        LINE
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
        aria-label="แชร์ทาง Facebook"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:opacity-80 transition-opacity"
        aria-label="แชร์ทาง X"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X
      </a>
      <button
        onClick={() => {
          navigator.clipboard?.writeText(pageUrl).then(() => {
            const btn = document.querySelector('[data-copy-btn]') as HTMLButtonElement
            if (btn) { btn.textContent = 'คัดลอกแล้ว ✓'; setTimeout(() => { btn.textContent = 'คัดลอก URL' }, 2000) }
          })
        }}
        data-copy-btn
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition-colors"
      >
        คัดลอก URL
      </button>
    </div>
  )
}
