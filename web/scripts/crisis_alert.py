"""master_db.json 재빌드 후 호출 — 파트너 클리닉 신규 부정 리뷰 detect → LINE/이메일 push.

Flow:
  1. master_db.json 로드
  2. data/.crisis_state.json 로드 (이전에 본 review hash set)
  3. clinic_partners.json 의 partner 마다:
     - sample_reviews_negative 에서 rating ≤ 2 인 리뷰만 추출
     - hash(text+rating+author) 가 state 에 없으면 → 신규 alert
     - LINE push (partner.line_user_id + line_bot_token or DEFAULT_LINE_TOKEN)
     - Email (partner.contact_email or fallback)
     - AI 답변 초안 첨부 (Python 측에서 replyDrafts.ts 와 동일 룰 재현)
  4. 새 hash 들 state 에 저장

env:
  RESEND_API_KEY
  RESEND_FROM_EMAIL
  LINE_DEFAULT_BOT_TOKEN
  FALLBACK_LEAD_EMAIL
"""
from __future__ import annotations

import hashlib
import json
import logging
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WEB = ROOT / "web"
MASTER_DB = WEB / "data" / "master_db.json"
PARTNERS_JSON = WEB / "data" / "clinic_partners.json"
STATE_FILE = WEB / "data" / ".crisis_state.json"

RESEND_KEY = os.environ.get("RESEND_API_KEY")
RESEND_FROM = os.environ.get("RESEND_FROM_EMAIL", "Bangkok Botox Clinic <leads@bangkokbotoxclinic.com>")
LINE_DEFAULT_TOKEN = os.environ.get("LINE_DEFAULT_BOT_TOKEN")
FALLBACK_EMAIL = os.environ.get("FALLBACK_LEAD_EMAIL", "chillanel22@gmail.com")

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

# replyDrafts.ts 와 동일 keyword → category 매핑.
REPLY_RULES = [
    (["wait", "waiting", "slow", "delay", "long time", "기다", "느리", "오래", "ช้า", "รอ"], "wait_time"),
    (["rude", "unprofessional", "attitude", "ignored", "staff", "service", "불친", "무례", "친절", "หยาบ", "พนักงาน"], "service"),
    (["expensive", "overcharg", "price", "cost", "money", "extra fee", "비싸", "가격", "추가요금", "แพง", "ราคา"], "price"),
    (["didn't work", "no effect", "weak", "no result", "ineffective", "효과 없", "안 좋", "ไม่ได้ผล", "ไม่ดี"], "result"),
    (["english", "korean", "thai only", "communicate", "language", "barrier", "영어", "한국어", "소통", "สื่อสาร", "ภาษา"], "communication"),
]

REPLY_TEMPLATES = {
    "wait_time": (
        "Dear {r}, we sincerely apologize for the long wait you experienced at {c}. "
        "We've reviewed our appointment scheduling and added an additional consultation room during peak hours this month. "
        "Please contact us directly on LINE — we'd like to offer you a priority booking on your next visit so we can demonstrate the improvement."
    ),
    "service": (
        "Dear {r}, thank you for your honest feedback — this is not the experience we want any patient to have at {c}. "
        "Our manager has been notified and the team member involved is being retrained. "
        "We'd appreciate the chance to make this right. Please DM us on LINE so our manager can speak with you personally."
    ),
    "price": (
        "Hi {r}, thank you for your feedback about pricing at {c}. "
        "We always confirm full pricing in writing before any procedure to avoid surprises — if this didn't happen for your visit, that's a process gap on our side. "
        "Please contact us so we can review your specific case and offer a credit toward your next visit."
    ),
    "result": (
        "Dear {r}, we're sorry the result didn't meet your expectations at {c}. "
        "Most reputable Bangkok clinics offer a free touch-up within 14 days for botox / filler / HIFU procedures, and we honor this too. "
        "Please come back so our doctor can assess and provide a complimentary correction. DM us on LINE to schedule."
    ),
    "communication": (
        "Dear {r}, we apologize for the communication difficulty during your visit to {c}. "
        "We have English- and Korean-speaking staff available — we'll ensure one of them is your primary contact for your next appointment. "
        "Please book via LINE and mention \"English (or Korean) speaker requested\" so we route you correctly."
    ),
    "generic": (
        "Dear {r}, thank you for your honest review of {c}. "
        "We take every piece of feedback seriously — we'd like to understand the specifics of your experience so we can improve. "
        "Please reach out to us directly on LINE so a senior team member can address your concerns personally."
    ),
}


def classify(text: str) -> str:
    low = text.lower()
    for keywords, category in REPLY_RULES:
        if any(k in low for k in keywords):
            return category
    return "generic"


def draft_reply(text: str, clinic_name: str, reviewer: str) -> tuple[str, str]:
    cat = classify(text)
    return cat, REPLY_TEMPLATES[cat].format(c=clinic_name, r=reviewer or "Valued patient")


def review_hash(text: str, rating: int, author: str) -> str:
    h = hashlib.sha256(f"{rating}|{author}|{text}".encode("utf-8")).hexdigest()
    return h[:16]


def load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return default
    except Exception as e:
        log.error(f"load {path} failed: {e}")
        return default


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    os.replace(tmp, path)


def http_post(url: str, headers: dict, body: dict) -> tuple[int, str]:
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json", **headers}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status, r.read().decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return 0, str(e)


def send_line(token: str | None, user_id: str, text: str) -> bool:
    tok = token or LINE_DEFAULT_TOKEN
    if not tok:
        log.info("[line] no token — skipping")
        return False
    body = {"to": user_id, "messages": [{"type": "text", "text": text[:4900]}]}
    status, resp = http_post("https://api.line.me/v2/bot/message/push", {"Authorization": f"Bearer {tok}"}, body)
    ok = status == 200
    if not ok:
        log.error(f"[line] err {status}: {resp[:200]}")
    return ok


