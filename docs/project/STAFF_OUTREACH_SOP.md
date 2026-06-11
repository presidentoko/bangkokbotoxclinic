# Cold Outreach SOP — Bangkok Clinics

**Goal:** Get clinic owners to open their free reputation dashboard.
Once they engage, the manager converts them into paid services (ads, dashboard add-ons).
**Your job: get the first click. That's it. No selling in your message.**

---

## 1. What You're Doing (1-minute briefing)

We've built a free clinic-reputation dashboard for ~2,500 Bangkok clinics. Each clinic has its **own URL** with its own data — Trust Score, unanswered negative reviews, AI-drafted reply suggestions, district ranking.

Most clinic owners don't know we made them this page. Your job is to send a short message telling them where it is. **No selling.** The dashboard sells itself once they open it.

If the dashboard is useful to them → they reply → the manager closes the paid services.

---

## 2. Tools You'll Use

### A. The Admin Compose Modal (preferred — use this 95% of the time)

1. Open the admin panel:
   - Botox site: `https://www.bangkokbotoxclinic.com/admin`
   - Dental site: `https://www.bangkokbestclinic.com/admin`
   - Hair site: `https://thaifacialclinic.com/admin`
2. Log in with the credentials your manager gave you.
3. Go to the **Outreach** tab.
4. Pick a clinic from the queue → click **Compose**.
5. The modal opens with the message **already filled in**, with the right placeholders (clinic name, ranking, dashboard URL, etc.) auto-substituted.
6. Pick:
   - **Channel**: LINE (preferred) → Facebook Messenger → Website form → Email (last resort)
   - **Language**: leave the default (auto-picked based on the clinic's reviewer base)
   - **Template**: leave as T1 unless the clinic has 3+ unanswered negatives (modal will auto-switch to T3)
7. Click **"Copy & Mark sent"** → message copied to clipboard + recorded.
8. Paste into LINE / Messenger / email → send.

**That's the entire workflow per clinic. ~30 seconds each.**

### B. Manual sending (if the Compose modal isn't available)

Use the templates in Section 4 below. Fill placeholders by hand from the clinic's public page:

- Clinic page: `https://www.bangkokbotoxclinic.com/clinic/<clinic_id>`
- Dashboard URL: same `<clinic_id>`, replace `/clinic/` with `/dashboard/`

---

## 3. Channel Priority

| Rank | Channel | Why |
|---|---|---|
| 1 | **LINE** | Bangkok clinics check LINE constantly. Highest reply rate. |
| 2 | Facebook Messenger | Many clinics have only a Page, not LINE. |
| 3 | Website contact form | Slow but legitimate. |
| 4 | Email | Last resort. Most clinics ignore email. |

Find LINE / FB info on the clinic's Google Maps page or website.

---

## 4. The Templates

### Variant A — Clinic HAS unanswered negative reviews on Google

Use this when the clinic has 1+ unanswered negative review. **The Compose modal auto-picks this.**

**Subject (email) / first line (LINE):**

```
{N} reviews on {Clinic Name} still need a reply
```

**Body:**

```
Hi {Clinic Name} team,

We track {Clinic Name} across Google Maps, HDmall, Wongnai, and a few other Thai platforms — you've got {N} negative reviews still without owner replies on Google. That's the single biggest drag on Trust Score and tells new patients the clinic isn't engaged.

We built a free clinic page that pulls all your platforms into one view, with AI-drafted replies ready to copy-paste — about 10 minutes to clear them.

Open here (no signup): {dashboard_url}

— {Your name}

ps. If this isn't useful, no reply needed — we don't double-send.
```

### Variant B — Clinic has NO unanswered negatives (clean record)

Use this when the clinic looks healthy. Lead with the ranking compliment.

**Subject (email) / first line (LINE):**

```
{Clinic Name} is #{Rank} in {District} — wanted you to see this
```

**Body:**

```
Hi {Clinic Name} team,

We rank Bangkok clinics by combining Google Maps, HDmall, Wongnai, and other Thai platforms — {Clinic Name} is currently #{Rank} of {Total} in {District} on our index. Solid spot.

We built a free clinic page that pulls all your platforms into one view — Trust Score breakdown, district ranking, and a 3-step quick-win checklist.

Open here (no signup): {dashboard_url}

— {Your name}

ps. If this isn't useful, no reply needed — we don't double-send.
```

### Day-3 Follow-up (only if no reply yet)

Wait 3 calendar days after first message. **Only follow up once.** If no reply after this, mark them as `no_response` in the admin panel and move on.

**Subject:** Reply to your original thread (don't start a new one).

**Body:**

```
Hi {Clinic Name},

Just bumping my earlier note — did you get a chance to look at the free page?

{dashboard_url}

No pressure. Happy to walk through it on a 15-min call if that's easier.

— {Your name}
```

---

## 5. Hair-site (thaifacialclinic.com) Variation

For hair-transplant clinics only, replace this line in both Variant A & B:

> `Google Maps, HDmall, Wongnai, and a few other Thai platforms`

with:

> `Google Maps, HDmall, Wongnai, Bookimed, Pantip, and Korean medical-tourism platforms`

Hair clinics get most of their patients from Korea / international medical tourism. Mentioning those platforms shows we understand their patient mix.

---

## 6. Targeting Priority (Who to Contact First)

The admin Outreach tab sorts these for you, but in case you're picking manually:

| Priority | Filter | Variant | Why |
|---|---|---|---|
| Highest | `unanswered_neg ≥ 3` AND `total_reviews ≥ 100` | A | Big urgency hook |
| High | `unanswered_neg ≥ 1` | A | Has the hook |
| Normal | `trust_score ≥ 70` AND `unanswered_neg == 0` | B | Healthy clinic, ranking flex |
| Skip | `total_reviews < 20` | — | Too little data to be credible |

---

## 7. Sending Rules — MUST FOLLOW

| # | Rule | Why |
|---|---|---|
| 1 | **Send times: 11:00–13:00 or 19:00–21:00 Bangkok time** | Manager break / after-clinic hours |
| 2 | **No sending Saturday / Sunday** | Lost in Monday inbox flood |
| 3 | **Send ≤ 50 messages per day per channel** | Above this LINE / FB flag as spam |
| 4 | **One follow-up only, on Day 3** | More = blocked or reported |
| 5 | **Never delete the `ps.` line** | It's the trust signal that drives reply rate |
| 6 | **Never put "Free" in the subject line** | Spam filter kill word |
| 7 | **Always verify placeholders are filled** before sending | A visible `{Clinic Name}` = instant ignore |
| 8 | **Match the language to the clinic** | Compose modal auto-picks; don't override unless you know better |

---

## 8. What to Do With Replies

| Reply type | Your action |
|---|---|
| "Yes, looks useful, what's the cost?" | Forward to manager immediately + tag clinic as `interested` |
| "Take me off your list" | Mark `do_not_contact` in admin. Never message again. |
| Question about how the data works | Reply: "Happy to walk you through it on a 15-min call — does {date} work?" + forward to manager |
| No reply after Day 3 follow-up | Mark `no_response` and move on |

**You don't sell anything.** Any pricing / contract talk → forward to manager.

---

## 9. What NOT to Do

- Don't translate Variant A/B into other languages on your own — use the Compose modal's language switcher (Thai / Korean / English templates are already written and tested).
- Don't add emojis to your message body (the templates are clean for a reason — emojis read as spam to Thai clinic managers).
- Don't promise specific services or prices in messages.
- Don't follow up more than once.
- Don't message the same clinic on multiple channels at once (LINE + email + Messenger = harassment).
- Don't forward replies to anyone except the manager.
- Don't ever share your admin login with anyone.

---

## 10. Daily Workflow (suggested)

| Time | Task |
|---|---|
| 10:30 | Open admin → review Outreach queue. Pick 20–30 top-priority clinics. |
| 11:00–13:00 | Send first batch. Compose modal for each (~30 sec). |
| 13:00–19:00 | Process same-day replies. Forward `interested` to manager. |
| 19:00–21:00 | Send second batch (another 20–30). |
| End of day | Day-3 follow-ups for clinics messaged 3 days ago with no reply. |

**Target: 40–60 first-touches per day + follow-ups. Expect 5–10% reply rate (good) or 15%+ (excellent).**

---

## 11. Questions / Escalation

| Situation | Action |
|---|---|
| Login not working / can't access admin | Text the manager |
| Modal showing error / not loading clinic data | Text the manager (include clinic name + screenshot) |
| Got a reply asking about pricing / contracts | Forward to the manager |
| Clinic threatening / hostile reply | Mark `do_not_contact` + forward to manager. Do not reply. |
| You're not sure if a clinic is worth contacting | Skip it. Time spent debating = time not sending. |

---

## 12. KPI (What Your Manager Will Look At)

| Metric | Target |
|---|---|
| First-touches per day | 40–60 |
| Reply rate | 5%+ (decent), 10%+ (great), 15%+ (excellent) |
| `interested` tags per week | 5–15 |
| Day-3 follow-up rate | 100% (every non-replied first-touch must be followed up once) |

---

## Quick Reference Card

**Send times:** 11:00–13:00 or 19:00–21:00 Bangkok time, weekdays only.
**Channel order:** LINE > Messenger > Web form > Email.
**Follow-up:** Day 3, once only.
**Cap:** 50 per day per channel.
**On reply:** Interested? → Forward to manager. Hostile? → Mark and forget.
**Tool:** Admin → Outreach tab → Compose. Click "Copy & Mark sent". Paste. Done.

---

*Read once. Then start with 10 messages to get the flow. After that the Compose modal makes it ~30 sec per send.*
