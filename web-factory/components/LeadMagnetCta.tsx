"use client";

// Lead magnet CTA — 무료 PDF 다운로드 + 이메일 캡처.

import { useState } from "react";
import { LEAD_MAGNET_I18N, type Locale } from "@/lib/buyersI18n";

// Default to the same Telegram-backed function RfqForm uses, so PDF leads
// notify the same channel as RFQs instead of silently falling back to a
// mailto: link that exposes a personal inbox on the public page.
const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_MAGNET_ENDPOINT || "/api/inquiry";
const PDF_URL  = process.env.NEXT_PUBLIC_LEAD_MAGNET_PDF_URL || "";
const FALLBACK_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "inquiry@thaisupplyhub.com";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  locale?: Locale;
  title?: string;
  subtitle?: string;
  benefitBullets?: string[];
};

export function LeadMagnetCta({ locale = "en", title, subtitle, benefitBullets }: Props) {
  const t = LEAD_MAGNET_I18N[locale];
  const [status, setStatus] = useState<Status>("idle");

  const _title = title ?? t.defaultTitle;
  const _subtitle = subtitle ?? t.defaultSubtitle;
  const _bullets = benefitBullets ?? [...t.defaultBullets];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("_locale", locale);
    // /api/inquiry requires name + message; this compact form only asks for
    // email + company, so backfill sensible values for the Telegram line.
    fd.set("name", (fd.get("company") as string) || "PDF request");
    fd.set("message", `Requested the free Sourcing Playbook PDF (${locale}).`);

    if (!ENDPOINT) {
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(`PDF request (${locale}) — Sourcing Playbook`)}&body=${encodeURIComponent(`Please send me the PDF.\n\nLocale: ${locale}\nEmail: ${fd.get("email")}\nCompany: ${fd.get("company") || "—"}`)}`;
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="my-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6 md:p-8">
        <div className="text-3xl mb-2">✓ Sent</div>
        <h3 className="font-bold text-lg mb-2 text-emerald-900">{PDF_URL ? t.successTitleReady : t.successTitleEmail}</h3>
        {PDF_URL ? (
          <a
            href={PDF_URL}
            download
            className="inline-block px-5 py-2.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800"
          >
            {t.downloadBtn}
          </a>
        ) : (
          <p className="text-sm text-emerald-800">
            {t.successBody} <a href={`mailto:${FALLBACK_EMAIL}`} className="underline font-semibold">{FALLBACK_EMAIL}</a>.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="my-8 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 md:p-8 shadow-sm">
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <div className="text-[10px] uppercase tracking-widest text-emerald-700 font-bold mb-2">
            {t.tag}
          </div>
          <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">{_title}</h3>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{_subtitle}</p>
          <ul className="space-y-1.5 text-sm">
            {_bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-2 space-y-3">
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
          <input type="hidden" name="_subject" value={`PDF request (${locale}) — Sourcing Playbook`} />

          <div>
            <label className="block text-xs font-semibold mb-1">{t.emailLabel}</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">{t.companyLabel}</label>
            <input
              type="text"
              name="company"
              placeholder="ACME Trading"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full px-4 py-2.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 disabled:opacity-50 transition text-sm"
          >
            {status === "submitting" ? t.submitting : t.submit}
          </button>
          {status === "error" && (
            <p className="text-xs text-red-700">{t.errorPrefix} <a href={`mailto:${FALLBACK_EMAIL}`} className="underline">{FALLBACK_EMAIL}</a> {t.emailDirect}</p>
          )}
          <p className="text-[10px] text-[var(--muted)] leading-relaxed">{t.privacy}</p>
        </form>
      </div>
    </div>
  );
}
