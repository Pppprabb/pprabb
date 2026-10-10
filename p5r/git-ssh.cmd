@echo off
REM Wrapper for Git to use Windows OpenSSH reliably (avoids MSYS HOME/known_hosts issues).
"C:\Windows\System32\OpenSSH\ssh.exe" ^
  -o StrictHostKeyChecking=accept-new ^
  -o UserKnownHostsFile="%USERPROFILE%\.ssh\known_hosts" ^
  %*

