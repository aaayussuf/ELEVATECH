# generate_category_images.ps1
# ------------------------------------------------------------------
# Generates the four category/brand images referenced by
# backend/app/seed.py:
#     /assets/products/brands/laptops.png
#     /assets/products/brands/printers.png
#     /assets/products/brands/phones.png
#     /assets/products/brands/accessories.png
#
# Output: frontend/public/assets/products/brands/*.png
#
# Icons are lucide-style line drawings on the ElevaTech dark-navy
# card gradient so they blend with the home "Shop By Category" cards.
# ------------------------------------------------------------------

param(
    [int]$Size = 512
)

Add-Type -AssemblyName System.Drawing

$script:s = [double]$Size / 24.0   # map a 24x24 icon grid onto the canvas
$script:outDir = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\frontend\public\assets\products\brands"))
New-Item -ItemType Directory -Force -Path $script:outDir | Out-Null

$script:strokeBlue = [System.Drawing.Color]::FromArgb(255, 96, 165, 250)  # #60A5FA
$script:topColor   = [System.Drawing.Color]::FromArgb(255, 16, 28, 49)    # #101C31
$script:bottomColor = [System.Drawing.Color]::FromArgb(255, 11, 20, 37)   # #0B1425

function New-IconPen {
    $pen = New-Object System.Drawing.Pen @($script:strokeBlue, 24)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    return $pen
}

