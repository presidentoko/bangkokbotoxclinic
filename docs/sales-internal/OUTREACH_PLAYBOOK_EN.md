# Cold Outreach Playbook

**Bangkok Best Clinic & Bangkok Botox Clinic — Sales Operations**

*Audience: English-speaking outreach staff. Target: Bangkok clinics that already serve international patients.*

*Version 2.0 — Pure English Edition*

---

## Welcome

Your job is to reach out to Bangkok clinics that already serve foreign patients and convince them to sign up for our directory partner program. You will work entirely in English. You will only contact clinics that respond to English (we filter the prospect list for you).

**Weekly goal:** 2 signed partners.

If you sign 2 partners per week, in six months we have 50 partners, each potentially worth 8,000 baht per month. That is your real measure.

---

## What we sell

We help Bangkok clinics get more international patients through three services:

1. We list them in our directory at bangkokbotoxclinic.com (aesthetics) or bangkokbestclinic.com (dental). Foreign patients searching Google find us.

2. When a patient fills out an enquiry form on our site, the lead goes directly to the clinic's LINE messenger.

3. We give the clinic a private dashboard with AI-drafted replies for their negative Google reviews, plus competitor analysis.

**Pricing**: Free 30-day trial, no credit card. After the trial, the clinic chooses either 200 baht per closed lead OR 8,000 baht per month for unlimited leads.

The clinic risks nothing. We only get paid when they get paid. This is your core pitch.

---

## How outreach works — your role vs. the Thai sales team

You are the **front line** for the first touch. You send English cold messages to all qualified clinics. Most Bangkok clinics have at least one English-capable person on staff (marketing, manager, owner) who handles foreign enquiries. They will reply if interested.

**Two-stage funnel:**

**Stage 1 — You (English staff):** Send initial cold messages in English to every prospect on the list. You handle the entire conversation if the clinic replies in English. Most marketing managers will reply in English even if their clinic reviews are mostly Thai.

**Stage 2 — Thai sales team:** If a clinic replies in Thai (or in broken English where they are clearly struggling), you escalate the conversation to the Thai sales team. They take over the closing process. You note this in your tracking sheet.

This means you should **send to all qualified clinics**, not only those marked English-friendly. The data column `has_english_reviewers` is a useful signal — clinics with Y are more likely to reply in English and you can handle them end-to-end. But it is not a filter. Send to both Y and N clinics.

**When to hand off to the Thai team:**
- The clinic replies in Thai language
- The clinic asks for a phone call (Thai team handles all calls)
- The reply uses broken English that suggests they need a Thai conversation
- The clinic asks to meet in person (Thai team handles in-person meetings)

**How to hand off:**
- In your tracking sheet, change the outcome to `HANDOFF_TO_THAI_TEAM`
- Forward the conversation thread to the team lead via LINE or email
- Include the clinic name, the dashboard URL, and a summary of what they asked
- Stop responding yourself. The Thai team takes over.

---

## Tools you need before Day 1

1. A computer with a modern browser (Chrome or Edge recommended).

2. Login credentials for the admin panel:
   - URL for aesthetic clinics: https://www.bangkokbotoxclinic.com/admin
   - URL for dental clinics: https://www.bangkokbestclinic.com/admin
   - Username: ym
   - Password: Yunmincandoit

3. A LINE app account dedicated to this work. Do not use your personal account. Set the display name to "Bangkok Best Clinic Partnership" and use our logo as the profile photo.

4. A Google Sheet for tracking your outreach. Template provided in section 11.

5. A spreadsheet program (Excel or Google Sheets) to open exported CSV files.

---

## Daily Workflow

Plan to spend 90 minutes per day on outreach. Here is the recommended schedule:

**10:00 AM — Pull prospects (5 minutes)**

Open the admin panel and export a fresh prospect list. Details in section 4.

**10:10 AM — Prioritize your day (10 minutes)**

Open the CSV in Excel. Filter and sort to pick your 20 best targets for today. Details in section 5.

**10:30 AM — Send first-touch messages (40 minutes)**

Send 20 personalized first-contact messages. Two minutes per message once you are warmed up. Details in sections 6 and 7.

**3:00 PM — Handle replies (30 minutes)**

