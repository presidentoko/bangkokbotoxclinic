"use client";

// 유료 PDF CTA — Gumroad / Lemon Squeezy.
// ENV NEXT_PUBLIC_PAID_PDF_URL 비어있으면 컴포넌트 hidden (상품 등록 전).
//
// Gumroad: https://gumroad.com/l/{product-slug}
// Lemon Squeezy: https://{store}.lemonsqueezy.com/checkout/buy/{variant-id}
// 둘 다 단순 외부 링크 + new tab 으로 처리 — 정적 사이트 호환.

import { PAID_PDF_I18N, type Locale } from "@/lib/buyersI18n";

const PAID_PDF_URL = process.env.NEXT_PUBLIC_PAID_PDF_URL || "";

export function PaidPdfCta({ locale = "en" }: { locale?: Locale }) {
  if (!PAID_PDF_URL) return null;
  const t = PAID_PDF_I18N[locale];

  return (
    <div className="my-8 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-6 md:p-8 shadow-sm">
      <div className="grid md:grid-cols-5 gap-6 items-center">
        <div className="md:col-span-3">
          <div className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-2">
            {t.tag}
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">{t.title}</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{t.subtitle}</p>
          <ul className="space-y-1.5 text-sm">
            {t.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold shrink-0">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <a
            href={PAID_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-5 py-4 rounded-xl bg-amber-600 text-white font-bold text-center hover:bg-amber-700 transition shadow-md text-base"
          >
            {t.buyBtn}
          </a>
          <p className="text-[10px] text-[var(--muted)] mt-2 leading-relaxed text-center">
            {t.secured}
          </p>
        </div>
      </div>
    </div>
  );
}
