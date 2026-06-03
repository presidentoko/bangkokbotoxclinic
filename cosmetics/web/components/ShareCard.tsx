"use client";
import { useState } from "react";
import Image from "next/image";

interface ShareCardProps {
  name: string;
  brand: string;
  imageUrl: string;
  score: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  priceTHB: number;
  listPriceTHB: number;
  discountPct: number;
  llmSummary: string;
  locale: string;
  pageUrl: string;
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 85 ? "#16a34a" : score >= 70 ? "#d97706" : "#e0607e";
  return (
    <div
      className="flex flex-col items-center justify-center rounded-full border-4 shadow-lg bg-white"
      style={{ width: 80, height: 80, borderColor: color }}
    >
      <span className="text-2xl font-black leading-none" style={{ color }}>
        {score}
      </span>
      <span className="text-[9px] text-neutral-400 mt-0.5">
        /100
      </span>
    </div>
  );
}

export function ShareCard({
  name,
  brand,
  imageUrl,
  score,
  rating,
  reviewCount,
  soldCount,
  priceTHB,
  listPriceTHB,
  discountPct,
  llmSummary,
  locale,
  pageUrl,
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);

  const shareText =
    locale === "th"
      ? `${name} — คะแนน ${score}/100 · ★${rating.toFixed(1)} · ${soldCount.toLocaleString()} สั่งแล้ว · ฿${Math.round(priceTHB).toLocaleString()}`
      : `${name} — Score ${score}/100 · ★${rating.toFixed(1)} · ${soldCount.toLocaleString()} sold · ฿${Math.round(priceTHB).toLocaleString()}`;

  const handleShare = async () => {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, text: shareText, url: pageUrl });
        return;
      } catch {
        // user cancelled or not supported — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const hasDiscount = discountPct > 0;
  const stars = Math.round(rating);

  return (
    <section className="space-y-3">
      {/* Section label */}
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {locale === "th" ? "แชร์สินค้านี้" : "Share this product"}
      </h2>

      {/* ── The card itself (screenshot target) ── */}
      <div
        id="share-card"
        className="relative overflow-hidden rounded-3xl shadow-xl"
        style={{
          background: "linear-gradient(145deg, #fff0f3 0%, #fbf4f1 40%, #fff8f0 100%)",
          border: "1.5px solid #f0d9d5",
        }}
      >
        {/* Gold top accent */}
        <div className="absolute top-0 inset-x-0 h-1 rounded-t-3xl" style={{ background: "linear-gradient(90deg, #c9a86a, #e0607e, #c9a86a)" }} />

        <div className="p-5 space-y-4">
          {/* Site tag */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md border border-rose-400 bg-white">
              <span className="font-serif text-[13px] font-bold text-rose-500">B</span>
            </div>
            <span className="text-[11px] font-semibold text-[#8a7a76] tracking-widest uppercase">
              bangkokfillers.com
            </span>
          </div>

          {/* Product image + info row */}
          <div className="flex gap-4 items-start">
            {/* Image */}
            {imageUrl && (
              <div className="shrink-0 rounded-2xl overflow-hidden border border-rose-100 bg-white shadow-sm" style={{ width: 100, height: 100 }}>
                <Image
                  src={imageUrl}
                  alt={name}
                  width={100}
                  height={100}
                  className="object-contain w-full h-full p-1.5"
                />
              </div>
            )}

            {/* Brand + name + score */}
            <div className="flex-1 space-y-1.5 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86a]">{brand}</p>
              <p className="text-sm font-semibold text-[#2b2222] leading-snug line-clamp-2">{name}</p>
              <div className="flex items-center gap-2 pt-1">
                <ScoreRing score={score} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-amber-500 text-base leading-none">
                    {"★".repeat(stars)}{"☆".repeat(Math.max(0, 5 - stars))}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {rating.toFixed(1)} · {reviewCount.toLocaleString()}{" "}
                    {locale === "th" ? "รีวิว" : "reviews"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* LLM summary */}
          {llmSummary && (
            <p className="text-xs text-neutral-600 leading-relaxed italic border-l-2 border-rose-200 pl-3">
              {llmSummary.length > 120 ? llmSummary.slice(0, 117) + "…" : llmSummary}
            </p>
          )}

          {/* Stat pills */}
          <div className="flex flex-wrap gap-2">
            {soldCount > 0 && (
              <div className="flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-3 py-1">
                <span className="text-rose-400 text-xs">🛒</span>
                <span className="text-xs font-semibold text-rose-700">
                  {soldCount.toLocaleString()}
                  {locale === "th" ? " สั่งแล้ว" : " sold"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1">
              <span className="text-xs font-bold text-[#2b2222]">
                ฿{Math.round(priceTHB).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs font-semibold text-rose-500 ml-0.5">
                  -{discountPct}%
                </span>
              )}
              {hasDiscount && (
                <span className="text-[10px] text-neutral-400 line-through ml-1">
                  ฿{Math.round(listPriceTHB).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Gold bottom accent */}
        <div className="h-0.5 mx-5 mb-3 rounded-full opacity-40" style={{ background: "linear-gradient(90deg, transparent, #c9a86a, transparent)" }} />
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-[0.98] transition-all px-6 py-3.5 text-white font-semibold text-base shadow-sm shadow-rose-200"
      >
        {copied ? (
          <>
            <span>✓</span>
            <span>{locale === "th" ? "คัดลอก URL แล้ว!" : "URL copied!"}</span>
          </>
        ) : (
          <>
            <span>📤</span>
            <span>{locale === "th" ? "แชร์สินค้านี้" : "Share this product"}</span>
          </>
        )}
      </button>
    </section>
  );
}
