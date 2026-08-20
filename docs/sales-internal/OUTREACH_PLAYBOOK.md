# Cold Outreach Playbook
## Bangkok Best Clinic & Bangkok Botox Clinic — Sales Operations

> **Your job:** Reach out to Bangkok clinics via LINE (primary), Facebook (backup), and website forms (fallback) to sign them up for our directory partner program. Goal: 2 signed clinics per week.

---

## Table of Contents
1. [What we sell — in one sentence](#what-we-sell)
2. [Tools you need](#tools)
3. [Daily workflow (90 minutes/day)](#daily-workflow)
4. [Step-by-step: Pulling prospects](#pulling-prospects)
5. [Step-by-step: Picking who to message first](#prioritizing)
6. [Step-by-step: How to message](#messaging)
7. [Message templates (Thai & English)](#templates)
8. [Decision tree: Which template for which clinic](#decision-tree)
9. [Response handling](#response-handling)
10. [Closing the deal](#closing)
11. [Daily tracking sheet](#tracking)
12. [KPIs we measure](#kpis)
13. [FAQ & troubleshooting](#faq)

---

## What we sell {#what-we-sell}

We help Bangkok clinics get more patients by:
- **Listing them on our directory** (bangkokbotoxclinic.com for aesthetics, bangkokbestclinic.com for dental) — visible to medical tourists searching Google
- **Sending leads to their LINE** — when a patient fills our enquiry form, it goes directly to the clinic
- **AI-drafted review replies** — so the clinic can respond to bad Google reviews quickly
- **Competitor dashboard** — clinic sees how they rank vs neighbors

**Pricing offer:** Free 30-day trial, no credit card. After trial: ฿200 per closed lead OR ฿8,000/month flat unlimited.

The clinic risks nothing. We only get paid when they get paid.

---

## Tools you need {#tools}

Set these up **before Day 1**:

1. **Browser** — Chrome or Edge
2. **Admin login:**
   - URL: `https://www.bangkokbotoxclinic.com/admin` (for botox/aesthetic clinics)
   - URL: `https://www.bangkokbestclinic.com/admin` (for dental clinics)
   - Username: `ym`
   - Password: `Yunmincandoit`
3. **LINE app** — Use a dedicated business account, not personal
   - Display name: "Bangkok Best Clinic — Partnership"
   - Profile photo: our logo
4. **Google Sheet** — Create a tracking sheet (template in [section 11](#tracking))
5. **Spreadsheet software** — Excel or Google Sheets to open the exported CSV

---

## Daily workflow (90 minutes/day) {#daily-workflow}

| Time | Task | Duration |
|------|------|----------|
| Morning (10am) | Export fresh prospect list from admin | 5 min |
| Morning (10am) | Pick today's 20 targets | 10 min |
| Morning (10:30am) | Send 20 first-touch messages | 40 min |
| Afternoon (3pm) | Handle replies from yesterday's batch | 30 min |
| Afternoon (3:30pm) | Update tracking sheet | 5 min |

**Don't send more than 20-25 cold messages per day.** Quality > quantity. Spamming gets your LINE account flagged.

---

## Step 1: Pulling prospects {#pulling-prospects}

### Pick the right site for the clinic type
- **Dental clinics?** Use the **bangkokbestclinic.com** admin
- **Aesthetic / botox / filler / hifu / laser / facial?** Use the **bangkokbotoxclinic.com** admin

### Export the CSV

1. Go to `/admin` (the URL for whichever site you're targeting)
2. Log in (ym / Yunmincandoit)
3. Stay on the **Overview** tab (it's the default)
4. Scroll all the way down — you'll see a green box titled **🎯 Prospect export (sales outreach)**
5. Set the filters:
   - **Min Trust:** `75` (default — keeps only strong clinics)
   - **Min reviews:** `50` (default — keeps only active clinics)
   - **City:** Leave blank for all cities, or type `Bangkok`, `Pattaya`, etc.
   - **Limit:** `100` (gets you a week of work)
6. Click **Preview** first — confirms 100 clinics matched
7. Click **↓ Download CSV** — saves the file to your Downloads folder
8. Open it in Excel / Google Sheets

### What's in the CSV

| Column | What it means | Use for |
|--------|---------------|---------|
| `name` | Clinic name | Personalize messages |
| `district` | Bangkok district | Personalize messages |
| `phone` | Phone number | Backup contact |
| `website` | Clinic website URL | Find their LINE QR or contact form |
| `trust_score` | Our score 0-100 | Mention in pitch ("Trust 87") |
| `rating` | Google star rating | Skip if < 4.0 (probably struggling) |
| `total_reviews` | Lifetime review count | Skip if < 50 (too small) |
| `recent_reviews_30d` | Reviews in last 30 days | High = active = good prospect |
| `has_english_reviewers` | Y/N | Y = serves foreigners = our market |
| `primary_review_lang` | EN/TH/KO/JA | Pick your message language |
| `dashboard_url` | URL to send them | **THE HOOK** — send this in your DM |
| `pitch_hook` | Auto-generated personalization | Copy into your message |
| `unanswered_neg_reviews` | Negative reviews not yet replied | If ≥ 3, use urgent template |

---

## Step 2: Prioritizing — who to message first {#prioritizing}

Sort the spreadsheet (in this order) by these signals to find the **easiest wins first**:

### Tier 1 — message TODAY (highest conversion)
✅ `unanswered_neg_reviews ≥ 3` AND `recent_reviews_30d ≥ 5`
→ They have a problem (bad reviews piling up) AND they're active. Strong urgency.

### Tier 2 — message tomorrow
✅ `has_english_reviewers = Y` AND `trust_score ≥ 80`
→ They serve foreigners and have momentum. They get our value immediately.

### Tier 3 — message later in the week
✅ Rank #4 to #10 in district AND `recent_reviews_30d ≥ 10`
→ Middle-tier clinics with traction. Top 3 are usually too confident to need us; below 10 don't have budget.

### SKIP these
❌ `rating < 4.0` — they have bigger problems than marketing
❌ `total_reviews < 30` — too small, not our market
❌ Already a partner (check your tracking sheet)
❌ Already messaged in last 7 days (check tracking sheet)

---

## Step 3: How to actually message {#messaging}

### A. Find their LINE ID

This is the hardest part. Try in this order:

1. **Open the clinic's website** (from the `website` column)
2. Look for these things on their site:
   - A LINE QR code (usually in the footer or contact page) — scan with your phone
   - A LINE ID like `@xxxxxxx` — search this in LINE > "Add friend" > "Search by ID"
   - A "Book on LINE" button — click and add
3. If no LINE on website, **search LINE app:**
   - Open LINE > Add friend > Search > type clinic name in Thai or English
   - Look for the official account (has a green badge)
4. If still nothing — try **Facebook page** (Google search "[clinic name] facebook")
   - Most Bangkok clinics have a FB page with Messenger contact
5. Last resort — **fill out their website contact form** (slower, lower reply rate)

**Mark in your tracking sheet:** `LINE_FOUND` / `FB_ONLY` / `WEBSITE_ONLY` / `NO_CONTACT`

### B. Send the message

1. Pick the **Thai template** (default) or **English template** based on `primary_review_lang`:
   - `primary_review_lang = TH` → Thai
   - `primary_review_lang = EN` → English
   - `primary_review_lang = KO` → English (most Korean clinics here speak English with us)
2. Copy the template from [section 7](#templates)
3. Replace the `{VARIABLES}` with values from the CSV
4. **Always include the `dashboard_url`** — this is the magic. They click → see their own data → instantly understand what we offer.
5. Send.

**Time per message: ~2 minutes** once you're warmed up.

### C. Mark as sent in tracking sheet

Log immediately so you don't double-message.

---

## Message templates {#templates}

### Template 1 — First contact, Thai (default for Thai clinics)

```
สวัสดีค่ะ ทีมงาน {CLINIC_NAME} 🙏

เราเป็นทีม Bangkok Best Clinic — ไดเรกทอรีคลินิกอิสระ
ที่จัดอันดับคลินิกในกรุงเทพฯ จากรีวิว Google จริง

คลินิกของท่านได้ Trust Score {TRUST}/100
จากการวิเคราะห์ {REVIEWS} รีวิว
อันดับ #{RANK} ในย่าน {DISTRICT}

เราติดต่อมาเพราะมีเครื่องมือสำหรับคลินิกของท่าน:

🚨 แจ้งเตือนรีวิวลบทันที (พร้อม draft ตอบกลับ AI)
📥 รับลีดจากเว็บไซต์ส่งตรงเข้า LINE
📊 Dashboard เปรียบเทียบกับคู่แข่งในย่านเดียวกัน

ทดลองฟรี 30 วัน ไม่ต้องใช้บัตรเครดิต ไม่มีค่าธรรมเนียมล่วงหน้า
จ่ายเพียง ฿200 ต่อลีดที่ปิดได้ (หรือ ฿8,000/เดือนไม่จำกัด)

ลอง Dashboard ของคลินิกท่านที่นี่:
{DASHBOARD_URL}

สนใจคุยต่อไหมคะ?
```

### Template 2 — First contact, English (for English-primary clinics)

```
Hi {CLINIC_NAME} team,

We're Bangkok Best Clinic — an independent directory ranking
Bangkok clinics from real Google reviews.

Your clinic earned a Trust Score of {TRUST}/100 from {REVIEWS}
analyzed reviews — ranked #{RANK} in {DISTRICT}.

We built tools specifically for clinics like yours:

🚨 Real-time alerts when new negative reviews come in
   (AI drafts a reply in your tone — ready to send)
📥 Lead capture form on your /clinic page →
   routes directly to your LINE
📊 Dashboard with district-level competitor analysis

We're offering a 30-day free pilot, no credit card,
no upfront fees. You only pay ฿200 per closed lead
(or ฿8,000/month flat for unlimited).

Preview your clinic's dashboard:
{DASHBOARD_URL}

Interested in a 15-min call this week?

Best,
{YOUR_NAME}
Bangkok Best Clinic Partnership Team
```

### Template 3 — Urgent / negative-review hook (use when `unanswered_neg_reviews ≥ 3`)

**Thai:**
```
สวัสดีค่ะ {CLINIC_NAME} 🙏

ดูใน Google รีวิวของคลินิกท่าน — มี {NEG_COUNT} รีวิวลบ
ที่ยังไม่มีคำตอบ

จากประสบการณ์ — รีวิวลบที่ตอบดีและรวดเร็ว
สามารถดึง score กลับขึ้นได้ภายใน 2-3 เดือน

เรามี AI ที่ draft คำตอบให้พร้อม ในระบบ Dashboard
ลองเข้าไปดูได้เลย — ตัวอย่างคำตอบรอท่านอยู่:

{DASHBOARD_URL}

ฟรี 30 วัน ไม่ต้องลงทะเบียน แค่เปิดดู
```

**English:**
```
Hi {CLINIC_NAME},

We noticed your Google profile has {NEG_COUNT}
negative reviews without responses.

In our data: clinics that reply to negative reviews
within 48 hours typically recover their rating within
2-3 months. Replying slowly = rating decay.

Our system has AI-drafted replies waiting for each of
your negative reviews — open this link to see them:

{DASHBOARD_URL}

Free 30-day trial, no signup required to look.
```

### Template 4 — Follow-up #1 (Day 3, no reply)

**Thai:**
```
สวัสดีค่ะอีกครั้ง 🙏

ส่งข้อความก่อนหน้าไปเรื่อง Trust Score และเครื่องมือ
สำหรับคลินิก {CLINIC_NAME}

ไม่อยากรบกวนค่ะ แค่อยากบอกสั้นๆ:
{HOOK}

ลิงก์ Dashboard:
{DASHBOARD_URL}

ไม่สนใจก็ไม่เป็นไรค่ะ ขอบคุณที่อ่าน 🙏
```

**English:**
```
Hi again,

I sent a note a few days ago about your Trust Score
and clinic tools at {CLINIC_NAME}.

Not following up to bother you — just wanted to share:
{HOOK}

Dashboard:
{DASHBOARD_URL}

If not interested, no problem at all. Thanks 🙏
```

### Template 5 — Closing after they reply with interest

**Thai:**
```
ขอบคุณค่ะที่สนใจ 🙏

สรุปขั้นตอนง่ายๆ:
1. ให้ LINE User ID ของท่านที่ต้องการรับลีด
2. ส่ง email สำหรับ summary report รายสัปดาห์
3. เริ่ม trial 30 วัน — เริ่มทันที

หลัง trial — ถ้าไม่มีลีดเข้า ก็ไม่จ่ายอะไรเลย
ถ้ามีลีดและปิดได้ — ฿200/lead เท่านั้น
ยกเลิกได้ตลอด ไม่มีค่าปรับ

ขอ LINE ID และ email ค่ะ?
```

**English:**
```
Great — thanks for the interest! 🙏

Quick onboarding:
1. Share your LINE User ID (where leads should arrive)
2. Share an email for weekly summary reports
3. We activate your 30-day trial immediately

After trial — if no leads came in, you owe nothing.
If leads came in and you closed them — ฿200/lead only.
Cancel anytime, no penalty.

Could you share your LINE ID and email?
```

---

## Decision tree — which template for which clinic {#decision-tree}

```
START
  ↓
Is unanswered_neg_reviews ≥ 3 ?
  ↓ YES → Template 3 (urgent / neg-review)
  ↓ NO
  ↓
Is primary_review_lang = TH ?
  ↓ YES → Template 1 (Thai)
  ↓ NO → Template 2 (English)
  ↓

After 3 days, no reply?
  ↓ → Template 4 (follow-up)
  ↓
After 7 more days, still no reply?
  ↓ → STOP. Mark "dead" in tracking sheet.
       Don't contact again for 60 days.

They replied with interest?
  ↓ → Template 5 (closing)
       → Add as partner in admin (see [Closing](#closing))
```

---

## Response handling {#response-handling}

### Common replies & how to handle them

#### "เราใช้ Facebook ads อยู่แล้ว / We already do Facebook ads"
**Reply:**
> Facebook CAC in Bangkok aesthetic averages ฿2,800 per lead. Our price is ฿200 per **closed** lead. Different funnel, lower risk. You can run both in parallel — they don't conflict.

#### "เราไม่มีเวลามาดู dashboard / We don't have time"
**Reply:**
> No time needed. Alerts come to LINE directly when something needs attention. You only open the dashboard when you want to see ROI or compare competitors. Most partners check it once a week for 5 minutes.

#### "ทำไมต้องจ่ายให้คุณ / Why would we pay you?"
**Reply:**
> No upfront fees. No subscription unless you choose ฿8K/month. You only pay when a lead closes. We carry the risk that you can close them. If you can't close, you owe nothing.

#### "ค่าใช้จ่ายเท่าไหร่ / What's the cost?"
**Reply:**
> Free 30-day pilot to test. After pilot, either:
>  - ฿200 per closed lead (no monthly fee)
>  - ฿8,000/month unlimited (good if you close 40+ leads/mo)
> Most clinics start with pay-per-lead and switch to monthly later.

#### "เราต้องเซ็นสัญญาไหม / Do we sign a contract?"
**Reply:**
> No contract. Cancel anytime via LINE message. We work on trust — partners stay because the service works.

#### "ขอเวลาคิดดู / Need time to think"
**Reply:**
> Take your time. The trial is risk-free so there's nothing to think about — you can start the trial, see if leads come in, and decide after 30 days. Want me to set you up now or wait?

#### "เราไม่สนใจ / Not interested"
**Reply:**
> Understood — thanks for replying! If your situation changes, I'm here. Wishing you good year ahead 🙏
> *(Mark "dead — not interested" in tracking. Don't contact again.)*

#### "เราอยากคุยทางโทรศัพท์ / Want to call"
**Reply:**
> Of course! When works for you? 15 minutes is enough.
> *(Set up a call. Use the closing template after.)*

### If they go silent after expressing interest
- Wait 2 days
- Send: *"ยังสนใจมั้ยคะ? ถ้าพร้อม ส่ง LINE ID มาก็เริ่มได้เลย / Still interested? Send your LINE ID whenever ready."*
- If no reply in another 3 days → mark "ghosted" and move on

---

## Closing — adding them as a partner {#closing}

When a clinic agrees to start a trial:

1. Get their **LINE User ID** (starts with `U`, e.g. `U1234abcd...`) — they can find this in LINE > Settings > Profile
2. Get their **email** for summary reports
3. Optionally: their **monthly avg ticket** (used for ROI math in their dashboard — e.g., ฿15,000)

Then go to admin:

1. `/admin` → **Partners tab**
2. Click **+ Add Partner**
3. Search for the clinic by name → click to select
4. Fill in:
   - **Plan tier:** `Trial` (default)
   - **Monthly fee:** `0` (it's a trial — no fee)
   - **Avg ticket:** what they told you
   - **Contact email:** their email
   - **LINE user ID:** their LINE ID
5. Click **Add partner**
6. Now click **📋 Copy dashboard link**
7. **Send the link back to the clinic** via LINE:
   > "Dashboard ของท่านพร้อมแล้วค่ะ — {DASHBOARD_URL} — ลีดจะส่งเข้า LINE ของท่านทุกครั้งที่มีคนกรอกฟอร์ม / Your dashboard is ready — {DASHBOARD_URL} — leads will arrive in your LINE whenever someone submits the form"

### After 30 days
- Check admin → Partners tab → see their lead count
- If they got leads and closed any → ask them to convert to paid (฿200/lead or ฿8K/mo)
- If they got 0 leads → tell them honestly, ask if they want to extend trial or pause

---

## Daily tracking sheet {#tracking}

Create a Google Sheet with these columns. **Update after every outreach.**

| Date | Clinic name | District | Trust | Channel | Template | Outcome | Reply date | Next action | Notes |
|------|-------------|----------|-------|---------|----------|---------|------------|-------------|-------|
| 2026-05-16 | Glam Clinic | Pathum Wan | 92 | LINE | T1 | sent | — | follow-up in 3d | LINE ID found easy |
| 2026-05-16 | V Square Clinic | Watthana | 92 | FB Messenger | T1 | sent | — | follow-up in 3d | LINE not found |
| 2026-05-15 | Aura Pattaya | Bang Lamung | 88 | LINE | T3 (urgent) | REPLIED | 2026-05-16 | send T5 closing | wants to know pricing |
| 2026-05-13 | XYZ Dental | Bang Khae | 81 | LINE | T1 | dead | — | stop | not interested |

### Outcome codes
- `sent` — message delivered, no reply yet
- `read_no_reply` — they read but didn't reply (LINE shows "read")
- `REPLIED` — they replied (handle them today!)
- `MEETING_SCHEDULED` — they want a call
- `SIGNED` — they're a partner now
- `dead — not interested` — they declined
- `dead — no reply` — silent after 2 follow-ups
- `ghosted` — replied with interest then went silent

---

## KPIs we measure {#kpis}

Your weekly targets:

| Metric | Weekly target | Excellent |
|--------|---------------|-----------|
| Outreach sent | 100 | 120 |
| Replies | 12-20 | 25+ |
| Meetings scheduled | 3-5 | 7+ |
| Signed partners | **2** | 3+ |

**The KPI that matters: signed partners.** If you sign 2/week, in 6 months you have ~50 partners. At ฿8K/month each, that's ฿400K MRR.

### Personal bonus structure
- ฿1,000 per signed partner (trial start)
- ฿2,000 bonus when that partner converts to paid (฿200/lead first payment OR ฿8K/month first payment)
- Quarterly bonus if you exceed 25 signed partners in 3 months

---

## FAQ & troubleshooting {#faq}

### Q: I can't find the clinic's LINE
Most clinics have one but it's not advertised. Try:
1. Search LINE by clinic name (Thai or English)
2. Look at their Google Maps listing — sometimes LINE QR is in the photos
3. Check Facebook page — many post LINE QR in pinned posts
4. Last resort: use Facebook Messenger (mark `FB_ONLY` in tracking)

### Q: My LINE account got temporarily restricted
You sent too many messages too fast. Rules to avoid this:
- **Max 25 messages per day** (not 50, not 100)
- **5-second delay between sends** (mentally count, don't bulk-paste)
- **Don't use identical messages** — vary the variables, vary one sentence
- **Vary the time of day** — don't send 25 at 10:00am sharp

If restricted: stop for 24 hours, send fewer next time.

### Q: A clinic is being aggressive / hostile
- Don't argue. Reply: *"ขอบคุณที่ตอบกลับนะคะ ขอให้คลินิกของท่านประสบความสำเร็จ 🙏"* (Thanks for the reply, wishing you success)
- Mark `dead — hostile` in tracking. Don't contact again for any reason.

### Q: They're asking technical questions I can't answer
Honest answer: *"ขอเวลานิดหน่อยให้เช็คกับทีมเทคนิคก่อนนะคะ / Let me check with our technical team and get back to you within 24h"*
Then ping the team lead. Don't make up answers — losing trust here is fatal.

### Q: They want to negotiate the price
Our pricing is firm for trial → ฿200/lead → ฿8K/month. Don't discount.
If they push hard: offer extended trial (60 days instead of 30). That's our only flexibility.

### Q: They're asking for invoice / tax info
This is a good sign — they're treating it seriously. Reply:
> "เรามีระบบออกใบกำกับภาษีอัตโนมัติให้ค่ะ จะส่งให้ทุกครั้งที่มี payment / We auto-generate tax invoices for every payment — sent automatically."
Then escalate to team lead to make sure we actually have this set up.

### Q: They want to see "more of how it works"
Send them the demo dashboard link:
> `https://www.bangkokbotoxclinic.com/dashboard/demo` (for botox)
> `https://www.bangkokbestclinic.com/dashboard/demo` (for dental)

Or send a 5-min Loom screen recording of you clicking through a partner dashboard. (Ask team lead for a current example.)

### Q: I see a clinic in the export that already turned us down 2 months ago
Check tracking — if `dead` status: skip. But after 60+ days you can re-approach with different angle (new feature, new pricing, etc.).

### Q: The dashboard_url link doesn't load for them
Try sending the URL without `https://` (some LINE clients break long links). Or send a screenshot of the dashboard plus the URL separately.

### Q: They're asking about competitors / how we compare to other directories
Honest answer:
> Other Bangkok directories are pay-to-rank — clinics pay for top spots and the rankings are gamed. We rank by Trust Score from actual Google review data. Our partners pay for **leads delivered**, not placement. If we don't deliver leads, you don't pay.

---

## Final checklist before you start Day 1

- [ ] Browser open with admin login working
- [ ] LINE business account created with proper name + photo
- [ ] Google Sheet tracking template open
- [ ] First CSV exported (100 prospects)
- [ ] First 20 priority clinics highlighted in sheet
- [ ] Template 1 (Thai) and Template 2 (English) copied to a notes file for easy access
- [ ] You've read sections 7 (templates) and 9 (response handling) twice

When you're ready: **send your first 5 messages**. See if any reply within 2 hours. If yes — handle them. If no — keep sending up to 20 for the day.

**Goal for Day 1:** 20 messages sent, tracking sheet populated.

**Goal for Week 1:** First signed partner. Doesn't matter if it's a trial — getting the first one teaches us the entire flow.

---

*Questions? Ping team lead. Don't guess — wrong info to a clinic kills trust permanently.*

*Updated 2026-05-16. Version 1.0.*
