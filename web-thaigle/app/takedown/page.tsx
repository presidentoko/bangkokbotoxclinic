"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function TakedownPage() {
  return (
    <Suspense fallback={null}>
      <TakedownForm />
    </Suspense>
  );
}

function TakedownForm() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({
    businessName: searchParams.get("businessName") ?? "",
    pageUrl: searchParams.get("pageUrl") ?? "",
    contactName: "",
    contactEmail: "",
    requestType: "correction",
    description: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "takedown", ...form }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error("submit failed");
      // Open mailto as backup so admin definitely sees it
      if (data.mailtoUrl) window.location.href = data.mailtoUrl;
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h1 className="text-xl font-bold mb-3">Request received</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          We aim to review all requests within 24–48 hours. Factual errors (hours, address, contact info) are corrected promptly. Trust Score adjustments are not possible — scores are computed automatically from public Google data.
        </p>
        <a href="/" className="text-orange-600 underline text-sm">Return to Thaigle</a>
      </main>
    );
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">Business Correction Request</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Is information about your business inaccurate or outdated? We review all requests within 24–48 hours.
      </p>

      {/* Data source disclaimer — legal protection */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-xs text-amber-800 leading-relaxed">
        <strong>About our data:</strong> All venue information, ratings, and reviews on Thaigle are aggregated from public Google Maps listings. Thaigle does not create, edit, or endorse individual reviews. Trust Scores are statistically derived — they cannot be manually adjusted. Factual errors (incorrect address, phone, hours, permanently closed) can be corrected. Ranking or score disputes are not within scope of this form.
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold mb-1">Business name *</label>
          <input
            name="businessName"
            value={form.businessName}
            onChange={handleChange}
            required
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white"
            placeholder="e.g. Siam Wellness Clinic Silom"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Thaigle page URL</label>
          <input
            name="pageUrl"
            value={form.pageUrl}
            onChange={handleChange}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white"
            placeholder="https://thaigle.com/activities/spa/..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold mb-1">Your name *</label>
            <input
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              required
              className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Email *</label>
            <input
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
              required
              className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Request type *</label>
          <select
            name="requestType"
            value={form.requestType}
            onChange={handleChange}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white"
          >
            <option value="correction">Correct inaccurate information (address, phone, hours)</option>
            <option value="closed">Mark as permanently closed</option>
            <option value="removal">Request listing removal (legal basis required)</option>
            <option value="response">Add business response / clarification</option>
            <option value="copyright">Copyright / intellectual property claim</option>
            <option value="pdpa">PDPA personal data removal request</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm bg-white resize-none"
            placeholder="Describe what is incorrect and what the accurate information should be. For removal requests, please state the legal basis."
          />
        </div>

        <div className="text-xs text-[var(--muted)] leading-relaxed">
          By submitting, you confirm the information provided is accurate to the best of your knowledge. False takedown requests may be logged. For personal data requests under Thailand PDPA, see our <a href="/privacy" className="underline">Privacy Policy</a>.
        </div>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
            Something went wrong submitting your request. Please try again, or email us directly via the contact page.
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition"
        >
          {loading ? "Submitting…" : "Submit request"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--border)] text-xs text-[var(--muted)]">
        <a href="/terms" className="underline mr-4">Terms of Use</a>
        <a href="/privacy" className="underline mr-4">Privacy Policy</a>
        <a href="/contact" className="underline">General contact</a>
      </div>
    </main>
  );
}
