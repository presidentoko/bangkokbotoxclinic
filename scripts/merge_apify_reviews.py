"""Apify "Google Maps Reviews Scraper" 결과를 우리 리뷰 CSV 에 합친다 (2026-10-16).

왜: 2026-10-13 부터 구글이 비로그인 세션에 limited view 를 줘서 로컬 스크래퍼가
클리닉당 5건밖에 못 긁는다. Apify 액터는 영향이 없고, 원문(text)과
번역본(textTranslated)을 같이 준다 — 지금까지 우리 CSV 의 태국어 리뷰는 전부
구글 영어 번역본이었다.

규칙 (bangkok_clinics/scraper.py save_reviews_csv 와 같은 정책):
  - 헤더는 REVIEW_HEADER 그대로. 칸을 늘리면 스크래퍼가 "헤더 불일치"로 보고
    파일을 통째로 새로 써서 기존 리뷰가 날아간다. 그래서 영어 번역본은 CSV 가
    아니라 옆의 <fn>_reviews_en.json 에 둔다.
  - 합집합. 기존 리뷰는 절대 지우지 않는다.
  - 같은 리뷰가 구글 ID 형식 변경(ChdD… / Ci9D…)으로 다른 ID 를 달고 올 수
    있다. ID 가 달라도 본문(원문 또는 번역본)이 기존 본문과 같으면 같은
    리뷰로 보고, 원문이 태국어면 기존 행의 본문만 원문으로 바꾼다.
  - 같은 _FileLock(.lock O_EXCL) 규약과 tmp→replace 쓰기를 쓴다 — 운영 중인
    스크래퍼와 동시에 돌아도 안전하다.

사용: python scripts/merge_apify_reviews.py <dataset.json> [...] [--dry-run]
"""
from __future__ import annotations

import csv
import json
import os
import re
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REVIEW_HEADER = [
    "review_id", "place_id", "restaurant_name", "rating", "text",
    "author_name", "author_id", "author_uri", "author_photo_uri",
    "author_is_local_guide", "author_review_count", "author_photo_count",
    "relative_date", "spent_amount", "sort_source",
]
TEXT = REVIEW_HEADER.index("text")
THAI = re.compile(r"[฀-๿]")

# 덴탈 클리닉이 있을 수 있는 출력 디렉터리 (web/scripts/build_master_db.py SOURCES)
OUT_DIRS = [
    ROOT / "dental_output" / "bangkok",
    ROOT / "bangkok_clinics" / "output",
    ROOT / "merge_handoff" / "_export" / "dental",
    ROOT / "pattaya" / "clinics_output",
    ROOT / "phuket" / "clinics_output",
    ROOT / "chiang_mai" / "clinics_output",
]


