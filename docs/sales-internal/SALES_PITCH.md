# Sales Pitch Templates — Bangkok Clinic Outreach

Outreach to Thai clinics. **Use Thai for LINE/SMS, English as fallback for clinic websites.**

Variables to fill in per clinic:
- `{CLINIC_NAME}` — clinic name
- `{DISTRICT}` — Pathum Wan / Watthana / etc.
- `{RANK}` — district rank from CSV
- `{TRUST}` — Trust Score (e.g., 87)
- `{REVIEWS}` — total review count
- `{DASHBOARD_URL}` — full URL to their dashboard preview
- `{NEG_COUNT}` — unanswered negative review count
- `{HOOK}` — pitch_hook field from CSV

---

## 1. First-contact LINE message (Thai)

**Subject (if email/LINE official account):** สวัสดีค่ะ — เกี่ยวกับคลินิก {CLINIC_NAME}

```
สวัสดีค่ะ ทีมงาน {CLINIC_NAME} 🙏

เราเป็นทีม Bangkok Best Clinic — ไดเรกทอรีคลินิกอิสระที่จัดอันดับคลินิกในกรุงเทพฯ จากรีวิว Google จริง

คลินิกของท่านได้รับ Trust Score {TRUST} จากการวิเคราะห์ {REVIEWS} รีวิว — อันดับ #{RANK} ในย่าน {DISTRICT}

ที่ติดต่อมาเพราะเรามีเครื่องมือสำหรับคลินิกท่านโดยเฉพาะ:

🚨 แจ้งเตือนรีวิวลบทันที (พร้อม draft ตอบกลับ AI)
📥 รับลีดจากเว็บไซต์ส่งตรงเข้า LINE
📊 Dashboard เปรียบเทียบกับคู่แข่งในย่านเดียวกัน

ทดลองใช้ฟรี 30 วัน ไม่ต้องใช้บัตรเครดิต ไม่มีค่าธรรมเนียมล่วงหน้า
จ่ายเพียง ฿200 ต่อลีดที่ปิดได้สำเร็จ (หรือ ฿8,000/เดือนไม่จำกัด)

ลองดู Dashboard ของคลินิกท่านที่นี่ค่ะ:
{DASHBOARD_URL}

สนใจคุยต่อไหมคะ?

ขอบคุณค่ะ
```

---

## 2. First-contact email/website form (English)

**Subject:** {CLINIC_NAME} — your Trust Score & lead routing options

```
Hi {CLINIC_NAME} team,

We're Bangkok Best Clinic — an independent directory ranking Bangkok clinics from real Google reviews.

Your clinic earned a Trust Score of {TRUST} from {REVIEWS} reviews — ranked #{RANK} in {DISTRICT}.

We built tools specifically for clinics like yours:

🚨 Real-time alerts for new negative reviews (with AI-drafted replies in your tone)
📥 Lead capture form on your /clinic page → routes directly to your LINE
📊 Dashboard with district-level competitor analysis

We're offering 30-day free pilot, no credit card, no upfront fees.
You only pay ฿200 per closed lead (or ฿8,000/month flat for unlimited).

Preview your dashboard here:
{DASHBOARD_URL}

Interested in a 15-min call this week?

Best,
{YOUR_NAME}
{YOUR_EMAIL}
```

---

## 3. Follow-up #1 (3 days no reply) — Thai

```
สวัสดีค่ะอีกครั้งค่ะ 🙏

ส่งข้อความก่อนหน้าไปแล้วเรื่อง Trust Score และเครื่องมือสำหรับคลินิก {CLINIC_NAME}

ไม่อยากรบกวนค่ะ แค่อยากบอกสั้นๆ:

{HOOK}

ถ้าสะดวกอยากดู Dashboard 30 วินาที ลิงก์อยู่ที่นี่ค่ะ:
{DASHBOARD_URL}

ไม่สนใจก็ไม่เป็นไรค่ะ ขอบคุณที่อ่านนะคะ 🙏
```

---

## 4. Follow-up #2 (Negative review hook) — Thai

**Use this version if `unanswered_neg_reviews ≥ 3`:**

```
สวัสดีค่ะ {CLINIC_NAME} 🙏

สังเกตว่าใน Google รีวิวมี {NEG_COUNT} รีวิวลบที่ยังไม่มีการตอบกลับ

จากประสบการณ์ — รีวิวลบที่ตอบดีจะดึงให้ score กลับขึ้นได้ภายใน 2-3 เดือน
ตอนนี้เรามี AI ที่ draft คำตอบให้พร้อมในระบบ Dashboard

ลองเข้าไปดูได้ค่ะ — ตัวอย่างคำตอบรอท่านอยู่:
{DASHBOARD_URL}

ฟรี 30 วัน ไม่ต้องลงทะเบียน แค่ดู
```

---

## 5. Objection handlers

### "เราใช้ Facebook ads อยู่แล้ว"
> Facebook CAC เฉลี่ยในกรุงเทพฯ คือ ฿2,800 ต่อ lead เราคิด ฿200 ต่อ lead — และเฉพาะที่ปิดได้จริง คุณรันคู่กันก็ได้ค่ะ

### "เราไม่มีเวลามาดู dashboard"
> Dashboard ไม่ต้องเปิดบ่อยค่ะ alerts ส่งตรงเข้า LINE — เปิดเฉพาะตอนต้องการดู ROI หรือคู่แข่ง

### "ทำไมเราต้องจ่ายให้คุณ?"
> ไม่จ่ายล่วงหน้าค่ะ จ่ายตอนปิด lead เท่านั้น — เราแบกความเสี่ยงเองว่า lead จะปิดได้ ถ้าไม่ปิด คุณไม่จ่าย

### "เรามีระบบของเราเองอยู่แล้ว"
> ไม่ต้องเปลี่ยนระบบค่ะ เราแค่เพิ่มช่องทางใหม่ — directory listing + lead capture จากเว็บไซต์เรา ส่งเข้าระบบที่ท่านมีอยู่ก็ได้

---

## 6. After-meeting / signup CTA — Thai

```
ขอบคุณค่ะ! 🙏

สรุปข้อตกลง:
✓ Trial 30 วัน — ฟรี
✓ ลีดส่งเข้า LINE: {LINE_USER_ID}
✓ Email สำหรับ summary: {EMAIL}
✓ จ่าย ฿200/lead เฉพาะที่ปิดได้สำเร็จ
✓ ยกเลิกได้ตลอดเวลา ไม่มีค่าปรับ

ลิงก์ Dashboard ของท่านพร้อมใช้:
{DASHBOARD_URL}

มีคำถามอะไรก็ส่งมาที่ LINE ได้เลยค่ะ 🙏
```

---

## Sequencing playbook

**Day 0:** First contact (template #1 or #2)
**Day 3:** Follow-up #1 (template #3) — 안 답하면 stop
**Day 7:** Follow-up #2 (template #4 — only if negative review hook)
**Day 30:** Re-engage with new social proof ("우리 파트너 X명 됨")

Conversion benchmark:
- LINE official account / direct LINE: **15-25%** reply rate
- Email form: **3-8%** reply rate
- Cold phone: **30-40%** reach, **10-15%** conversion

Target: 100 outreach → 15 replies → 5 meetings → 2 signed partners
