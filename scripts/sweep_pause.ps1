# sweep_pause.ps1
# Free RAM for the bangkok-real-estate weekly-refresh CI sweep (self-hosted runner
# on this machine) by pausing this project's browser scrapers during the Sunday
# sweep window. Uses the watchdog's OWN run\<name>.disabled markers, so even if
# ensure_watchdog.vbs relaunches the watchdog mid-window it will SKIP these
# services (watchdog.py: `if s.is_paused(): continue`) and not respawn them.
#
# Resume (sweep_resume.ps1) removes ONLY the markers this run created, restoring
# any pre-existing chain-state .disabled markers untouched.
#
# Registered as Scheduled Task "SweepPauseScrapers" @ Sun 02:00 (BKK local).
# Runner-independent on purpose: see sweep_resume.ps1 header.
param([switch]$DryRun)

$ErrorActionPreference = 'Continue'
$ROOT  = Split-Path -Parent $PSScriptRoot      # scripts\ is directly under project root
$RUN   = Join-Path $ROOT 'run'
$LOG   = Join-Path $ROOT 'logs\sweep_pause_resume.log'
$TRACK = Join-Path $RUN  'sweep_paused.txt'

# Keep these alive: SOCKS proxies + lightweight monitors/builders (negligible RAM,
# no headless browser). Every OTHER run\<name>.pid is a browser scraper → pause it.
$KEEP = @(
  'nordvpn_runner','watchdog','telegram_monitor','health_monitor',
  'throughput_monitor','auto_push_loop','master_db_builder',
  'restaurants_db_builder','wiki_summary_gen'
)

function Log($m) {
  $line = "[{0}] PAUSE {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m
  try { Add-Content -Path $LOG -Value $line -Encoding utf8 } catch {}
  Write-Output $line
}

if (-not (Test-Path $RUN)) { Log "run dir not found: $RUN - abort"; exit 1 }

$pidFiles = Get-ChildItem -Path $RUN -Filter '*.pid' -ErrorAction SilentlyContinue
$created = New-Object System.Collections.Generic.List[string]
foreach ($pf in $pidFiles) {
  $name = $pf.BaseName
  if ($KEEP -contains $name) { continue }
  $marker = Join-Path $RUN "$name.disabled"
  $procId = (Get-Content $pf.FullName -ErrorAction SilentlyContinue | Select-Object -First 1)
  if ($DryRun) {
    Log "would pause+kill $name (pid=$procId)$(if (Test-Path $marker) {' [marker already present - would NOT track]'})"
    continue
  }
  # Only create+track markers we add, so resume restores prior state exactly.
  if (-not (Test-Path $marker)) {
    New-Item -ItemType File -Path $marker -Force | Out-Null
    $created.Add($name)
  }
  # PID-reuse guard (mirrors watchdog.kick): only kill if the PID is still a
  # python/node process. Stale/shared .pid files were observed, so never taskkill
  # a recycled PID that the OS may have handed to chrome/explorer/etc.
  if ("$procId" -match '^\d+$') {
    $p = Get-Process -Id ([int]$procId) -ErrorAction SilentlyContinue
    if ($p -and ($p.ProcessName -in @('python','node'))) {
      & taskkill /F /T /PID $procId 2>$null | Out-Null
    }
  }
}

if ($DryRun) { Log "dry-run complete (no changes made)"; exit 0 }

# Sweep leftover headless browsers (at 02:00 these belong only to the just-killed
# scrapers; the condo reviews loop and the not-yet-started CI sweep don't own any).
Get-Process chrome-headless-shell -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Set-Content -Path $TRACK -Value $created -Encoding utf8
Start-Sleep -Seconds 3
$free = [math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB,1)
Log ("paused {0} services [{1}]; free RAM now {2}GB" -f $created.Count, ($created -join ','), $free)
