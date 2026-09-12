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
- **Tendances** : 14 derniers jours, répartition, heures, mots qui reviennent.

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
