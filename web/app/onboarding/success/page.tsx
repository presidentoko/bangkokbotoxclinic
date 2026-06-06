import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Received",
  robots: { index: false, follow: false },
};

export default async function OnboardingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; clinic?: string }>;
}) {
  const { email, clinic } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold mb-3">Application received!</h1>
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-left mb-6">
        <p className="text-sm text-emerald-900 leading-relaxed">
          {clinic && (
            <span className="block font-semibold mb-2">Clinic: {clinic}</span>
          )}
          {email ? (
            <>We&apos;ll contact you at <strong>{email}</strong> within 24 hours.</>
          ) : (
            <>We&apos;ll contact you within 24 hours.</>
          )}
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-emerald-800">
          <li>✓ Dashboard access confirmed and activated</li>
          <li>✓ LINE bot wiring — we&apos;ll send setup instructions</li>
          <li>✓ Your first 30 days are free, no card needed</li>
        </ul>
      </div>
      <p className="text-sm text-[var(--muted)] mb-6">
        Questions? Reach us on{" "}
        <a
          href="https://line.me/R/ti/p/@405zhjqb"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
        >
          LINE @405zhjqb
        </a>{" "}
        or email{" "}
        <a href="mailto:hello@bkkclinics.com" className="font-bold underline">
          hello@bkkclinics.com
        </a>
      </p>
      <a
        href="/"
        className="inline-block rounded-lg bg-black text-white px-6 py-2.5 text-sm font-bold hover:opacity-80"
      >
        Back to home
      </a>
    </div>
  );
}
