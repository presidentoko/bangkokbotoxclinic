// Plain HTML email templates — no React Email dep, just inline strings.
// Goal: render reliably in Gmail/Outlook/iOS mail without JS.

export function weeklyDigestHtml({
  clinicName,
  newLeads,
  pendingReplies,
  trustScore,
  competitorName,
  beatsCompetitor,
  dashboardUrl,
}: {
  clinicName: string;
  newLeads: number;
  pendingReplies: number;
  trustScore: number;
  competitorName?: string;
  beatsCompetitor: boolean;
  dashboardUrl: string;
}): string {
  const actionItem = pendingReplies > 0
    ? `You have <b>${pendingReplies} unanswered negative review${pendingReplies === 1 ? "" : "s"}</b>. AI-drafted replies are waiting — 30 seconds to copy + post on Google.`
    : `Trust Score holding strong. Consider a review-request campaign to push past competitor #1.`;
  const compLine = competitorName
    ? `<p style="color:#525252;font-size:13px;border-top:1px solid #e5e5e5;padding-top:12px;">👀 <b>Competitor watch:</b> ${competitorName} · ${beatsCompetitor ? "you lead" : "ahead of you"}</p>`
    : "";

  return `<!doctype html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f6f6f6;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:0;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
    <div style="background:linear-gradient(135deg,#1e3a8a,#312e81);color:#fff;padding:20px 24px;">
      <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;opacity:0.85;">Monday digest</div>
      <h1 style="margin:6px 0 0;font-size:22px;line-height:1.2;">Hi ${escapeHtml(clinicName.split(" ")[0])} team —</h1>
    </div>
    <div style="padding:20px 24px;">
      <p style="margin:0 0 16px;color:#525252;font-size:14px;line-height:1.5;">Here's what changed for your clinic in the last 7 days:</p>
      <table role="presentation" style="width:100%;border-collapse:separate;border-spacing:6px;">
        <tr>
          ${kpi("New leads", newLeads.toString(), "Form submits")}
          ${kpi("Need replies", pendingReplies.toString(), "Negative reviews")}
        </tr>
        <tr>
          ${kpi("Trust Score", trustScore.toFixed(0), beatsCompetitor ? "Beats #1 competitor" : "Behind #1")}
          ${kpi("Profile views", "+18%", "vs prior week")}
        </tr>
      </table>
      <div style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:0 8px 8px 0;padding:12px 14px;margin:18px 0 16px;">
        <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#92400e;">Action item</div>
        <p style="margin:4px 0 0;font-size:14px;line-height:1.5;color:#111;">${actionItem}</p>
      </div>
      <a href="${dashboardUrl}" style="display:inline-block;background:#059669;color:#fff;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:800;font-size:14px;">Open dashboard →</a>
      ${compLine}
    </div>
    <div style="background:#fafafa;padding:14px 24px;font-size:11px;color:#737373;line-height:1.5;border-top:1px solid #e5e5e5;">
      You're receiving this because your clinic has an active dashboard with BKK Clinics.
      <br>To stop these emails, contact us at billing@bkkclinics.com.
    </div>
  </div>
</body></html>`;
}

function kpi(label: string, value: string, sub: string): string {
  return `<td style="background:#f9fafb;border-radius:8px;padding:10px 12px;width:50%;">
    <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#737373;">${escapeHtml(label)}</div>
    <div style="font-size:24px;font-weight:900;color:#111;line-height:1;margin:4px 0;">${escapeHtml(value)}</div>
    <div style="font-size:10px;color:#737373;">${escapeHtml(sub)}</div>
  </td>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

export function paymentConfirmedHtml({
  clinicName,
  amountTHB,
  paidAt,
  reference,
}: { clinicName: string; amountTHB: number; paidAt: string; reference?: string }): string {
  return `<!doctype html><html><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#f6f6f6;margin:0;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e5e5;overflow:hidden;">
    <div style="background:#059669;color:#fff;padding:18px 24px;text-align:center;">
      <div style="font-size:40px;">✓</div>
      <h1 style="margin:8px 0 0;font-size:20px;">Payment received</h1>
    </div>
    <div style="padding:24px;">
      <p style="font-size:15px;line-height:1.5;color:#111;">Hi ${escapeHtml(clinicName)} team,</p>
      <p style="font-size:14px;line-height:1.6;color:#525252;">We received your transfer of <b style="color:#111;">฿${amountTHB.toLocaleString()}</b> on ${escapeHtml(new Date(paidAt).toLocaleDateString())}.</p>
      <p style="font-size:14px;line-height:1.6;color:#525252;">Your dashboard is now <b style="color:#059669;">active</b> for the next month. AI-reply tool, lead inbox, and weekly digest are all live.</p>
      ${reference ? `<p style="font-size:11px;color:#737373;">Reference: <code>${escapeHtml(reference)}</code></p>` : ""}
    </div>
  </div></body></html>`;
}