def send_email(to_addr: str, subject: str, html: str, text: str) -> bool:
    if not RESEND_KEY:
        log.info("[email] no RESEND_API_KEY — skipping")
        return False
    body = {"from": RESEND_FROM, "to": to_addr, "subject": subject, "html": html, "text": text}
    status, resp = http_post("https://api.resend.com/emails", {"Authorization": f"Bearer {RESEND_KEY}"}, body)
    ok = status in (200, 201, 202)
    if not ok:
        log.error(f"[email] err {status}: {resp[:200]}")
    return ok


def build_alert_text(clinic_name: str, rating: int, author: str, text: str, draft: str, category: str) -> str:
    stars = "★" * rating + "☆" * (5 - rating)
    return (
        f"🚨 NEW {rating}★ REVIEW — {clinic_name}\n"
        f"━━━━━━━━━━━━━━━━━━━━\n"
        f"By {author or 'Google reviewer'}  {stars}\n"
        f"Category: {category}\n\n"
        f"\"{text[:400]}{'…' if len(text) > 400 else ''}\"\n\n"
        f"━━━ AI REPLY DRAFT ━━━\n"
        f"{draft}\n\n"
        f"📋 Copy → paste to Google review reply within 48h to protect your Trust Score."
    )


def build_alert_html(clinic_name: str, rating: int, author: str, text: str, draft: str, category: str) -> str:
    stars = "★" * rating + "☆" * (5 - rating)
    return f"""<!doctype html><html><body style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#0a0a0a;">
<div style="background:#dc2626;color:white;padding:16px 20px;border-radius:12px 12px 0 0;">
  <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;opacity:0.9;">🚨 Crisis alert — new {rating}-star review</div>
  <div style="font-size:20px;font-weight:800;margin-top:4px;">{clinic_name}</div>
</div>
<div style="background:white;border:1px solid #fecaca;border-top:none;border-radius:0 0 12px 12px;padding:20px;">
  <div style="font-size:14px;color:#737373;margin-bottom:8px;">
    <strong>{author or 'Google reviewer'}</strong> · <span style="color:#ca8a04">{stars}</span> · category: <em>{category}</em>
  </div>
  <blockquote style="margin:12px 0;padding:12px 16px;background:#fef2f2;border-left:4px solid #dc2626;font-style:italic;">
    {text[:500].replace('<','&lt;')}{'…' if len(text) > 500 else ''}
  </blockquote>
  <div style="margin-top:20px;">
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#7c3aed;font-weight:bold;margin-bottom:8px;">✨ AI reply draft</div>
    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:14px;font-size:14px;line-height:1.6;">
      {draft.replace('<','&lt;')}
    </div>
  </div>
  <div style="margin-top:16px;padding:12px;background:#fef3c7;border-radius:8px;font-size:13px;color:#92400e;">
    ⚡ Copy this reply → paste to Google review within 48h to protect your Trust Score.
  </div>
</div></body></html>"""


def main() -> int:
    if not MASTER_DB.exists():
        log.error(f"master_db.json 없음: {MASTER_DB}")
        return 1

    db = load_json(MASTER_DB, {})
    partners_data = load_json(PARTNERS_JSON, {"partners": []})
    state = load_json(STATE_FILE, {"seen": {}})

    clinics_by_id = {c["id"]: c for c in db.get("clinics", [])}
    partners = partners_data.get("partners", [])

    if not partners:
        log.info("등록된 partner 없음 — 종료")
        return 0

    total_new = 0
    for partner in partners:
        clinic_id = partner.get("clinic_id")
        clinic = clinics_by_id.get(clinic_id)
        if not clinic:
            log.warning(f"partner clinic_id={clinic_id} master_db 에 없음")
            continue

        negatives = clinic.get("sample_reviews_negative", []) or []
        critical = [r for r in negatives if r.get("rating", 5) <= 2]

        seen_for_clinic = set(state["seen"].get(clinic_id, []))
        new_alerts = []
        for rev in critical:
            h = review_hash(rev.get("text", ""), rev.get("rating", 0), rev.get("author", ""))
            if h in seen_for_clinic:
                continue
            new_alerts.append((rev, h))

        if not new_alerts:
            log.info(f"[{clinic.get('name','?')[:30]}] 신규 부정 리뷰 없음")
            continue

        log.info(f"[{clinic.get('name','?')[:30]}] 신규 부정 리뷰 {len(new_alerts)}건 → 알림 전송")

        for rev, h in new_alerts:
            cat, draft = draft_reply(rev.get("text", ""), clinic.get("name", ""), rev.get("author", ""))
            text_body = build_alert_text(clinic.get("name", ""), rev.get("rating", 0), rev.get("author", ""), rev.get("text", ""), draft, cat)
            html_body = build_alert_html(clinic.get("name", ""), rev.get("rating", 0), rev.get("author", ""), rev.get("text", ""), draft, cat)

            email_to = partner.get("contact_email") or FALLBACK_EMAIL
            subject = f"🚨 New {rev.get('rating',0)}★ review — {clinic.get('name','')[:50]}"
            send_email(email_to, subject, html_body, text_body)

            if partner.get("line_user_id"):
                send_line(partner.get("line_bot_token"), partner["line_user_id"], text_body)

            seen_for_clinic.add(h)
            total_new += 1

        state["seen"][clinic_id] = list(seen_for_clinic)[-500:]  # 최근 500개만 유지

    state["last_run"] = __import__("datetime").datetime.now().isoformat()
    save_json(STATE_FILE, state)
    log.info(f"완료 — 신규 alert {total_new}건 전송")
    return 0


if __name__ == "__main__":
    sys.exit(main())
