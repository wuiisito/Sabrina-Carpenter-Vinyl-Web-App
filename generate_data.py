import json
import urllib.parse
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent.resolve()
base = BASE_DIR / "sabrina_instrumentals" / "instrumentals"
albums_data = [
    {
        "id": "short-n-sweet",
        "folder": "01 - Short n' Sweet (2024)",
        "title": "Short n' Sweet",
        "year": "2024",
        "era": "The Golden Starlet & Espresso Era",
        "subtitle": "Su sexto álbum de estudio, aclamado por la crítica y fenómeno pop global",
        "color": "#FBE4A0",
        "accent": "#B5D5E8",
        "dark": "#241412",
        "quote": "That's that me espresso ☕💋",
        "desc": "Un viaje sutilmente picante, ingenioso y pop de alta costura que consolidó a Sabrina como la nueva reina del pop internacional, con éxitos colosales como Espresso, Please Please Please y Taste.",
        "cover_bg": "linear-gradient(135deg, #B5D5E8 0%, #D8ECF8 40%, #FBE4A0 100%)",
        "label_bg": "#B5D5E8",
        "label_text": "#1D3557"
    },
    {
        "id": "emails-i-cant-send",
        "folder": "02 - Emails I Can't Send Fwd (2022-2023)",
        "title": "Emails I Can't Send Fwd:",
        "year": "2022-2023",
        "era": "The Confessional & Feather Era",
        "subtitle": "El álbum más íntimo, crudo y sanador de su carrera",
        "color": "#F7CCD7",
        "accent": "#E63946",
        "dark": "#2B1117",
        "quote": "I'm like a feather, light as a feather 🪶💌",
        "desc": "Escrito en forma de cartas y borradores no enviados, este álbum desnudó las vulnerabilidades, desamores y superaciones de Sabrina con melodías pop conmovedoras como Nonsense, Feather y Because I Liked a Boy.",
        "cover_bg": "linear-gradient(135deg, #FAD2E1 0%, #F7CCD7 50%, #C9184A 100%)",
        "label_bg": "#F7CCD7",
        "label_text": "#590D22"
    },
    {
        "id": "fruitcake",
        "folder": "03 - fruitcake (Holiday EP 2023)",
        "title": "fruitcake",
        "year": "2023",
        "era": "The Festive Coquette Era",
        "subtitle": "El EP navideño más atrevido y dulce del pop",
        "color": "#D8F3DC",
        "accent": "#E63946",
        "dark": "#1B261D",
        "quote": "A Nonsense Christmas twist 🍒🎄",
        "desc": "Una joya festiva de 6 canciones con giros navideños coquetos y sarcásticos, convirtiendo las fiestas en una celebración de humor y nostalgia pop.",
        "cover_bg": "linear-gradient(135deg, #E63946 0%, #B7094C 50%, #2D6A4F 100%)",
        "label_bg": "#D8F3DC",
        "label_text": "#081C15"
    },
    {
        "id": "singular-act-2",
        "folder": "04 - Singular Act II (2019)",
        "title": "Singular: Act II",
        "year": "2019",
        "era": "The Seductive Cabaret Era",
        "subtitle": "Segunda parte del díptico dance-pop y empoderamiento",
        "color": "#F72585",
        "accent": "#7209B7",
        "dark": "#1A0B2E",
        "quote": "Got everyone in the room looking at me ✨💃",
        "desc": "Un disco enérgico y sensual donde Sabrina exploró sonidos R&B y dance-pop sofisticados con himnos de pista como Looking at Me e In My Bed.",
        "cover_bg": "linear-gradient(135deg, #7209B7 0%, #F72585 60%, #4CC9F0 100%)",
        "label_bg": "#F72585",
        "label_text": "#FFFFFF"
    },
    {
        "id": "singular-act-1",
        "folder": "05 - Singular Act I (2018)",
        "title": "Singular: Act I",
        "year": "2018",
        "era": "The Confident Pop Royalty Era",
        "subtitle": "El salto a la madurez vocal y estilística",
        "color": "#E0AAFF",
        "accent": "#FFD166",
        "dark": "#10002B",
        "quote": "Sue me for looking so good tonight 💎👑",
        "desc": "Con una presencia escénica arrolladora y beats brillantes, canciones como Sue Me y Almost Love definieron la identidad bop de Sabrina.",
        "cover_bg": "linear-gradient(135deg, #10002B 0%, #3C096C 50%, #9D4EDD 100%)",
        "label_bg": "#C77DFF",
        "label_text": "#240046"
    },
    {
        "id": "evolution",
        "folder": "06 - Evolution (2016)",
        "title": "Evolution",
        "year": "2016",
        "era": "The Golden Electropop Era",
        "subtitle": "El descubrimiento de su sonido sintético y bailable",
        "color": "#FFD166",
        "accent": "#EF476F",
        "dark": "#2E1C0C",
        "quote": "Somewhere in the world they think they're in love 🎶⏳",
        "desc": "Marcado por el megaéxito internacional Thumbs y On Purpose, Evolution demostró su capacidad para cantar baladas desgarradoras y electropop cautivador.",
        "cover_bg": "linear-gradient(135deg, #F39C12 0%, #D35400 60%, #2C3E50 100%)",
        "label_bg": "#FFD166",
        "label_text": "#3D1308"
    },
    {
        "id": "eyes-wide-open",
        "folder": "07 - Eyes Wide Open (2015)",
        "title": "Eyes Wide Open",
        "year": "2015",
        "era": "The Acoustic Folk-Pop Beginnings",
        "subtitle": "El debut luminoso que lo inició todo",
        "color": "#A8DADC",
        "accent": "#E76F51",
        "dark": "#132A2F",
        "quote": "All our eyes wide open looking at the stars 🌟🌻",
        "desc": "Su álbum debut de estudio, cargado de guitarras acústicas, frescura folk-pop y letras sobre el crecimiento personal y el amor adolescente.",
        "cover_bg": "linear-gradient(135deg, #A8DADC 0%, #457B9D 60%, #1D3557 100%)",
        "label_bg": "#A8DADC",
        "label_text": "#1D3557"
    },
    {
        "id": "singles",
        "folder": "08 - Singles & Features",
        "title": "Singles & Colaboraciones",
        "year": "2016-2021",
        "era": "The Standalone Gems Era",
        "subtitle": "Sencillos icónicos y éxitos multiplatino",
        "color": "#FFB703",
        "accent": "#FB8500",
        "dark": "#211500",
        "quote": "You can try to get under my skin 🪞🔥",
        "desc": "Una colección selecta de sus mayores sencillos no pertenecientes a álbumes y colaboraciones mundiales como Skin, Why y On My Way junto a Alan Walker.",
        "cover_bg": "linear-gradient(135deg, #023047 0%, #219EBC 50%, #FB8500 100%)",
        "label_bg": "#FB8500",
        "label_text": "#FFFFFF"
    }
]

