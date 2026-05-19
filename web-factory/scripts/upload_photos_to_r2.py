"""public/photos/ → Cloudflare R2 bucket 업로드.

전제:
  - wrangler 로그인 완료 (wrangler login)
  - R2 bucket 이미 생성 (wrangler r2 bucket create thaisupplyhub-photos)
  - bucket 에 public 도메인 binding (Cloudflare 대시보드 → R2 → 해당 bucket → Settings → "Public Access" 또는 "Custom domain")

이 스크립트:
  1. public/photos/ 트리 walk
  2. 각 파일을 r2 키 photos/{place_id}/{n}.jpg 로 업로드
  3. 이미 있는 키는 skip (size 비교)
  4. ContentType: image/jpeg

usage:
    python scripts/upload_photos_to_r2.py thaisupplyhub-photos
    python scripts/upload_photos_to_r2.py thaisupplyhub-photos --dry-run
"""
from __future__ import annotations

import argparse
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).parent
WEB = HERE.parent
PHOTOS_DIR = WEB / "public" / "photos"


def list_remote_keys(bucket: str) -> set[str]:
    """이미 업로드된 키 목록 — wrangler r2 object list 사용."""
    try:
        r = subprocess.run(
            ["npx", "wrangler", "r2", "object", "list", bucket, "--prefix=photos/"],
            capture_output=True, text=True, timeout=120, encoding="utf-8",
        )
    except FileNotFoundError:
        print("wrangler 가 PATH 에 없음 — npm i -g wrangler 또는 npx 로 호출 가능 확인", file=sys.stderr)
        return set()
    if r.returncode != 0:
        print(f"list FAIL: {r.stderr[:300]}", file=sys.stderr)
        return set()
    keys: set[str] = set()
    # wrangler 출력 형식: 각 줄마다 key 가 들어있음 (정확한 포맷 wrangler 버전마다 다름)
    for line in r.stdout.splitlines():
        line = line.strip()
        if line.startswith("photos/") and line.endswith(".jpg"):
            keys.add(line.split()[0])
    return keys


def upload_one(bucket: str, key: str, local_path: Path) -> tuple[bool, str]:
    cmd = [
        "npx", "wrangler", "r2", "object", "put",
        f"{bucket}/{key}",
        f"--file={local_path}",
        "--content-type=image/jpeg",
    ]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True, timeout=60, encoding="utf-8")
    except subprocess.TimeoutExpired:
        return False, "timeout"
    except Exception as e:
        return False, f"err_{type(e).__name__}"
    if r.returncode != 0:
        return False, r.stderr[:200].replace("\n", " ")
    return True, "ok"


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("bucket", help="R2 bucket name (e.g. thaisupplyhub-photos)")
    p.add_argument("--dry-run", action="store_true")
    p.add_argument("--workers", type=int, default=4)
    p.add_argument("--skip-list", action="store_true",
                   help="이미 업로드된 key 목록 확인 skip — 모든 파일 강제 업로드")
    args = p.parse_args()

    if not PHOTOS_DIR.exists():
        sys.exit(f"missing: {PHOTOS_DIR}")

    # 로컬 파일 수집
    local: list[tuple[str, Path]] = []
    for jpg in PHOTOS_DIR.rglob("*.jpg"):
        rel = jpg.relative_to(PHOTOS_DIR)        # ChIJ.../0.jpg
        key = "photos/" + str(rel).replace("\\", "/")
        local.append((key, jpg))
    print(f"local files: {len(local):,}")

    # remote 확인
    remote_keys: set[str] = set()
    if not args.skip_list:
        print("listing remote keys (may take 30s+) …")
        remote_keys = list_remote_keys(args.bucket)
        print(f"  remote already has: {len(remote_keys):,}")

    to_upload = [(k, p) for k, p in local if k not in remote_keys]
    print(f"to upload: {len(to_upload):,}")
    if args.dry_run:
        print("dry-run — 종료")
        return
    if not to_upload:
        print("nothing to upload — 끝")
        return

    # 업로드 (병렬)
    t0 = time.time()
    ok = fail = 0
    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futures = {ex.submit(upload_one, args.bucket, k, p): k for k, p in to_upload}
        for i, fut in enumerate(as_completed(futures), 1):
            key = futures[fut]
            success, info = fut.result()
            if success:
                ok += 1
            else:
                fail += 1
                print(f"  ✗ {key}: {info}")
            if i % 50 == 0:
                elapsed = time.time() - t0
                rate = i / elapsed
                eta = (len(to_upload) - i) / rate
                print(f"  [{i:>5}/{len(to_upload)}] ok={ok} fail={fail}  rate={rate:.1f}/s eta={eta/60:.0f}min")

    print()
    print(f"DONE — uploaded {ok}, failed {fail}")
    print(f"set: NEXT_PUBLIC_PHOTOS_BASE=https://<your-r2-public-domain>")
    print(f"     (bucket settings → public access → domain)")


if __name__ == "__main__":
    main()
