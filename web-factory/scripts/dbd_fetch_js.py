"""DBD Nuxt 번들 가져와서 복호화 루틴 찾기.

1) probe 결과에서 _nuxt/ JS URL 추출
2) 각 번들 다운로드 → bundles/ 폴더
3) AES/decrypt/encKey/subtle 키워드로 grep, hit 한 번들들 출력
"""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

OUT_DIR = Path(__file__).parent / "dbd_bundles"
OUT_DIR.mkdir(exist_ok=True)

probe = json.loads(Path("scripts/dbd_deep_probe_result.json").read_text(encoding="utf-8"))
html_head = probe["result_meta"]["result_page_head"]

# 1) 번들 URL 추출 — modulepreload + script src
urls = set()
for m in re.finditer(r'href="(/_nuxt/[A-Za-z0-9_\-]+\.js)"', html_head):
    urls.add("https://datawarehouse.dbd.go.th" + m.group(1))
for m in re.finditer(r'src="(/_nuxt/[A-Za-z0-9_\-]+\.js)"', html_head):
    urls.add("https://datawarehouse.dbd.go.th" + m.group(1))
for m in re.finditer(r'href="(https://datawarehouse\.dbd\.go\.th/_nuxt/[A-Za-z0-9_\-]+\.js)"', html_head):
    urls.add(m.group(1))

print(f"found {len(urls)} JS bundle URLs in probe HTML")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36",
    "Referer": "https://datawarehouse.dbd.go.th/",
    "Accept": "*/*",
}

# 2) 다운로드
KEYWORDS = ["encKey", "decrypt", "AES-GCM", "AES-CBC", "subtle", "PBKDF2", "deriveKey", "createDecipheriv", "WebCrypto"]
hits: dict[str, list[str]] = {}

for url in sorted(urls):
    fname = url.split("/")[-1]
    dest = OUT_DIR / fname
    if not dest.exists():
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=20) as r:
                body = r.read()
            dest.write_bytes(body)
            print(f"  ✓ {fname}  ({len(body):>7,} bytes)")
        except Exception as e:
            print(f"  ✗ {fname}  {type(e).__name__}: {e!s:.80}")
            continue
    else:
        print(f"  · {fname}  (cached, {dest.stat().st_size:>7,} bytes)")

    content = dest.read_text(encoding="utf-8", errors="replace")
    matched = [k for k in KEYWORDS if k in content]
    if matched:
        hits[fname] = matched

print()
print("=== bundles with crypto keywords ===")
for fname, kws in hits.items():
    print(f"  {fname}: {kws}")
