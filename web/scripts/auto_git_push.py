"""master_db.json 변경 시 자동 git commit + push.

여러 master_db 파일(클리닉 + 식당) 둘 다 감지. 둘 중 하나라도 변경되면 함께 commit.
Vercel 은 GitHub push 받으면 auto-deploy.
"""
from __future__ import annotations

import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path


def _parse_shortstat(out: str) -> tuple[int, int]:
    """git diff --shortstat 출력에서 (insertions, deletions) 추출.
    예: " 1 file changed, 168 insertions(+), 168 deletions(-)" """
    ins = 0
    dels = 0
    m_i = re.search(r"(\d+)\s+insertions?\(\+\)", out)
    m_d = re.search(r"(\d+)\s+deletions?\(-\)", out)
    if m_i:
        ins = int(m_i.group(1))
    if m_d:
        dels = int(m_d.group(1))
    return ins, dels

ROOT = Path(__file__).resolve().parents[2]
MASTER_DBS = [
    ROOT / "web" / "data" / "master_db.json",
    ROOT / "web-restaurants" / "data" / "master_db.json",
]
# 자동 commit 디렉토리 — wiki_generator 가 점진적으로 생성한 LLM 요약 파일들.
# 신규/변경 .json 파일만 add (각 클리닉 1 파일, 누적되며 SEO 풍부화).
AUTO_DIRS = [
    ROOT / "web" / "data" / "wiki_summaries",
]
# 소스 디렉토리 — 신규 컴포넌트/라우트/lib 가 커밋 안 돼 main 빌드가 깨지는 사고
# (import 만 커밋되고 파일은 untracked → Vercel 'Module not found') 재발 방지용.
# 데이터 push 에 piggyback 하여 함께 commit (별도 push trigger 안 함).
SOURCE_DIRS = [
    ROOT / "web" / "app",
    ROOT / "web" / "components",
    ROOT / "web" / "lib",
]
STATE_FILE = ROOT / "run" / "auto_git_push.state"


def run(cmd: list[str], cwd: Path = ROOT, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd, cwd=str(cwd), capture_output=True, text=True,
        encoding="utf-8", check=check,
    )


def latest_mtime() -> float:
    return max((p.stat().st_mtime for p in MASTER_DBS if p.exists()), default=0.0)


