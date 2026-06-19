"use client";

const TELEGRAM_BOT = "https://t.me/Koreaplastic_bot";

export function SupplierVerifiedCTA() {
  return (
    <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
          Most popular
        </span>
        <h3 className="text-2xl font-bold">Verified Supplier Badge — ฿5,000</h3>
        <p className="text-sm text-[var(--muted)] mt-1">
          One-time. Badge stays as long as your DBD registration remains active.
        </p>
      </div>

      <a
        href={TELEGRAM_BOT}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-[#229ED9] text-white font-bold text-base hover:bg-[#1a8fc4] transition"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current shrink-0" aria-hidden="true">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        Telegram으로 문의하기
      </a>

      <p className="text-xs text-[var(--muted)] text-center mt-3">
        회사명 + DBD 등록번호 메시지 주시면 확인 후 안내드립니다.
      </p>
    </div>
  );
}
