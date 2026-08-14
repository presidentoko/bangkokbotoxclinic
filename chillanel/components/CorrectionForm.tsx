"use client";

import { useState } from "react";
import type { Lang } from "@/lib/site";
import { tFor } from "@/lib/i18n";

type Status = "idle" | "sending" | "success" | "error";

export function CorrectionForm({ placeId, placeName, lang }: { placeId: string; placeName: string; lang: Lang }) {
  const t = tFor(lang);
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "correction",
          placeId,
          placeName,
          issueType: data.get("issueType"),
          details: data.get("details"),
          contact: data.get("contact"),
          website: data.get("website"),
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <details className="group rounded-xl border border-border bg-bg-elev p-4 mt-6">
      <summary className="cursor-pointer list-none font-semibold text-sm flex items-center justify-between gap-4 text-muted">
        {t.correction.linkLabel}
        <span className="shrink-0 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
      </summary>
      <div className="mt-4">
        {status === "success" ? (
          <p className="text-sm text-muted">{t.correction.success}</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="absolute left-[-9999px] w-px h-px opacity-0"
              aria-hidden="true"
            />
            <div>
              <label htmlFor="correction-issueType" className="block text-xs font-semibold mb-1.5 text-muted">
                {t.correction.issueTypeLabel}
              </label>
              <select
                id="correction-issueType"
                name="issueType"
                required
                className="w-full min-h-11 rounded-xl border border-border bg-bg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value={t.correction.issueTypes.closed}>{t.correction.issueTypes.closed}</option>
                <option value={t.correction.issueTypes.wrongInfo}>{t.correction.issueTypes.wrongInfo}</option>
                <option value={t.correction.issueTypes.duplicate}>{t.correction.issueTypes.duplicate}</option>
                <option value={t.correction.issueTypes.other}>{t.correction.issueTypes.other}</option>
              </select>
            </div>
            <div>
              <label htmlFor="correction-details" className="block text-xs font-semibold mb-1.5 text-muted">
                {t.correction.detailsLabel}
              </label>
              <textarea
                id="correction-details"
                name="details"
                required
                rows={3}
                maxLength={2000}
                placeholder={t.correction.detailsPlaceholder}
                className="w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div>
              <label htmlFor="correction-contact" className="block text-xs font-semibold mb-1.5 text-muted">
                {t.correction.contactLabel}
              </label>
              <input
                id="correction-contact"
                name="contact"
                type="text"
                maxLength={200}
                placeholder={t.correction.contactPlaceholder}
                className="w-full min-h-11 rounded-xl border border-border bg-bg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            {status === "error" && <p className="text-sm text-red-500">{t.correction.error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full border border-border font-semibold px-5 py-2.5 min-h-11 hover:border-accent transition disabled:opacity-60 disabled:pointer-events-none"
            >
              {status === "sending" ? t.correction.sending : t.correction.submit}
            </button>
          </form>
        )}
      </div>
    </details>
  );
}
