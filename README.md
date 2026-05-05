# Bangkok Clinics — Operator Manual

Independent directory of Bangkok aesthetic and medical clinics. End-to-end pipeline from Google Maps scraping → analysis → public website.

This document is for operators (you and the team) running the pipeline day-to-day. Not for end users.

## Quick reference

| Task | Command / Location |
|---|---|
| Check pipeline alive | `tail -f logs/watchdog.log` |
| Check scraping progress | `tail -f logs/bangkok_clinics_grid.log` `tail -f logs/bangkok_clinics_review.log` |
| Check master_db rebuild | `tail -f logs/master_db_builder.log` |
| Check auto git push | `tail -f logs/auto_push_loop.log` |
| Production site (Vercel) | https://bangkokbotoxclinic.com |
| Vercel staging URL | https://bangkokbotoxclinicbyym.vercel.app |
| GitHub repo | https://github.com/presidentoko/bangkokbotoxclinic |
| Vercel dashboard | https://vercel.com/dashboard |

## Architecture

```
[Google Maps]
     ↓ (scraper, every minute)
bangkok_clinics/output/clinics.csv + reviews/<id>_reviews.csv
     ↓ (master_db_builder, 5 min poll)
web/data/master_db.json   ← cleaned, scored, categorized
     ↓ (auto_push_loop, 10 min poll)
GitHub (origin/main)
     ↓ (Vercel auto-deploy on push)
https://bangkokbotoxclinic.com
```

End-to-end latency: new clinic discovered → live on prod ≈ 15-30 min.

## Background services (managed by `scripts/watchdog.py`)

| Service | What it does | Restart on death |
|---|---|---|
| `nordvpn_runner` | 8 NordVPN SOCKS5 tunnels (ports 2080-2087) | Yes |
| `bangkok_clinics_grid` | Discovers new clinics via Google Maps grid | Yes (until grid done) |
| `bangkok_clinics_review` | Scrapes detail + reviews for each discovered clinic | Yes |
| `master_db_builder` | Rebuilds `web/data/master_db.json` every 5 min on change | Yes |
| `auto_push_loop` | Auto-commit + push master_db changes every 10 min | Yes |
| `vercel_deploy_loop` | (Legacy) Vercel deploy hook trigger — only used if `VERCEL_DEPLOY_HOOK` env set; otherwise idle | Yes |

Watchdog itself is auto-respawned every 5 min by Windows Task Scheduler entry `DeliverableWatchdogCheck` running `scripts/ensure_watchdog.bat`.

## Pause / resume scrapers

To pause a service (without killing watchdog):
```powershell
New-Item -ItemType File run/<service_name>.disabled
```

To resume:
```powershell
Remove-Item run/<service_name>.disabled
```

Currently paused services (resume only when you want to scrape these cities again):
- `bangkok_review`, `ayutthaya_grid`, `chiang_mai_grid`, `phuket_grid`, `pattaya_grid`, `pattaya_review`, `chiang_rai_grid`, `khon_kaen_grid`, `korat_grid`, `hat_yai_grid`, `hua_hin_grid`, `krabi_grid`, `koh_samui_grid`, `udon_thani_grid`, `telegram_monitor`

## Multi-domain deploy (Phase 2 specialty domains)

Same codebase, 5 Vercel projects, different env per project:

| Domain | NEXT_PUBLIC_SITE_FOCUS | NEXT_PUBLIC_SITE_URL |
|---|---|---|
| bangkokbotoxclinic.com | `botox` | `https://bangkokbotoxclinic.com` |
| bangkokfillers.com | `filler` | `https://bangkokfillers.com` |
| haifacialclinic.com | `hifu` | `https://haifacialclinic.com` |
| (4th — your call) | `laser` or `facial` | … |
| (5th — your call) | `dental` | … |

When ready to launch domain N:
1. Vercel → Add New Project → import same GitHub repo
2. Set Root Directory = `web`
3. Set env vars (see `web/.env.example`)
4. Deploy
5. Connect domain in Vercel dashboard + DNS at registrar

## Vercel env vars (production)

All optional except `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SITE_FOCUS`.

| Var | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL | `https://bangkokbotoxclinic.com` |
| `NEXT_PUBLIC_SITE_FOCUS` | Specialty filter | `botox` |
| `NEXT_PUBLIC_KLOOK_AID` | Klook affiliate ID | (empty until partner) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense client ID | (empty until enabled) |
| `LEAD_WEBHOOK_URL` | Slack/Discord webhook for lead notifications | `https://hooks.slack.com/...` |
| `SPONSORED_EDITORS_PICK` | CSV clinic IDs for top Editor's Pick badge | `0x...,0x...` |
| `SPONSORED_RECOMMENDED` | CSV clinic IDs for Recommended badge | `0x...,0x...` |
| `SPONSORED_FEATURED` | CSV clinic IDs for Featured badge | `0x...,0x...` |

## Revenue model

### CPL (Cost Per Lead)
- Every clinic page has a green LINE button → opens BookingForm modal.
- Form submission hits `/api/lead`.
- If `LEAD_WEBHOOK_URL` is set, a Slack/Discord notification is posted with all fields.
- Operator manually relays the booking request to the clinic via their LINE/phone.
- Bill clinics ฿50/lead or ฿5,000/month flat once volume is proven.

### Featured slots
- Add a clinic ID to `SPONSORED_EDITORS_PICK` / `SPONSORED_RECOMMENDED` / `SPONSORED_FEATURED` env on Vercel → redeploy.
- Sorted to the top of all category/district lists with a coloured badge.
- ฿10,000/month per slot.

### Market intelligence (B2B SaaS)
- Pitch on `/for-clinics`. Future: build a `/dashboard` page reading from master_db.json showing competitor analytics.
- ฿8,000/month per clinic.

