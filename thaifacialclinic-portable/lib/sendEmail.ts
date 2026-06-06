// Lightweight Resend wrapper. No SDK — just fetch.
// Set RESEND_API_KEY in env. Fail-soft if missing.

const FROM_DEFAULT = process.env.EMAIL_FROM || "BKK Clinics <noreply@bkkclinics.com>";

export type SendResult = { ok: boolean; id?: string; error?: string };

export async function sendEmail({
  to, subject, html, text, from,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}): Promise<SendResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: from || FROM_DEFAULT, to, subject, html, text }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: (j as { message?: string }).message || `status ${r.status}` };
    return { ok: true, id: (j as { id?: string }).id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "fetch failed" };
  }
}
