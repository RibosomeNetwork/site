#!/usr/bin/env python3
"""Render a contact sheet of all 12 minimal-2 RIBO logos at multiple sizes."""
import os

LOGOS_DIR = "/home/z/my-project/download/ribo-logos-minimal-2"
OUT_DIR = "/tmp/ribo-logo-minimal-2-render"
os.makedirs(OUT_DIR, exist_ok=True)

logos = sorted([f for f in os.listdir(LOGOS_DIR) if f.endswith(".svg")])

html = """<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body { margin: 0; padding: 32px; background: #07071A; font-family: 'Space Grotesk', sans-serif; color: #F4F4FF; }
  h1 { font-size: 22px; margin-bottom: 24px; color: #5C5CFF; letter-spacing: 0.05em; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .cell { background: #0D0D2B; border: 1px solid rgba(184,184,255,0.18); border-radius: 8px; padding: 16px; }
  .num { color: #5C5CFF; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.2em; margin-bottom: 4px; }
  .title { color: #F4F4FF; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
  .previews { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .preview { display: flex; align-items: center; justify-content: center; height: 140px; border-radius: 6px; }
  .preview.dark { background: #0D0D2B; border: 1px solid rgba(184,184,255,0.1); }
  .preview.light { background: #F4F4FF; }
  .preview img { width: 120px; height: 120px; }
  .favicons { display: flex; gap: 12px; align-items: center; padding-top: 12px; border-top: 1px solid rgba(184,184,255,0.1); }
  .favicon-cell { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .favicon-cell img { image-rendering: pixelated; }
  .favicon-cell .sz { font-family: 'Space Mono', monospace; font-size: 9px; color: #8080A8; }
</style></head><body>
<h1>RIBO Minimal Logo Concepts Batch 2 — 12 marks · 3 size tests</h1>
<div class="grid">
"""
for i, logo in enumerate(logos, 13):
    title = logo.replace(f"{i:02d}-", "").replace(".svg", "").replace("-", " ").title()
    abs_path = f"file://{LOGOS_DIR}/{logo}"
    html += f'''
    <div class="cell">
      <div class="num">CONCEPT {i:02d}</div>
      <div class="title">{title}</div>
      <div class="previews">
        <div><div style="font-family:'Space Mono',monospace;font-size:9px;color:#8080A8;letter-spacing:0.15em;margin-bottom:4px;">DARK</div>
        <div class="preview dark"><img src="{abs_path}"></div></div>
        <div><div style="font-family:'Space Mono',monospace;font-size:9px;color:#8080A8;letter-spacing:0.15em;margin-bottom:4px;">LIGHT</div>
        <div class="preview light"><img src="{abs_path}"></div></div>
      </div>
      <div class="favicons">
        <div class="favicon-cell"><img src="{abs_path}" width="48" height="48"><div class="sz">48px</div></div>
        <div class="favicon-cell"><img src="{abs_path}" width="32" height="32"><div class="sz">32px</div></div>
        <div class="favicon-cell"><img src="{abs_path}" width="16" height="16"><div class="sz">16px</div></div>
      </div>
    </div>
    '''

html += "</div></body></html>"

sheet_html = os.path.join(OUT_DIR, "contact-sheet.html")
with open(sheet_html, "w") as f:
    f.write(html)

print(f"Contact sheet HTML: {sheet_html}")
print(f"Logos referenced: {len(logos)}")
