# Staff QA Checklist — Bangkok Botox Clinic + Bangkok Best Clinic (Dental)

**Purpose:** End-to-end test of the platform before resuming cold outreach. Both sites share the same codebase but serve different verticals.

**How to use:** Work top to bottom. Each item has an expected result. Mark `[x]` for Pass, `[F]` for Fail. If `[F]`, screenshot and add a note. Should take ~30 minutes total per site.

| Site | Domain | Vertical |
|---|---|---|
| Botox | `https://www.bangkokbotoxclinic.com` | Aesthetic / cosmetic clinics |
| Dental | `https://www.bangkokbestclinic.com` | Dental clinics |

The admin panel is identical for both — testing it once on either site covers both.

---

## Section 1 — Admin login (do this once per session)

1. [ ] Open `https://www.bangkokbotoxclinic.com/admin` in Chrome (or Safari on phone)
2. [ ] Enter username `ym` and password (ask the manager for the current passcode — `ADMIN_PASSCODE` env var)
3. [ ] You should see five tabs at the top: **Overview · Outreach · Partners · Leads · Ads**
4. [ ] Click each tab once to make sure it loads. None should error.

**If login fails:** the `ADMIN_USERNAME` / `ADMIN_PASSCODE` env vars on Vercel may have changed. Tell the manager.

---

## Section 2 — Outreach tab (the new sales workflow)

### 2A. Prospect Exporter

5. [ ] Go to the **Outreach** tab. At the top, find the green-bordered **🎯 Prospect export** panel.
6. [ ] Set filters: `Min Trust = 75`, `Min reviews = 50`, `City = Bangkok`, `Limit = 50`. Click **Preview**.
7. [ ] You should see a table with up to 10 prospect rows. Each row has a checkbox, clinic name, district, Trust score, a pitch hook, and two action buttons (📩 and 👁).
8. [ ] Click 👁 on any row. A new tab should open showing that clinic's `/dashboard/<id>` page (the free reputation report).
9. [ ] Close that tab. Back in admin, click 📩 on any row. A dark modal should slide in.

### 2B. Single Compose modal

10. [ ] In the Compose modal you should see:
    - Title: **📩 Compose outreach** with the clinic name
    - A context bar with 4 numbers: **Trust · District rank · Unanswered negs · Total reviews**
    - 3 dropdowns: **Template (T1–T5) · Language (EN/한국어/ไทย) · Channel (LINE/Email/etc.)**
    - A signature field for your name
    - A large text area pre-filled with a message that includes the clinic name + dashboard URL
11. [ ] Type your name in the signature field. The text area should refresh with `— [Your name]` at the bottom.
12. [ ] Switch the **Language** to 한국어. The text area should switch to Korean within ~1 second.
13. [ ] Switch the **Template** to **T3 — Crisis**. The message text should change to a different message focused on negative reviews.
14. [ ] Edit the text area manually — add a word. A small **"· edited"** label should appear and a **"↺ Reset to template"** button should appear.
15. [ ] Click **↺ Reset to template** — your edit disappears.
16. [ ] Click **📋 Copy & Mark as sent** (green button). The button should flash and the modal should close.
17. [ ] Open any text editor (Notepad / TextEdit) and paste (Ctrl+V). The full message should be there.
18. [ ] Scroll down in admin Outreach. You should see a **new outreach record** at the top of the list with the clinic you just composed.

### 2C. Bulk queue mode (the time-saver)

19. [ ] Back in the **Prospect Exporter** preview table, click the master checkbox in the header — all 10 rows should select (rows turn purple).
20. [ ] A purple button should appear: **📩 Compose queue (10) →**. Click it.
21. [ ] The Compose modal opens with **Queue 1 / 10** chip next to the title.
22. [ ] The primary button now reads **📋 Copy & Next →**. There is also a **Skip →** button.
23. [ ] Click **Copy & Next →**. The modal should refresh to clinic 2 of 10 within ~1 second (new data, new pre-filled message).
24. [ ] Paste into a text editor — clinic 1's message should be on clipboard.
25. [ ] Click **Skip →** for clinic 2. Modal advances to clinic 3 of 10 (clinic 2 is NOT logged).
26. [ ] Click **Quit queue** (bottom right). Modal closes, selection clears.
27. [ ] In Outreach list, you should see 1 new record (clinic 1) added but not clinic 2 (skipped) or clinics 3–10 (quit).