class FileLock:
    """scraper.py _FileLock 과 같은 규약 (path + '.lock', 60s stale 회수)."""

    def __init__(self, path: Path, timeout: float = 30.0):
        self.lock_path = path.with_suffix(path.suffix + ".lock")
        self.timeout = timeout
        self.held = False

    def __enter__(self):
        deadline = time.time() + self.timeout
        while time.time() < deadline:
            try:
                fd = os.open(str(self.lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                os.write(fd, str(os.getpid()).encode())
                os.close(fd)
                self.held = True
                return self
            except FileExistsError:
                try:
                    if time.time() - self.lock_path.stat().st_mtime > 60:
                        self.lock_path.unlink(missing_ok=True)
                        continue
                except OSError:
                    pass
                time.sleep(0.05)
        raise TimeoutError(f"lock busy: {self.lock_path}")

    def __exit__(self, *exc):
        if self.held:
            try:
                self.lock_path.unlink()
            except OSError:
                pass


def atomic_write(path: Path, rows: list[list]) -> None:
    tmp = path.with_suffix(path.suffix + f".tmp.{os.getpid()}")
    with open(tmp, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f, quoting=csv.QUOTE_NONNUMERIC)
        w.writerow(REVIEW_HEADER)
        w.writerows(rows)
    for i in range(20):
        try:
            os.replace(tmp, path)
            return
        except PermissionError:
            time.sleep(0.1 * (i + 1))
    os.replace(tmp, path)


def norm(t: str) -> str:
    return re.sub(r"[\W_]+", "", (t or "").lower())[:80]


def is_better(new_t: str, old_t: str) -> bool:
    """scraper.review_row_is_better 와 같은 판정 (본문만)."""
    new_t, old_t = (new_t or "").strip(), (old_t or "").strip()
    if not new_t:
        return False
    if not old_t:
        return True
    nt, ot = bool(THAI.search(new_t)), bool(THAI.search(old_t))
    if nt != ot:
        return nt
    return len(new_t) > len(old_t) * 1.2


def locate(fid: str, clinic_dirs: dict[str, list[Path]]) -> list[Path]:
    fn = fid.replace(":", "_") + "_reviews.csv"
    hits = [d / "reviews" / fn for d in OUT_DIRS if (d / "reviews" / fn).exists()]
    if hits:
        return hits
    return [d / "reviews" / fn for d in clinic_dirs.get(fid, [])]


def load_clinic_dirs() -> dict[str, list[Path]]:
    out: dict[str, list[Path]] = {}
    for d in OUT_DIRS:
        p = d / "clinics.csv"
        if not p.exists():
            continue
        with open(p, newline="", encoding="utf-8-sig", errors="replace") as f:
            for row in csv.DictReader(f):
                pid = row.get("place_id") or ""
                if pid:
                    out.setdefault(pid, []).append(d)
    return out


def to_row(r: dict) -> list:
    return [
        r["reviewId"], r["fid"], r.get("title") or "", r.get("stars") or 0,
        (r.get("text") or "").strip(),
        "", "", "", "",
        1 if r.get("isLocalGuide") else 0, r.get("reviewerNumberOfReviews") or 0, 0,
        r.get("publishAt") or "", "", "apify_relevant",
    ]


def merge_file(path: Path, items: list[dict], dry: bool) -> tuple[int, int, int]:
    with FileLock(path):
        rows: list[list] = []
        if path.exists():
            with open(path, newline="", encoding="utf-8-sig", errors="replace") as f:
                data = list(csv.reader(f))
            if data and data[0] != REVIEW_HEADER:
                print(f"  SKIP 헤더 불일치: {path}")
                return 0, 0, 0
            rows = [r for r in data[1:] if r and r[0]]
        by_id = {r[0]: r for r in rows}
        by_text = {norm(r[TEXT]): r for r in rows if norm(r[TEXT])}
        added = improved = dup = 0
        translations: dict[str, str] = {}
        for it in items:
            new = to_row(it)
            tr = (it.get("textTranslated") or "").strip()
            old = by_id.get(new[0])
            if old is None:
                for k in (norm(new[TEXT]), norm(tr)):
                    if k and k in by_text:
                        old = by_text[k]
                        dup += 1
                        break
            if old is None:
                rows.append(new)
                by_id[new[0]] = new
                if norm(new[TEXT]):
                    by_text[norm(new[TEXT])] = new
                added += 1
                rid = new[0]
            else:
                rid = old[0]
                if is_better(new[TEXT], old[TEXT]):
                    old[TEXT] = new[TEXT]
                    improved += 1
            if tr:
                translations[rid] = tr
        if not dry and (added or improved):
            path.parent.mkdir(parents=True, exist_ok=True)
            atomic_write(path, rows)
        if not dry and translations:
            side = path.with_name(path.name.replace("_reviews.csv", "_reviews_en.json"))
            cur = {}
            if side.exists():
                try:
                    cur = json.loads(side.read_text(encoding="utf-8"))
                except Exception:
                    cur = {}
            cur.update(translations)
            side.write_text(json.dumps(cur, ensure_ascii=False), encoding="utf-8")
        return added, improved, dup


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    by_fid: dict[str, dict[str, dict]] = {}
    for a in args:
        for r in json.load(open(a, encoding="utf-8")):
            if r.get("reviewId") and r.get("fid"):
                by_fid.setdefault(r["fid"], {})[r["reviewId"]] = r
    clinic_dirs = load_clinic_dirs()
    tot = {"places": 0, "files": 0, "added": 0, "improved": 0, "dup": 0, "nowhere": 0}
    for fid, items in by_fid.items():
        paths = locate(fid, clinic_dirs)
        if not paths:
            tot["nowhere"] += 1
            continue
        tot["places"] += 1
        for p in paths:
            a, i, d = merge_file(p, list(items.values()), dry)
            tot["files"] += 1
            tot["added"] += a
            tot["improved"] += i
            tot["dup"] += d
    print(("[dry-run] " if dry else "") + json.dumps(tot))


if __name__ == "__main__":
    main()