def main() -> int:
    cur_mtime = latest_mtime()
    if cur_mtime == 0:
        print("[auto_git_push] master_db 파일 없음 — 종료")
        return 0

    last_mtime = 0.0
    if STATE_FILE.exists():
        try:
            last_mtime = float(STATE_FILE.read_text().strip())
        except (OSError, ValueError):
            pass

    if cur_mtime <= last_mtime:
        print(f"[auto_git_push] master_db 변경 없음 (mtime {cur_mtime:.0f}) — 스킵")
        return 0

    # 변경된 path 만 add. Smart skip: 의미있는 변경만 push (Vercel deploy 절약).
    # Trivial 변경 정의: generated_at timestamp 만 다르고 clinic 데이터는 동일.
    # 측정: git diff --shortstat 의 insertions+deletions 합. 임계치 미만이면 skip.
    SMART_SKIP_LINES = int(os.getenv("AUTO_PUSH_MIN_DELTA_LINES", "500"))
    paths_changed: list[str] = []
    skipped_trivial: list[tuple[str, int, int]] = []
    for p in MASTER_DBS:
        if not p.exists():
            continue
        rel = p.relative_to(ROOT).as_posix()
        status = run(["git", "status", "--porcelain", rel], check=False)
        if not status.stdout.strip():
            continue
        # 변경량 측정 — staged 아니라도 working tree 와 HEAD 비교
        diff = run(["git", "diff", "--shortstat", "HEAD", "--", rel], check=False)
        ins, dels = _parse_shortstat(diff.stdout)
        if ins + dels < SMART_SKIP_LINES:
            skipped_trivial.append((rel, ins, dels))
            continue
        paths_changed.append(rel)

    if skipped_trivial:
        for rel, ins, dels in skipped_trivial:
            print(f"[auto_git_push] skip trivial: {rel} (+{ins}/-{dels} < {SMART_SKIP_LINES})")
        # state 갱신해서 다음 사이클에 같은 mtime 재검사 안 하게
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(str(cur_mtime))

    if not paths_changed:
        print(f"[auto_git_push] 변경 없음 또는 모두 trivial — push 안 함")
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(str(cur_mtime))
        return 0

    print(f"[auto_git_push] 변경 감지: {paths_changed} → commit + push")

    for path in paths_changed:
        run(["git", "add", path])

    # AUTO_DIRS — wiki_summaries 같이 점진적으로 생성되는 디렉토리.
    # 신규/변경 파일 있으면 같이 commit (별도 push trigger 안 하고 piggyback).
    auto_dir_files = 0
    for d in AUTO_DIRS:
        if not d.exists():
            continue
        rel = d.relative_to(ROOT).as_posix()
        status = run(["git", "status", "--porcelain", rel], check=False)
        if not status.stdout.strip():
            continue
        run(["git", "add", rel])
        # 카운트 (얼마나 새로 들어왔는지 로그용)
        new_files = sum(1 for line in status.stdout.splitlines() if line.startswith("??") or line.strip().startswith("A"))
        modified_files = sum(1 for line in status.stdout.splitlines() if line.strip().startswith("M"))
        auto_dir_files += new_files + modified_files
        if new_files or modified_files:
            print(f"[auto_git_push] +{rel}: {new_files} new, {modified_files} modified")

    # SOURCE_DIRS — 신규/변경 소스파일(컴포넌트·라우트·lib)을 같이 commit.
    # 이게 빠지면 import 만 푸시되고 파일은 untracked → main 빌드 'Module not found' 로 깨짐.
    source_files = 0
    for d in SOURCE_DIRS:
        if not d.exists():
            continue
        rel = d.relative_to(ROOT).as_posix()
        status = run(["git", "status", "--porcelain", rel], check=False)
        if not status.stdout.strip():
            continue
        run(["git", "add", rel])
        n = len([ln for ln in status.stdout.splitlines() if ln.strip()])
        source_files += n
        print(f"[auto_git_push] +source {rel}: {n} files")
    if source_files:
        print(f"[auto_git_push] 소스 {source_files}개 동반 커밋 (빌드 깨짐 방지)")

    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    msg = f"chore(data): auto-update master_db @ {ts} ({len(paths_changed)} dataset)"
    commit = run(["git", "commit", "-m", msg], check=False)
    if commit.returncode != 0:
        print(f"[auto_git_push] commit 실패: {commit.stderr.strip()[:200]}")
        STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
        STATE_FILE.write_text(str(cur_mtime))
        return 0
    print(f"[auto_git_push] commit: {commit.stdout.strip()[:200]}")

    push = run(["git", "push", "origin", "main"], check=False)
    if push.returncode != 0:
        stderr = push.stderr.strip()
        if any(k in stderr for k in ("non-fast-forward", "fetch first", "[rejected]")):
            print("[auto_git_push] push 거부(diverge) → fetch+merge 후 재시도")
            run(["git", "fetch", "origin"], check=False)
            dirty = run(["git", "diff", "--name-only"], check=False)
            stashed = False
            if dirty.stdout.strip():
                # 무차별 stash 금지 — 예전엔 워킹트리 전체를 stash 했다가
                # pop 이 충돌로 실패(check=False)하면 개발자의 미커밋 코드
                # 수정이 트리에서 통째로 사라졌음 (2026-07-10 19:25 실제 사고:
                # scraper.py/watchdog.py/nordvpn_runner.py 수정 소실). merge 를
                # 실제로 막는 파일만 최소 범위로 stash 한다.
                behind = run(["git", "diff", "--name-only", "HEAD..origin/main"], check=False)
                incoming = set(ln.strip() for ln in behind.stdout.splitlines() if ln.strip())
                local = [ln.strip() for ln in dirty.stdout.splitlines() if ln.strip()]
                blocking = [f for f in local if f in incoming]
                if blocking:
                    s = run(["git", "stash", "push", "-m", "auto-merge-stash", "--"] + blocking,
                            check=False)
                    stashed = s.returncode == 0
            merge = run(["git", "merge", "origin/main", "-X", "ours", "--no-edit"], check=False)
            if stashed:
                pop = run(["git", "stash", "pop"], check=False)
                if pop.returncode != 0:
                    # pop 실패 = 변경이 stash 에 갇힘. 조용히 넘기지 말 것.
                    # 복구: git stash list → git checkout stash@{N} -- <파일>
                    print("[auto_git_push] !! stash pop 실패 — 변경이 stash에 갇힘, 수동 복구 필요: "
                          + pop.stderr.strip()[:200], file=sys.stderr)
            if merge.returncode != 0:
                print(f"[auto_git_push] merge 실패: {merge.stderr.strip()[:200]}", file=sys.stderr)
                return 1
            push = run(["git", "push", "origin", "main"], check=False)
            if push.returncode != 0:
                print(f"[auto_git_push] 재시도 push 실패: {push.stderr.strip()[:300]}", file=sys.stderr)
                return 1
        else:
            print(f"[auto_git_push] push 실패: {stderr[:300]}", file=sys.stderr)
            return 1

    print("[auto_git_push] push 완료 → Vercel auto-deploy 트리거됨")

    # IndexNow ping — Bing/Yandex 즉시 인덱싱 트리거. 실패해도 push 은 성공으로 간주.
    indexnow_script = ROOT / "scripts" / "indexnow_ping.py"
    if indexnow_script.exists():
        # 변경된 dataset 따라 어떤 site ping 할지 결정
        targets = []
        if any("web/data/" in p for p in paths_changed):
            targets.append("clinic")
        if any("web-restaurants/data/" in p for p in paths_changed):
            targets.append("restaurants")
        for t in targets:
            try:
                r = run([sys.executable, str(indexnow_script), t], check=False)
                print(f"[auto_git_push] IndexNow {t}: {(r.stdout or '').strip()[:200]}")
            except Exception as e:
                print(f"[auto_git_push] IndexNow {t} skipped: {e}")

    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(str(cur_mtime))
    return 0


if __name__ == "__main__":
    sys.exit(main())