### 2D. Template performance

28. [ ] In Outreach tab, find **📊 Template performance — which one is winning?** below the stats bar. Click to expand.
29. [ ] You should see a table with rows T1–T5 (only templates with data show). Columns: **Template · Sent · Replied · Reply rate · Signed · Close rate**.
30. [ ] Reply rates ≥30% appear green, 15–30% amber, lower is gray. Verify the colors match the percentages.

### 2E. Enriched rows + filters

31. [ ] Each outreach row should show: clinic name + **Trust XX badge** (green/amber/gray) + **#N/M in district** + 🚨 badge if 3+ unanswered negative reviews.
32. [ ] Type a clinic name in the search box. Rows filter live.
33. [ ] Switch the filter dropdown to **All records**. Dead/signed records should appear.
34. [ ] Switch back to **Active pipeline**. Dead/signed disappear.

### 2F. Quick status change

35. [ ] On any active record, click the small status dropdown in the row. Change to **Replied (EN)** — the row should reload with the new badge and bg color.
36. [ ] Change it back to **Sent**. Should work.

### 2G. Staff name persistence

37. [ ] Open a new Compose modal (📩 from any row).
38. [ ] The signature field should already have **your name** filled in (the name you typed in step 11).
39. [ ] If it's empty, type your name and re-test. The localStorage should keep it.

### 2H. Outreach log form (manual entry)

40. [ ] Click **+ Log outreach** (top right of Outreach tab).
41. [ ] Search for a clinic name. Autocomplete should appear.
42. [ ] Pick a clinic. Form expands — your name should auto-fill from step 38.
43. [ ] Pick channel, template, outcome. Click **Save outreach record**. New row should appear in the list.

---

## Section 3 — Public site, list pages (what cold visitors see)

**Test these on BOTH sites:**
- Botox: `https://www.bangkokbotoxclinic.com`
- Dental: `https://www.bangkokbestclinic.com`

For each URL below, repeat on both sites unless marked otherwise.

44. [ ] Open the home page (`/`). You should see a hero, search bar, and a **"Top 50 by Trust Score"** section.
45. [ ] The first **10 clinics** should be displayed as **large rich cards** — each card has a colored Trust Score bar, sample review quote, topic chips, language breakdown bar, and **View details** button.
46. [ ] Below the 10th card you should see a section header **"#11 – #N · runner-up rankings"**.
47. [ ] Ranks 11+ should be displayed as **compact rows** — one line per clinic with rank · name · district · ★ rating · Trust score · arrow.
48. [ ] Click any compact row. It should open the clinic detail page (`/clinic/<id>`).
49. [ ] **Mobile test:** Open the home page on your phone (or Chrome DevTools mobile view at iPhone size). The compact rows should fit one per line without horizontal scroll, with the arrow hidden.
50. [ ] **Botox site specifically:** verify the top 10 are aesthetic / botox / filler clinics, not dental clinics.
51. [ ] **Dental site specifically:** verify the top 10 are dental / orthodontic / implant clinics, not aesthetic clinics. The hero should read "Verify before you smile." or similar.

### Repeat compact-card check on these listing pages:

52. [ ] `/best/clean-facility` — top 10 rich + rest compact
53. [ ] `/best/genuine-brand` — same
54. [ ] `/city/bangkok` — same
55. [ ] `/d/sukhumvit` (or any district slug) — same
56. [ ] `/c/botox` (botox site) **or** `/c/dental-clinics` (dental site) — same, grouped by city
57. [ ] `/ko` — Korean header **"#11 – #N · 그 외 순위"**, same compact pattern

---

## Section 4 — Clinic dashboard (the free wedge — main sales tool)

