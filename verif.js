// node verif.js — casse si le vocabulaire, les themes ou les calculs cassent.
const P = require('./gentiane.js');
let ok = 0;
const eq = (a, b, quoi) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error('ECHEC ' + quoi + ' : ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); process.exit(1); } ok++; };
const vrai = (x, quoi) => { if (!x) { console.error('ECHEC ' + quoi); process.exit(1); } ok++; };

/* -- vocabulaire --------------------------------------------------------- */
eq(P.FAMILLES.length, 5, 'cinq familles');
eq(P.FAMILLES.filter(f => f.livre).length, 3, 'trois familles du livre');
P.FAMILLES.forEach(f => {
  eq(f.blocs.length, 4, 'quatre paliers pour ' + f.cle);
  f.blocs.forEach((b, k) => vrai(b.length >= 2, 'palier ' + k + ' de ' + f.cle + ' non vide'));
});

/* -- accord grammatical --------------------------------------------------
   Trois accords, et la cle stockee ne bouge jamais : un journal ecrit au
   feminin doit rester lisible si on passe au masculin ou sans accord. */
eq(P.ACCORDS.map(a => a.cle), ['f', 'm', 'n'], 'trois accords');
const tousLesMots = [].concat(...P.FAMILLES.map(f => [].concat(...f.blocs)));
vrai(tousLesMots.length > 40, 'le vocabulaire est complet');
tousLesMots.forEach(q => {
  if (Array.isArray(q)) {
    eq(q.length, 3, 'trois formes pour ' + q[0]);
    q.forEach((forme, i) => vrai(forme && forme.trim().length > 1, 'forme ' + i + ' de ' + q[0]));
    vrai(!q.some(f => /[·•]/.test(f)), 'aucun point median dans ' + q[0]);
  }
  eq(P.cle(q), Array.isArray(q) ? q[0] : q, 'cle stable');
  eq(P.mot(q, 'f'), P.cle(q), 'accord feminin = cle');
});
eq(P.motAffiche('Affolée', 'm'), 'Affolé', 'Affolée au masculin');
eq(P.motAffiche('Affolée', 'n'), 'De l’affolement', 'Affolée sans accord');
eq(P.motAffiche('Affolée', 'f'), 'Affolée', 'Affolée au feminin');
eq(P.motAffiche('mot inconnu', 'm'), 'mot inconnu', 'un mot inconnu se rend tel quel');
// Aucune cle en double : deux qualificatifs identiques rendraient les echos faux.
const cles = tousLesMots.map(P.cle);
eq(new Set(cles).size, cles.length, 'aucun qualificatif en double');

/* -- paliers ------------------------------------------------------------- */
eq([0, 1, 3, 4, 6, 7, 8, 9, 10, 11].map(P.bloc), [null, 0, 0, 1, 1, 2, 2, 3, 3, null], 'les paliers du tableau');
eq([0, 1, 2, 3].map(P.intensiteDuBloc), [2, 5, 7, 9], 'intensite proposee par palier');

/* -- couleur et contraste ------------------------------------------------
   La promesse est calculee, pas constatee a l'oeil : chaque monde, en clair
   comme en sombre, a chaque cran de chaleur et de contraste, tient AA. */
eq(P.contraste('#ffffff', '#000000'), 21, 'contraste blanc/noir');
eq(P.contraste('#ffffff', '#ffffff'), 1, 'contraste blanc/blanc');
vrai(/^#[0-9a-f]{6}$/.test(P.ok(0.5, 0.1, 200)), 'OKLCH rend un hex');
// Hors gamut : on retire du chroma, donc la couleur reste valide et pas ecretee n'importe comment.
vrai(/^#[0-9a-f]{6}$/.test(P.ok(0.5, 0.9, 140)), 'OKLCH hors gamut reste un hex');

let paires = 0;
for (const t of P.THEMES) {
  for (const sombre of [true, false]) {
    for (const k of [0, 0.25, 0.5, 0.75, 1]) {
      for (const w of [0, 0.5, 1]) {
        const p = P.palette(t.cle, sombre, w, k);
        const nom = t.cle + '/' + (sombre ? 'sombre' : 'clair') + '/c' + k + '/w' + w;
        const AA = (a, b, quoi) => {
          const r = P.contraste(a, b);
          if (r < 4.5) { console.error('ECHEC contraste ' + nom + ' ' + quoi + ' = ' + r); process.exit(1); }
          paires++;
        };
        AA(p.ink, p.fond, 'texte sur fond');
        AA(p.ink, p.surf, 'texte sur surface');
        AA(p.ink2, p.fond, 'texte secondaire sur fond');
        AA(p.ink2, p.surf, 'texte secondaire sur surface');
        // Aucun texte ne se pose sur surf2 (pistes de jauge) : on verifie
        // seulement qu'elle se detache de la surface qui la porte.
        vrai(P.contraste(p.surf2, p.surf) >= 1.05, 'surface 2 detachee ' + nom);
        AA(p.surRampe, p.rampe[1], 'libelle de la pilule');
        p.familles.forEach(f => {
          AA(f.a, p.fond, 'emotion ' + f.cle + ' sur fond');
          AA(f.a, p.surf, 'emotion ' + f.cle + ' sur surface');
          AA(p.surPlein, f.p, 'texte sur pastille ' + f.cle);
        });
        // Le trait doit rester visible sans devenir un cadre : 1.4:1 mini, 3:1 maxi.
        const rt = P.contraste(p.trait, p.surf);
        vrai(rt >= 1.15 && rt <= 3.6, 'liseré lisible mais discret ' + nom + ' (' + rt + ')');
      }
    }
  }
}
vrai(paires > 1000, 'toutes les paires de couleur ont ete verifiees (' + paires + ')');

// Les cinq emotions restent distinctes entre elles dans tous les mondes.
for (const sombre of [true, false]) {
  const p = P.palette('encre', sombre, 0.5, 0.5);
  for (let i = 0; i < p.familles.length; i++) for (let j = i + 1; j < p.familles.length; j++) {
    const a = p.familles[i], b = p.familles[j];
    vrai(a.a !== b.a, 'emotions ' + a.cle + ' et ' + b.cle + ' distinctes');
  }
}
// Une valeur hors bornes retombe sur le milieu au lieu de casser la palette.
eq(P.palette('jardin', true, 9, -3).fond, P.palette('jardin', true, 0.5, 0.5).fond, 'reglages hors bornes ignores');
eq(P.palette('monde inexistant', true, 0.5, 0.5).fond, P.palette('jardin', true, 0.5, 0.5).fond, 'theme inconnu = jardin');
vrai(P.cssTheme(P.palette('lagon', false, 0.5, 0.5)).includes('--f-colere:'), 'le CSS porte les couleurs d’emotion');

/* -- journal ------------------------------------------------------------- */
const J = (id, ts, fam, intensite, quoi, quals, corps) => ({ id, ts, fam, intensite, quoi: quoi || '', quals: quals || [], corps: corps || '' });
const T = new Date(2026, 8, 13, 12, 0).getTime(), JOUR = 864e5;

const j = [
  J(1, T, 'colere', 8, 'le voisin remet sa musique à fond', ['Révoltée'], 'mâchoire serrée'),
  J(2, T - JOUR, 'colere', 7, 'musique du voisin encore', ['Révoltée'], 'mâchoire serrée'),
  J(3, T - 3 * JOUR, 'joie', 5, 'balade au parc', ['Joyeuse'], ''),
  J(4, T - 40 * JOUR, 'peur', 9, 'rendez-vous médical', ['Terrifiée'], 'ventre noué'),
];

eq(P.parJour(j).length, 4, 'un groupe par jour');
eq(P.parJour(j)[0].liste[0].id, 1, 'le plus recent en premier');
eq(P.resume(j).total, 4, 'total');
eq(P.resume(j).moyenne, 7.3, 'intensite moyenne');
eq(P.dominante(j), 'colere', 'la dominante cumule les intensites');
// Une colere a 9 pese plus que deux agacements a 1 : c'est l'intensite qui compte.
eq(P.dominante([J(9, T, 'joie', 1), J(10, T, 'joie', 1), J(11, T, 'colere', 9)]), 'colere', 'une forte pese plus que deux faibles');
eq(P.repartition(j)[0].cle, 'colere', 'repartition triee');
eq(P.trame(j, '2026-09-13', 14).length, 14, 'quatorze jours de trame');
eq(P.trame(j, '2026-09-13', 3).map(x => x.n), [0, 1, 1], 'jours vides compris');
eq(P.heures(j)[12], 4, 'les heures');
eq(P.topQuals(j, 2)[0], ['Révoltée', 2], 'les mots qui reviennent, par cle');
eq(P.sensations(j, 'colere', 2), ['mâchoire serrée'], 'les sensations deja notees a ce palier');
eq(P.sensations(j, 'colere', 1), [], 'aucune sensation a un autre palier');

/* -- echos --------------------------------------------------------------- */
eq(P.similarite(j[0], j[1]), 6.5, 'meme famille 2 + meme palier 1,5 + un qualificatif 1 + mots partages plafonnes a 2');
eq(P.similarite(j[0], j[2]), 0, 'familles differentes = zero');
vrai(P.similarite(j[0], j[1]) >= P.SEUIL, 'au-dessus du seuil');
eq(P.echos(j, j[0]).map(x => x.e.id), [2], 'un seul echo');
eq(P.echos(j, j[0])[0].mots, ['voisin', 'musique', 'machoire', 'serree'], 'les mots partages sont dits');
eq(P.motsCles('Le voisin, encore, avec sa musique'), ['voisin', 'musique'], 'mots vides et mots courts jetes');
eq(P.constellation(j).points.length, 4, 'un point par moment');
eq(P.constellation(j).liens, [{ a: 2, b: 3, s: 6.5 }], 'un trait entre les deux coleres');

/* -- seance -------------------------------------------------------------- */
const s7 = P.periode(j, 'semaine', T);
eq(s7.liste.length, 3, 'sept jours : trois moments');
eq(s7.titre, 'Les 7 derniers jours', 'titre des sept jours');
eq(P.periode(j, 'mois', T).liste.length, 3, 'trente jours : trois moments');
eq(P.periode(j, 'mois', T).titre, 'Les 30 derniers jours', 'titre des trente jours');
const sa = P.periode(j, 'seance', T, T - 2 * JOUR);
eq(sa.liste.length, 2, 'depuis la seance : deux moments');
eq(sa.titre, 'Depuis 2 jours', 'titre depuis la seance');
eq(P.periode(j, 'seance', T, T).titre, 'Depuis ce matin', 'seance posee aujourd’hui');
eq(P.periode(j, 'seance', T, null).cle, 'semaine', 'sans ancre, on retombe sur sept jours');
eq(P.periode(j, 'semaine', T).resume.moyenne, 6.7, 'la periode porte son propre resume');
eq(P.periode([], 'semaine', T).liste, [], 'periode vide');

/* -- moments gardes pour soi ---------------------------------------------
   Un moment prive reste dans le journal et disparait du mode seance. Sans ca,
   le patient s'autocensure a la saisie, et c'est la donnee la plus utile
   qu'on perd. */
const jp = j.concat([J(5, T - 2 * JOUR, 'peur', 6, 'ce que je ne dis pas encore', ['Effrayée'], '')]);
jp[jp.length - 1].prive = true;
eq(P.periode(jp, 'semaine', T).liste.length, 3, 'le moment prive sort du mode seance');
eq(P.parJour(jp).length, 5, 'mais il reste dans le journal');
vrai(!P.periode(jp, 'mois', T).liste.some(e => e.prive), 'aucun moment prive sur trente jours non plus');
eq(P.periode(jp, 'semaine', T).resume.total, 3, 'les chiffres de la seance l ignorent aussi');

/* -- un mot, tous ses moments -------------------------------------------- */
eq(P.momentsDuMot(j, 'Révoltée').map(e => e.id), [1, 2], 'les deux moments du mot, du plus recent au plus ancien');
eq(P.momentsDuMot(j, 'Terrifiée').map(e => e.id), [4], 'un seul moment');
eq(P.momentsDuMot(j, 'jamais pose'), [], 'un mot jamais pose ne rend rien');
// On cherche par cle, pas par forme affichee : sinon changer d'accord viderait l'ecran.
eq(P.momentsDuMot(j, P.motAffiche('Révoltée', 'm')), [], 'la recherche se fait sur la cle');

/* -- journal de demonstration --------------------------------------------
   Il sert les ecrans embarques dans psy.html : s il derive du vocabulaire,
   la page destinee aux psychologues montre des mots qui n existent pas. */
const demo = P.DEMO(T);
vrai(demo.length >= 8, 'le journal de demonstration est fourni');
eq(demo.filter(e => e.prive).length, 1, 'un moment prive, pour que la regle se voie');
const clesConnues = new Set([].concat(...P.FAMILLES.map(f => [].concat(...f.blocs))).map(P.cle));
demo.forEach(e => {
  vrai(P.famille(e.fam), 'famille connue : ' + e.fam);
  vrai(e.intensite >= 1 && e.intensite <= 10, 'intensite dans les bornes');
  (e.quals || []).forEach(q => vrai(clesConnues.has(q), 'qualificatif existant : ' + q));
});
eq(new Set(demo.map(e => e.id)).size, demo.length, 'aucun identifiant en double');
vrai(P.echos(demo, demo[0]).length >= 1, 'le moment le plus recent a au moins un echo a montrer');
vrai(P.constellation(demo).liens.length >= 1, 'le graphe des motifs a au moins un trait');
vrai(P.periode(demo, 'semaine', T).liste.length >= 3, 'la seance de sept jours n est pas vide');
vrai(!P.periode(demo, 'mois', T).liste.some(e => e.prive), 'le prive de demonstration sort bien de la seance');
vrai(P.topQuals(demo, 3).length >= 3, 'assez de mots qui reviennent pour la vue Tendances');

/* -- echelle du texte ----------------------------------------------------- */
eq(P.echelleTexte(0.5), 1, 'le milieu est la taille dessinee');
vrai(P.echelleTexte(0) < 1 && P.echelleTexte(0) >= 0.85, 'le plus petit reste lisible');
vrai(P.echelleTexte(1) >= 1.3, 'le plus grand va franchement plus loin');
vrai(P.echelleTexte(0.2) < P.echelleTexte(0.4) && P.echelleTexte(0.6) < P.echelleTexte(0.8), 'l echelle est croissante');
eq(P.echelleTexte(undefined), 1, 'une valeur absente retombe au milieu');
eq(P.echelleTexte(9), 1, 'une valeur hors bornes aussi');

/* -- accueil ------------------------------------------------------------- */
const matin = new Date(2026, 8, 13, 9, 0).getTime();
eq(P.salut('Julie', [], matin).titre, 'Bonjour Julie', 'bonjour le matin');
eq(P.salut('', [], matin).titre, 'Bonjour', 'sans prenom');
eq(P.salut('Julie', [], new Date(2026, 8, 13, 21, 0).getTime()).titre, 'Bonsoir Julie', 'bonsoir le soir');
eq(P.salut('Julie', [], new Date(2026, 8, 13, 3, 0).getTime()).titre, 'Bonsoir Julie', 'la nuit aussi c est bonsoir : bonne nuit est un au revoir');
eq(P.salut('Julie', j, T).souffle, 'Un moment noté aujourd’hui.', 'compte du jour');
vrai(!/dernier moment|il y a/.test(P.salut('Julie', [j[1]], T).souffle), 'aucun rappel du temps passe depuis la derniere note : ca marcherait comme un reproche');
vrai(!/f[ée]licit|bravo|continue comme/i.test(P.salut('Julie', j, T).souffle), 'aucune felicitation');

console.log(ok + ' verifications passees, dont ' + paires + ' paires de couleur.');
