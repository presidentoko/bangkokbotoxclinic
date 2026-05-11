import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinic Dashboard — Login",
  description: "Private B2B dashboard for partner clinics.",
};

export default function DashboardIndexPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">
        Partner dashboard
      </div>
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
        Your clinic dashboard
      </h1>
      <p className="text-base text-[var(--muted)] leading-relaxed mb-8">
        If you&apos;re a partner clinic, we sent you a private dashboard URL when your subscription started.
        Bookmark it — that URL is your dashboard.
      </p>

      <div className="bg-white border border-[var(--border)] rounded-xl p-5 mb-6">
        <div className="text-sm font-bold mb-2">URL format</div>
        <code className="text-xs bg-gray-50 px-3 py-2 rounded block font-mono break-all">
          https://www.bangkokbotoxclinic.com/dashboard/&lt;your-clinic-id&gt;
        </code>
        <p className="text-xs text-[var(--muted)] mt-3">
          Your clinic ID is the same one used on your public page URL (<code>/clinic/&lt;id&gt;</code>).
          Lost it? Email <strong>partners@bangkokbotoxclinic.com</strong> or LINE <strong>@bangkokbotoxclinic</strong>.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="/dashboard/demo"
          className="block bg-white border-2 border-[var(--accent)] rounded-xl p-5 hover:shadow-md transition"
        >
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>
            See it first
          </div>
          <div className="font-bold mb-1">Live demo dashboard →</div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            Real data, anonymized as a sample clinic. Same dashboard you&apos;d see for yours.
          </p>
        </a>

        <a
          href="/for-clinics#pilot"
          className="block bg-white border border-[var(--border)] rounded-xl p-5 hover:shadow-md transition"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-1">
            Not yet a partner
          </div>
          <div className="font-bold mb-1">30-day pilot →</div>
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            See your clinic&apos;s current Trust Score + competitive position before signing up.
          </p>
        </a>
      </div>
    </div>
  );
}
