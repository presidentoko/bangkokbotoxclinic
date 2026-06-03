# Hair Data Pipeline — Automated Deploy Design

**Date:** 2026-06-04  
**Project:** thaifacialclinic-portable (thaihairguide.com)  
**Status:** Approved

---

## Problem

The hair pipeline is fully manual:

1. Scrapers write individual CSVs to `dbd-scraper/hair/`
2. A separate process merges them into `thaihairguide_master.csv`
3. `npm run data` regenerates `public/data/clinics.json` locally
4. `vercel --prod` deploys manually via CLI

Vercel build servers cannot access `dbd-scraper/hair/` (outside the uploaded project root), so `clinics.json` is never regenerated on Vercel — it always uses the last locally-generated copy. The dental project has an equivalent automated pipeline (`deploy_data_to_main.py` + Windows Task Scheduler); hair has nothing comparable.

---

## Goal

Mirror the dental pipeline for hair:

```
[Daily — Task Scheduler]
thaihairguide_master.csv
        ↓
node scripts/build-data.mjs  (runs in thaifacialclinic-portable/)
        ↓
public/data/clinics.json  regenerated
        ↓
isolated origin/main worktree  commit + push
        ↓
Vercel git integration  auto-deploy triggered
```

---

## Architecture

### Script: `scripts/deploy_hair_data.py`

Mirrors `scripts/deploy_data_to_main.py` with two differences:

| | dental | hair |
|---|---|---|
| Source | `web/data/master_db.json` (already JSON) | `dbd-scraper/hair/thaihairguide_master.csv` |
| Build step | none | `node scripts/build-data.mjs` (existing script) |
| Target in git | `web/data/master_db.json` | `thaifacialclinic-portable/public/data/clinics.json` |

**Flow:**

1. Confirm `dbd-scraper/hair/thaihairguide_master.csv` exists and is valid (row count > 0)
2. Run `node scripts/build-data.mjs` from `thaifacialclinic-portable/` — this regenerates `public/data/clinics.json` using the existing transform logic
3. Read generated JSON to get clinic count for the commit message
4. `git fetch origin main`
5. Create isolated detached worktree at `origin/main` (outside repo, same pattern as dental)
6. Copy `clinics.json` into the worktree at `thaifacialclinic-portable/public/data/clinics.json`
7. `git add` → if no diff vs `origin/main`, skip (no empty commits)
8. Commit + push → Vercel git integration triggers auto-deploy
9. Cleanup worktree

Safety: if `node` is not found or build fails, log and exit without touching git.

---

### One-time: Add `clinics.json` to git

`clinics.json` is currently untracked. It must be committed to `origin/main` before the worktree diff-check can work:

```
git add thaifacialclinic-portable/public/data/clinics.json
git commit -m "chore: track clinics.json for automated hair data pipeline"
git push
```

---

### One-time: Vercel Git Integration

Connect `thaifacialclinic-portable` to GitHub so pushes to `main` trigger auto-deploy:

- Vercel Dashboard → project `thaifacialclinic-portable` → Settings → Git
- Connect repo: `presidentoko`'s deliverable repo
- **Root Directory:** `thaifacialclinic-portable`
- Production Branch: `main`

After this, CLI deploys (`vercel --prod`) can continue to work alongside git-triggered deploys.

---

### Windows Task Scheduler

```
Task name:   DeployHairData
Trigger:     Daily, 06:00 local time (after scrapers complete)
Action:      .venv\Scripts\python.exe scripts\deploy_hair_data.py
Start in:    C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable
Log:         logs\deploy_hair_data.log
```

Same setup as dental's `DeployClinicDentalMasterDB` task.

---

## Files Changed

| File | Action |
|---|---|
| `scripts/deploy_hair_data.py` | Create (new script) |
| `thaifacialclinic-portable/public/data/clinics.json` | Add to git tracking (1-time) |
| Windows Task Scheduler | Register new task (manual step) |
| Vercel git integration | Connect via dashboard (manual step) |

No changes to `build-data.mjs`, `package.json`, or any app code.

---

## Error Handling

| Situation | Behavior |
|---|---|
| `thaihairguide_master.csv` missing | Log warning, exit 0 (no deploy) |
| `node` build fails | Log error, exit 1 (no git touch) |
| `clinics.json` unchanged vs `origin/main` | Log "no change", exit 0 |
| `git push` fails | Retry 4×, log failure, exit 1 |

---

## Out of Scope

- Automating the individual scraper runs (still manual / separate scheduler)
- Automating the CSV merge into `thaihairguide_master.csv`
- Any changes to the Next.js app or `build-data.mjs`
