import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WEB_DIR = Path(__file__).parent.resolve()
ICONS_DIR = WEB_DIR / "icons"
COVERS_DIR = WEB_DIR / "covers"
ICONS_DIR.mkdir(parents=True, exist_ok=True)
COVERS_DIR.mkdir(parents=True, exist_ok=True)

def draw_retro_vinyl(draw, cx, cy, radius, label_color, border_color):
    # Outer vinyl black disk
    draw.ellipse([cx - radius, cy - radius, cx + radius, cy + radius], fill="#111113", outline="#222225", width=3)
    
    # Phonograph grooves
    for r in range(int(radius * 0.45), int(radius * 0.95), max(4, int(radius * 0.05))):
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline="#1c1c20", width=1)
        if r % 12 == 0:
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline="#28282e", width=1)

    # Vinyl light sheen arcs (highlights)
    sheen_box = [cx - radius * 0.9, cy - radius * 0.9, cx + radius * 0.9, cy + radius * 0.9]
    draw.arc(sheen_box, start=35, end=75, fill="#383842", width=6)
    draw.arc(sheen_box, start=215, end=255, fill="#383842", width=6)

    # Center label
    lr = radius * 0.38
    draw.ellipse([cx - lr, cy - lr, cx + lr, cy + lr], fill=label_color, outline=border_color, width=3)
    
    # Spindle hole
    sr = radius * 0.07
    draw.ellipse([cx - sr, cy - sr, cx + sr, cy + sr], fill="#fbfbfb", outline="#666666", width=2)
    sr2 = radius * 0.04
    draw.ellipse([cx - sr2, cy - sr2, cx + sr2, cy + sr2], fill="#080808")

