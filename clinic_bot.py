#!/usr/bin/env python3
"""
클리닉 텔레그램 봇 — 클리닉 원장 셀프 등록 + 매일 아침 브리핑.

등록 흐름:
  /start → 클리닉 이름 입력 → DB 매칭 → 확인 → 완료

매일 08:00 (ICT, UTC+7):
  Trust Score / 어제 리뷰 / 부정 리뷰 AI 답변 초안 / 경쟁사 알림
"""

import json
import logging
import os
import re
import time
import threading
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path
from difflib import SequenceMatcher

# ── 설정 ─────────────────────────────────────────────────────────
BOT_TOKEN = os.environ.get("CLINIC_BOT_TOKEN", "8798845574:AAH_vjYSdXGg7W0GCKxDvUYkk5FKWOxuE5g")
ROOT      = Path(__file__).parent
STATE_DIR = ROOT / "clinic_bot_state"
STATE_DIR.mkdir(exist_ok=True)
REG_FILE  = STATE_DIR / "registrations.json"   # {chat_id: clinic_id}
PENDING_FILE = STATE_DIR / "pending.json"       # {chat_id: "awaiting_name"}
DB_PATH   = ROOT / "web" / "data" / "master_db.json"

BRIEFING_HOUR_ICT = 8   # 08:00 ICT (UTC+7)
ICT = timezone(timedelta(hours=7))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


# ── 상태 파일 ─────────────────────────────────────────────────────

def load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default
    except Exception:
        return default

