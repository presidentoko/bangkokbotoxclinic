# sweep_resume.ps1
# Undo sweep_pause.ps1: remove ONLY the run\<name>.disabled markers that pause
# created (tracked in run\sweep_paused.txt), so the always-on watchdog restarts
# the paused scrapers on its next tick. Pre-existing chain-state markers are left
# untouched.
#
# Registered as Scheduled Task "SweepResumeScrapers" @ Sun 09:00 (BKK local).
#
# WHY an OS scheduled task and NOT an in-workflow `if: always()` step: the failure
# we are fixing is "self-hosted runner loses communication / dies" mid-sweep. If
# the runner dies, NO further workflow steps run - including cleanup - so an
# in-job resume could leave scrapers paused forever. An OS task fires regardless
# of the runner's fate. This is the safety guarantee.
param([switch]$DryRun)

$ErrorActionPreference = 'Continue'
$ROOT  = Split-Path -Parent $PSScriptRoot
$RUN   = Join-Path $ROOT 'run'
$LOG   = Join-Path $ROOT 'logs\sweep_pause_resume.log'
$TRACK = Join-Path $RUN  'sweep_paused.txt'

function Log($m) {
  $line = "[{0}] RESUME {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $m
  try { Add-Content -Path $LOG -Value $line -Encoding utf8 } catch {}
  Write-Output $line
}

$names = @()
if (Test-Path $TRACK) {
  $names = Get-Content $TRACK -ErrorAction SilentlyContinue | Where-Object { $_ -and $_.Trim() }
} else {
  Log "no track file ($TRACK) - nothing to resume (pre-existing markers left untouched)"
}

foreach ($name in $names) {
  $marker = Join-Path $RUN "$name.disabled"
  if (Test-Path $marker) {
    if ($DryRun) { Log "would remove marker $name.disabled" }
    else { Remove-Item $marker -Force -ErrorAction SilentlyContinue; Log "resumed $name" }
  }
}

if ($DryRun) { Log "dry-run complete (no changes made)"; exit 0 }

if (Test-Path $TRACK) { Remove-Item $TRACK -Force -ErrorAction SilentlyContinue }

# Safety net: if the watchdog itself died (e.g. the runner crash took the box hard),
# bring it back so the un-paused services actually get restarted.
$wd = Get-CimInstance Win32_Process -Filter "name='python.exe'" -ErrorAction SilentlyContinue |
      Where-Object { $_.CommandLine -match 'watchdog\.py' }
if (-not $wd) {
  $vbs = Join-Path $ROOT 'scripts\ensure_watchdog.vbs'
  if (Test-Path $vbs) { & wscript.exe $vbs; Log "watchdog was down -> invoked ensure_watchdog.vbs" }
  else { Log "WARN watchdog down and ensure_watchdog.vbs missing at $vbs" }
}
Log "resume complete ($($names.Count) services un-paused)"
