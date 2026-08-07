"""
Apify contact-info-scraper 결과를 master_db.json 에 병합.

scripts/apify_to_master_db.py 는 Google Places 결과 전용이라 place_id 로 매칭한다.
contact scraper 출력에는 place_id 가 없고 크롤한 URL 뿐이라 그 경로로는 못 들어온다.
그래서 website 호스트로 매칭하는 별도 경로가 필요하다.

매칭 규칙: 결과의 url/domain 에서 호스트를 뽑아 www. 를 떼고,
master_db 의 supplier.website 호스트와 대조한다. 한 호스트에 여러 supplier 가
걸리면(같은 그룹사가 사이트 하나를 공유) 전부에 같은 연락처를 넣는다.

이메일 선별:
  - noreply/no-reply/postmaster 등 발신전용 주소 제외
  - 이미지·폰트 파일명이 이메일로 오인된 것 제외
  - 도메인이 일치하는 주소를 우선 (info@theircompany.com > someone@gmail.com)

실행:
  python scripts/merge_contact_emails.py <내려받은_json_파일_또는_폴더> [...]
  python scripts/merge_contact_emails.py --dry-run data/apify_raw/2026-08-10/
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MASTER_DB = ROOT / "data" / "master_db.json"

JUNK_LOCAL = (
    "noreply", "no-reply", "donotreply", "do-not-reply", "postmaster",
    "mailer-daemon", "bounce", "example", "your-email", "youremail",
    "email", "sentry", "wixpress",
)
JUNK_DOMAIN = ("example.com", "sentry.io", "wix.com", "godaddy.com", "domain.com")
# 이메일 정규식에 파일명이 걸리는 경우가 흔하다: logo@2x.png, icon@3x.webp
FILE_EXT = re.compile(r"\.(png|jpe?g|gif|svg|webp|woff2?|ttf|css|js)$", re.I)


def host_of(url: str) -> str:
    m = re.match(r"https?://([^/]+)", url or "")
    h = m.group(1).lower() if m else (url or "").lower()
    return h[4:] if h.startswith("www.") else h


def is_real_email(addr: str) -> bool:
    addr = (addr or "").strip().lower()
    if not addr or addr.count("@") != 1 or FILE_EXT.search(addr):
        return False
    local, _, domain = addr.partition("@")
    if "." not in domain or len(domain) < 4:
        return False
    if any(j in local for j in JUNK_LOCAL) or domain in JUNK_DOMAIN:
        return False
    return True


def load_records(paths: list[str]) -> list[dict]:
    files: list[Path] = []
    for p in paths:
        path = Path(p)
        if path.is_dir():
            files.extend(sorted(path.rglob("*.json")))
        elif path.is_file():
            files.append(path)
        else:
            print(f"  ! 경로 없음: {p}")
    records: list[dict] = []
    for f in files:
        try:
            data = json.loads(f.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError) as e:
            print(f"  ! 파싱 실패 {f.name}: {e}")
            continue
        items = data if isinstance(data, list) else data.get("items", [])
        # place 스크랩 결과가 섞여 들어오면 조용히 무시한다 — 그건
        # apify_to_master_db.py 담당이고, 여기서 처리하면 이중 병합이 된다.
        contact_items = [
            r for r in items
            if isinstance(r, dict) and ("emails" in r or "phones" in r or "linkedIns" in r)
        ]
        if contact_items:
            print(f"  + {f.name}: {len(contact_items)}건")
            records.extend(contact_items)
        else:
            print(f"  - {f.name}: contact 형식 아님 (건너뜀)")
    return records


def main() -> int:
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry_run = "--dry-run" in sys.argv
    if not args:
        print(__doc__)
        return 1

    print("입력 파일 읽는 중…")
    records = load_records(args)
    if not records:
        print("병합할 contact 레코드가 없습니다.")
        return 1

    # 호스트 → 연락처
    by_host: dict[str, dict] = {}
    for r in records:
        host = host_of(r.get("url") or r.get("domain") or "")
        if not host:
            continue
        emails = [e for e in (r.get("emails") or []) if is_real_email(e)]
        # 자사 도메인 주소를 앞으로 — 대표 연락처일 가능성이 높다.
        emails.sort(key=lambda e: (host.split(".")[0] not in e.split("@")[1], e))
        slot = by_host.setdefault(host, {"emails": [], "linkedin": None})
        for e in emails:
            if e not in slot["emails"]:
                slot["emails"].append(e)
        if not slot["linkedin"]:
            lis = r.get("linkedIns") or []
            slot["linkedin"] = lis[0] if lis else None

    by_host = {h: v for h, v in by_host.items() if v["emails"] or v["linkedin"]}
    print(f"\n연락처 확보 호스트: {len(by_host):,}")

    db = json.loads(MASTER_DB.read_text(encoding="utf-8"))
    suppliers = db["suppliers"]

    matched = 0
    email_added = 0
    for s in suppliers:
        w = s.get("website")
        if not w:
            continue
        info = by_host.get(host_of(w))
        if not info:
            continue
        matched += 1
        if info["emails"] and not s.get("email"):
            s["email"] = info["emails"][0]
            if len(info["emails"]) > 1:
                s["emails_all"] = info["emails"][:5]
            email_added += 1
        if info["linkedin"] and not s.get("linkedin"):
            s["linkedin"] = info["linkedin"]

    total_email = sum(1 for s in suppliers if s.get("email"))
    print(f"매칭된 supplier   : {matched:,}")
    print(f"이메일 신규 부여  : {email_added:,}")
    print(f"이메일 보유 총계  : {total_email:,} / {len(suppliers):,}")

    if dry_run:
        print("\n--dry-run — master_db.json 은 저장하지 않았습니다.")
        return 0

    db["with_email"] = total_email
    MASTER_DB.write_text(
        json.dumps(db, ensure_ascii=False, separators=(",", ":")), encoding="utf-8"
    )
    print(f"\n저장 완료: {MASTER_DB}")
    print("다음: npm run build → 배포 → git commit (커밋 빠뜨리면 배포에 안 들어갑니다)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
