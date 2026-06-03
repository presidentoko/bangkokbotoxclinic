import { affiliateUrl } from "@/lib/affiliate";
import { type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/types";

/**
 * variant="inline"  — prominent blush rose button used inside the verdict card (desktop+)
 * variant="sticky"  — full-width, used inside the mobile sticky buy bar (already styled by parent)
 */
export function AffiliateButton({
  p,
  locale,
  variant = "inline",
}: {
  p: Product;
  locale: Locale;
  variant?: "inline" | "sticky";
}) {
  const price = `฿${Math.round(p.price_thb).toLocaleString()}`;
  const label =
    locale === "th" ? `ดูราคาล่าสุด · ${price}` : `Check price · ${price}`;

  if (variant === "sticky") {
    return (
      <a
        href={affiliateUrl(p)}
        target="_blank"
        rel="sponsored noopener"
        className="flex w-full items-center justify-center gap-2 text-white font-semibold text-base"
      >
        {label}
      </a>
    );
  }

  return (
    <a
      href={affiliateUrl(p)}
      target="_blank"
      rel="sponsored noopener"
      className="inline-flex items-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 px-6 py-3 text-white font-semibold text-base shadow-sm transition-colors"
    >
      {label}
    </a>
  );
}
