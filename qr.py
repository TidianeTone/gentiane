# Genere qr.svg une bonne fois : Gentiane n'embarque aucune dependance, donc
# l'encodeur vit ici, pas dans l'application. A relancer si l'URL change.
#
#   python qr.py
#
# Le script redessine sa propre sortie en bitmap et la fait relire par le
# detecteur d'OpenCV, en taille reelle et reduite a 200px : un QR stylise qui
# ne se lit plus est un QR mort, et ca ne se voit pas a l'oeil.
import io, segno

URL = "https://gentiane.vercel.app"
SORTIE = r"G:/Mes APP/Gentiane/qr.svg"

# Correction H : le style (coins arrondis, yeux en degrade) mange de la marge
# de lecture, on la reprend sur la redondance.
qr = segno.make(URL, error="H")
m = [[bool(c) for c in row] for row in qr.matrix]
n = len(m)

MARGE = 4                      # zone de silence, en modules
U = 12                         # pixels par module
COTE = (n + 2 * MARGE) * U

FOND = "#eff7fe"               # le sol clair de « Jardin de nuit »
ENCRE = "#152432"
RAMPE = ["#056347", "#294e84", "#803e60"]   # la rampe du theme, en clair

R_MOD = U // 2                 # arrondi d'un module isole
R_OEIL = 14                    # arrondi de l'anneau : au-dela, ca cesse de se lire
R_NOYAU = 7

# Les trois yeux sont dessines a la main : on les retire du semis de modules.
yeux = [(0, 0), (n - 7, 0), (0, n - 7)]
def dans_un_oeil(x, y):
    return any(ox <= x < ox + 7 and oy <= y < oy + 7 for ox, oy in yeux)

def plein(x, y):
    return 0 <= x < n and 0 <= y < n and m[y][x] and not dans_un_oeil(x, y)

# Un module est un carre dont chaque coin n'est arrondi que si ses deux voisins
# sont vides : les modules voisins se soudent, les isoles deviennent des pastilles.
def coins(x, y):
    h, b = plein(x, y - 1), plein(x, y + 1)
    g, d = plein(x - 1, y), plein(x + 1, y)
    return (R_MOD if not h and not g else 0, R_MOD if not h and not d else 0,
            R_MOD if not b and not d else 0, R_MOD if not b and not g else 0)

def module(x, y):
    px, py = (x + MARGE) * U, (y + MARGE) * U
    hg, hd, bd, bg = coins(x, y)
    arc = lambda r, dx, dy: f" a{r},{r} 0 0 1 {dx},{dy}" if r else ""
    return (f'<path d="M{px + hg},{py} h{U - hg - hd}' + arc(hd, hd, hd)
            + f' v{U - hd - bd}' + arc(bd, -bd, bd)
            + f' h-{U - bd - bg}' + arc(bg, -bg, -bg)
            + f' v-{U - bg - hg}' + arc(hg, hg, -hg) + ' z"/>')

semis = "".join(module(x, y) for y in range(n) for x in range(n) if plein(x, y))

# L'oeil : un anneau d'un module d'epaisseur, et un noyau de trois modules.
def oeil(ox, oy):
    px, py = (ox + MARGE) * U, (oy + MARGE) * U
    return (
        f'<rect x="{px + U / 2:.0f}" y="{py + U / 2:.0f}" width="{6 * U}" height="{6 * U}" '
        f'rx="{R_OEIL}" fill="none" stroke="url(#rampe)" stroke-width="{U}"/>'
        f'<rect x="{px + 2 * U}" y="{py + 2 * U}" width="{3 * U}" height="{3 * U}" '
        f'rx="{R_NOYAU}" fill="url(#rampe)"/>'
    )

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {COTE} {COTE}" width="{COTE}" height="{COTE}" role="img" aria-label="QR code vers gentiane.vercel.app">
<title>gentiane.vercel.app</title>
<defs><linearGradient id="rampe" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="{RAMPE[0]}"/><stop offset=".46" stop-color="{RAMPE[1]}"/><stop offset="1" stop-color="{RAMPE[2]}"/>
</linearGradient></defs>
<rect width="{COTE}" height="{COTE}" rx="{3 * U}" fill="{FOND}"/>
<g fill="{ENCRE}">{semis}</g>
{"".join(oeil(ox, oy) for ox, oy in yeux)}
</svg>
'''
io.open(SORTIE, "w", encoding="utf-8").write(svg)

# -- le meme dessin, en bitmap, relu par un vrai decodeur --------------------
import cv2, numpy as np
from PIL import Image, ImageDraw

hexa = lambda c: tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))
im = Image.new("RGB", (COTE, COTE), hexa(FOND))
d = ImageDraw.Draw(im)
for y in range(n):
    for x in range(n):
        if plein(x, y):
            px, py = (x + MARGE) * U, (y + MARGE) * U
            isole = not (plein(x - 1, y) or plein(x + 1, y) or plein(x, y - 1) or plein(x, y + 1))
            d.rounded_rectangle([px, py, px + U - 1, py + U - 1],
                                radius=R_MOD if isole else R_MOD // 2, fill=hexa(ENCRE))
# On teste les yeux avec la teinte la plus claire de la rampe : le pire cas.
for ox, oy in yeux:
    px, py = (ox + MARGE) * U, (oy + MARGE) * U
    d.rounded_rectangle([px, py, px + 7 * U - 1, py + 7 * U - 1],
                        radius=R_OEIL, outline=hexa(RAMPE[2]), width=U)
    d.rounded_rectangle([px + 2 * U, py + 2 * U, px + 5 * U - 1, py + 5 * U - 1],
                        radius=R_NOYAU, fill=hexa(RAMPE[2]))

brut = np.array(im)[:, :, ::-1].copy()
det = cv2.QRCodeDetector()
for nom, img in [("taille reelle", brut),
                 ("reduit a 200px", cv2.resize(brut, (200, 200), interpolation=cv2.INTER_AREA)),
                 ("reduit a 120px", cv2.resize(brut, (120, 120), interpolation=cv2.INTER_AREA))]:
    lu = det.detectAndDecode(img)[0]
    if lu != URL:
        raise SystemExit(f"ECHEC : illisible {nom} (lu {lu!r})")
    print(f"relu {nom} : {lu}")

print(f"{SORTIE} : {n}x{n} modules, {len(svg)} octets")
