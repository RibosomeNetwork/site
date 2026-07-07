import os
LOGO_SVG = "/home/z/my-project/public/icon.svg"
html = f'<!DOCTYPE html><html><head><meta charset="UTF-8"><style>'
html += 'body{margin:0;padding:0;background:transparent}'
html += '.canvas{width:1024px;height:1024px;display:flex;align-items:center;justify-content:center}'
html += 'img{width:1024px;height:1024px}'
html += '</style></head><body>'
html += f'<div class="canvas"><img src="file://{LOGO_SVG}"></div>'
html += '</body></html>'
with open("/home/z/my-project/scripts/render-logo-v4.html", "w") as f:
    f.write(html)
print("HTML written")
