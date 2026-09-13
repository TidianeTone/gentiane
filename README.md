# Gentiane

Journal des émotions, d'après les exercices « Identifiez vos émotions » (p.102)
et « Graduez vos émotions » (p.103). PWA : ça s'installe sur l'écran d'accueil
et ça marche hors ligne. Destiné à être proposé par un psychologue à un
patient — `psy.html` est la page qui s'adresse aux praticiens.

## L'application (`index.html`)

- **Premier lancement** : l'appli ne demande pas une émotion, elle demande un
  prénom, un accord grammatical et des couleurs. Le patient choisit son monde
  avant d'écrire la moindre ligne.
- **Une fiche par moment** : jour et heure, ce que je fais, l'émotion,
  l'intensité, les qualificatifs, les sensations physiques.
- **Le thermomètre est le curseur** : on le glisse de 0 à 10, il prend la
  couleur de l'émotion, et le palier (+ / ++ / +++ / ++++) qu'il atteint
  allume le bloc de vocabulaire correspondant. L'inverse marche aussi :
  choisir un mot pose le thermomètre au milieu de son palier.
- **Les sensations physiques se rappellent** : ce qui a déjà été noté pour
  cette émotion à ce palier est reproposé en pastilles — c'est le thermomètre
  de la p.103 qui se remplit tout seul au fil des entrées.
- **Échos** : pendant la saisie, l'appli remonte les moments passés qui
  ressemblent à celui-ci — « il y a 2 semaines · le voisin remet sa musique
  à fond · musique, voisin ».
- **Graphe des motifs** : un point par moment (x = le temps, y = l'intensité,
  la couleur = l'émotion), et un trait entre deux moments qui se ressemblent.
- **Tendances** : 14 derniers jours, répartition, heures, mots qui reviennent.
- **Séance** : une période bornée (7 jours, 30 jours, ou depuis le dernier
  rendez-vous), rendue en plus grand et plus aéré — c'est le seul écran fait
  pour être lu par quelqu'un d'autre que celui qui l'a écrit.

## Les thèmes

Un thème ne décrit que le **sol** : fond, surfaces, encre, accent, rampe.
Sept mondes (`P.THEMES`), chacun en clair et en sombre, plus deux réglages
continus — chaleur et contraste.

Tout est calculé en **OKLCH** par `P.palette()`, jamais écrit à la main :
la clarté y est perceptuelle, donc on peut promettre un écart de contraste et
le tenir dans les sept mondes. `node verif.js` refait le calcul WCAG sur
chaque combinaison thème × mode × contraste × chaleur et casse si une seule
paire texte/fond passe sous 4.5:1. Hors gamut, `P.ok()` retire du chroma au
lieu d'écrêter les canaux : écrêter ferait tourner la teinte, et deux familles
d'émotion finiraient par se ressembler.

**Les cinq couleurs d'émotion ne changent jamais d'un monde à l'autre**
(`P.TEINTES`) — peur violet, tristesse bleu, colère rouge, joie rose,
tendresse vert. C'est la grammaire que le patient et son psy apprennent.

## L'accord grammatical

Le vocabulaire du livre est donné au féminin. Au premier lancement, le patient
choisit l'accord de toute l'application : **féminin, masculin, ou sans accord**
(tournures nominales — « De l'affolement » plutôt qu'« Affolé·e »). Pas de
point médian, jamais de masculin par défaut.

Un qualificatif est soit une chaîne invariable, soit un triplet
`[féminin, masculin, sans accord]`. **Ce qui est stocké dans une entrée est
toujours la clé** — la forme féminine (`P.cle`) — jamais la forme affichée :
changer d'accord ne doit pas casser un journal déjà écrit, ni fausser les
échos.

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

## Ce que l'appli ne fait pas

Pas de diagnostic, pas de score clinique, pas d'alerte, **pas d'IA**. Rien
n'est interprété, résumé ni commenté automatiquement : l'interprétation
appartient au psy, et rien n'a besoin d'être envoyé à un service tiers.
Pas de notification, pas de série à tenir, pas de félicitations — noter un
moment ne rapporte rien.

## Données

Tout vit dans le `localStorage` du téléphone. Pas de compte, pas de serveur,
rien ne sort de l'appareil. **Contrepartie assumée** : vider les données du
navigateur ou changer de téléphone efface le journal. Il n'y a pas d'export,
parce qu'un export voudrait dire une copie quelque part.

## Installer

Ouvrir l'URL, puis :
- **iPhone (Safari)** : Partager → « Sur l'écran d'accueil ».
- **Android (Chrome)** : menu ⋮ → « Installer l'application ».

## Développer

```
node verif.js     # casse si le vocabulaire, les themes ou les calculs cassent
```
Serveur local : config `gentiane` (port 8546). `gentiane.js` tient le
vocabulaire, les thèmes et les calculs purs ; `index.html` et `psy.html` ne
font que l'interface et partagent le même module.

**Piège PWA** : `sw.js` est réseau-d'abord sur tout le même-origine (le cache
n'est qu'un filet hors ligne). Bumper `CACHE` à chaque déploiement qui change
un asset.
