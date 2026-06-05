import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { productSlug } from "@/lib/data";
import { scoreColor, score1, baht } from "@/lib/format";
import { t } from "@/lib/i18n";

export type ProofMode = "score" | "sold" | "loved";

interface ProductStripProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  products: Product[];
  locale: Locale;
  concern?: string;
  proof: ProofMode;
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

function ProofBadge({
  product,
  proof,
  concern,
  locale,
}: {
  product: Product;
  proof: ProofMode;
  concern?: string;
  locale: Locale;
}) {
  if (proof === "score" && concern) {
    const s = product.total_score[concern] ?? 0;
    const color = scoreColor(s);
    const bg =
      s >= 85 ? "bg-emerald-50" : s >= 70 ? "bg-amber-50" : "bg-rose-50";
    return (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${color} ${bg}`}
      >
        {t(locale, "score")} {score1(s)}
      </span>
    );
  }

  if (proof === "sold") {
    const label = `${formatNumber(product.sold_count)} ${t(locale, "sold")}`;
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
        🔥 {label}
      </span>
    );
  }

  if (proof === "loved") {
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
        💖 {formatNumber(product.konvy_review_count)}{" "}
        {t(locale, "reviews_short")}
        {product.konvy_rating ? ` · ★${product.konvy_rating.toFixed(1)}` : ""}
      </span>
    );
  }

  return null;
}

function ProductCard({
  product,
  locale,
  concern,
  proof,
}: {
  product: Product;
  locale: Locale;
  concern?: string;
  proof: ProofMode;
}) {
  const slug = productSlug(product);
  const href = `/${locale}/product/${slug}`;

  return (
    <Link
      href={href}
      className="group w-40 shrink-0 flex flex-col gap-2 rounded-2xl bg-white border border-[#efe1db] p-3 hover:shadow-md hover:shadow-rose-100 hover:-translate-y-0.5 transition-all duration-200 snap-start"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-[#f5ebe7] flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="160px"
            className="object-contain p-1"
          />
        ) : (
          <div className="w-full h-full bg-rose-50 rounded-2xl" />
        )}
      </div>

      {/* Brand eyebrow */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#c9a86a] truncate">
        {product.brand}
      </p>

      {/* Product name */}
      <p className="font-serif-display text-xs font-semibold text-[#2b2222] leading-snug line-clamp-2 group-hover:text-rose-500 transition-colors">
        {product.name}
      </p>

      {/* Proof badge */}
      <div className="mt-auto space-y-1">
        <ProofBadge
          product={product}
          proof={proof}
          concern={concern}
          locale={locale}
        />
        {product.price_thb > 0 && (
          <p className="text-[10px] text-[#8a7a76]">{baht(product.price_thb)}</p>
        )}
      </div>
    </Link>
  );
}

export function ProductStrip({
  title,
  subtitle,
  eyebrow,
  products,
  locale,
  concern,
  proof,
}: ProductStripProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="space-y-0.5">
        {eyebrow && (
          <p className="text-xs uppercase tracking-widest font-semibold text-[#c9a86a]">
            {eyebrow}
          </p>
        )}
        <h2 className="font-serif-display text-xl font-semibold text-[#2b2222]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-[#8a7a76] leading-snug">{subtitle}</p>
        )}
      </div>

      {/* Horizontal scroll row */}
      <div
        className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((p) => (
          <ProductCard
            key={p.product_id}
            product={p}
            locale={locale}
            concern={concern}
            proof={proof}
          />
        ))}
      </div>
    </section>
  );
}
