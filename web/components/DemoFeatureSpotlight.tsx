"use client";
// 영업용 데모 페이지 최상단 — 3개 feature spotlight.
// AI 답글 카드는 실제 Claude API 호출 (클리닉 실제 리뷰 사용).

import { useState } from "react";
import type { Clinic } from "@/lib/types";
import type { LeadRecord } from "@/lib/leadStore";

type Props = {
  clinic: Clinic;
  competitors: Clinic[];
  leads: LeadRecord[];
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="mt-3 w-full rounded-lg border border-indigo-300 bg-white text-indigo-700 text-xs font-bold py-2 hover:bg-indigo-50 transition"
    >
      {copied ? "✓ Copied!" : "Copy reply"}
    </button>
  );
}

function AiReplyCard({ clinic }: { clinic: Clinic }) {
  const review = clinic.sample_reviews_negative?.[0];
  const [reply, setReply] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tried, setTried] = useState(false);

  async function generate() {
    if (!review || loading) return;
    setLoading(true);
    setTried(true);
    try {
      const res = await fetch("/api/dashboard/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinic_id: clinic.id,
          review_text: review.text,
          clinic_name: clinic.name,
          author_name: review.author ?? "",
          style: 1,
        }),
      });
      const data = await res.json() as { draft?: string };
      if (data.draft) setReply(data.draft);
    } catch {
      setReply("Apologies — demo generation unavailable. Real dashboard always works.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🤖</span>
        <div>
          <div className="font-black text-sm">AI Review Replies</div>
          <div className="text-xs text-slate-500">Auto-drafted in seconds</div>
        </div>
      </div>

      {review ? (
        <div className="flex-1 flex flex-col gap-2">
          {/* Actual review */}
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-900 leading-relaxed">
            <div className="font-bold mb-1">⭐ {review.rating ?? "1-2"} · {review.author ?? "Guest"}</div>
            <p className="line-clamp-3">{review.text}</p>
          </div>

          {/* Reply area */}
          <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3 text-xs min-h-[80px] flex items-center justify-center">
            {loading && (
              <div className="flex flex-col items-center gap-2 text-indigo-600">
                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Claude is writing…</span>
              </div>
            )}
            {!loading && reply && (
              <p className="text-indigo-900 leading-relaxed">{reply}</p>
            )}
            {!loading && !reply && (
              <p className="text-indigo-400 italic">AI reply appears here…</p>
            )}
          </div>

          {!tried ? (
            <button
              onClick={generate}
              className="mt-1 w-full rounded-lg bg-indigo-600 text-white text-xs font-black py-2.5 hover:bg-indigo-700 transition"
            >
              ✨ Generate reply now
            </button>
          ) : reply ? (
            <CopyButton text={reply} />
          ) : null}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400 italic">
          No negative reviews — great sign!
        </div>
      )}
    </div>
  );
}

function PriceIntelCard({ clinic, competitors }: { clinic: Clinic; competitors: Clinic[] }) {
  const myRank = competitors.findIndex((x) => x.id === clinic.id) + 1 || competitors.length;
  const top = competitors[0];
  const pctile = Math.round((1 - (myRank - 1) / Math.max(competitors.length, 1)) * 100);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">📊</span>
        <div>
          <div className="font-black text-sm">Price Intelligence</div>
          <div className="text-xs text-slate-500">vs {competitors.length} local rivals</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3">
          <div className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold mb-1">Your ranking</div>
          <div className="text-2xl font-black text-emerald-800">
            #{myRank} <span className="text-sm font-bold text-emerald-600">of {competitors.length}</span>
          </div>
          <div className="text-xs text-emerald-700 mt-0.5">Top {100 - pctile}% in {clinic.district || clinic.city_label}</div>
        </div>

        <div className="space-y-1.5">
          {competitors.slice(0, 3).map((comp, i) => (
            <div key={comp.id} className="flex items-center gap-2">
              <span className={`text-[10px] font-black w-4 shrink-0 ${comp.id === clinic.id ? "text-indigo-600" : "text-slate-400"}`}>
                #{i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${comp.id === clinic.id ? "bg-indigo-500" : "bg-slate-300"}`}
                    style={{ width: `${Math.min(100, (comp.trust_score / (top?.trust_score || 1)) * 100)}%` }}
                  />
                </div>
              </div>
              <span className={`text-[10px] font-bold shrink-0 ${comp.id === clinic.id ? "text-indigo-600" : "text-slate-500"}`}>
                {comp.trust_score.toFixed(0)}
                {comp.id === clinic.id && " ←you"}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-xs text-amber-800">
          {myRank === 1
            ? "You're the top-ranked clinic in your area."
            : `${top?.name?.split(" ")[0] ?? "Top clinic"} leads by ${(top.trust_score - clinic.trust_score).toFixed(0)} pts — we show you how to close the gap.`}
        </div>
      </div>
    </div>
  );
}

function LeadsCard({ leads, clinic }: { leads: LeadRecord[]; clinic: Clinic }) {
  const preview = leads.slice(0, 4);
  const SERVICE_EMOJI: Record<string, string> = {
    botox: "💉", filler: "💋", hifu: "⚡", facial: "✨", laser: "🔬",
    hair: "💇", implant: "🦷", veneer: "😁", whitening: "🤍", ortho: "🦴",
    consult: "📋",
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">📩</span>
        <div>
          <div className="font-black text-sm">Real Patient Leads</div>
          <div className="text-xs text-slate-500">{leads.length} inquiries · last 96h</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-1.5">
        {preview.map((lead) => (
          <div key={lead.id} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 flex items-center gap-2">
            <span className="text-base shrink-0">{SERVICE_EMOJI[lead.service ?? "consult"] ?? "📋"}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold truncate">{lead.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{lead.notes?.slice(0, 55)}…</div>
            </div>
            <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded-full shrink-0">New</span>
          </div>
        ))}

        <div className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-center text-[10px] text-slate-500 font-bold">
          +{Math.max(0, leads.length - 4)} more leads in dashboard
        </div>
      </div>
    </div>
  );
}

export function DemoFeatureSpotlight({ clinic, competitors, leads }: Props) {
  return (
    <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-8">
          <div className="inline-block bg-indigo-500/20 border border-indigo-400/30 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">
            Live demo · real data for {clinic.name}
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            Here&rsquo;s exactly what you get
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Everything below uses your clinic&rsquo;s real Google data. Click <strong className="text-white">Generate reply</strong> to watch AI work on your actual reviews.
          </p>
        </div>

        {/* 3 cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { content: <AiReplyCard clinic={clinic} /> },
            { content: <PriceIntelCard clinic={clinic} competitors={competitors} /> },
            { content: <LeadsCard leads={leads} clinic={clinic} /> },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 text-slate-100 flex flex-col"
            >
              {card.content}
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/onboarding/partner"
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-black px-6 py-3 rounded-full text-sm transition"
          >
            Activate for {clinic.name} →
          </a>
          <span className="text-slate-400 text-xs">30-day free trial · no credit card</span>
        </div>
      </div>
    </div>
  );
}
