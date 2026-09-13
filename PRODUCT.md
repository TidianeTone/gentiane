# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Utilisateur principal : le patient.** Quelqu'un qui suit une thérapie et à qui
son psy propose de tenir un journal des émotions entre deux séances. Il note sur
son téléphone, seul, souvent juste après le moment qui l'a remué — parfois
debout dans la rue, parfois le soir au lit. Genre, âge et niveau d'aisance
numérique inconnus : l'appli ne peut rien présupposer.

**Utilisateur secondaire : le psychologue.** Il découvre l'outil, décide s'il
peut le mettre entre les mains de ses patients, et le regarde avec eux en
séance. Il ne l'installe pas, ne l'administre pas, ne reçoit aucune donnée.

Origine du besoin (fait rapporté, à conserver) : une enfant autiste à qui une
psy réputée avait donné le tableau du livre sur une feuille blanche, sans
couleur. La feuille blanche l'a angoissée plus qu'elle ne l'a aidée. La couleur
et l'appropriation ne sont pas une décoration de l'outil, elles sont la
condition pour qu'il soit ouvert.

## Product Purpose

Tenir les deux exercices du cahier — « Identifiez vos émotions » (p.102, le
tableau jour / ce que je fais / émotion / intensité 0-10 / qualificatifs) et
« Graduez vos émotions » (p.103, le thermomètre avec sensations physiques par
palier) — sur un téléphone, hors ligne, sans compte.

Réussite : le patient note ses moments sans y penser, et arrive en séance avec
de la matière factuelle que le psy peut lire en trente secondes.

## Positioning

Le thermomètre **est** le curseur d'intensité, pas une illustration à côté.
Le palier atteint allume le bloc de vocabulaire ; choisir un mot repose le
thermomètre au milieu de son palier. L'exercice papier n'est pas transposé à
l'écran, il est devenu le geste.

Deuxième mécanisme propre : les **échos**. Un score de similarité délibérément
lisible à la main (même famille 2, même palier 1,5, qualificatif partagé 1,
mot partagé 0,5 plafonné à 2 ; seuil 3,5) qui sert deux fois — en direct
pendant la saisie sous « Déjà vécu », et dessiné dans Tendances en
constellation. Le score doit rester explicable au patient comme au psy :
c'est la raison d'être du barème en points plutôt que d'une distance
vectorielle.

## Operating Context

- Saisie au téléphone, souvent une main, souvent hors ligne. PWA installable.
- Le psy transmet l'URL ; il n'y a rien à configurer côté praticien.
- En séance, le patient tend son téléphone : c'est le **mode séance**, qui
  restitue une période (semaine, mois, ou depuis la dernière séance) mise en
  page pour être lue par quelqu'un d'autre que celui qui l'a écrite.

## Capabilities and Constraints

- **100 % local**, `localStorage`, pas de compte, pas de serveur, **pas
  d'export**, rien ne quitte l'appareil. Contrepartie assumée : vider le
  navigateur ou changer de téléphone efface le journal.
- **Aucune IA embarquée, aucune interprétation automatique.** Décision
  explicite : le psy est là pour interpréter, l'appli ne restitue que des
  faits. Bénéfice secondaire — rien n'a besoin d'être envoyé nulle part.
- Pas de diagnostic, pas de score clinique, pas d'alerte.
- Saisie en fiche, jamais en tableau : le tableau du livre est le modèle
  mental, jamais la mise en page mobile.
- Familles : les trois du livre (peur, tristesse, colère) plus joie et
  tendresse, marquées « hors livre ».
- Aucun exemple pré-rempli dans les champs libres.
- Les sensations physiques déjà notées pour une famille à un palier sont
  reproposées en pastilles.
- **Un moment peut être marqué « gardé pour moi »** : il reste dans le journal
  et n'apparaît jamais en mode séance. L'écran séance énonce la règle, jamais
  le nombre de moments concernés — le psy sait que le mécanisme existe, le
  compte appartient au patient.
- La saisie s'ouvre sur l'émotion et le thermomètre : un moment se note en
  trois gestes sans faire défiler. Le contexte, les sensations, l'heure et le
  marqueur privé sont en dessous et restent facultatifs.
- Stack : HTML/CSS/JS statiques, zéro dépendance, `gentiane.js` (UMD pur,
  testé par `node verif.js`) tient le vocabulaire et les calculs ;
  `index.html` ne fait que l'interface. Déployé sur Vercel.

## Brand Commitments

- Nom **Gentiane**. Typographie **Fraunces** pour l'affiche (un caractère de
  livre, axes SOFT/WONK adoucis — l'application vient d'un cahier) et
  **Atkinson Hyperlegible Next** pour le texte (dessiné par le Braille
  Institute : lettres impossibles à confondre). Remplace Archivo/Gabarito
  le 13/09/2026 — l'affiche compressée en capitales sonnait sportive là où
  il fallait de l'accueil.
- Le thermomètre, la pilule d'action, les cartes arrondies : l'ossature
  visuelle est acquise et se conserve d'un thème à l'autre.
- **Les cinq couleurs d'émotion sont invariantes** — peur violet, tristesse
  bleu, colère rouge, joie rose, tendresse vert. Elles ne changent pas avec
  le thème : c'est la grammaire que le patient et le psy apprennent.
- Voix : tutoiement, phrases courtes, jamais de ton clinique, jamais de
  félicitations ni de gamification.

## Evidence on Hand

Les deux exercices du cahier de thérapie (p.102 et p.103) sont la source réelle
et vérifiable de l'outil. Aucun témoignage, aucun chiffre d'usage, aucune
validation clinique n'existe : rien de tel ne doit être inventé, ni sur la page
destinée aux psychologues ni ailleurs.

## Product Principles

1. **L'exercice devient le geste.** Rien de ce qui existait sur le papier ne
   doit rester une simple transposition à l'écran.
2. **Tout est explicable.** Aucun chiffre affiché dont on ne puisse dire à
   voix haute d'où il vient.
3. **L'appli restitue, le psy interprète.** Aucune suggestion, aucune
   interprétation, aucun conseil.
4. **L'appareil est le seul dépositaire.** Chaque fonction doit tenir sans
   serveur, sans compte, sans réseau.
5. **Rien n'est présupposé du patient.** Ni son genre, ni son prénom, ni son
   goût, ni sa tolérance à la lumière : il le pose lui-même, au premier
   lancement, avant d'écrire quoi que ce soit.

## Accessibility & Inclusion

- **Accord grammatical choisi par le patient** au premier lancement — féminin,
  masculin, ou sans accord (tournures nominales). Le vocabulaire entier suit.
  Jamais de point médian.
- **Réglage de la taille du texte** au premier lancement, à côté du thème :
  0.9x à 1.35x. Seul le texte grandit — le thermomètre est un instrument
  dessiné et reste en pixels.
- **Thème clair et thème sombre au même niveau**, plus un réglage de contraste.
  Chaque combinaison thème × mode × contraste doit tenir le seuil WCAG AA
  (4.5:1 texte courant, 3:1 grand texte) — vérifié par calcul dans
  `node verif.js`, pas à l'œil.
- Cibles tactiles ≥ 44px, focus visible, `prefers-reduced-motion` respecté.