result = []

for a in albums_data:
    alb_dir = base / a["folder"]
    tracks = []
    if alb_dir.exists():
        for f in sorted(list(alb_dir.glob("*.mp3"))):
            raw_title = f.stem
            parts = raw_title.split(" - ", 1)
            num = parts[0]
            clean_title = parts[1].replace(" (Instrumental)", "") if len(parts) > 1 else raw_title
            
            yt_query = f"Sabrina Carpenter {clean_title} Official Audio"
            yt_search_url = f"https://www.youtube.com/results?search_query={urllib.parse.quote(yt_query)}"
            
            tracks.append({
                "id": f"{a['id']}-{num}",
                "number": int(num),
                "numberStr": num,
                "title": clean_title,
                "file": f"audio/{a['folder']}/{f.name}",
                "youtube": yt_search_url,
                "youtube_title": f"Sabrina Carpenter - {clean_title} (Official Audio)"
            })
    a_copy = dict(a)
    a_copy["cover_image"] = f"covers/{a['id']}.png"
    a_copy["tracks"] = tracks
    result.append(a_copy)

out_file = Path(__file__).parent / "songs_data.js"
with open(out_file, "w", encoding="utf-8") as out:
    out.write("// Catálogo completo de Sabrina Carpenter - Instrumentales y Enlaces\n")
    out.write("window.SABRINA_ALBUMS = " + json.dumps(result, indent=2, ensure_ascii=False) + ";\n")

print(f"Generado exitosamente songs_data.js con {sum(len(a['tracks']) for a in result)} canciones!")