Pick a clinic from any list page. Note its ID from the URL (e.g. `/clinic/abc123` → ID is `abc123`). Open `/dashboard/<id>` in a new tab.

### 4A. Free report banner (non-partner only)

58. [ ] At the top below the header, there should be a green-tinted banner: **🎁 Free reputation report · No signup**.
59. [ ] The banner body mentions: "your clinic's intelligence report is ready", "N unanswered negative reviews" (or "all handled"), and three buttons: **📤 Share with your team · 📄 Save as PDF · ↓ Jump to action items**.
60. [ ] Click **📤 Share with your team**. The button should turn green and say **✓ Link copied!**. Paste in a text editor — the dashboard URL should be on clipboard.
61. [ ] Click **📄 Save as PDF**. The browser print dialog opens. Cancel.
62. [ ] Click **↓ Jump to action items**. The page scrolls down to the Crisis alerts section.

### 4B. KPI bar

63. [ ] The 6-tile KPI bar should show: **Trust Score · Profile views (30d) · Pending replies · Projected leads/mo · Projected revenue · ROI multiplier**.
64. [ ] If Pending replies > 0, the Trust Score tile sub-label should say **"+X.X projected if you reply"** (in emerald color).

### 4C. ROI section

65. [ ] Below the banner should be a green-cyan ROI card titled **"Projected ROI · if you join lead routing"**.
66. [ ] Four cells: **Projected leads/mo · Projected closes · Revenue attributed · Same leads via Facebook**.
67. [ ] Footer CTA: **"Want this real? Talk to us →"** linking to /for-clinics#pilot.

### 4D. Crisis alerts (AI replies — biggest demo moment)

68. [ ] If the clinic has unanswered negative reviews, you should see a red 🚨 **Crisis alerts** section.
69. [ ] A progress bar shows "Progress: X of N resolved" with projected Trust score gain.
70. [ ] Each negative review card has a "✨ AI reply draft" `<details>` element. Click to expand.
71. [ ] You should see **"generating…"** with a pulsing dot for ~1–3 seconds.
72. [ ] Then a small green **"LLM"** badge appears next to the style label.
73. [ ] The reply text below should be **naturally written, in the same language as the review** (Thai review → Thai reply, English → English, Korean → Korean) — not template-stilted.
74. [ ] Click **📋 Copy reply**. Button turns green saying "✓ Copied!".
75. [ ] Click **✏️ Style: Formal →**. Style cycles to Warm, reply text refreshes after brief "generating…".
76. [ ] Click **✓ Mark resolved** on any review card. The card opacity drops, the KPI Trust score sub-label updates, the progress bar advances.

### 4E. Trust Score breakdown

77. [ ] Below crisis alerts, **Trust Score breakdown** card with 4 lever bars: Rating quality · Review volume · Local Guide ratio · Reviewer authority.
78. [ ] In the section header: **"How is this computed? →"** link. Click — opens `/about/trust-score` in a new tab.
79. [ ] On `/about/trust-score`, verify the page renders: formula tables, top-20 by Trust Score table from real data, "What it isn't" section. Close the tab.

### 4F. Quick wins checklist

80. [ ] **🎯 Quick wins this month** card with 3–4 numbered actions.
81. [ ] Each action has a green progress bar and real numbers (e.g. "187 / 200 reviews").
82. [ ] Click any linked action — should jump to relevant section.

### 4G. Beat competitor widget

83. [ ] **🥇 Beat your #1 competitor** card with a competitor name + Trust gap number.
84. [ ] Two paths shown: **Path 1 — rating** (with star delta needed) and **Path 2 — review volume** (with N reviews needed).
85. [ ] Footer link **"Get review templates ↓"** scrolls to Review request templates.

### 4H. Review request templates

86. [ ] **📨 Review request templates** section with 3-language toggle (EN / 한국어 / ไทย).
87. [ ] Click **한국어**. Templates re-render in Korean.
88. [ ] Each template card has the clinic's actual name substituted (e.g. "{name} → " becomes the real clinic name).
89. [ ] Click **📋 Copy** on any template. Paste to text editor — full template text.

