export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { loadClinics, getClinicById } from "@/lib/data";
import { buildReportData } from "@/lib/reportData";
import { isAdminAuthedFromCookies } from "@/lib/adminAuth";
import AdminLogin from "@/components/AdminLogin";
import { CopyButton } from "./CopyButton";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thaifacialclinic.com";
const BRAND = "Hair by Thai Facial Clinic";

export default async function OutreachPage(
  { params }: { params: Promise<{ clinicId: string }> },
) {
  if (!(await isAdminAuthedFromCookies())) return <AdminLogin />;

  const { clinicId } = await params;
  const c = getClinicById(clinicId);
  if (!c) notFound();

  const { clinics } = loadClinics();
  const r = buildReportData(c, clinics, SITE);
  const topPct = Math.max(1, 100 - r.trustPercentile);

  const negLine =
    r.negativeCount > 0
      ? `and ${r.negativeCount} unanswered review${r.negativeCount > 1 ? "s" : ""} with AI reply drafts`
      : "all reviews answered ✓";

  const lineMsg = `Hi ${c.name} team! 👋

We prepared a free reputation report for your clinic:
${r.reportUrl}

It shows your Trust Score (${c.trust_score}/100), your ranking in ${c.city}, ${negLine}.

No signup needed — open it on your phone.

If useful, we offer a paid service to do this work for you.
But the report is free either way.`;

  const emailSubject = `Free Clinic Report — ${c.name} | ${BRAND}`;

  const emailBody = `Dear ${c.name} Team,

We've prepared a free reputation report for your clinic — no signup needed:
${r.reportUrl}

---

Your current data on our platform:

⭐ Rating: ${c.avg_scraped_rating?.toFixed(1) ?? c.rating?.toFixed(1) ?? "—"} | Reviews: ${(c.review_count ?? 0).toLocaleString()} | Trust Score: ${c.trust_score}/100
📊 Top ${topPct}% of ${c.city} clinics
${r.negativeCount > 0 ? `⚠️  ${r.negativeCount} unanswered review${r.negativeCount > 1 ? "s" : ""} found — the full report includes AI-drafted replies.\n` : "✓  No unanswered negative reviews found.\n"}
---

What partner clinics receive:
• Featured placement on hair clinic search pages
• Verified badge + Trust Score displayed to patients
• International patient funnel (English, Korean, Arabic interface)
• Lead inquiries forwarded directly to your LINE or email
• Monthly performance snapshot

We'd be happy to walk your team through the live dashboard.
Please let us know if you have any questions.

Best regards,
${BRAND}
${SITE}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 font-mono text-sm">
      <div className="mb-6">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">
          Admin · Outreach Generator
        </div>
        <h1 className="text-xl font-black text-white">{c.name}</h1>
        <p className="text-gray-400 text-xs mt-1">
          Trust Score {c.trust_score} · Top {topPct}% ·{" "}
          {c.city}
          {r.negativeCount > 0 && ` · ⚠ ${r.negativeCount} unanswered`}
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        <a href={r.reportUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700">
          Open report ↗
        </a>
        <a href={r.demoUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs px-3 py-1.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700">
          Open demo ↗
        </a>
        <a href="/admin"
          className="text-xs px-3 py-1.5 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700">
          ← Admin
        </a>
      </div>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">LINE Message</span>
          <CopyButton text={lineMsg} label="Copy LINE" />
        </div>
        <pre className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 whitespace-pre-wrap leading-relaxed text-xs">
          {lineMsg}
        </pre>
      </section>

      <section className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">Email Subject</span>
          <CopyButton text={emailSubject} label="Copy Subject" />
        </div>
        <pre className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-gray-200 text-xs">
          {emailSubject}
        </pre>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-300 font-bold text-xs uppercase tracking-widest">Email Body</span>
          <CopyButton text={emailBody} label="Copy Email" />
        </div>
        <pre className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 whitespace-pre-wrap leading-relaxed text-xs">
          {emailBody}
        </pre>
      </section>
    </div>
  );
}
