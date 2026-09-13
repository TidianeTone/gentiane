# Fabrique l'habillage du thermometre a partir du rendu de rendu/verre-a.png.
# A relancer si le rendu change :
#
#   python verre.py
#
# Le principe tient en une phrase : le verre n'a pas de couleur a lui. Il ne
# montre que sa lumiere, et prend celle du mercure qui est dedans et du monde
# qui est derriere. Donc l'image ne porte AUCUNE couleur : c'est une carte de
# lumiere en gris, posee dans l'appli en mix-blend-mode soft-light, pour
# lequel le gris 128 est l'identite — le fond du rendu disparait tout seul,
# sans detourage, sans canal alpha, et l'habillage marche sur les sept mondes
# en clair comme en sombre.
#
# Le rendu du modele a un leger vignetage : on le retire ligne par ligne en
# ramenant le fond a 128 exactement, sinon le rectangle se verrait en fusion.
import numpy as np
from PIL import Image

# Le rendu source n'est pas dans le depot (4 Mo). Il a ete fabrique par
# kie.ai, modele seedream/5-pro-text-to-image, ratio 9:16, avec ce brief :
#
#   Macro studio product photograph of an EMPTY colourless laboratory glass
#   thermometer shell, completely transparent clear borosilicate glass, no
#   liquid inside, no mercury, no numbers, no scale markings, no text, no
#   label. Shape: a very long narrow vertical cylindrical tube with a softly
#   rounded closed top, joined at the bottom to a perfect small glass sphere
#   bulb. The object is extremely tall and thin and fills the frame from top
#   to bottom, perfectly vertical, dead centre. Lighting: a single soft studio
#   softbox from the upper left, producing one long crisp white specular
#   highlight running down the left side of the cylinder, a thin bright
#   caustic rim on the right edge, and a small round catchlight on the upper
#   left of the sphere. Background: absolutely flat seamless neutral 50
#   percent mid grey, uniform, no gradient, no vignette, no floor, no cast
#   shadow, no surface, no environment reflections, no colour anywhere.
#   Strictly monochrome greyscale, zero colour saturation, zero colour tint.
#   Razor sharp focus, high detail, clean edges.
SRC = 'rendu/verre-a.png'
TUBE = 'verre-tube.png'      # pose sur .tube, etire verticalement
BULBE = 'verre-bulbe.png'    # pose sur .bulbe, carre

im = Image.open(SRC).convert('L')
a = np.asarray(im).astype(np.float32)
H, W = a.shape

# 1. le fond a 128 : chaque ligne est recalee sur sa propre marge gauche,
#    ce qui efface le vignetage vertical comme horizontal.
marge = np.median(a[:, : W // 12], axis=1, keepdims=True)
a = a - marge + 128.0

# 2. ou est l'objet ? tout ce qui s'ecarte du fond de plus d'un cheveu.
ecart = np.abs(a - 128.0)
objet = ecart > 10.0   # sous ce seuil, le grain du rendu passe pour du verre
xs = np.where(objet.any(axis=0))[0]
ys = np.where(objet.any(axis=1))[0]
x0, x1, y0, y1 = xs[0], xs[-1], ys[0], ys[-1]

# 3. le bulbe est la sphere du bas : sa largeur est le maximum de l'objet.
#    Le verre est transparent, donc l'interieur d'une ligne est du fond :
#    ce qui donne la largeur, c'est l'ECART entre les deux bords, jamais le
#    nombre de pixels qui s'ecartent du fond.
def etendue(ligne):
    w = np.where(ligne)[0]
    return 0 if not len(w) else w[-1] - w[0] + 1
largeurs = np.array([etendue(l) for l in objet])
depart = y1 - (y1 - y0) // 5
diam = int(largeurs[depart:].max())
by1 = y1
by0 = by1 - diam
bx0 = (x0 + x1) // 2 - diam // 2

# 4. le tube va du haut jusqu'au col, juste au-dessus du bulbe.
ty0, ty1 = y0, by0
tcol = np.where(objet[ty0 : ty1].any(axis=0))[0]
tx0, tx1 = tcol[0], tcol[-1]
# le tube s'evase vers le col : on garde la largeur du fut, pas celle du col.
fut = np.where(objet[ty0 + (ty1 - ty0) // 3])[0]
tx0, tx1 = fut[0], fut[-1]
print('tube %dx%d  bulbe %d de diametre' % (tx1 - tx0 + 1, ty1 - ty0, diam))


def coupe(y0, y1, x0, x1, taille, nom):
    d = np.asarray(Image.fromarray(np.clip(a[y0:y1, x0:x1], 0, 255).astype(np.uint8), 'L')
                   .resize(taille, Image.LANCZOS)).astype(np.float32)
    # Zone morte : tout ce qui frole 128 y retombe exactement. En soft-light
    # le gris 128 ne fait rien, donc ce qui reste du fond disparait au lieu de
    # dessiner un rectangle pale autour de l'habillage.
    d[np.abs(d - 128.0) < 4.0] = 128.0
    d = d.astype(np.uint8)
    Image.fromarray(d, 'L').save(nom, optimize=True)
    return d


# Le tube est pose etire : 44px de large suffisent, sa hauteur est refaite
# par le CSS. Le bulbe est un carre de 96px.
t = coupe(ty0, ty1, tx0, tx1 + 1, (44, 512), TUBE)
b = coupe(by0, by1 + 1, bx0, bx0 + diam + 1, (96, 96), BULBE)

for nom, d in ((TUBE, t), (BULBE, b)):
    bord = np.concatenate([d[0], d[-1], d[:, 0], d[:, -1]]).astype(np.float32)
    print('%-16s %sx%s  fond aux bords %.1f  ecart max %.0f'
          % (nom, d.shape[1], d.shape[0], bord.mean(), np.abs(d.astype(np.float32) - 128).max()))

# Un habillage qui porte de la couleur trahirait le monde choisi : on le
# verifie plutot que de l'esperer.
src = np.asarray(Image.open(SRC).convert('RGB')).astype(np.int16)
sat = (src.max(axis=2) - src.min(axis=2)).max()
print('saturation maximale du rendu : %d / 255' % sat)
assert sat < 20, 'le rendu porte de la couleur, il teinterait les sept mondes'