def save_json(path: Path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


# ── DB 로드 ───────────────────────────────────────────────────────

_db_cache = None
_db_mtime = 0

def load_db() -> list:
    global _db_cache, _db_mtime
    try:
        mtime = DB_PATH.stat().st_mtime
        if _db_cache is None or mtime != _db_mtime:
            data = json.loads(DB_PATH.read_text(encoding="utf-8"))
            _db_cache = data.get("clinics", [])
            _db_mtime = mtime
    except Exception as e:
        log.warning(f"DB 로드 실패: {e}")
        _db_cache = _db_cache or []
    return _db_cache


# ── 클리닉 검색 ───────────────────────────────────────────────────

def fuzzy_score(a: str, b: str) -> float:
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def search_clinics(query: str, top_n: int = 3) -> list:
    clinics = load_db()
    scored = []
    q = query.lower().strip()
    for c in clinics:
        name = c.get("name", "")
        score = fuzzy_score(q, name)
        # 이름에 쿼리 포함되면 보너스
        if q in name.lower():
            score = max(score, 0.7)
        if score > 0.3:
            scored.append((score, c))
    scored.sort(key=lambda x: -x[0])
    return [c for _, c in scored[:top_n]]


def get_clinic_by_id(clinic_id: str) -> dict | None:
    return next((c for c in load_db() if c.get("id") == clinic_id), None)


# ── 브리핑 생성 ───────────────────────────────────────────────────

def build_briefing(clinic: dict) -> str:
    name = clinic.get("name", "클리닉")
    trust = clinic.get("trust_score", 0)
    rating = clinic.get("rating") or clinic.get("avg_scraped_rating")
    review_count = clinic.get("scraped_review_count", 0)
    district = clinic.get("district") or clinic.get("city_label", "")

    # 부정 리뷰 찾기
    reviews = clinic.get("reviews_sample", [])
    neg_reviews = [r for r in reviews if r.get("rating") and r["rating"] <= 3 and r.get("text")]

    # 경쟁사: 같은 지역 클리닉들
    all_clinics = load_db()
    same_district = [
        c for c in all_clinics
        if c.get("id") != clinic.get("id")
        and (c.get("district") == district or c.get("city_label") == district)
        and c.get("trust_score", 0) > 0
    ]
    avg_trust = (
        sum(c["trust_score"] for c in same_district) / len(same_district)
        if same_district else 0
    )
    rank = sum(1 for c in same_district if c.get("trust_score", 0) > trust) + 1
    total_in_area = len(same_district) + 1

    lines = [
        f"🌅 <b>Good morning, {name}!</b>",
        f"",
        f"📊 <b>오늘 현황</b>",
        f"  Trust Score: <b>{trust}/100</b>",
    ]

    if rating:
        lines.append(f"  Google 평점: ⭐ {rating:.1f}")

    if district and same_district:
        lines.append(f"  {district} 내 순위: <b>#{rank}/{total_in_area}</b>")
        lines.append(f"  지역 평균 Trust: {avg_trust:.0f}/100")

    if neg_reviews:
        lines.append(f"")
        lines.append(f"⚠️ <b>답변이 필요한 리뷰 {len(neg_reviews)}건</b>")
        for r in neg_reviews[:2]:
            text = r["text"][:120].replace("<", "&lt;").replace(">", "&gt;")
            stars = "⭐" * int(r["rating"])
            lines.append(f"")
            lines.append(f"  {stars} \"{text}...\"")
            lines.append(f"")
            lines.append(f"  💬 <i>AI 답변 초안:</i>")
            lines.append(f"  <i>{generate_reply_draft(r, name)}</i>")
    else:
        lines.append(f"")
        lines.append(f"✅ 미답변 부정 리뷰 없음")

    clinic_id = clinic.get("id", "")
    lines += [
        "",
        f"🔗 <a href='https://www.bangkokbotoxclinic.com/dashboard/{clinic_id}'>내 대시보드 보기 →</a>",
    ]

    return "\n".join(lines)


def generate_reply_draft(review: dict, clinic_name: str) -> str:
    text = review.get("text", "")
    rating = review.get("rating", 1)
    reviewer = review.get("reviewer", "고객")

    if rating <= 2:
        return (
            f"Dear {reviewer}, thank you for your honest feedback. "
            f"We sincerely apologize for your experience at {clinic_name}. "
            f"Please contact us directly so we can make this right. "
            f"Your satisfaction is our priority."
        )
    else:
        return (
            f"Dear {reviewer}, thank you for taking the time to share your experience. "
            f"We're sorry it wasn't perfect. We'd love to hear more — "
            f"please reach out to us directly and we'll do our best to improve."
        )


# ── Telegram API ──────────────────────────────────────────────────

def tg_request(method: str, **kwargs) -> dict:
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/{method}"
    data = urllib.parse.urlencode(kwargs).encode()
    try:
        resp = urllib.request.urlopen(
            urllib.request.Request(url, data=data), timeout=10
        )
        return json.loads(resp.read())
    except Exception as e:
        log.warning(f"TG {method} 실패: {e}")
        return {}


def send(chat_id: str, text: str, **kwargs):
    tg_request("sendMessage", chat_id=chat_id, text=text,
                parse_mode="HTML", disable_web_page_preview=True, **kwargs)


def get_updates(offset: int = 0) -> list:
    r = tg_request("getUpdates", offset=offset, timeout=5)
    return r.get("result", [])


# ── 명령 처리 ─────────────────────────────────────────────────────

HELP_TEXT = (
    "👋 <b>Bangkok Clinic Bot</b>\n\n"
    "클리닉 평판을 매일 아침 텔레그램으로 받아보세요.\n\n"
    "/start — 클리닉 등록\n"
    "/report — 지금 바로 브리핑 보기\n"
    "/status — 내 클리닉 현황\n"
    "/unregister — 등록 해제\n"
    "/help — 도움말"
)


def handle_message(chat_id: str, text: str):
    regs    = load_json(REG_FILE, {})
    pending = load_json(PENDING_FILE, {})
    text = text.strip()

    # ── 등록 대기 중 (이름 입력 단계) ────────────────────────────
    if pending.get(chat_id) == "awaiting_name":
        pending.pop(chat_id)
        save_json(PENDING_FILE, pending)

        results = search_clinics(text)
        if not results:
            send(chat_id,
                 f"❌ '<b>{text}</b>' 로 클리닉을 찾지 못했어요.\n"
                 f"다시 시도: /start")
            return

        if len(results) == 1:
            c = results[0]
            _confirm_registration(chat_id, c, regs)
        else:
            # 여러 개 나오면 선택지 제시
            lines = ["🔍 여러 클리닉이 검색됐어요. 번호를 입력해주세요:\n"]
            choices = {}
            for i, c in enumerate(results, 1):
                lines.append(f"  <b>{i}.</b> {c['name']} ({c.get('district') or c.get('city_label','')})")
                choices[str(i)] = c
            lines.append("\n번호 외 다른 입력이면 처음부터 다시 시작해요.")
            send(chat_id, "\n".join(lines))
            pending[chat_id] = {"state": "awaiting_choice", "choices": {
                k: v.get("id") for k, v in choices.items()
            }}
            save_json(PENDING_FILE, pending)
        return

    # ── 선택 대기 중 ──────────────────────────────────────────────
    if isinstance(pending.get(chat_id), dict) and pending[chat_id].get("state") == "awaiting_choice":
        choices = pending[chat_id]["choices"]
        if text in choices:
            clinic_id = choices[text]
            c = get_clinic_by_id(clinic_id)
            pending.pop(chat_id)
            save_json(PENDING_FILE, pending)
            if c:
                _confirm_registration(chat_id, c, regs)
            else:
                send(chat_id, "❌ 오류가 발생했어요. /start 로 다시 시도해주세요.")
        else:
            pending.pop(chat_id)
            save_json(PENDING_FILE, pending)
            send(chat_id, "취소됐어요. /start 로 다시 시작하세요.")
        return

    # ── 일반 명령 ─────────────────────────────────────────────────
    cmd, _, _ = text.partition(" ")
    cmd = cmd.lower().lstrip("/").split("@")[0]

    if cmd == "start":
        if chat_id in regs:
            c = get_clinic_by_id(regs[chat_id])
            cname = c["name"] if c else "알 수 없음"
            send(chat_id,
                 f"✅ 이미 <b>{cname}</b> 으로 등록돼 있어요.\n"
                 f"/report — 지금 브리핑\n"
                 f"/unregister — 등록 해제")
        else:
            pending[chat_id] = "awaiting_name"
            save_json(PENDING_FILE, pending)
            send(chat_id,
                 "👋 <b>Bangkok Clinic Bot</b> 에 오신 것을 환영해요!\n\n"
                 "클리닉 이름을 입력해주세요 (예: Navella Wellness):")

    elif cmd == "report":
        if chat_id not in regs:
            send(chat_id, "먼저 등록해주세요: /start")
            return
        c = get_clinic_by_id(regs[chat_id])
        if not c:
            send(chat_id, "❌ 클리닉 데이터를 찾지 못했어요.")
            return
        send(chat_id, build_briefing(c))

    elif cmd == "status":
        if chat_id not in regs:
            send(chat_id, "먼저 등록해주세요: /start")
            return
        c = get_clinic_by_id(regs[chat_id])
        if not c:
            send(chat_id, "❌ 데이터 없음")
            return
        trust = c.get("trust_score", 0)
        rating = c.get("rating") or c.get("avg_scraped_rating", 0)
        send(chat_id,
             f"📊 <b>{c['name']}</b>\n"
             f"Trust Score: <b>{trust}/100</b>\n"
             f"Google 평점: ⭐ {rating:.1f}\n"
             f"리뷰 수: {c.get('scraped_review_count', 0):,}개")

    elif cmd == "unregister":
        if chat_id in regs:
            regs.pop(chat_id)
            save_json(REG_FILE, regs)
            send(chat_id, "✅ 등록 해제됐어요. 다시 등록: /start")
        else:
            send(chat_id, "등록된 클리닉이 없어요.")

    elif cmd in ("help", "h"):
        send(chat_id, HELP_TEXT)

    else:
        send(chat_id, f"❓ 모르는 명령어예요.\n{HELP_TEXT}")


def _confirm_registration(chat_id: str, c: dict, regs: dict):
    regs[chat_id] = c["id"]
    save_json(REG_FILE, regs)
    trust = c.get("trust_score", 0)
    rating = c.get("rating") or c.get("avg_scraped_rating", 0)
    send(chat_id,
         f"🎉 <b>{c['name']}</b> 등록 완료!\n\n"
         f"Trust Score: <b>{trust}/100</b>\n"
         f"Google 평점: ⭐ {rating:.1f if rating else '—'}\n\n"
         f"매일 오전 08:00 에 브리핑을 보내드려요.\n"
         f"지금 바로 보려면: /report")


# ── 매일 아침 브리핑 ──────────────────────────────────────────────

def daily_briefing_loop():
    sent_today: set[str] = set()
    while True:
        now = datetime.now(ICT)
        date_key = now.strftime("%Y-%m-%d")

        if now.hour == BRIEFING_HOUR_ICT and date_key not in sent_today:
            regs = load_json(REG_FILE, {})
            log.info(f"브리핑 발송 시작: {len(regs)}개 클리닉")
            for chat_id, clinic_id in regs.items():
                c = get_clinic_by_id(clinic_id)
                if c:
                    try:
                        send(chat_id, build_briefing(c))
                        time.sleep(0.05)  # rate limit 방지
                    except Exception as e:
                        log.warning(f"브리핑 실패 {chat_id}: {e}")
            sent_today.add(date_key)
            # 날짜 바뀌면 초기화
            if len(sent_today) > 2:
                sent_today = {date_key}
            log.info("브리핑 완료")

        time.sleep(60)  # 1분마다 체크


# ── 폴링 루프 ─────────────────────────────────────────────────────

def polling_loop():
    last_id = 0
    log.info("폴링 시작")
    while True:
        try:
            updates = get_updates(offset=last_id + 1)
            for upd in updates:
                last_id = upd["update_id"]
                msg = upd.get("message", {})
                text = msg.get("text", "").strip()
                chat_id = str(msg.get("chat", {}).get("id", ""))
                if text and chat_id:
                    handle_message(chat_id, text)
        except Exception as e:
            log.warning(f"폴링 오류: {e}")
        time.sleep(2)


# ── 메인 ─────────────────────────────────────────────────────────

def main():
    if BOT_TOKEN == "REPLACE_WITH_TOKEN":
        print("❌ CLINIC_BOT_TOKEN 환경변수를 설정해주세요.")
        print("   export CLINIC_BOT_TOKEN=your_token_here")
        return

    log.info("클리닉 봇 시작")

    threads = [
        threading.Thread(target=polling_loop, daemon=True),
        threading.Thread(target=daily_briefing_loop, daemon=True),
    ]
    for t in threads:
        t.start()

    try:
        while True:
            time.sleep(60)
    except KeyboardInterrupt:
        log.info("봇 종료")


if __name__ == "__main__":
    main()
