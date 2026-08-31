# Supervisor for photo_scraper.py - Bangkok pass, then Pattaya.
#
# photo_scraper.py has its own restart loop, but it cannot be relied on: on
# 2026-08-31 the python process vanished mid-run without writing a single line
# after the traceback, so nothing inside the process was left to restart it.
# The scraper skips any restaurant whose output CSV already exists, so simply
# launching it again is both cheap and correct - that makes an external
# supervisor the right shape for this.
#
# Stop condition per city: a run that finishes without producing a single new
# output file, STALL_LIMIT times in a row. That covers both "genuinely done"
# (python prints "Nothing to do." and exits at once) and "wedged for reasons we
# cannot fix from here", without hard-coding an expected total.
#
# ASCII only. A previous version used an em dash, which the console wrote in a
# legacy code page and PowerShell then failed to parse.

# -StartAt picks which city to begin with. Needed because a finished city does
# not necessarily go quiet: Bangkok kept yielding 4 files a round from a handful
# of place_ids whose "/" sanitises to a filename the pending check doesn't
# recognise, and each of those resets the stall counter. Left alone it would
# have held the queue on a city with 881 of 881 places already collected while
# Pattaya sat at 5 of 1,137.
param(
    [ValidateSet("Bangkok", "Pattaya")]
    [string]$StartAt = "Bangkok"
)

$ErrorActionPreference = "Continue"
$base = "C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable"
$STALL_LIMIT = 3

function Invoke-City {
    param([string]$Label, [string]$InputCsv, [string]$OutDir, [string]$LogFile)

    Write-Host "=== $Label pass starting ==="
    $stall = 0
    $round = 0

    while ($stall -lt $STALL_LIMIT) {
        $round++
        $before = 0
        if (Test-Path $OutDir) {
            $before = (Get-ChildItem $OutDir -Filter *.csv -ErrorAction SilentlyContinue | Measure-Object).Count
        }

        $ts = Get-Date -Format "HH:mm:ss"
        Write-Host "[$ts] $Label round $round - $before files so far"

        python photo_scraper.py --input $InputCsv --output-dir $OutDir --log-file $LogFile

        $after = 0
        if (Test-Path $OutDir) {
            $after = (Get-ChildItem $OutDir -Filter *.csv -ErrorAction SilentlyContinue | Measure-Object).Count
        }
        $gained = $after - $before

        $ts = Get-Date -Format "HH:mm:ss"
        if ($gained -gt 0) {
            $stall = 0
            Write-Host "[$ts] $Label round $round ended, +$gained new (total $after). Relaunching."
        } else {
            $stall++
            Write-Host "[$ts] $Label round $round ended with nothing new ($stall/$STALL_LIMIT)."
        }

        # Only pause when we gained nothing; a productive run that merely
        # crashed should get straight back to work.
        if ($gained -le 0 -and $stall -lt $STALL_LIMIT) { Start-Sleep -Seconds 20 }
    }

    $final = 0
    if (Test-Path $OutDir) {
        $final = (Get-ChildItem $OutDir -Filter *.csv -ErrorAction SilentlyContinue | Measure-Object).Count
    }
    Write-Host "=== $Label pass done - $final output files ==="
}

Set-Location "$base\bangkok_reviews"

if ($StartAt -eq "Bangkok") {
    Invoke-City -Label "Bangkok" `
        -InputCsv "output/restaurants.csv" `
        -OutDir   "output/photos" `
        -LogFile  "output/photo.log"
} else {
    Write-Host "=== Skipping Bangkok (-StartAt Pattaya) ==="
}

Invoke-City -Label "Pattaya" `
    -InputCsv "../pattaya/output/restaurants.csv" `
    -OutDir   "../pattaya/output/photos" `
    -LogFile  "../pattaya/output/photo.log"

Write-Host "=== ALL DONE - Bangkok and Pattaya photo scraping complete ==="
