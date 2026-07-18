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
      ? `${name} — คะแนน ${score}/100 · ★${rating.toFixed(1)} · ${soldCount.toLocaleString("en-US")} สั่งแล้ว · ฿${Math.round(priceTHB).toLocaleString("en-US")}`
      : `${name} — Score ${score}/100 · ★${rating.toFixed(1)} · ${soldCount.toLocaleString("en-US")} sold · ฿${Math.round(priceTHB).toLocaleString("en-US")}`;

  const handleShare = async () => {
    if (typeof navigator === "undefined") return;
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
                    {rating.toFixed(1)} · {reviewCount.toLocaleString("en-US")}{" "}
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
                  {soldCount.toLocaleString("en-US")}
                  {locale === "th" ? " สั่งแล้ว" : " sold"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1">
              <span className="text-xs font-bold text-[#2b2222]">
                ฿{Math.round(priceTHB).toLocaleString("en-US")}
              </span>
              {hasDiscount && (
                <span className="text-xs font-semibold text-rose-500 ml-0.5">
                  -{discountPct}%
                </span>
              )}
              {hasDiscount && (
                <span className="text-[10px] text-neutral-400 line-through ml-1">
                  ฿{Math.round(listPriceTHB).toLocaleString("en-US")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Gold bottom accent */}
        <div className="h-0.5 mx-5 mb-3 rounded-full opacity-40" style={{ background: "linear-gradient(90deg, transparent, #c9a86a, transparent)" }} />
      </div>

      {/* Share buttons */}
      <div className="grid grid-cols-3 gap-2">
        {/* LINE */}
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#06C755] px-2 py-3 text-sm font-semibold text-white transition-all active:scale-95 min-h-[44px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          <span>{locale === "th" ? "แชร์ LINE" : "Share LINE"}</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + pageUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 py-3 text-sm font-semibold text-white transition-all active:scale-95 min-h-[44px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Copy link */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-100 px-2 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-200 transition-all active:scale-95 min-h-[44px]"
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>{locale === "th" ? "คัดลอก" : "Copy"}</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
              <span>{locale === "th" ? "คัดลอก" : "Copy"}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