### 4I. Lead inflow (empty state)

90. [ ] If clinic isn't a partner, **Lead inflow** section shows "No leads yet" with empty state.
91. [ ] Click **👁 Preview a sample lead**. A demo lead card appears below the empty state.
92. [ ] Click again — hidden.

### 4J. Email weekly digest signup

93. [ ] Toward the bottom, **📧 Email me when this changes** card (only on non-partner dashboards).
94. [ ] Enter `test@example.com` and click **Subscribe**.
95. [ ] Card should change to **"✓ Subscribed — first digest arrives next Monday."** in green.

### 4K. Upsell footer

96. [ ] Purple gradient **"Pick the services that take work off your plate"** section.
97. [ ] 6 service cards, each with a price tag: **Auto-reply ฿1,500/mo · Review campaigns ฿1,500/mo · Lead routing ฿50/lead or ฿5,000/mo · Featured from ฿5,000/mo · Korean/EN SEO ฿4,500/mo · Monthly call ฿2,000/mo**.
98. [ ] CTA "Talk to us — pick what fits →" links to /for-clinics#pilot.

### 4L. Sticky header

99. [ ] At the very top of the dashboard, sticky header with: clinic name, **👁 View as patient** button, **📊 Export PDF** button.
100. [ ] Click **👁 View as patient** — opens `/clinic/<id>` (the public page) in a new tab. Verify it shows the patient-facing view.

---

## Section 5 — Dashboard search landing

101. [ ] Open `/dashboard` (no clinic id).
102. [ ] You should see **"Find your clinic's free intelligence report"** with a SearchBar.
103. [ ] Type a partial clinic name. Autocomplete should suggest matching clinics.
104. [ ] Click any suggestion → goes to that clinic's dashboard.

---

## Section 6 — Mobile / phone-only checks

Do these on an actual phone (iPhone or Android):

105. [ ] Open `https://www.bangkokbotoxclinic.com` on phone Safari/Chrome.
106. [ ] Home page hero loads. Search bar works.
107. [ ] Top-10 rich cards readable. Scroll smooth.
108. [ ] Section header "#11 – #N runner-up rankings" visible.
109. [ ] Compact rows: rank + name + Trust score visible in one line, no horizontal scroll.
110. [ ] Tap a compact row → clinic detail page opens.
111. [ ] On clinic detail page, **Free report** banner readable, all sections scroll-visible.
112. [ ] Repeat on `https://www.bangkokbestclinic.com` (dental site).

---

## Section 7 — Dental-specific sanity (dental site only)

113. [ ] Open `https://www.bangkokbestclinic.com`. Hero: "Verify before you smile." or similar dental phrasing.
114. [ ] Top clinics should be **dental/implant/orthodontic clinics** (not aesthetic clinics with "clinic" in the name).
115. [ ] Check 5 random clinics — their `primary_type` or service mentions should be dental-related.
116. [ ] If you find a non-dental clinic in the dental site (e.g. botox-only clinic), screenshot and report. The dental filter has a strict whitelist.
117. [ ] Open `/best/implant` (if exists) — should list implant-focused clinics. If 404, that's OK (page not generated yet).

---

## Section 8 — Botox-specific sanity (botox site only)

118. [ ] Open `https://www.bangkokbotoxclinic.com`. Hero focuses on botox / aesthetic.
119. [ ] Top clinics should be **botox / filler / aesthetic clinics** — not dental.
120. [ ] Open `/best/clean-facility` — should list aesthetic clinics ranked by clean-facility topic.
121. [ ] Spot-check 5 random clinics — they should offer botox or related cosmetic services.

---

## Reporting

If anything fails (`[F]`), please record:
- **Step number** (e.g. step 23)
- **Browser + device** (Chrome Mac / Safari iPhone / etc.)
- **Screenshot** of the broken state
- **What you expected** vs what happened

Send the list to the manager. Group fixes will be deployed in batches.

---

**Estimated time to complete entire checklist:** ~30 min per site (admin tested once for both)

**Last updated:** 2026-05-17
