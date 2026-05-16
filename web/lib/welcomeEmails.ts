// Welcome email automation — Day 0/3/7/14/30 시퀀스.
// 발송 추적 Redis 키: `welcome:sent:<clinic_id>:<day>` = ISO timestamp
// Vercel Cron 이 매일 호출 → trial 시작일 + N일 도래한 파트너 찾아 발송.

import type { ClinicPartner } from "./partners";
import { sendEmail } from "./notify";
import { getSiteConfig } from "./site";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export type WelcomeDay = 0 | 3 | 7 | 14 | 30;
const ALL_DAYS: WelcomeDay[] = [0, 3, 7, 14, 30];

async function redisGet(key: string): Promise<string | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const j = (await res.json()) as { result?: string | null };
    return j.result ?? null;
  } catch {
    return null;
  }
}

async function redisSet(key: string, value: string): Promise<boolean> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return false;
  try {
    const res = await fetch(UPSTASH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(["SET", key, value]),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

function daysSince(dateStr: string, now: Date = new Date()): number {
  const start = new Date(dateStr).getTime();
  return Math.floor((now.getTime() - start) / 86_400_000);
}

function clinicDashboardUrl(clinicId: string): string {
  const cfg = getSiteConfig();
  return `https://${cfg.domain}/dashboard/${clinicId}`;
}

const EMAILS: Record<WelcomeDay, (p: ClinicPartner, brand: string, url: string) => { subject: string; html: string; text: string }> = {
  0: (p, brand, url) => ({
    subject: `Welcome to ${brand} — your trial is active`,
    text: `Welcome to ${brand}! Your 30-day trial is now active. Dashboard: ${url}`,
    html: `<div style="font-family:Calibri,Arial,sans-serif;max-width:600px;line-height:1.5">
<h2 style="color:#1a4d2e">Welcome to ${brand}!</h2>
<p>Your 30-day trial is now active. Here is what happens next:</p>
<ol>
<li>Patients submitting enquiries on our directory will be routed to your LINE: <strong>${p.line_user_id ?? "(not set — message us to configure)"}</strong></li>
<li>Weekly summary reports go to: <strong>${p.contact_email ?? "(not set)"}</strong></li>
<li>Your private dashboard is here: <a href="${url}">${url}</a></li>
</ol>
<p>Bookmark the dashboard URL. You will get a LINE notification the moment a new lead arrives — but the dashboard shows the full picture (AI reply drafts, competitor analysis, ROI math).</p>
<p>If a lead arrives within 14 days, please reply within 24 hours — it's the single biggest predictor of conversion.</p>
<p>I'll check in around Day 7 to see how things are going. Reply to this email anytime with questions.</p>
<p>— ${brand} Partnership Team</p>
</div>`,
  }),
  3: (_p, brand, url) => ({
    subject: `Day 3 — quick check, are you getting LINE alerts?`,
    text: `Just checking your trial is working. Dashboard: ${url}`,
    html: `<div style="font-family:Calibri,Arial,sans-serif;max-width:600px;line-height:1.5">
<h2 style="color:#1a4d2e">Quick check-in</h2>
<p>You're 3 days into your ${brand} trial. Two questions:</p>
<ol>
<li><strong>Are LINE notifications working?</strong> If not, message me back so we can fix.</li>
<li><strong>Have you seen any leads yet?</strong> Even if zero so far, that's normal — most clinics see their first lead in week 2.</li>
</ol>
<p>Your dashboard tracks profile views (foreign patients browsing your listing) — open it to see if anyone has looked you up:<br>
<a href="${url}">${url}</a></p>
<p>Quick win this week: respond to any negative Google reviews you might have. Our AI drafted replies are waiting in your dashboard.</p>
<p>— ${brand} Team</p>
</div>`,
  }),
  7: (_p, brand, url) => ({
    subject: `Week 1 done — your traffic data is in`,
    text: `First week of trial complete. Check your view data: ${url}`,
    html: `<div style="font-family:Calibri,Arial,sans-serif;max-width:600px;line-height:1.5">
<h2 style="color:#1a4d2e">Your Week 1 data is ready</h2>
<p>One week into your ${brand} trial. Time to look at the data:</p>
<ul>
<li>How many foreign patients viewed your clinic this week → your dashboard <strong>Profile views</strong> card</li>
<li>How does your Trust Score compare to your district average → <strong>Competitor analysis</strong> tab</li>
<li>Any pending review replies → <strong>Crisis alerts</strong></li>
</ul>
<p>Open your dashboard: <a href="${url}">${url}</a></p>
<p><strong>Common pattern at this stage:</strong> Bangkok clinics see 30-100 profile views in week 1. Lead conversion typically starts in week 2-3 as our SEO rankings establish.</p>
<p>Got 5 minutes? Reply with the answer to: <strong>what's your average procedure ticket?</strong> We'll update the ROI projections in your dashboard.</p>
<p>— ${brand} Team</p>
</div>`,
  }),
  14: (_p, brand, url) => ({
    subject: `Halfway through trial — your ROI projection`,
    text: `Halfway point. Review your dashboard: ${url}`,
    html: `<div style="font-family:Calibri,Arial,sans-serif;max-width:600px;line-height:1.5">
<h2 style="color:#1a4d2e">Halfway checkpoint</h2>
<p>Day 14 of 30 in your ${brand} trial. Let's look at what we've got:</p>
<p>Open your dashboard: <a href="${url}">${url}</a></p>
<p><strong>Things to check:</strong></p>
<ul>
<li><strong>Profile views</strong> — are foreign patients finding you?</li>
<li><strong>Leads</strong> — anyone filled out the enquiry form?</li>
<li><strong>Trust Score trend</strong> — any negative reviews handled?</li>
</ul>
<p><strong>If you've gotten any leads:</strong> what's your close rate so far? That tells us whether pay-per-lead (฿200) or monthly unlimited (฿8,000) is better for you after the trial.</p>
<p><strong>If zero leads yet:</strong> totally normal. Our SEO is still warming up your listing. We typically see leads start around Day 20-25. Stay tuned.</p>
<p>Either way — reply with how things are going. I want to hear from you.</p>
<p>— ${brand} Team</p>
</div>`,
  }),
  30: (_p, brand, url) => ({
    subject: `Your trial ends today — let's pick a plan`,
    text: `Trial ends today. Pick a plan or extend: ${url}`,
    html: `<div style="font-family:Calibri,Arial,sans-serif;max-width:600px;line-height:1.5">
<h2 style="color:#1a4d2e">Your trial wraps today</h2>
<p>30 days into your ${brand} partnership. Time to decide what's next.</p>
<p>Open your dashboard to see your final trial summary: <a href="${url}">${url}</a></p>
<p><strong>Three options:</strong></p>
<ol>
<li><strong>Continue with pay-per-lead (฿200/lead).</strong> Best if you closed fewer than 40 leads this month. We bill only when a lead converts.</li>
<li><strong>Switch to monthly unlimited (฿8,000/month).</strong> Best if you closed 40+ leads. Better unit economics at high volume.</li>
<li><strong>Extend trial 30 more days.</strong> If results were inconclusive (low lead volume due to seasonality, etc.), we'll extend. Reply and let us know.</li>
</ol>
<p>If you got value and you want to continue — reply to this email with "pay-per-lead" or "monthly". I'll set it up.</p>
<p>If you didn't get value — also reply. We'd like to understand why before parting ways.</p>
<p>Either way, your dashboard stays open another 7 days for transition.</p>
<p>— ${brand} Team</p>
</div>`,
  }),
};

/**
 * Send a specific welcome email and record it. Returns true if newly sent.
 * Idempotent — won't re-send if already sent for this clinic+day.
 */
export async function sendWelcomeEmail(p: ClinicPartner, day: WelcomeDay): Promise<{ sent: boolean; reason?: string }> {
  if (!p.contact_email) return { sent: false, reason: "no contact_email" };

  const key = `welcome:sent:${p.clinic_id}:${day}`;
  const already = await redisGet(key);
  if (already) return { sent: false, reason: "already sent" };

  const cfg = getSiteConfig();
  const url = clinicDashboardUrl(p.clinic_id);
  const tpl = EMAILS[day](p, cfg.brand, url);
  const success = await sendEmail(p.contact_email, tpl.subject, tpl.html, tpl.text);
  if (success) await redisSet(key, new Date().toISOString());

  return { sent: success, reason: success ? undefined : "send failed" };
}

/**
 * Process all partners — for each, send any welcome email that's due.
 * Called by Vercel Cron daily.
 */
export async function processWelcomeQueue(partners: ClinicPartner[]): Promise<{ checked: number; sent: number; results: { clinic_id: string; day: WelcomeDay; sent: boolean; reason?: string }[] }> {
  const results: { clinic_id: string; day: WelcomeDay; sent: boolean; reason?: string }[] = [];
  let sentCount = 0;

  for (const p of partners) {
    if (!p.started_at || !p.contact_email) continue;
    const days = daysSince(p.started_at);
    for (const target of ALL_DAYS) {
      // 발송 시점: 정확한 day 또는 그 다음 (cron 놓친 경우 catch-up)
      if (days < target) continue;
      // catch-up은 target+2일 이내만 (오래된 trial은 무시)
      if (days > target + 2) continue;
      const res = await sendWelcomeEmail(p, target);
      results.push({ clinic_id: p.clinic_id, day: target, ...res });
      if (res.sent) sentCount++;
    }
  }

  return { checked: partners.length, sent: sentCount, results };
}
