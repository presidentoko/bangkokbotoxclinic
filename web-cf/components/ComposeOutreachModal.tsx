"use client";

// Admin 영업팀이 한 클리닉에 보낼 cold outreach 메시지를 작성하는 모달.
// 사용처: AdminView 의 OutreachTab 행 + ProspectExporter preview 행.
//
// 흐름: 클릭 → /api/admin/clinic-info 로 클리닉 데이터 가져옴 → 자동 채워진 템플릿
//   → staff가 template / 언어 / 텍스트 편집 → "Copy & Mark sent" 한 클릭
//   → 클립보드 복사 + /api/admin/outreach POST 로 record 생성 → 모달 닫기.

import { useState, useEffect, useMemo, useCallback } from "react";

function adminKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_pk") ?? "";
}
import {
  TEMPLATE_METADATA,
  renderTemplate,
  type ClinicInfo,
  type TemplateId,
  type Lang,
} from "@/lib/outreachTemplates";

type Channel = "LINE" | "FB_MESSENGER" | "WEBSITE_FORM" | "EMAIL" | "OTHER";

export function ComposeOutreachModal({
  clinicId,
  clinicName,
  defaultStaff,
  onClose,
  onSent,
  queuePosition,
  queueTotal,
  onNext,
}: {
  clinicId: string;
  clinicName: string;
  defaultStaff?: string;
  onClose: () => void;
  onSent: () => void;
  // Queue mode — when composing for multiple prospects in sequence.
  queuePosition?: number;
  queueTotal?: number;
  onNext?: () => void;
}) {
  const isQueueMode = !!queueTotal && queueTotal > 1;
  const [info, setInfo] = useState<ClinicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [template, setTemplate] = useState<TemplateId>("T1");
  const [lang, setLang] = useState<Lang>("en");
  const [channel, setChannel] = useState<Channel>("LINE");
  const [staff, setStaff] = useState(() => {
    if (defaultStaff) return defaultStaff;
    if (typeof window === "undefined") return "";
    return localStorage.getItem("outreach_staff_name") ?? "";
  });
  const [text, setText] = useState("");
  const [edited, setEdited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Persist staff name across modal opens
  useEffect(() => {
    if (staff && typeof window !== "undefined") {
      localStorage.setItem("outreach_staff_name", staff);
    }
  }, [staff]);

  // Fetch clinic data on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/clinic-info?clinic_id=${encodeURIComponent(clinicId)}`, {
      headers: { "x-admin-key": adminKey() },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: ClinicInfo) => {
        if (!cancelled) {
          setInfo(data);
          // Auto-pick urgent template if unanswered negatives are high
          if (data.unanswered_neg_reviews >= 3) setTemplate("T3");
          // Auto-pick KO if Korean-leaning clinic
          if (data.has_korean_reviewers && data.primary_review_lang === "KO") setLang("ko");
          // Auto-pick TH if mostly Thai
          else if (data.primary_review_lang === "TH") setLang("th");
        }
      })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [clinicId]);

  // Re-render template when template/lang/staff change — unless user has manually edited
  const computed = useMemo(() => {
    if (!info) return "";
    return renderTemplate(template, lang, info, staff);
  }, [info, template, lang, staff]);

  useEffect(() => {
    if (!edited && computed) setText(computed);
  }, [computed, edited]);

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [text]);

  const handleCopyAndSend = useCallback(async () => {
    if (!text || !info || submitting) return;
    setSubmitting(true);
    try {
      try { await navigator.clipboard.writeText(text); } catch {}
      await fetch("/api/admin/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
        body: JSON.stringify({
          clinic_id: info.clinic_id,
          clinic_name: info.name,
          staff: staff || undefined,
          channel,
          template,
          outcome: "sent",
          sent_at: new Date().toISOString(),
          next_action: "Follow up in 3 days",
          note: `Composed via admin modal (${lang.toUpperCase()})`,
        }),
      });
      // Queue mode: parent uses key={clinicId} so a new clinic remounts the
      // modal with fresh state — no manual reset needed.
      if (isQueueMode && onNext) onNext();
      else onSent();
    } finally {
      setSubmitting(false);
    }
  }, [text, info, staff, channel, template, lang, submitting, onSent, isQueueMode, onNext]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-indigo-500/40 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-base font-bold text-indigo-300 flex items-center gap-2 flex-wrap">
              📩 Compose outreach
              {isQueueMode && (
                <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-300">
                  Queue {queuePosition} / {queueTotal}
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[480px]">{clinicName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xl leading-none">✕</button>
        </div>

        {loading && (
          <div className="px-5 py-10 text-center text-gray-500 text-sm">Loading clinic data…</div>
        )}

        {error && (
          <div className="px-5 py-10 text-center text-red-400 text-sm">Error: {error}</div>
        )}

        {info && (
          <>
            {/* Clinic context bar */}
            <div className="px-5 py-3 bg-gray-950 border-b border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <div className="text-gray-500 uppercase tracking-widest text-[10px] mb-0.5">Trust</div>
                <div className="text-base font-black text-emerald-400 tabular-nums">{info.trust_score}/100</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase tracking-widest text-[10px] mb-0.5">{info.district || info.city} rank</div>
                <div className="text-base font-black text-indigo-300 tabular-nums">#{info.rank_district} / {info.district_total}</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase tracking-widest text-[10px] mb-0.5">Unanswered negs</div>
                <div className={`text-base font-black tabular-nums ${info.unanswered_neg_reviews >= 3 ? "text-red-400" : "text-gray-300"}`}>
                  {info.unanswered_neg_reviews}
                </div>
              </div>
              <div>
                <div className="text-gray-500 uppercase tracking-widest text-[10px] mb-0.5">Reviews</div>
                <div className="text-base font-black text-gray-300 tabular-nums">{info.total_reviews.toLocaleString()}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="px-5 py-4 border-b border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Template</label>
                <select
                  value={template}
                  onChange={(e) => { setTemplate(e.target.value as TemplateId); setEdited(false); }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100"
                >
                  {(Object.keys(TEMPLATE_METADATA) as TemplateId[]).map((id) => (
                    <option key={id} value={id}>{TEMPLATE_METADATA[id].label}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-500 mt-1">{TEMPLATE_METADATA[template].hint}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Language</label>
                <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
                  {(["en", "ko", "th"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setEdited(false); }}
                      className={`flex-1 text-xs font-bold py-1.5 rounded transition ${lang === l ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-200"}`}
                    >
                      {l === "en" ? "EN" : l === "ko" ? "한국어" : "ไทย"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value as Channel)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100"
                >
                  <option value="LINE">LINE</option>
                  <option value="FB_MESSENGER">FB Messenger</option>
                  <option value="WEBSITE_FORM">Website form</option>
                  <option value="EMAIL">Email</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Staff name */}
            <div className="px-5 py-3 border-b border-gray-800">
              <label className="text-xs text-gray-500 mb-1 block">Your name (signature)</label>
              <input
                value={staff}
                onChange={(e) => { setStaff(e.target.value); setEdited(false); }}
                placeholder="e.g. John, Suchada"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100"
              />
            </div>

            {/* Message textarea */}
            <div className="flex-1 overflow-hidden flex flex-col px-5 py-3 min-h-0">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-500">
                  Message preview {edited && <span className="text-amber-400 ml-1">· edited</span>}
                </label>
                {edited && (
                  <button
                    onClick={() => { setEdited(false); setText(computed); }}
                    className="text-[10px] text-gray-500 hover:text-gray-300"
                  >
                    ↺ Reset to template
                  </button>
                )}
              </div>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setEdited(true); }}
                rows={14}
                className="flex-1 w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm text-gray-100 font-mono resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="px-5 py-4 border-t border-gray-800 flex items-center gap-2 flex-wrap">
              <button
                onClick={handleCopyAndSend}
                disabled={submitting || !text}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-4 py-2 text-sm text-white font-bold transition"
              >
                {submitting ? "..." : (isQueueMode ? "📋 Copy & Next →" : "📋 Copy & Mark as sent")}
              </button>
              <button
                onClick={handleCopy}
                disabled={!text}
                className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 transition"
              >
                {copied ? "✓ Copied" : "📋 Copy only"}
              </button>
              <a
                href={info.dashboard_url}
                target="_blank"
                rel="noopener"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-200 transition"
              >
                👁 Preview dashboard
              </a>
              {isQueueMode && onNext && (
                <button
                  onClick={onNext}
                  className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 transition"
                >
                  Skip →
                </button>
              )}
              <button
                onClick={onClose}
                className="ml-auto text-gray-500 hover:text-gray-300 text-sm px-2"
              >
                {isQueueMode ? "Quit queue" : "Cancel"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
