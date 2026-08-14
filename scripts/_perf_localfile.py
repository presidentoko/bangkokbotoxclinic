"""빌드 산출물(.html) 하나를 해부 — 라이브와 같은 잣대로 비교하기 위한 도구.

실행: python scripts/_perf_localfile.py <path.html> [<path2.html> ...]
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

FLIGHT_RE = re.compile(r"self\.__next_f\.push\((.*?)\)</script>", re.S)
CLASSNAME_RE = re.compile(r'\\"className\\":\\"([^\\]{0,600})')
ROW_RE = re.compile(r"group flex items-center gap-3 px-4 py-3 bg-white border")
TRUST_RE = re.compile(r'\\"trust_score\\"')
LD_RE = re.compile(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', re.S)


def main() -> int:
    for p in sys.argv[1:]:
        path = Path(p)
        if not path.exists():
            print(f"{p}: 없음")
            continue
        html = path.read_text(encoding="utf-8", errors="ignore")
        flight = "".join(FLIGHT_RE.findall(html))
        cns = CLASSNAME_RE.findall(flight)
        ld = sum(len(m) for m in LD_RE.findall(html))
        print(f"\n=== {path.name} ===")
        print(f"  HTML        {len(html)/1024:8.1f}KB")
        print(f"  플라이트     {len(flight)/1024:8.1f}KB  ({len(flight)*100//max(1,len(html))}%)")
        print(f"  className   {len(cns):5}개 = {sum(len(c) for c in cns)/1024:.1f}KB")
        print(f"  JSON-LD     {ld/1024:8.1f}KB")
        # 같은 문자열이 렌더된 HTML 과 플라이트 양쪽에 들어간다. 라이브 측정 때와
        # 잣대를 맞추려면 **플라이트만** 세야 한다(2026-08-13에 이걸로 한 번 헛읽음).
        print(f"  컴팩트행     {len(ROW_RE.findall(flight)):5}  (플라이트 기준 = 실제 행 수)")
        print(f"     참고: HTML 전체 기준 {len(ROW_RE.findall(html))} (렌더분+플라이트분)")
        print(f"  클리닉직렬   {len(TRUST_RE.findall(flight)):5}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
