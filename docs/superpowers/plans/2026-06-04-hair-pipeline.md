# Hair Data Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automate daily regeneration and deployment of `clinics.json` from `thaihairguide_master.csv` to production, mirroring the dental pipeline.

**Architecture:** A Python script (`deploy_hair_data.py`) validates the source CSV, calls the existing Node.js `build-data.mjs` to regenerate `clinics.json`, then uses an isolated git worktree to commit and push `clinics.json` to `origin/main` — triggering Vercel's git integration for auto-deploy. Scheduled daily at 06:00 via Windows Task Scheduler.

**Tech Stack:** Python 3.x, Node.js (existing `scripts/build-data.mjs`), Git worktrees, Windows Task Scheduler, Vercel git integration

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `thaifacialclinic-portable/public/data/clinics.json` | Add to git (1-time) | Production clinic data — must be tracked for worktree diff to work |
| `scripts/__init__.py` | Create (empty) | Makes `scripts/` importable for tests |
| `scripts/deploy_hair_data.py` | Create | Full deploy orchestration (validate CSV → build → commit → push) |
| `tests/test_deploy_hair_data.py` | Create | Unit tests for `validate_source_csv` and `run_node_build` |

---

### Task 1: Track `clinics.json` in git (one-time setup)

**Files:**
- Modify tracking: `thaifacialclinic-portable/public/data/clinics.json`

- [ ] **Step 1: Stage the file**

```bash
cd C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable
git add thaifacialclinic-portable/public/data/clinics.json
```

- [ ] **Step 2: Verify it's staged**

```bash
git status thaifacialclinic-portable/public/data/clinics.json
```

Expected:
```
new file:   thaifacialclinic-portable/public/data/clinics.json
```

- [ ] **Step 3: Commit and push**

```bash
git commit -m "chore: track clinics.json for automated hair data pipeline"
git push
```

Expected: push succeeds, file visible on GitHub under `thaifacialclinic-portable/public/data/clinics.json`.

---

### Task 2: Write failing tests

**Files:**
- Create: `scripts/__init__.py`
- Create: `tests/test_deploy_hair_data.py`

- [ ] **Step 1: Create `scripts/__init__.py`**

Create an empty file at `scripts/__init__.py` (makes the scripts directory importable as a Python package).

```bash
cd C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable
type nul > scripts\__init__.py
```

- [ ] **Step 2: Create test file**

Create `tests/test_deploy_hair_data.py` with this content:

```python
import json
import subprocess
from pathlib import Path
from unittest.mock import MagicMock

import pytest

from scripts.deploy_hair_data import validate_source_csv, run_node_build


def test_validate_source_csv_missing(tmp_path):
    with pytest.raises(FileNotFoundError):
        validate_source_csv(tmp_path / "nonexistent.csv")


def test_validate_source_csv_header_only(tmp_path):
    csv = tmp_path / "master.csv"
    csv.write_text("name,place_id\n", encoding="utf-8")
    with pytest.raises(ValueError, match="0 data rows"):
        validate_source_csv(csv)


def test_validate_source_csv_valid(tmp_path):
    csv = tmp_path / "master.csv"
    csv.write_text("name,place_id\nClinic A,ChIJ123\nClinic B,ChIJ456\n", encoding="utf-8")
    count = validate_source_csv(csv)
    assert count == 2


def test_run_node_build_success(tmp_path, monkeypatch):
    clinics_json = tmp_path / "clinics.json"
    clinics_json.write_text(
        json.dumps({"total": 214, "clinics": [{"id": "x"}]}),
        encoding="utf-8",
    )

    def fake_run(cmd, **kwargs):
        result = MagicMock()
        result.returncode = 0
        result.stdout = "[build-data] wrote 214 clinics"
        result.stderr = ""
        return result

    monkeypatch.setattr("scripts.deploy_hair_data.subprocess.run", fake_run)
    count = run_node_build(project_root=tmp_path, out_file=clinics_json)
    assert count == 214


def test_run_node_build_node_failure(tmp_path, monkeypatch):
    def fake_run(cmd, **kwargs):
        result = MagicMock()
        result.returncode = 1
        result.stdout = ""
        result.stderr = "Cannot find module 'csv-parse'"
        return result

    monkeypatch.setattr("scripts.deploy_hair_data.subprocess.run", fake_run)
    with pytest.raises(RuntimeError, match="node build failed"):
        run_node_build(project_root=tmp_path, out_file=tmp_path / "clinics.json")
```

