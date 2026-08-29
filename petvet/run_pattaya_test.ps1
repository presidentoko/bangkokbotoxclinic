$root = 'C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable'
$py   = 'C:\Users\yn\AppData\Local\Programs\Python\Python312\python.exe'
$env2 = @{
  CITY_OUTPUT_DIR = "petvet_output_pattaya_test"
  CITY_LAT        = "12.9236"
  CITY_LNG        = "100.8825"
  CITY_RADIUS_M   = "3000"
  SEARCH_QUERY    = "โรงพยาบาลสัตว์"
  SEARCH_TAG      = "th_vet"
  GRID_N_WORKERS  = "3"
}
foreach ($k in $env2.Keys) { [Environment]::SetEnvironmentVariable($k, $env2[$k], "Process") }
$p = Start-Process -FilePath $py -ArgumentList @('-u','-m','petvet.scraper_grid') `
     -WorkingDirectory $root `
     -RedirectStandardOutput "$root\petvet\pattaya_test.log" `
     -RedirectStandardError  "$root\petvet\pattaya_test.err" `
     -WindowStyle Hidden -PassThru
Write-Output "PID $($p.Id)"
