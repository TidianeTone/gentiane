# Gentiane

Journal des émotions, d'après les exercices « Identifiez vos émotions » (p.102)
et « Graduez vos émotions » (p.103). PWA : ça s'installe sur l'écran d'accueil
et ça marche hors ligne.

- **Une fiche par moment** : jour et heure, ce que je fais, l'émotion,
  l'intensité, les qualificatifs, les sensations physiques.
- **Le thermomètre est le curseur** : on le glisse de 0 à 10, il prend la
  couleur de l'émotion, et le palier (+ / ++ / +++ / ++++) qu'il atteint
  allume le bloc de vocabulaire correspondant. L'inverse marche aussi :
  choisir un mot pose le thermomètre au milieu de son palier.
- **Les sensations physiques se rappellent** : ce qui a déjà été noté pour
  cette émotion à ce palier est reproposé en pastilles — c'est le thermomètre
  de la p.103 qui se remplit tout seul au fil des entrées.
- **Vocabulaire** : les trois familles du livre (peur, tristesse, colère),
  plus joie et tendresse, marquées « hors livre ». Tout est au féminin —
  « Affolée », « Fâchée » — parce que c'est elle qui l'écrit.
- **Échos** : pendant la saisie, dès que l'émotion et les mots sont posés,
  l'appli remonte les moments passés qui ressemblent à celui-ci — « il y a
  2 semaines · le voisin remet sa musique à fond · musique, voisin ».
- **Graphe des motifs** : un point par moment (x = le temps, y = l'intensité,
  la couleur = l'émotion), et un trait entre deux moments qui se ressemblent.
  Toucher un point donne le moment et tous ses échos.
- **Tendances** : 14 derniers jours, répartition, heures, mots qui reviennent.

## Comment deux moments « se ressemblent »

Un score volontairement lisible à la main, pour qu'on puisse toujours
expliquer pourquoi deux points sont reliés (`P.similarite`) :

| ingrédient | points |
|---|---|
| même famille d'émotion | 2 (sinon le score est 0, tout de suite) |
| même palier (+ / ++ / +++ / ++++) | 1,5 |
| par qualificatif partagé | 1 |
| par mot partagé dans le texte ou les sensations | 0,5, plafonné à 2 |

Au-dessus de `P.SEUIL` (3,5 — soit au minimum même famille **et** même
palier), c'est un écho. Les mots vides et les mots de moins de quatre lettres
sont jetés, les accents aplatis.

## Données

Tout vit dans le `localStorage` du téléphone. Pas de compte, pas de serveur,
rien ne sort de l'appareil. **Contrepartie assumée** : vider les données du
navigateur ou changer de téléphone efface le journal. Il n'y a pas d'export.

## Installer

Ouvrir l'URL, puis :
- **iPhone (Safari)** : Partager → « Sur l'écran d'accueil ».
- **Android (Chrome)** : menu ⋮ → « Installer l'application ».

## Développer

```
node verif.js     # casse si le vocabulaire ou les calculs cassent
```
Serveur local : config `gentiane` (port 8546). `gentiane.js` tient le
vocabulaire et les calculs purs ; `index.html` ne fait que l'interface.