- [ ] **Step 3: Run tests — confirm they fail (module doesn't exist yet)**

```bash
cd C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable
.venv\Scripts\python.exe -m pytest tests/test_deploy_hair_data.py -v
```

Expected: `ImportError: cannot import name 'validate_source_csv' from 'scripts.deploy_hair_data'` (or ModuleNotFoundError). This is correct — the implementation doesn't exist yet.

---

### Task 3: Implement `scripts/deploy_hair_data.py`

**Files:**
- Create: `scripts/deploy_hair_data.py`

- [ ] **Step 1: Create the script**

Create `scripts/deploy_hair_data.py` with this content:

```python
"""
Hair-site daily data deploy — mirrors deploy_data_to_main.py for dental.

Flow:
  1. Validate dbd-scraper/hair/thaihairguide_master.csv exists + non-empty
  2. Run `node scripts/build-data.mjs` in thaifacialclinic-portable/ → regenerates clinics.json
  3. Commit thaifacialclinic-portable/public/data/clinics.json to origin/main via isolated worktree
  4. Push → Vercel git integration triggers auto-deploy

Run manually:  .venv\Scripts\python.exe scripts\deploy_hair_data.py
Scheduled:     Windows Task Scheduler "DeployHairData" (daily 06:00)
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SOURCE_CSV = REPO / "dbd-scraper" / "hair" / "thaihairguide_master.csv"
PROJECT = REPO / "thaifacialclinic-portable"
CLINICS_JSON = PROJECT / "public" / "data" / "clinics.json"
REL_CLINICS = "thaifacialclinic-portable/public/data/clinics.json"
WT = REPO.parent.parent / ".deploy-hair-wt"
LOG = REPO / "logs" / "deploy_hair_data.log"

GIT_NAME = "presidentoko"
GIT_EMAIL = "chillanel22@gmail.com"


def log(msg: str) -> None:
    line = f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}"
    print(line, flush=True)
    try:
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except OSError:
        pass


def git(args, cwd, check=True, stdin=None):
    return subprocess.run(
        ["git", *args], cwd=str(cwd), text=True, encoding="utf-8",
        capture_output=True, input=stdin, check=check,
    )


def validate_source_csv(path: Path) -> int:
    """Returns data row count or raises FileNotFoundError / ValueError."""
    if not path.exists():
        raise FileNotFoundError(f"CSV not found: {path}")
    lines = path.read_text(encoding="utf-8-sig").strip().splitlines()
    data_rows = len(lines) - 1  # subtract header row
    if data_rows <= 0:
        raise ValueError(f"CSV has 0 data rows: {path}")
    return data_rows


def run_node_build(project_root: Path, out_file: Path) -> int:
    """Runs build-data.mjs, returns clinic count from generated JSON. Raises RuntimeError on failure."""
    result = subprocess.run(
        ["node", "scripts/build-data.mjs"],
        cwd=str(project_root),
        text=True,
        encoding="utf-8",
        capture_output=True,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"node build failed (exit {result.returncode}): {result.stderr.strip()[:300]}"
        )
    try:
        data = json.loads(out_file.read_text(encoding="utf-8"))
        return data.get("total", 0)
    except (json.JSONDecodeError, OSError):
        return 0


def main() -> int:
    # 1. Validate source CSV
    try:
        csv_rows = validate_source_csv(SOURCE_CSV)
    except (FileNotFoundError, ValueError) as e:
        log(f"source CSV invalid — 종료: {e}")
        return 0

    log(f"source CSV OK: {csv_rows} rows")

    # 2. Run Node.js build → regenerate clinics.json
    try:
        clinic_count = run_node_build(PROJECT, CLINICS_JSON)
    except RuntimeError as e:
        log(f"build 실패 — 종료: {e}")
        return 1

    log(f"build 완료: {clinic_count} clinics → {CLINICS_JSON}")

    # 3. Fetch latest origin/main
    git(["fetch", "origin", "main"], REPO, check=False)

    # 4. (Re)create isolated detached worktree at origin/main
    git(["worktree", "remove", "--force", str(WT)], REPO, check=False)
    if WT.exists():
        shutil.rmtree(WT, ignore_errors=True)
    try:
        git(["worktree", "add", "--detach", str(WT), "origin/main"], REPO)
    except subprocess.CalledProcessError as e:
        log(f"worktree 생성 실패 — 종료: {e.stderr.strip()[:200]}")
        return 1

    try:
        # 5. Copy clinics.json into worktree and stage
        dst = WT / REL_CLINICS
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(CLINICS_JSON, dst)
        git(["add", REL_CLINICS], WT)

        # 6. Skip if unchanged vs origin/main
        if git(["diff", "--cached", "--quiet"], WT, check=False).returncode == 0:
            log(f"변경 없음 (origin/main과 동일, {clinic_count} clinics) — 스킵")
            return 0

        # 7. Commit
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        msg = (
            f"chore(data): auto-update hair clinics.json → {clinic_count} clinics @ {today}\n\n"
            "Automated daily hair data deploy (isolated origin/main worktree).\n\n"
            "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
        )
        git(
            ["-c", f"user.name={GIT_NAME}", "-c", f"user.email={GIT_EMAIL}",
             "commit", "-F", "-"],
            WT,
            stdin=msg,
        )

        # 8. Push with retries
        pushed = False
        for i in range(1, 5):
            p = git(["push", "origin", "HEAD:main"], WT, check=False)
            if p.returncode == 0:
                pushed = True
                break
            log(f"push 재시도 {i}/4 실패: {(p.stderr or '').strip().splitlines()[-1:]}")
            time.sleep(3)

        if not pushed:
            log("push 4회 실패 — 종료 (다음 주기 재시도)")
            return 1

        log(f"✅ push 완료 → Vercel 자동 배포 트리거 ({clinic_count} clinics)")
        return 0
    finally:
        git(["worktree", "remove", "--force", str(WT)], REPO, check=False)
        if WT.exists():
            shutil.rmtree(WT, ignore_errors=True)


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 2: Run tests — all should pass**

```bash
cd C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable
.venv\Scripts\python.exe -m pytest tests/test_deploy_hair_data.py -v
```

Expected:
```
PASSED tests/test_deploy_hair_data.py::test_validate_source_csv_missing
PASSED tests/test_deploy_hair_data.py::test_validate_source_csv_header_only
PASSED tests/test_deploy_hair_data.py::test_validate_source_csv_valid
PASSED tests/test_deploy_hair_data.py::test_run_node_build_success
PASSED tests/test_deploy_hair_data.py::test_run_node_build_node_failure
5 passed
```

- [ ] **Step 3: Smoke test (reads real CSV, runs real build, no push)**

```bash
cd C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable
.venv\Scripts\python.exe scripts\deploy_hair_data.py
```

Expected log (data already on origin/main from Task 1, so no push):
```
[...] source CSV OK: 645 rows
[...] build 완료: 214 clinics → ...clinics.json
[...] 변경 없음 (origin/main과 동일, 214 clinics) — 스킵
```

If you see `node build failed`, check that `node` is on PATH:
```bash
node --version
```

- [ ] **Step 4: Commit**

```bash
git add scripts/__init__.py scripts/deploy_hair_data.py tests/test_deploy_hair_data.py
git commit -m "feat(pipeline): deploy_hair_data.py — daily CSV→JSON→git→Vercel automation"
git push
```

---

### Task 4: Vercel Git Integration (manual, one-time)

**Files:** None — Vercel dashboard config only.

- [ ] **Step 1: Open project settings**

Go to: `https://vercel.com/pont-s-projects/thaifacialclinic-portable/settings/git`

- [ ] **Step 2: Connect GitHub repo**

- Click "Connect Git Repository"
- Select the repo that contains `thaifacialclinic-portable/`
- Set **Root Directory** = `thaifacialclinic-portable`
- Set **Production Branch** = `main`
- Save

- [ ] **Step 3: Verify auto-deploy triggers**

The `git push` from Task 3 Step 4 should have already triggered a build. Check:
`https://vercel.com/pont-s-projects/thaifacialclinic-portable/deployments`

Expected: a new deployment entry triggered by the commit from Task 3.

---

### Task 5: Windows Task Scheduler (manual, one-time)

**Files:** None — OS config only.

- [ ] **Step 1: Open Task Scheduler**

```
Win+R → taskschd.msc → Enter
```

- [ ] **Step 2: Create the task**

Action menu → "Create Task" (not "Create Basic Task"):

**General tab:**
| Field | Value |
|---|---|
| Name | `DeployHairData` |
| Run whether user is logged on or not | ✅ checked |
| Run with highest privileges | ✅ checked |

**Triggers tab** → New:
- Begin the task: On a schedule
- Daily, recur every 1 day
- Start time: `06:00:00`

**Actions tab** → New:
- Program/script: `C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\.venv\Scripts\python.exe`
- Add arguments: `scripts\deploy_hair_data.py`
- Start in: `C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable`

**Settings tab:**
- If the task is already running: `Stop the existing instance`

- [ ] **Step 3: Test run**

Right-click `DeployHairData` → Run.

Then check the log:
```bash
type C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\logs\deploy_hair_data.log
```

Expected last line (no change since data just deployed):
```
[...] 변경 없음 (origin/main과 동일, 214 clinics) — 스킵
```