Check LINE for any responses to yesterday's batch. Respond to each one. Details in section 9.

**3:30 PM — Update tracking sheet (5 minutes)**

Log what happened today. Sent, replied, dead, signed.

**Important: Never send more than 20 to 25 messages per day.** LINE has anti-spam algorithms. Sending too many too fast will temporarily block your account. Quality over quantity.

---

## Step 1: How to pull a prospect list

First, decide which site you are sourcing from today. If you are reaching out to dental clinics, use the Bangkok Best Clinic admin. If you are reaching out to aesthetic, botox, filler, HIFU, laser, or facial clinics, use the Bangkok Botox Clinic admin.

To pull the list:

1. Open the admin URL in your browser.
2. Log in with the credentials above.
3. You will land on the Overview tab automatically.
4. Scroll all the way to the bottom of the page.
5. You will see a green section titled "Prospect export (sales outreach)".
6. Set these filter values:
   - Min Trust: 75
   - Min reviews: 50
   - City: leave blank for all cities, or type "Bangkok" or "Pattaya" if you want to focus
   - Limit: 100
7. Click the Preview button first. This confirms the filters work and shows the top 10 matches.
8. Click "Download CSV". The file saves to your Downloads folder.
9. Open the CSV in Excel or Google Sheets.

The CSV has these columns. Pay special attention to the ones marked important:

- `name` — clinic name. **IMPORTANT** for personalization
- `district` — Bangkok district name (Pathum Wan, Watthana, etc.). **IMPORTANT** for personalization
- `phone` — phone number
- `website` — clinic website URL. **IMPORTANT** for finding their LINE
- `trust_score` — our score from 0 to 100. **IMPORTANT** for the pitch
- `rating` — Google star rating
- `total_reviews` — lifetime review count
- `recent_reviews_30d` — reviews in the last 30 days. High number means active clinic.
- `has_english_reviewers` — Y or N. **IMPORTANT** — Y means you can likely close end-to-end. N means likely Thai handoff.
- `primary_review_lang` — EN, TH, KO, JA, or other. Look for EN.
- `dashboard_url` — preview URL for this clinic. **CRITICAL** — send this in every message
- `pitch_hook` — auto-generated personalization line. **IMPORTANT**
- `unanswered_neg_reviews` — count of negative reviews without responses. **IMPORTANT** for urgent template

---

## Step 2: Picking who to message first

Open the CSV. You will message **all qualified clinics** regardless of `has_english_reviewers` value. Bangkok clinic marketing managers usually have someone who can reply in English. If they reply in Thai, you hand off to the Thai sales team (see section 2 for handoff).

That said, **prioritize English-friendly clinics** because you can handle the full conversation yourself, which is faster than escalating.

Sort the rows into tiers:

**Tier One — message TODAY (highest urgency, all clinics)**

Sort by `unanswered_neg_reviews` descending. Any clinic with three or more unanswered negative reviews and at least five recent reviews in the last 30 days goes here. Real problem + active = strong urgency. Use Template Three.

**Tier Two — message TODAY (you can close end-to-end)**

Filter `has_english_reviewers = Y` AND `trust_score ≥ 80` AND `recent_reviews_30d ≥ 10`. High likelihood of English reply. You handle the whole conversation. Use Template One.

**Tier Three — message tomorrow (may need Thai team handoff)**

Filter `trust_score ≥ 75` AND `recent_reviews_30d ≥ 5`, regardless of English flag. Strong clinics that might reply in Thai. Send English first; if they reply in Thai, hand off to Thai sales team. Volume play. Use Template One.

**Tier Four — message later in the week**

Mid-tier, district rank 4–10. Long tail. Use Template One or Two.

**SKIP these completely**
- `rating` below 4.0 (they have bigger problems than marketing)
- `total_reviews` below 30 (too small to be worth our time)
- Already a partner (check your tracking sheet)
- Already contacted in the last 7 days (check tracking sheet)

---

## Step 3: How to actually send the message

The hardest part of this job is finding the clinic's LINE ID. Here is the order of operations to find it:

**Method 1: Their website**

