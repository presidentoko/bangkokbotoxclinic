"""shared/ → 각 web 앱 sync.

`shared/components/*.tsx`, `shared/lib/*.ts`를 단일 source로 두고
각 Next.js 앱(web/, web-restaurants/, web-golf/)의 동일 경로에 복사.

목적:
- Vercel Root Directory가 web 앱 폴더로 묶여있어서 직접 path alias로 ../shared/* 못 씀
- 그래서 shared 편집 → sync 실행 → 각 앱 안에 동일 파일이 commit됨
- Vercel은 평소처럼 web/ 빌드 (변화 없음)

워크플로우:
1. shared/ 안의 파일 편집
2. `python scripts/sync_shared.py` 실행
3. 각 앱의 components/*, lib/*가 업데이트됨
4. git commit + push

각 sync된 파일은 맨 위에 warning 헤더가 박힘 — 직접 편집하지 말고 shared/ 편집하라는 신호.
"""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).parent.parent
SHARED = ROOT / "shared"
TARGETS = [ROOT / "web", ROOT / "web-restaurants", ROOT / "web-golf"]

WARNING = (
    "// ⚠️ AUTO-GENERATED from shared/{rel}\n"
    "// DO NOT edit directly — edit shared/{rel}, then run `python scripts/sync_shared.py`.\n"
    "\n"
)

# 특정 앱에서 shared 원본보다 앞서나간 파일 — 덮어쓰면 기능이 사라진다.
#
# 2026-08-06 사고: web/ 은 lib/i18n.ts 에 한국어(Lang "ko" + 번역 90줄)를
# 추가해둔 상태였는데, shared 원본엔 en/th 뿐이라 sync 한 번에 통째로
# 깎였다. Lang 타입에서 "ko" 가 사라지면서 BookingForm 등 ko 를 참조하던
# 파일이 전부 타입 에러가 났다. TrustBadge.tsx 도 같은 이유로 회귀.
#
# 근본 해결은 shared 쪽에 ko 를 올려 divergence 를 없애는 것이지만,
# 그러면 web-restaurants / web-golf 의 Record<Lang, string> 들이 전부
# ko 키를 요구받아 깨진다. 그 정리 전까지는 여기서 제외해 사고를 막는다.
SKIP = {
    ("web", "lib/i18n.ts"),
    ("web", "components/TrustBadge.tsx"),
}


def sync_file(src: Path, dst: Path, rel: str) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    content = src.read_text(encoding="utf-8")
    if not content.startswith("// ⚠️ AUTO-GENERATED"):
        content = WARNING.format(rel=rel) + content
    dst.write_text(content, encoding="utf-8")


def main() -> int:
    if not SHARED.exists():
        print(f"shared/ folder missing: {SHARED}")
        return 1
    files = [p for p in SHARED.rglob("*") if p.is_file()]
    if not files:
        print("shared/ empty - nothing to sync")
        return 0
    print(f"{len(files)} files -> {len(TARGETS)} targets sync")
    n_written = 0
    for target in TARGETS:
        if not target.exists():
            print(f"  target missing (skip): {target.name}")
            continue
        for src in files:
            rel = src.relative_to(SHARED).as_posix()
            if (target.name, rel) in SKIP:
                print(f"  · skip (앱이 shared보다 앞서감): {target.name}/{rel}")
                continue
            dst = target / rel
            sync_file(src, dst, rel)
            n_written += 1
            print(f"  → {dst.relative_to(ROOT).as_posix()}")
    print(f"done. {n_written} files written.")
    return 0


if __name__ == "__main__":
    import sys
    sys.exit(main())