def create_pwa_icons():
    for size in [192, 512]:
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Rounded background card
        bg_margin = int(size * 0.04)
        draw.rounded_rectangle([bg_margin, bg_margin, size - bg_margin, size - bg_margin], radius=int(size * 0.22), fill="#241412")
        
        # Outer gold ring
        draw.rounded_rectangle([bg_margin, bg_margin, size - bg_margin, size - bg_margin], radius=int(size * 0.22), outline="#FBE4A0", width=max(2, size // 64))

        # Center vinyl
        draw_retro_vinyl(draw, size // 2, size // 2, int(size * 0.38), "#F7CCD7", "#E63946")

        # Heart mark on center label
        hr = int(size * 0.08)
        hx, hy = size // 2, size // 2 - int(size * 0.12)
        draw.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], fill="#E63946")

        img.save(ICONS_DIR / f"icon-{size}.png")
        print(f"Icon created: icon-{size}.png")

    # Also save as favicon.png
    fav = img.resize((64, 64), Image.Resampling.LANCZOS)
    fav.save(WEB_DIR / "favicon.png")
    print("Favicon created.")

def draw_album_cover(filename, title, subtitle, colors, deco_type="kiss"):
    size = 600
    img = Image.new("RGBA", (size, size), colors["bg"])
    draw = ImageDraw.Draw(img)

    # Gradient-like layered background rings
    for i in range(12):
        r = size * (0.95 - i * 0.06)
        alpha_color = colors.get("tint", "#FFFFFF")
        draw.ellipse([size/2 - r/2, size/2 - r/2, size/2 + r/2, size/2 + r/2], outline=alpha_color, width=1)

    # Border frame with chic vintage photo style
    margin = 35
    draw.rectangle([margin, margin, size - margin, size - margin], outline=colors["accent"], width=3)
    draw.rectangle([margin + 8, margin + 8, size - margin - 8, size - margin - 8], outline=colors["accent"], width=1)

    # Decorative corner diamonds
    for x, y in [(margin, margin), (size - margin, margin), (margin, size - margin), (size - margin, size - margin)]:
        dr = 6
        draw.polygon([(x, y - dr), (x + dr, y), (x, y + dr), (x - dr, y)], fill=colors["accent"])

    # Center vinyl disk peek / graphic element
    cx, cy = size // 2, size // 2 - 20
    draw_retro_vinyl(draw, cx, cy, 140, colors["label"], colors["accent"])

    # Sabrina Carpenter brand header
    try:
        font_brand = ImageFont.load_default(size=24)
        font_title = ImageFont.load_default(size=36)
        font_sub = ImageFont.load_default(size=18)
    except Exception:
        font_brand = font_title = font_sub = None

    # Header text
    brand_text = "S A B R I N A   C A R P E N T E R"
    draw.text((size // 2, 60), brand_text, fill=colors["accent"], anchor="mm", font=font_brand)

    # Album title banner
    banner_y = size - 110
    draw.rounded_rectangle([50, banner_y - 35, size - 50, banner_y + 40], radius=15, fill=colors["banner_bg"], outline=colors["accent"], width=2)
    draw.text((size // 2, banner_y - 8), title, fill=colors["text"], anchor="mm", font=font_title)
    draw.text((size // 2, banner_y + 22), subtitle.upper(), fill=colors["accent"], anchor="mm", font=font_sub)

    # Chic vintage corner sticker badge (placed safely in top right corner)
    draw.rounded_rectangle([size - 145, 20, size - 20, 52], radius=6, fill=colors["banner_bg"], outline=colors["accent"], width=2)
    draw.text((size - 82, 36), "INSTRUMENTAL", fill=colors["accent"], anchor="mm", font=font_sub)

    img.save(COVERS_DIR / filename)
    print(f"Cover created: {filename}")

def create_all_covers():
    covers = [
        (
            "short-n-sweet.png",
            "SHORT N' SWEET",
            "2024 · Deluxe Instrumental Edition",
            {
                "bg": "#B5D5E8",
                "accent": "#FBE4A0",
                "label": "#FBE4A0",
                "banner_bg": "#241412",
                "text": "#FDFBF7",
                "tint": "#CEE5F2"
            }
        ),
        (
            "emails-i-cant-send.png",
            "emails i can't send fwd:",
            "2022-2023 · Complete Edition",
            {
                "bg": "#F7CCD7",
                "accent": "#E63946",
                "label": "#FAD2E1",
                "banner_bg": "#2B1117",
                "text": "#FDFBF7",
                "tint": "#F9DFE6"
            }
        ),
        (
            "fruitcake.png",
            "fruitcake",
            "2023 · Holiday EP Instrumental",
            {
                "bg": "#1B261D",
                "accent": "#E63946",
                "label": "#D8F3DC",
                "banner_bg": "#0D160E",
                "text": "#D8F3DC",
                "tint": "#2D6A4F"
            }
        ),
        (
            "singular-act-2.png",
            "SINGULAR: ACT II",
            "2019 · Dance Pop & Velvet Edition",
            {
                "bg": "#1A0B2E",
                "accent": "#F72585",
                "label": "#7209B7",
                "banner_bg": "#10002B",
                "text": "#FDFBF7",
                "tint": "#3C096C"
            }
        ),
        (
            "singular-act-1.png",
            "SINGULAR: ACT I",
            "2018 · Pop Royalty Edition",
            {
                "bg": "#240046",
                "accent": "#FFD166",
                "label": "#9D4EDD",
                "banner_bg": "#10002B",
                "text": "#FFD166",
                "tint": "#5A189A"
            }
        ),
        (
            "evolution.png",
            "EVOLUTION",
            "2016 · Electropop Era Edition",
            {
                "bg": "#2E1C0C",
                "accent": "#FFD166",
                "label": "#F39C12",
                "banner_bg": "#1E1208",
                "text": "#FFD166",
                "tint": "#D35400"
            }
        ),
        (
            "eyes-wide-open.png",
            "EYES WIDE OPEN",
            "2015 · Debut Acoustic Era",
            {
                "bg": "#1D3557",
                "accent": "#A8DADC",
                "label": "#F1FAEE",
                "banner_bg": "#102035",
                "text": "#F1FAEE",
                "tint": "#457B9D"
            }
        ),
        (
            "singles.png",
            "SINGLES & FEATURES",
            "2016-2021 · Iconic Hits & Collabs",
            {
                "bg": "#211500",
                "accent": "#FB8500",
                "label": "#FFB703",
                "banner_bg": "#140D00",
                "text": "#FFB703",
                "tint": "#854D0E"
            }
        ),
    ]

    for fname, title, sub, colors in covers:
        draw_album_cover(fname, title, sub, colors)

if __name__ == "__main__":
    create_pwa_icons()
    create_all_covers()
    print("Todos los assets visuales generados!")
