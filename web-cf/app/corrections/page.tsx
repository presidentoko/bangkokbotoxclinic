import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Corrections & Right of Reply",
  description: "Request a correction, dispute a Trust Score, submit a right of reply, or request data removal.",
  alternates: { canonical: "/corrections" },
};

export const dynamic = "force-static";

const BUILD_DATE = "2026-06-23";
const CONTACT_EMAIL = "[CONTACT_EMAIL]";

export default function CorrectionsPage() {
  const cfg = getSiteConfig();
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Corrections</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Corrections &amp; Right of Reply</h1>
      <p className="text-sm text-[var(--muted)] mb-8">Last updated: {BUILD_DATE}</p>

      <div className="prose prose-sm max-w-none space-y-6 text-[var(--fg)]">
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm leading-relaxed text-blue-900">
            {cfg.brand} is committed to accuracy and fairness. Any clinic, business, or individual who appears
            in our directory has the right to request a correction, dispute a metric, or submit a reply.
            We review all requests promptly and in good faith.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">What you can request</h2>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>
              <strong>Factual correction</strong> — wrong address, phone number, hours, or other factual information.
            </li>
            <li>
              <strong>Trust Score dispute</strong> — if you believe our automated score contains an error or is
              based on incorrect data, explain why and we will review the underlying signals.
            </li>
            <li>
              <strong>Right of reply</strong> — submit a brief statement (up to 300 words) to be displayed
              alongside your listing. We do not edit the content but reserve the right to decline statements
              that contain defamatory content.
            </li>
            <li>
              <strong>Photo or review removal</strong> — if you believe a photo or review excerpt displayed on
              your listing infringes your copyright or contains false information, provide details and we will
              investigate.
            </li>
            <li>
              <strong>Data (PDPA) deletion</strong> — if your personal data appears in our directory and you
              wish to exercise your right to erasure under applicable law, submit a request with your full name
              and the specific data you wish removed.
            </li>
            <li>
              <strong>Complete listing removal</strong> — clinics may request removal of their listing. Note that
              we aggregate publicly available information; removal from our site does not remove data from
              Google Maps or other public sources.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">How to submit a request</h2>
          <p className="text-sm leading-relaxed mb-3">
            Email <strong>{CONTACT_EMAIL}</strong> with the subject line
            &quot;[Corrections] — [Clinic Name]&quot; and include:
          </p>
          <ol className="list-decimal pl-5 text-sm space-y-1">
            <li>Your name and role (e.g. clinic owner, manager).</li>
            <li>The clinic name and URL of the page you are disputing.</li>
            <li>The type of request (see list above).</li>
            <li>A clear description of what is incorrect and what the correct information is.</li>
            <li>Any supporting evidence (e.g. official documents, screenshots).</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Copyright / Notice &amp; Takedown</h2>
          <p className="text-sm leading-relaxed">
            If you believe content on our site infringes your copyright, please submit a notice to{" "}
            {CONTACT_EMAIL} including:
          </p>
          <ol className="list-decimal pl-5 text-sm space-y-1 mt-2">
            <li>Identification of the copyrighted work you claim is infringed.</li>
            <li>The URL of the infringing material on our site.</li>
            <li>Your contact information and a good-faith statement that use is not authorised.</li>
            <li>A statement that the information in your notice is accurate.</li>
          </ol>
          <p className="text-sm leading-relaxed mt-2">
            We will act on valid notices promptly, typically within 5–10 business days.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Response time</h2>
          <p className="text-sm leading-relaxed">
            We aim to acknowledge all requests within <strong>3 business days</strong> and to resolve or respond
            substantively within <strong>14 business days</strong>. Complex cases (e.g. requiring legal review)
            may take longer; we will keep you informed.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Quick contact</h2>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=[Corrections] — Clinic Name&body=Clinic name:%0APage URL:%0ARequest type:%0ADescription:%0AEvidence:`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white text-sm font-bold shadow-md"
            style={{ background: "var(--accent, #2563eb)" }}
          >
            Email us a correction request →
          </a>
        </section>
      </div>
    </div>
  );
}
