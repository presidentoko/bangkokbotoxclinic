"""로그에서 VPN 출구 서버별 성적을 복원해 nordvpn_runner 의 점수 파일에 병합한다.

왜 필요한가 (2026-08-26):
  pick_server 가 성적을 참고하도록 바꿨는데(ecd4ee4), 점수는 스크래퍼가
  실행 중 모으는 것이라 재시작 직후엔 비어 있다. 게다가 표본 3회 미만은
  "미검증"으로 중간 배치하는 안전장치 때문에, 초기에는 112개 서버 중 111개가
  미검증으로 분류돼 정렬이 사실상 아무 일도 하지 않았다 — 안전장치가 기능을
  무력화한 셈이다.

  그런데 그 데이터는 이미 로그에 있다. 로그에는 "VPN rotated idx=N → host"
  와 그 뒤의 워커별 성공/차단이 남아 있어, 어느 출구에서 무엇이 일어났는지
  복원할 수 있다. 실측: 08-23 이후 로그만으로 서버 572개, 검증된(3회+) 213개,
  성공률 50% 이상 69개를 얻는다.

사용:
  python scripts/seed_vpn_scores.py            # 병합
  python scripts/seed_vpn_scores.py --dry-run  # 계산만
"""
import collections
import json
import os
import re
import sys
import tempfile
from pathlib import Path

LOG = Path(__file__).resolve().parent.parent / "logs" / "bangkok_clinics_review.log"
SCORES = Path(tempfile.gettempdir()) / "vpn_server_scores.json"
# 이 날짜 이전은 차단 사태 전이라 지금 상황을 대표하지 못한다.
SINCE = "2026-08-23"


def scores_from_log(path: Path) -> dict:
    """로그를 훑어 {host: {ok, bad}} 를 만든다.

    워커별로 "현재 어느 서버를 쓰는지"를 rotate 라인으로 추적한 뒤, 그 워커의
    완료/차단 라인을 그 서버에 귀속시킨다.
    """
    cur: dict[str, str] = {}
    out: dict[str, dict] = collections.defaultdict(lambda: {"ok": 0, "bad": 0})
    day = None
    with open(path, encoding="utf-8", errors="replace") as f:
        for line in f:
            m = re.match(r"(\d{4}-\d\d-\d\d)", line)
            if m:
                day = m.group(1)
            if day and day < SINCE:
                continue
            rot = re.search(r"VPN rotated idx=(\d+) → (\S+)", line)
            if rot:
                # "host (ip:port)" 형식일 수 있으므로 호스트명만.
                cur[rot.group(1)] = rot.group(2).split(" ")[0]
                continue
            w = re.search(r"\[W(\d)\]", line)
            if not w:
                continue
            host = cur.get(w.group(1))
            if not host:
                continue
            if re.search(r"#\d+ 완료", line):
                out[host]["ok"] += 1
            elif "blocked exit IP" in line:
                out[host]["bad"] += 1
    return dict(out)


def main() -> int:
    dry = "--dry-run" in sys.argv
    if not LOG.exists():
        print(f"로그 없음: {LOG}")
        return 1
    derived = scores_from_log(LOG)
    try:
        live = json.loads(SCORES.read_text())
    except Exception:
        live = {}
    # 로그 유래분은 **더하지 않고 덮어쓴다**. 더하면 재실행할 때마다 같은
    # 로그를 다시 세서 수치가 배로 불어난다 — 실제로 1회 병합 뒤 드라이런에서
    # nl826 이 10승 → 20승으로 뛰는 걸 확인했다(2026-08-26).
    # 로그는 불변 사실이므로 "현재 로그가 말하는 값"이 곧 정답이고,
    # 파일에만 있는 항목(로그가 밀려 사라진 옛 서버)은 그대로 보존한다.
    merged = {h: dict(v) for h, v in live.items()}
    merged.update({h: dict(v) for h, v in derived.items()})

    verified = [h for h, v in merged.items() if v["ok"] + v["bad"] >= 3]
    good = [h for h in verified if merged[h]["ok"] / (merged[h]["ok"] + merged[h]["bad"]) >= 0.5]
    print(f"로그에서 복원한 서버 {len(derived)}개 · 병합 후 총 {len(merged)}개")
    print(f"  검증됨(3회+): {len(verified)}개 · 우대 대상(성공률 50%+): {len(good)}개")
    for h in sorted(good, key=lambda x: -merged[x]["ok"])[:5]:
        v = merged[h]
        print(f"    {h:26s} {v['ok']}승 {v['bad']}패")
    if dry:
        print("(--dry-run: 저장하지 않음)")
        return 0
    tmp = SCORES.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(merged))
    os.replace(tmp, SCORES)
    print(f"저장: {SCORES}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
