"""clinic-enrichment 의 인스타 계정을 클리닉 id → 핸들 표로 뽑는다 (2026-10-31).

견적 경매에서 클리닉에 인스타 DM 을 보낼 때 쓴다. master_db 의 website_instagram 은
"웹사이트 칸에 인스타 링크를 넣은 곳"만 채워져 보톡스 829곳 중 0곳이었다.
enrichment 는 클리닉 웹사이트에서 찾은 소셜 링크라 훨씬 많다.

출력: web/data/clinic_instagram.json  {clinic_id: handle}
master_db 에 있는 클리닉만 남긴다. 계정이 여러 개면 첫 번째.
"""

import json
import re
from pathlib import Path

WEB = Path(__file__).resolve().parent.parent
SRC = WEB.parent / "clinic-enrichment" / "data" / "clinic_enrichment.json"
DB = WEB / "data" / "master_db.json"
OUT = WEB / "data" / "clinic_instagram.json"

HANDLE = re.compile(r"^[A-Za-z0-9._]{1,30}$")
NOT_ACCOUNTS = {"p", "reel", "reels", "explore", "accounts", "stories", "tv"}


def main() -> None:
    enrich = json.loads(SRC.read_text(encoding="utf-8"))
    ids = {c["id"] for c in json.loads(DB.read_text(encoding="utf-8"))["clinics"]}
    out = {}
    for cid, v in enrich.items():
        if cid not in ids:
            continue
        social = v.get("social") or {}
        for h in social.get("instagram") or []:
            h = str(h).strip().lstrip("@").strip("/")
            if HANDLE.match(h) and h.lower() not in NOT_ACCOUNTS:
                out[cid] = h
                break
    OUT.write_text(json.dumps(dict(sorted(out.items())), ensure_ascii=False, indent=0) + "\n", encoding="utf-8")
    print(f"{len(out)} clinics with Instagram → {OUT.relative_to(WEB)}")


if __name__ == "__main__":
    main()
