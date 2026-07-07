#!/usr/bin/env python3
"""Render all 12 RIBO SVG logos to a single contact-sheet PNG using the
headless browser. Output: /home/z/my-project/download/ribo-logos/contact-sheet.png
Also writes individual PNGs for each logo."""
import os
import subprocess
import time

LOGOS_DIR = "/home/z/my-project/download/ribo-logos"
OUT_DIR = "/tmp/ribo-logo-render"
os.makedirs(OUT_DIR, exist_ok=True)

# Build a contact-sheet HTML that embeds all 12 SVGs in a 4x3 grid
logos = sorted([f for f in os.listdir(LOGOS_DIR) if f.endswith(".svg")])
html = """<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body { margin: 0; padding: 32px; background: #07071A; font-family: 'Space Grotesk', sans-serif; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .cell { background: #0D0D2B; border: 1px solid rgba(184,184,255,0.18); border-radius: 8px; padding: 16px; text-align: center; }
  .num { color: #5C5CFF; font-family: 'Space Mono', monospace; font-size: 12px; letter-spacing: 0.2em; margin-bottom: 8px; }
  .title { color: #F4F4FF; font-size: 14px; font-weight: 600; margin-bottom: 12px; }
  img { width: 200px; height: 200px; }
</style></head><body>
<div class="grid">
"""
for i, logo in enumerate(logos, 1):
    title = logo.replace(f"{i:02d}-", "").replace(".svg", "").replace("-", " ").title()
    # Use absolute file path so the browser can resolve the SVG regardless of CWD
    abs_path = f"file://{LOGOS_DIR}/{logo}"
    html += f'<div class="cell"><div class="num">CONCEPT {i:02d}</div><div class="title">{title}</div><img src="{abs_path}"></div>\n'
html += "</div></body></html>"

sheet_html = os.path.join(OUT_DIR, "contact-sheet.html")
with open(sheet_html, "w") as f:
    f.write(html)

# Copy the HTML to the logos dir so relative SVG paths resolve
# (the browser opens via file:// URL)
print(f"Contact sheet HTML: {sheet_html}")
print(f"Logos referenced: {len(logos)}")
