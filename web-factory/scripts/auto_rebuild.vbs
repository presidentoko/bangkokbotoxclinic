' Hidden launcher for auto_rebuild.py — suppresses the console flash on every
' scheduled task run (10분 주기라 하루 144번 깜빡였다).
'
' scripts/ensure_watchdog.vbs 와 같은 패턴. PowerShell 의 -WindowStyle Hidden 은
' 프로세스가 뜬 *뒤에* 숨기는 것이라 시작 순간의 깜빡임을 못 막는다. wscript 로
' 띄우면 콘솔 자체가 생기지 않는다.
'
' 2026-08-09: 예약 작업이 C:\Users\yn\Desktop\deliverable\... (Work\0_main 누락)
' 을 가리켜 10분마다 0x80070002 로 실패하고 있었다. 레포가 Desktop\Work\0_main\
' 아래로 옮겨졌는데 작업 등록이 따라가지 않은 것. 경로를 바꿀 일이 생기면
' 이 파일과 예약 작업 양쪽을 함께 확인할 것.
Set sh = CreateObject("Wscript.Shell")
sh.Run "cmd /c """"C:\Users\yn\AppData\Local\Programs\Python\Python312\python.exe"" ""C:\Users\yn\Desktop\Work\0_main\deliverable\deliverable\web-factory\scripts\auto_rebuild.py""""", 0, False
