# Launches the Lazada price run detached from the calling shell.
$root = 'C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable'
$py   = 'C:\Users\yn\AppData\Local\Programs\Python\Python312\python.exe'
$a = @('-u','-m','petfood.lazada_prices','--verbose',
       '--delay','8','--slug-tries','3',
       '--block-cooldown','900','--max-cooldown','3600','--max-blocks','12')
$p = Start-Process -FilePath $py -ArgumentList $a -WorkingDirectory $root `
     -RedirectStandardOutput "$root\petfood\lazada_prices.log" `
     -RedirectStandardError  "$root\petfood\lazada_prices.err" `
     -WindowStyle Hidden -PassThru
Write-Output "PID $($p.Id)"
