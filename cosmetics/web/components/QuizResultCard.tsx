"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import {
  SKIN_LABELS,
  BUDGET_LABELS,
  CONCERN_QUIZ_META,
  type SkinType,
  type Budget,
} from "@/lib/quiz-config";
import type { Concern } from "@/lib/data";
import type { Product } from "@/lib/types";

export interface QuizResultEntry {
  product: Product;
  href: string;
}

interface Props {
  entries: QuizResultEntry[];
  skin: SkinType;
  concern: Concern;
  budget: Budget;
  locale: Locale;
  resultUrl: string;
}

export function QuizResultCard({ entries, skin, concern, budget, locale, resultUrl }: Props) {
  const isTh = locale === "th";
  const [copied, setCopied] = useState(false);

  const skinLbl = isTh ? SKIN_LABELS[skin].th : SKIN_LABELS[skin].en;
  const concernMeta = CONCERN_QUIZ_META[concern];
  const concernLbl = isTh ? concernMeta?.th : concernMeta?.en;
  const budgetLbl = isTh ? BUDGET_LABELS[budget].th : BUDGET_LABELS[budget].en;

  const title = isTh ? "สกินแคร์ที่ใช่สำหรับฉัน 🌸" : "My perfect skincare match 🌸";
  const shareText = isTh
    ? `${SKIN_LABELS[skin].emoji} ${skinLbl} · ${concernMeta?.emoji} ${concernLbl} · ${budgetLbl}\n${title}\n${resultUrl}`
    : `${SKIN_LABELS[skin].emoji} ${skinLbl} · ${concernMeta?.emoji} ${concernLbl} · ${budgetLbl}\n${title}\n${resultUrl}`;

  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(resultUrl)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  async function handleShare() {
    if (typeof navigator === "undefined") return;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: resultUrl });
        return;
      } catch { /* user cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(resultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { /* ignore */ }
  }

  const RANK_COLORS = ["#c9a86a", "#a8a8a8", "#cd7f32"] as const;

  return (
    <div className="space-y-4">
      {/* ── Shareable card ── */}
      <div
        id="quiz-result-card"
        className="relative overflow-hidden rounded-3xl shadow-xl"
        style={{
          background: "linear-gradient(145deg, #fff0f3 0%, #fbf4f1 40%, #fff8f0 100%)",
          border: "1.5px solid #f0d9d5",
        }}
      >
        {/* Gold top accent (matches ShareCard) */}
        <div
          className="absolute top-0 inset-x-0 h-1 rounded-t-3xl"
          style={{ background: "linear-gradient(90deg, #c9a86a, #e0607e, #c9a86a)" }}
        />

        <div className="p-5 space-y-5">
          {/* Site tag */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-md border border-rose-400 bg-white">
                <span className="font-serif text-[13px] font-bold text-rose-500">B</span>
              </div>
              <span className="text-[11px] font-semibold text-[#8a7a76] tracking-widest uppercase">
                bangkokfillers.com
              </span>
            </div>
            <span className="text-lg">🌸</span>
          </div>

          {/* Skin profile */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86a]">
              {isTh ? "ผิวของคุณ" : "Your skin profile"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Pill label={`${SKIN_LABELS[skin].emoji} ${skinLbl}`} />
              <Pill label={`${concernMeta?.emoji} ${concernLbl}`} />
              <Pill label={`💰 ${budgetLbl}`} />
            </div>
          </div>

          {/* Top 3 products */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86a]">
              {isTh ? "TOP 3 ที่เหมาะกับคุณ" : "Your top 3 picks"}
            </p>
            {entries.map(({ product: p, href }, i) => (
              <Link key={p.product_id} href={href} className="flex items-center gap-3 group">
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white shadow-sm"
                  style={{ background: RANK_COLORS[i] }}
                >
                  {i + 1}
                </div>
                <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border border-rose-100 bg-white">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={p.name}
                      width={56}
                      height={56}
                      className="object-contain w-full h-full p-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-rose-200 text-xl">✦</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#c9a86a]">{p.brand}</p>
                  <p className="text-sm font-medium text-[#2b2222] leading-tight line-clamp-2 group-hover:text-rose-500 transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-rose-500">
                      {Math.round(p.total_score[concern] ?? 0)} pts
                    </span>
                    <span className="text-xs text-neutral-400">
                      ฿{Math.round(p.price_thb).toLocaleString()}
                    </span>
                    {p.konvy_rating > 0 && (
                      <span className="text-xs text-amber-500">
                        ★{p.konvy_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Gold bottom accent */}
        <div
          className="h-0.5 mx-5 mb-3 rounded-full opacity-40"
          style={{ background: "linear-gradient(90deg, transparent, #c9a86a, transparent)" }}
        />
      </div>

      {/* Share controls */}
      <div className="space-y-2.5">
        <p className="text-xs text-neutral-400 text-center">
          {isTh ? "แชร์ผลลัพธ์ของคุณ" : "Share your results"}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 rounded-2xl bg-rose-500 hover:bg-rose-600 active:scale-[0.98] transition-all px-4 py-3 text-white font-semibold text-sm shadow-sm shadow-rose-200"
          >
            {copied ? (
              <><span>✓</span><span>{isTh ? "คัดลอกแล้ว!" : "Copied!"}</span></>
            ) : (
              <><span>📤</span><span>{isTh ? "แชร์" : "Share"}</span></>
            )}
          </button>
          <a
            href={lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#00B900] hover:bg-[#009900] active:scale-[0.98] transition-all px-4 py-3 text-white font-semibold text-sm"
          >
            <span>💬</span><span>LINE</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] active:scale-[0.98] transition-all px-4 py-3 text-white font-semibold text-sm"
          >
            <span>💬</span><span>WhatsApp</span>
          </a>
        </div>
        <Link
          href={`/${locale}/quiz`}
          className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 hover:text-rose-500 transition-colors py-1"
        >
          ↩ {isTh ? "ทำแบบทดสอบอีกครั้ง" : "Retake the quiz"}
        </Link>
      </div>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700">
      {label}
    </span>
  );
}