function New-Canvas {
    $bmp = New-Object System.Drawing.Bitmap @($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $rect = New-Object System.Drawing.RectangleF @(0, 0, $Size, $Size)
    $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush @($rect, $script:topColor, $script:bottomColor, 90.0)
    $g.FillRectangle($grad, $rect)
    $grad.Dispose()
    return @{ Bitmap = $bmp; Gfx = $g }
}

function Save-Icon($bmp, $g, [string]$fileName) {
    $outPath = Join-Path $script:outDir $fileName
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Created $outPath"
}

function Add-Glow([System.Drawing.Graphics]$g, [double]$cx, [double]$cy, [double]$radiusUnits) {
    $segments = 64
    $r = $radiusUnits * $script:s
    $cxp = $cx * $script:s
    $cyp = $cy * $script:s

    $pts = New-Object 'System.Collections.Generic.List[System.Drawing.PointF]'
    for ($i = 0; $i -lt $segments; $i++) {
        $angle = (2 * [math]::PI * $i) / $segments
        $pts.Add((New-Object System.Drawing.PointF @([float]($cxp + $r * [math]::Cos($angle)), [float]($cyp + $r * [math]::Sin($angle)))))
    }

    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddPolygon($pts.ToArray())

    $brush = New-Object System.Drawing.Drawing2D.PathGradientBrush($path)
    $brush.CenterColor = [System.Drawing.Color]::FromArgb(80, $script:strokeBlue)
    $surroundColors = New-Object System.Drawing.Color[] $segments
    for ($i = 0; $i -lt $segments; $i++) {
        $surroundColors[$i] = [System.Drawing.Color]::FromArgb(0, $script:strokeBlue)
    }
    $brush.SurroundColors = $surroundColors

    $g.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()
    $pts.Clear()
}

function Add-RoundedRectPath(
    [System.Drawing.Drawing2D.GraphicsPath]$path,
    [double]$x1, [double]$y1, [double]$x2, [double]$y2,
    [double]$r, [bool]$closed = $true
) {
    $left   = [float]($x1 * $script:s)
    $top    = [float]($y1 * $script:s)
    $right  = [float]($x2 * $script:s)
    $bottom = [float]($y2 * $script:s)
    $rad    = [float]($r * $script:s)
    $w = $right - $left
    $h = $bottom - $top
    if ($rad -gt $w / 2) { $rad = $w / 2 }
    if ($rad -gt $h / 2) { $rad = $h / 2 }

    $path.AddArc($left, $top, 2 * $rad, 2 * $rad, 180, 90)
    $path.AddArc($right - 2 * $rad, $top, 2 * $rad, 2 * $rad, 270, 90)
    $path.AddArc($right - 2 * $rad, $bottom - 2 * $rad, 2 * $rad, 2 * $rad, 0, 90)
    $path.AddArc($left, $bottom - 2 * $rad, 2 * $rad, 2 * $rad, 90, 90)
    if ($closed) { $path.CloseFigure() }
}

function New-Laptop {
    $c = New-Canvas
    Add-Glow $c.Gfx 12 11 10

    $pen = New-IconPen
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRectPath $path 3 4 21 16 2
    $g = $c.Gfx
    $g.DrawPath($pen, $path)
    $g.DrawLine($pen, [float](2 * $script:s), [float](20 * $script:s), [float](22 * $script:s), [float](20 * $script:s))

    $path.Dispose()
    $pen.Dispose()
    Save-Icon $c.Bitmap $g "laptops.png"
}

function New-Phone {
    $c = New-Canvas
    Add-Glow $c.Gfx 12 12 9.5

    $pen = New-IconPen
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRectPath $path 5 2 19 22 2
    $g = $c.Gfx
    $g.DrawPath($pen, $path)

    $dotR = [float](0.55 * $script:s)
    $brush = New-Object System.Drawing.SolidBrush $script:strokeBlue
    $g.FillEllipse($brush, [float](12 * $script:s) - $dotR, [float](18 * $script:s) - $dotR, 2 * $dotR, 2 * $dotR)
    $brush.Dispose()

    $path.Dispose()
    $pen.Dispose()
    Save-Icon $c.Bitmap $g "phones.png"
}

function New-Printer {
    $c = New-Canvas
    Add-Glow $c.Gfx 12 13 9.5

    $pen = New-IconPen
    $sx = $script:s
    $g = $c.Gfx

    # paper feed slot on top (open downward)
    $slot = New-Object System.Drawing.Drawing2D.GraphicsPath
    $slot.StartFigure()
    $slot.AddLine([float](6 * $sx), [float](9 * $sx), [float](6 * $sx), [float](3 * $sx))
    $slot.AddArc([float](5 * $sx), [float](2 * $sx), [float](2 * $sx), [float](2 * $sx), 90, 90)
    $slot.AddLine([float](7 * $sx), [float](2 * $sx), [float](17 * $sx), [float](2 * $sx))
    $slot.AddArc([float](17 * $sx), [float](2 * $sx), [float](2 * $sx), [float](2 * $sx), 0, 90)
    $slot.AddLine([float](18 * $sx), [float](3 * $sx), [float](18 * $sx), [float](9 * $sx))
    $g.DrawPath($pen, $slot)

    # printer body (rounded, with an opening at the bottom centre)
    $body = New-Object System.Drawing.Drawing2D.GraphicsPath
    $body.StartFigure()
    $body.AddLine([float](6 * $sx), [float](18 * $sx), [float](4 * $sx), [float](18 * $sx))
    $body.AddArc([float](2 * $sx), [float](16 * $sx), [float](4 * $sx), [float](4 * $sx), 90, 90)
    $body.AddLine([float](2 * $sx), [float](15 * $sx), [float](2 * $sx), [float](11 * $sx))
    $body.AddArc([float](2 * $sx), [float](9 * $sx), [float](4 * $sx), [float](4 * $sx), 180, 90)
    $body.AddLine([float](4 * $sx), [float](9 * $sx), [float](20 * $sx), [float](9 * $sx))
    $body.AddArc([float](18 * $sx), [float](9 * $sx), [float](4 * $sx), [float](4 * $sx), 270, 90)
    $body.AddLine([float](22 * $sx), [float](11 * $sx), [float](22 * $sx), [float](15 * $sx))
    $body.AddArc([float](18 * $sx), [float](16 * $sx), [float](4 * $sx), [float](4 * $sx), 0, 90)
    $body.AddLine([float](18 * $sx), [float](18 * $sx), [float](6 * $sx), [float](18 * $sx))
    $g.DrawPath($pen, $body)

    # paper output tray
    $tray = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRectPath $tray 6 14 18 22 1
    $g.DrawPath($pen, $tray)

    $slot.Dispose()
    $body.Dispose()
    $tray.Dispose()
    $pen.Dispose()
    Save-Icon $c.Bitmap $g "printers.png"
}

function New-Headphones {
    $c = New-Canvas
    Add-Glow $c.Gfx 12 13 9.5

    $pen = New-IconPen
    $sx = $script:s
    $g = $c.Gfx

    # headband arc
    $band = New-Object System.Drawing.Drawing2D.GraphicsPath
    $band.AddArc([float](3 * $sx), [float](5 * $sx), [float](18 * $sx), [float](18 * $sx), 180, 180)
    $g.DrawPath($pen, $band)

    # left and right ear cups
    $left = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRectPath $left 3 13 8 21 2
    $g.DrawPath($pen, $left)

    $right = New-Object System.Drawing.Drawing2D.GraphicsPath
    Add-RoundedRectPath $right 16 13 21 21 2
    $g.DrawPath($pen, $right)

    $band.Dispose()
    $left.Dispose()
    $right.Dispose()
    $pen.Dispose()
    Save-Icon $c.Bitmap $g "accessories.png"
}

New-Laptop
New-Phone
New-Printer
New-Headphones
Write-Host "All 4 category images generated in $($script:outDir)"