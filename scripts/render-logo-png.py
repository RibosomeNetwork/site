#!/usr/bin/env python3
"""Render the RIBO Wave Strips logo to PNG at multiple sizes for og:image,
apple-touch-icon, and legacy PNG favicons.
"""
import os
import subprocess

LOGO_SVG = "/home/z/my-project/public/icon.svg"
OUT_DIR = "/home/z/my-project/public"

# Build a small HTML page that renders the SVG at high resolution, then we'll
# screenshot it. This avoids needing rsvg-convert or imagemagick.
html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body {{ margin: 0; padding: 0; background: transparent; }}
  .canvas {{ width: 1024px; height: 1024px; display: flex; align-items: center; justify-content: center; }}
  img {{ width: 1024px; height: 1024px; }}
</style></head><body>
<div class="canvas"><img src="file://{LOGO_SVG}"></div>
</body></html>
"""

html_path = "/tmp/ribo-logo-render.html"
with open(html_path, "w") as f:
    f.write(html)

print(f"HTML render page: {html_path}")
print(f"Output dir: {OUT_DIR}")
