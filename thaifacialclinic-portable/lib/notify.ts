// Lead notification — pushes new lead summaries to free channels.
//
// ENV (set any/all in .env.local):
//   LEAD_WEBHOOK_URL       — Discord webhook (or Slack incoming webhook)
//   TELEGRAM_BOT_TOKEN     — From @BotFather (https://t.me/BotFather)
//   TELEGRAM_CHAT_ID       — Your personal chat id (get via @userinfobot)
//
// Each channel is independent: missing env → silent skip. Send failures
// are caught + logged, never crash the lead route.

import type { LeadRecord } from "./leadStore";

function formatLead(lead: LeadRecord): string {
  const lines = [
    `🆕 New lead — ${lead.clinic_name || lead.clinic_id || "unknown clinic"}`,
    `From: ${lead.name || "(no name)"} <${lead.email}>`,
  ];
  if (lead.phone) lines.push(`Phone: ${lead.phone}`);
  if (lead.procedure) lines.push(`Procedure: ${lead.procedure}`);
  if (lead.date || lead.time_slot) lines.push(`Preferred: ${[lead.date, lead.time_slot].filter(Boolean).join(" ")}`);
  if (lead.notes) lines.push(`Notes: ${lead.notes.slice(0, 400)}`);
  return lines.join("\n");
}

async function notifyDiscord(text: string): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
  } catch (e) {
    console.error("[notify] discord err", e);
  }
}

async function notifyTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
  } catch (e) {
    console.error("[notify] telegram err", e);
  }
}

/** Fire all configured channels in parallel. Returns immediately; channels run async. */
export function notifyNewLead(lead: LeadRecord): void {
  const text = formatLead(lead);
  // Don't await — fire and forget so /api/lead returns fast
  Promise.allSettled([
    notifyDiscord(text),
    notifyTelegram(text),
  ]);
}

export type PaymentClaim = {
  clinic_name: string;
  clinic_id?: string;
  amount_thb: number;
  reference?: string;
  payer_name?: string;
  partner_email?: string;
  note?: string;
  at: string;
};

function formatPaymentClaim(p: PaymentClaim): string {
  const lines = [
    `💰 Payment claim — ${p.clinic_name}`,
    `Amount: ฿${p.amount_thb.toLocaleString()}`,
  ];
  if (p.payer_name) lines.push(`Payer: ${p.payer_name}`);
  if (p.reference) lines.push(`Reference: ${p.reference}`);
  if (p.partner_email) lines.push(`Email: ${p.partner_email}`);
  if (p.note) lines.push(`Note: ${p.note.slice(0, 300)}`);
  lines.push(``);
  lines.push(`⚠️ ACTION: open TTB Bank app, verify ฿${p.amount_thb.toLocaleString()} arrived from "${p.payer_name || p.clinic_name}", then mark paid in admin.`);
  lines.push(`Submitted: ${p.at}`);
  return lines.join("\n");
}

/** Partner clicked "I just paid" — alert owner via all channels. */
export function notifyPaymentClaim(claim: PaymentClaim): void {
  const text = formatPaymentClaim(claim);
  Promise.allSettled([
    notifyDiscord(text),
    notifyTelegram(text),
  ]);
}