Open the URL in the `website` column. Look at the footer, contact page, and homepage for:
- A LINE QR code (scan with your phone's LINE app)
- A LINE ID written as `@something` (search this in LINE's "Add Friend" page)
- A button labeled "Book on LINE", "Contact us on LINE", or similar (click and add)

**Method 2: Search LINE app directly**

Open LINE on your phone. Go to "Add Friend", then "Search". Type the clinic's exact name in English. If you see an account with a green verification badge, that is them.

**Method 3: Facebook**

Many Bangkok clinics post their LINE QR code on their Facebook page, often in the pinned post. Google search for "[clinic name] facebook" to find it.

**Method 4: Facebook Messenger**

If the clinic has a Facebook page but you cannot find their LINE, message them on Facebook Messenger instead. Mark `FB_ONLY` in your tracking sheet for these.

**Method 5: Website contact form**

If nothing else works, fill out their website contact form. Lowest reply rate but better than nothing. Mark `WEBSITE_FORM` in your tracking sheet.

Once you have located their contact channel, copy the appropriate template (see section 7), fill in the variables from the CSV, and send.

After sending, immediately log the outreach in your tracking sheet. Do not skip this step. Double-messaging the same clinic looks unprofessional.

---

## Message Templates (English only)

Replace the items in curly braces with values from the CSV row.

### Template One — First contact, standard

Use this for any English-speaking clinic that does not have urgent negative reviews.

```
Hi {CLINIC_NAME} team,

We are Bangkok Best Clinic, an independent directory that ranks Bangkok clinics based on real Google review data. We help English-speaking clinics get more international patients.

Your clinic earned a Trust Score of {TRUST_SCORE} out of 100 from {TOTAL_REVIEWS} analyzed reviews. You are ranked number {RANK} in {DISTRICT}. Strong fundamentals.

We built specific tools for clinics like yours:

— Real-time alerts when new negative reviews arrive on Google, with AI-drafted replies ready in your tone
— A lead capture form on your clinic page that routes enquiries directly to your LINE
— A private dashboard with district-level competitor analysis

We are offering a 30-day free pilot. No credit card. No upfront fees. After the trial you choose: 200 baht per closed lead, OR 8,000 baht per month for unlimited leads. Cancel anytime.

Preview your clinic's dashboard here:
{DASHBOARD_URL}

Open to a 15-minute call this week?

Best regards,
{YOUR_NAME}
Bangkok Best Clinic Partnership Team
```

### Template Two — First contact, alternative phrasing

Use this as a variation if you have already used Template One that day. Avoid sending identical messages back-to-back.

```
Hello,

I am reaching out from Bangkok Best Clinic. We rank Bangkok clinics based on Google review data and help English-speaking clinics convert more international patients into bookings.

I am writing because {CLINIC_NAME} stood out: Trust Score {TRUST_SCORE}, rank {RANK} in {DISTRICT}, {TOTAL_REVIEWS} reviews analyzed. You are clearly doing things right.

Three things we can do for you:

First, we alert you on LINE the moment a new negative review hits your Google profile, and we include an AI-drafted reply ready to send.

Second, we send qualified patient enquiries from our website directly to your LINE inbox.

Third, we give you a dashboard showing how you compare to other clinics in {DISTRICT} on review quality, reviewer credibility, and recent momentum.

Free 30-day pilot. No upfront commitment. Pay only for leads that close.

Your dashboard preview is here:
{DASHBOARD_URL}

Would you like to chat for 15 minutes this week?

Thanks,
{YOUR_NAME}
```

### Template Three — Urgent, for clinics with unanswered negative reviews

Use this only when `unanswered_neg_reviews` is 3 or more.

```
Hi {CLINIC_NAME},

I noticed your Google profile has {UNANSWERED_NEG_REVIEWS} negative reviews that have not received a response yet.

In our research across Bangkok clinics: those that reply to negative reviews within 48 hours typically recover their rating within 2 to 3 months. Slow or no replies lead to compounding rating decay.

Our system has already drafted AI replies for each of your unanswered negative reviews. The tone is matched to your existing positive reviews. You just click "Copy" and post.

Open this link to see the drafted replies waiting for you:
{DASHBOARD_URL}

The 30-day trial is free. No signup required just to look at the drafts.

If even one of those replies converts a viewer back into a customer, the system has paid for itself.

Best,
{YOUR_NAME}
Bangkok Best Clinic
```

### Template Four — Follow-up, 3 days after no reply

Use this when 3 days have passed since the first message and there has been no response.

```
Hi {CLINIC_NAME},

I sent a note a few days ago about your Trust Score and our partnership tools.

I am not following up to bother you. Just wanted to share one specific signal we noticed:

{PITCH_HOOK}

Here is your dashboard preview again, in case it got lost:
{DASHBOARD_URL}

If now is not the right time, no problem at all. Wishing you a successful year ahead.

Best,
{YOUR_NAME}
```

### Template Five — Closing, when they reply with interest

Use this when a clinic responds positively and is ready to begin a trial.

```
Wonderful, thank you for the interest.

Here is how we activate your 30-day trial. I just need three things from you:

1. Your LINE User ID. This is the ID where new leads will arrive. You can find it in your LINE app under Settings, then Profile. It starts with "U" followed by letters and numbers.

2. An email address for the weekly summary report we send.

3. Approximately what your average procedure ticket value is in Thai baht. This helps us calculate your ROI accurately in the dashboard.

Once I have those three things, your trial starts immediately. Leads begin flowing the same day.

After the trial, you choose between 200 baht per closed lead (no monthly cost) or 8,000 baht per month for unlimited (best if you close more than 40 leads per month). You can cancel any time and there is no penalty.

Looking forward to working together.

Best,
{YOUR_NAME}
```

---

## Decision Tree — Which template to use

Start with the question: Does this clinic have 3 or more unanswered negative reviews?

- If yes, use Template Three (urgent / negative review hook)
- If no, continue

Is this the first time I am contacting them, or have I already sent a Template One or Two before?

- If first time, use Template One. (Or Template Two if you have already sent multiple Template One messages today and want variety.)
- If you sent Template One 3 days ago with no reply, use Template Four (follow-up)
- If you sent Template Four 7 days ago with no reply, stop. Mark as dead in tracking sheet. Do not contact again for 60 days.

Did they reply with interest?

- Yes, use Template Five (closing)
- After their reply with LINE ID and email, go to the admin and add them as a partner. Then send their dashboard URL back. See section 10 for the closing flow in detail.

---

## Response Handling — Common Objections

When clinics reply, they often have predictable concerns. Here are pre-written responses.

**They say: "We already do Facebook ads."**

Reply: Facebook ads in Bangkok aesthetic averages 2,800 baht per acquired lead. Our cost is 200 baht per closed lead. Lower risk for you because you only pay when the lead converts. You can run both channels in parallel. They do not conflict. If anything, our funnel is complementary because patients researching seriously will use both Facebook and Google.

**They say: "We do not have time to manage another dashboard."**

Reply: You do not need to. The dashboard sends alerts to your LINE only when something needs attention. You open it once a week to see ROI summaries. Most active partners log in for five minutes per week. Everything else is automated.

**They say: "Why should we pay you?"**

Reply: You do not pay anything upfront. You only pay when a lead closes. We carry the risk. If we cannot deliver leads that you can close, you owe nothing. It is a pure performance arrangement.

**They say: "How much exactly does this cost?"**

Reply: The 30-day trial is free. After the trial, you choose one of two structures. Option one: 200 baht per closed lead, no monthly fee. Option two: 8,000 baht per month for unlimited leads in your service category. Most clinics start on pay-per-lead and switch to monthly once they close more than 40 leads per month. Whatever you prefer.

**They say: "Do we need to sign a contract?"**

Reply: No contract. No commitment. Cancel any time by sending a LINE message. We earn your business by delivering results, not by locking you in.

**They say: "Let me think about it."**

Reply: Of course. There is genuinely nothing to think about with the trial because it is free and you can cancel at any time. The most informative thing you can do is start the trial, watch what comes in for 30 days, and then decide. Would you like to set it up now or revisit in a couple weeks?

**They say: "We are not interested."**

Reply: Understood. Thank you for taking the time to respond. If your situation changes, I am here. Wishing you a strong year ahead.

Mark "dead — not interested" in your tracking sheet. Do not contact again. Move on.

**They say: "Can we talk on the phone?"**

Reply: Of course. When works best for you? Fifteen minutes is plenty.

Set up the call. Use Template Five during or after the call to close.

**If they go silent after expressing interest:**

Wait two days. Then send: "Hi, just checking in. Still interested? If you are ready, send me your LINE ID and email and we will activate your trial immediately."

If no reply in three more days, mark as "ghosted" and move on. Do not chase further.

---

## Closing — How to Activate a New Partner

When a clinic agrees to start a trial, you need three pieces of information from them:

1. LINE User ID (where leads should be sent). It begins with the letter U.
2. Email address (for weekly summary reports).
3. Approximate average procedure ticket value in baht (for ROI calculations).

Once you have these, go to the admin panel:

1. Log in at /admin
2. Click the Partners tab
3. Click "+ Add Partner"
4. In the search field, type the clinic name. The autocomplete will show matching clinics. Click the right one.
5. Fill in the form:
   - Plan tier: Trial
   - Monthly fee: 0 (it is a trial)
   - Avg ticket: enter the value they gave you
   - Contact email: their email
   - LINE user ID: their LINE ID starting with U
6. Click "Add partner"

The partner is now in our system. Lead routing is active.

Next, find the partner in the list. Click "Copy dashboard link". The URL is now in your clipboard.

Send the URL back to the clinic with a message like this:

```
Your dashboard is ready and your 30-day trial is live.

{DASHBOARD_URL}

Bookmark this page. Any patient who fills out the enquiry form on our directory will appear in your dashboard and trigger a LINE notification to you.

I will check in at the 14-day mark to see how things are going. Anything you need before then, just LINE me here.
```

After 30 days:
- Check the admin Partners tab. See how many leads they received.
- If they got leads and closed some, ask them to convert to a paid plan.
- If they got zero leads, talk to them honestly. Offer to extend the trial, or part ways amicably. Either is fine.

---

## Daily Tracking Sheet

Create a Google Sheet with these columns and update after every outreach. This is your single source of truth and your performance record.

| Column | What to enter |
|--------|---------------|
| Date | The date you sent the message |
| Clinic name | From the CSV |
| District | From the CSV |
| Trust | The trust_score number |
| Channel | LINE, FB_MESSENGER, or WEBSITE_FORM |
| Template | T1, T2, T3, T4, or T5 |
| Outcome | See codes below |
| Reply date | If they replied, the date they did |
| Next action | What you plan to do next |
| Notes | Anything useful for follow-ups |

**Outcome codes:**

- `sent` — message delivered, no reply yet
- `read_no_reply` — they read it (LINE shows "read") but did not reply
- `REPLIED_EN` — they responded in English. You handle today.
- `HANDOFF_TO_THAI_TEAM` — they replied in Thai, or asked for a call. Forwarded to Thai sales team.
- `MEETING_SCHEDULED` — they want a call (Thai team handles)
- `SIGNED` — they signed up for the trial (you get bonus regardless of who closed)
- `dead — not interested` — they declined
- `dead — no reply` — silent after two follow-ups
- `dead — hostile` — they were rude. Mark and never contact again.
- `ghosted` — initially interested then went silent

Example rows:

```
2026-05-16  Glam Clinic    Pathum Wan  92  LINE  T1  sent  -  follow-up in 3d  LINE ID found easily
2026-05-15  Aura Pattaya   Bang Lamung 88  LINE  T3  REPLIED  2026-05-16  send T5  asked about pricing
2026-05-13  XYZ Dental     Bang Khae   81  LINE  T1  dead — not interested  -  stop  declined politely
```

---

## KPIs — What We Measure

These are your weekly targets:

- Outreach sent: 100 (excellent = 120)
- Replies received: 12 to 20 (excellent = 25+)
- Meetings scheduled: 3 to 5 (excellent = 7+)
- Signed partners: 2 (excellent = 3+)

**The single metric that matters: signed partners per week.** If you sign 2 per week, in 6 months we have ~50 partners. At an average value of 8,000 baht per month each, that is 400,000 baht in monthly recurring revenue.

**Bonus structure:**

- 1,000 baht bonus per signed partner at trial start
- 2,000 baht bonus when that partner converts to a paid plan (first payment of either 200 baht per lead or 8,000 baht per month)
- Quarterly bonus: extra 30,000 baht if you exceed 25 signed partners in a 3-month period

---

## Frequently Asked Questions

**Q: I cannot find the clinic's LINE ID anywhere.**

Most Bangkok clinics have a LINE but do not advertise it well. Try: search LINE directly with the clinic name, check Google Maps photos for a QR code, check the clinic's Facebook page (especially pinned posts), or use Facebook Messenger as the backup channel.

**Q: My LINE account got temporarily restricted.**

You sent too many messages too quickly. To avoid this in the future: send no more than 25 messages per day, wait at least 5 seconds between messages, vary the wording slightly between messages, and spread sends across different times of day. If restricted now, wait 24 hours before resuming.

**Q: A clinic was rude or hostile in their response.**

Do not engage. Reply with: "Thank you for the response. Wishing your clinic success." Mark as `dead — hostile` in your tracking. Never contact them again.

**Q: They asked a technical question I cannot answer.**

Be honest. Reply: "Let me check with our technical team and get back to you within 24 hours." Then ask the team lead. Never make up an answer. Losing credibility here is permanent.

**Q: They want to negotiate the price down.**

Our pricing is firm: free trial → 200 baht per lead → 8,000 baht per month. Do not discount. The only flexibility we offer is extending the trial from 30 days to 60 days for clinics that ask. That is it.

**Q: They ask about invoices or tax documentation.**

Reply: "We auto-generate tax invoices for every payment. They are sent automatically to the email on file." Then immediately ask the team lead to confirm this is set up before the clinic's first payment.

**Q: They want to see more proof of how the system works.**

Send them the demo dashboard URL: https://www.bangkokbotoxclinic.com/dashboard/demo for aesthetic, or https://www.bangkokbestclinic.com/dashboard/demo for dental. If they want more, ask the team lead for a recording of a live partner dashboard you can share.

**Q: I see a clinic in today's export that we tried 2 months ago and they said no.**

Check your tracking sheet. If marked dead, skip them. After 60+ days you can try again with a fresh angle (new feature announcement, new pricing, holiday timing, etc.).

**Q: The dashboard URL does not load for them.**

LINE sometimes truncates long URLs. Try sending the URL on its own line, without "https://" prefix, or send them a screenshot of the dashboard plus the URL in a separate message.

**Q: They want to know how we compare to other Bangkok directories.**

Be direct and honest. Many other directories operate as pay-to-rank: clinics pay for top placement and the rankings are gamed. We rank by Trust Score derived from actual Google review data. Our partners pay only for delivered leads, not for placement. We have no incentive to bury anyone in search results. If we do not deliver leads, the partner pays nothing.

---

## Day 1 Checklist

Before you send your first message, verify:

- Browser is open with the admin login working
- LINE business account is created with the correct display name and profile photo
- Google Sheet tracking template is set up and visible on your screen
- You have exported your first prospect CSV
- You have sorted the CSV by tier (urgency / English-friendly / volume)
- You have identified your top 20 priority clinics for today
- You have Templates One and Three copied to a notes file for easy paste-and-edit
- You have read sections 7 (Templates) and 9 (Response Handling) at least twice

Once verified, send your first 5 messages. Wait 2 hours for any replies. If you get a reply, handle it. If not, send the next 15 to reach 20 for the day.

**Day 1 goal:** 20 messages sent. Tracking sheet populated. Zero signed partners is fine.

**Week 1 goal:** First signed partner of any kind, even a trial. Getting the first one teaches you the full workflow. Bonuses begin paying out from this point forward.

---

## Final Note

This work is not glamorous. Most of the messages you send will not get a reply. That is normal. The math still works: 100 messages get you 15 replies, those 15 replies become 3 to 5 meetings, those meetings become 2 signed partners. Multiply by 26 weeks per half year and you have 50 partners.

When you feel discouraged, look at the math. The system works if you keep sending.

When you sign someone, send a quick note to the team lead. We will celebrate.

Questions you cannot answer from this document: ask the team lead before guessing. The cost of getting a wrong answer to a prospect is permanent loss of credibility, which costs the company more than your salary.

Good luck. You are the front line. The product is built. Now the company needs you to bring partners through the door.

---

*End of playbook. Version 2.0. Updated 2026-05-16. Pure English edition for international staff.*
