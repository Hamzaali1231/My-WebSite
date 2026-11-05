$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$tasks=Get-Content outputs/image-tasks.json -Raw | ConvertFrom-Json
$encoder=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters=[System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0]=[System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality,[long]88)
foreach($task in $tasks){
  $inputPath=Join-Path (Get-Location) $task.input
  $outPath=Join-Path (Get-Location) $task.output
  $im=[System.Drawing.Image]::FromFile($inputPath)
  $ratio=[Math]::Min([double]1,[Math]::Min([double]1000/$im.Width,[double]800/$im.Height))
  $bmp=[System.Drawing.Bitmap]::new([Math]::Max(1,[int]($im.Width*$ratio)),[Math]::Max(1,[int]($im.Height*$ratio)))
  $g=[System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($im,0,0,$bmp.Width,$bmp.Height)
  $bmp.Save($outPath,$encoder,$parameters)
  $g.Dispose();$bmp.Dispose();$im.Dispose()
}
Write-Output ('Optimized '+$tasks.Count+' gallery images')
