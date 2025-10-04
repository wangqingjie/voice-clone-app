# 测试 TTS API
Write-Host "Testing TTS API..." -ForegroundColor Cyan

$bodyObject = @{
    text = "你好世界，这是一个测试"
    model = "speech-1.5"
    format = "mp3"
}
$body = $bodyObject | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/api/tts" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 10
    
    if ($response.success) {
        Write-Host "`n✅ TTS API 工作正常！" -ForegroundColor Green
        Write-Host "Audio Size: $($response.data.fileSize) bytes" -ForegroundColor Cyan
        Write-Host "Format: $($response.data.format)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ ERROR!" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

