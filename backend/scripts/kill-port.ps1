param(
  [int]$Port = 5000
)

Write-Host "Checking port $Port..."
$lines = netstat -ano | Select-String ":$Port\s"

if (-not $lines) {
  Write-Host "No process is listening on port $Port."
  exit 0
}

$pids = $lines | ForEach-Object {
  if ($_ -match '\s+(\d+)\s*$') { [int]$matches[1] }
} | Sort-Object -Unique

foreach ($pid in $pids) {
  Write-Host "Stopping PID $pid on port $Port..."
  taskkill /PID $pid /F 2>$null
}

Write-Host "Done."
