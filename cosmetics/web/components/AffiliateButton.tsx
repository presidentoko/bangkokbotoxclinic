import { affiliateUrl } from "@/lib/affiliate";
import { t, type Locale } from "@/lib/i18n";
import type { Product } from "@/lib/types";
export function AffiliateButton({ p, locale }: { p: Product; locale: Locale }) {
  return (
    <a href={affiliateUrl(p)} target="_blank" rel="sponsored noopener"
       className="inline-block rounded bg-pink-600 px-4 py-2 text-white font-medium">
      {t(locale, "buy_now")} · ฿{Math.round(p.price_thb).toLocaleString()}
    </a>
  );
}
