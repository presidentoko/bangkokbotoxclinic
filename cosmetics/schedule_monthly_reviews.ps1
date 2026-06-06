# Register Windows Task Scheduler task:
# Runs review scrapers on the 1st of every month at 02:00 AM for 36 hours.
# Run this script ONCE as Administrator to set up the schedule.
#
# To run manually now:
#   python -m cosmetics.run_reviews --hours 36 --fresh
#
# To stop a running review pass early:
#   New-Item -ItemType File cosmetics/state/STOP_REVIEWS

$taskName  = "Cosmetics_MonthlyReviews"
$workDir   = Split-Path -Parent $PSScriptRoot
$python    = (Get-Command python).Source
$cmd       = "$python -m cosmetics.run_reviews --hours 36 --fresh"

$action    = New-ScheduledTaskAction -Execute $python `
               -Argument "-m cosmetics.run_reviews --hours 36 --fresh" `
               -WorkingDirectory $workDir

# Monthly: day 1 at 02:00
$trigger   = New-ScheduledTaskTrigger -Monthly -DaysOfMonth 1 -At "02:00"

$settings  = New-ScheduledTaskSettingsSet `
               -ExecutionTimeLimit "40:00:00" `
               -MultipleInstances IgnoreNew `
               -WakeToRun $false

# Run as current user (no password stored)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -RunLevel Limited

Register-ScheduledTask -TaskName $taskName `
  -Action $action -Trigger $trigger `
  -Settings $settings -Principal $principal `
  -Force | Out-Null

Write-Host "Registered: '$taskName' — runs every 1st of month at 02:00 (36h window)"
Write-Host "To verify:  Get-ScheduledTask -TaskName '$taskName'"
Write-Host "To run now: Start-ScheduledTask -TaskName '$taskName'"
Write-Host "To remove:  Unregister-ScheduledTask -TaskName '$taskName' -Confirm:`$false"
