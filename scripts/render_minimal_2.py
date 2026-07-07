import os
LOGOS_DIR = "/home/z/my-project/download/ribo-logos-minimal-2"
OUT_DIR = "/tmp/ribo-logo-minimal-2-render"
os.makedirs(OUT_DIR, exist_ok=True)
logos = sorted([f for f in os.listdir(LOGOS_DIR) if f.endswith(".svg")])
html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>'
html += 'body{margin:0;padding:32px;background:#07071A;font-family:Space Grotesk,sans-serif;color:#F4F4FF}'
html += 'h1{font-size:22px;margin-bottom:24px;color:#5C5CFF;letter-spacing:.05em}'
html += '.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}'
html += '.cell{background:#0D0D2B;border:1px solid rgba(184,184,255,.18);border-radius:8px;padding:16px}'
html += '.num{color:#5C5CFF;font-family:Space Mono,monospace;font-size:11px;letter-spacing:.2em;margin-bottom:4px}'
html += '.title{color:#F4F4FF;font-size:13px;font-weight:600;margin-bottom:12px}'
html += '.previews{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}'
html += '.preview{display:flex;align-items:center;justify-content:center;height:140px;border-radius:6px}'
html += '.preview.dark{background:#0D0D2B;border:1px solid rgba(184,184,255,.1)}'
html += '.preview.light{background:#F4F4FF}'
html += '.preview img{width:120px;height:120px}'
html += '.favicons{display:flex;gap:12px;align-items:center;padding-top:12px;border-top:1px solid rgba(184,184,255,.1)}'
html += '.favicon-cell{display:flex;flex-direction:column;align-items:center;gap:4px}'
html += '.favicon-cell img{image-rendering:pixelated}'
html += '.favicon-cell .sz{font-family:Space Mono,monospace;font-size:9px;color:#8080A8}'
html += '</style></head><body><h1>RIBO Minimal Batch 2 — 12 marks</h1><div class="grid">'
for i, logo in enumerate(logos, 13):
    title = logo.replace(f"{i:02d}-", "").replace(".svg", "").replace("-", " ").title()
    abs_path = f"file://{LOGOS_DIR}/{logo}"
    html += f'<div class="cell"><div class="num">CONCEPT {i:02d}</div><div class="title">{title}</div>'
    html += f'<div class="previews"><div><div style="font-family:Space Mono,monospace;font-size:9px;color:#8080A8;letter-spacing:.15em;margin-bottom:4px;">DARK</div><div class="preview dark"><img src="{abs_path}"></div></div>'
    html += f'<div><div style="font-family:Space Mono,monospace;font-size:9px;color:#8080A8;letter-spacing:.15em;margin-bottom:4px;">LIGHT</div><div class="preview light"><img src="{abs_path}"></div></div></div>'
    html += f'<div class="favicons"><div class="favicon-cell"><img src="{abs_path}" width="48" height="48"><div class="sz">48px</div></div><div class="favicon-cell"><img src="{abs_path}" width="32" height="32"><div class="sz">32px</div></div><div class="favicon-cell"><img src="{abs_path}" width="16" height="16"><div class="sz">16px</div></div></div></div>'
html += '</div></body></html>'
with open(os.path.join(OUT_DIR, "contact-sheet.html"), "w") as f:
    f.write(html)
print(f"Done. Logos: {len(logos)}")
