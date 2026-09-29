Add-Type -AssemblyName System.Drawing

$inputPath = "d:\new cleclo\public\cleclo.png"
$bmp = [System.Drawing.Bitmap]::FromFile($inputPath)

$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y++) {
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Pixel with opacity and not background white
        if ($c.A -gt 15 -and -not ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240)) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Bounds: minX=$minX, minY=$minY, maxX=$maxX, maxY=$maxY"

# Add 2px safety padding
$padding = 4
$minX = [Math]::Max(0, $minX - $padding)
$minY = [Math]::Max(0, $minY - $padding)
$maxX = [Math]::Min($bmp.Width - 1, $maxX + $padding)
$maxY = [Math]::Min($bmp.Height - 1, $maxY + $padding)

$cropWidth = $maxX - $minX + 1
$cropHeight = $maxY - $minY + 1

$rect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$bmp.Dispose()

$outputPath = "d:\new cleclo\public\cleclo-cropped.png"
$cropped.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()

Move-Item -Path $outputPath -Destination $inputPath -Force
Write-Host "Success! New cropped size: ${cropWidth}x${cropHeight}"