## Daily ops checklist

Run **once a day** (e.g. morning):

1. Scrape progress
   ```powershell
   Get-Content logs/bangkok_clinics_grid.log -Tail 5
   Get-Content logs/bangkok_clinics_review.log -Tail 5
   ```
   Expected: `processed=N pending=M …` lines updating, no `KICK` in last 30 min.

2. Master DB freshness
   ```powershell
   Get-Item web/data/master_db.json | Select-Object LastWriteTime, Length
   ```
   Expected: LastWriteTime within last 30 minutes.

3. Auto-push success
   ```powershell
   Get-Content logs/auto_push_loop.log -Tail 10
   ```
   Expected: at least one `push 완료` line in last 1 hour. If only `변경 없음` then scrape is not adding new data — check VPN.

4. Vercel deploy status
   - https://vercel.com/dashboard → click project → Deployments tab → most recent should be < 30 min old.

5. Live site
   - https://bangkokbotoxclinic.com → loads, shows recent clinic data.

## Troubleshooting

### Scraper stuck — no new clinics in last hour

```powershell
# Check VPN tunnels alive
Get-Content $env:TEMP/vpn_status.json | ConvertFrom-Json | Select-Object -ExpandProperty ports | Where-Object alive -eq $true | Measure-Object
```
Should be ≥ 4. If < 4, VPN is failing — check NordVPN account/credentials in `nordvpn/auth.txt`.

### Auto-push failing

```powershell
Get-Content logs/auto_push_loop.log -Tail 30
```
Common causes:
- `~/.git-credentials` missing/corrupt → re-run setup with new PAT
- GitHub token revoked → generate new at https://github.com/settings/tokens

### Vercel build failing

- Vercel dashboard → Deployments → click failed → Logs.
- Common: env var typo, master_db.json schema change.
- Manually rebuild: dashboard → ⋯ → Redeploy.

### Site shows stale data

- Check Vercel deploy timestamp.
- Manually trigger: dashboard → ⋯ → Redeploy.
- Or push an empty commit:
  ```bash
  git commit --allow-empty -m "trigger redeploy" && git push
  ```

## Adding a new clinic to Featured slot

1. Find the clinic ID on the live site (URL: `/clinic/<id>`)
2. Vercel dashboard → Settings → Environment Variables
3. Edit `SPONSORED_EDITORS_PICK` (or `_RECOMMENDED` or `_FEATURED`) → add the ID, comma-separated
4. Save → Vercel auto-redeploys (~ 2 min)
5. Refresh site → clinic now has the badge and is sorted top of category pages

## Manual data correction

If a clinic complains about a wrong listing:
1. Check the source on Google Maps — is it actually wrong there too? If yes, ask them to update Google. If no, file a bug.
2. To temporarily exclude a clinic from listings (rare): add their `place_id` to a hardcoded blocklist in `web/lib/data.ts` (TODO: env-driven blocklist).

## File map

```
deliverable/
├── README.md                          # this file
├── SPEC.md                            # technical spec (scraper architecture)
├── nordvpn_runner.py                  # 8x SOCKS5 tunnel orchestrator
├── nordvpn/                           # NordVPN config (auth.txt gitignored)
├── node-openvpn-socks/                # OpenVPN SOCKS5 client (Node.js)
├── bangkok_clinics/                   # active scraper
│   ├── config.py                      # SEARCH_QUERY, MIN_REVIEW_COUNT, etc.
│   ├── scraper_grid.py                # discovers clinics
│   ├── scraper.py                     # collects reviews + metadata
│   └── output/                        # CSVs (gitignored)
│       ├── clinics.csv                # 1 row per clinic
│       └── reviews/<pid>_reviews.csv  # individual review files
├── bangkok_reviews/                   # legacy restaurant scraper (paused)
├── scripts/
│   ├── watchdog.py                    # process supervisor (root of all)
│   ├── ensure_watchdog.bat            # Windows scheduled task entry
│   ├── ensure_watchdog.vbs            # silent launcher
│   ├── run.sh / stop.sh               # manual start/stop
│   └── run_clinics.sh                 # phase1/phase2 helper
├── web/                               # Next.js 16 app — Vercel deploys this
│   ├── app/                           # routes (App Router)
│   ├── components/                    # React components
│   ├── lib/                           # data loading, types, helpers
│   ├── data/master_db.json            # cleaned source-of-truth (committed!)
│   ├── scripts/
│   │   ├── build_master_db.py         # CSV → JSON cleaner
│   │   ├── watch_and_build.py         # 5-min polling daemon
│   │   ├── auto_git_push.py           # commit + push when JSON changes
│   │   └── auto_push_loop.py          # 10-min daemon
│   └── vercel.json                    # Vercel config
├── logs/                              # rotated logs (gitignored)
├── run/                               # PID + state files (gitignored)
└── .venv/                             # Python venv (gitignored)
```

## When you (the operator) leave for the day

The pipeline runs unattended. As long as:
- Watchdog is alive (auto-respawned by scheduler)
- VPN tunnels stay up (auto-rotated)
- GitHub credentials valid

…it will continue scraping, building, pushing, and deploying every 30 minutes for as long as the laptop stays on.

If the laptop sleeps/restarts: watchdog re-spawns on next scheduler tick (≤ 5 min). Scrape resumes from where it left off (resume-safe by design).

## Contacts

- Developer (handoff): see git log, contact through repo issues.
- NordVPN account: stored in `nordvpn/auth.txt` (do not commit).
- GitHub: presidentoko / bangkokbotoxclinic.
- Vercel: linked to GitHub repo, auto-deploy on `main` push.
