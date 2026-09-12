// Gentiane — le vocabulaire du livre (p.102) et les calculs purs sur le journal.
// Une entrée : { id, ts, quoi, fam, intensite (0-10), quals: [], corps }.
// Le vocabulaire est au féminin : le journal s'écrit à la première personne,
// et c'est une femme qui le tient — pas de point médian à lire au passage.
// `corps` = les sensations physiques du thermomètre de la p.103.
// Intensité 0 = pas encore posée. Les blocs + / ++ / +++ / ++++ suivent le tableau.
(function (root) {
  'use strict';
  const P = {};

  P.PALIERS = ['+', '++', '+++', '++++'];

  P.FAMILLES = [
    { cle: 'peur', nom: 'Peur', couleur: '#a793c4', livre: true, blocs: [
      ['Dans l’appréhension, craintive', 'Insécurisée, méfiante', 'Nerveuse, stressée'],
      ['Inquiète, anxieuse', 'Alarmée', 'Effrayée'],
      ['Paniquée', 'Affolée'],
      ['Submergée, impuissante, désorientée', 'Terrifiée'],
    ] },
    { cle: 'tristesse', nom: 'Tristesse', couleur: '#6a8fc9', livre: true, blocs: [
      ['Chagrinée, peinée', 'Cafardeuse', 'Blessée, déçue'],
      ['Sentiment d’inutilité, d’abandon, d’impuissance', 'Malheureuse', 'Déprimée'],
      ['Honteuse, coupable', 'Mélancolique'],
      ['Abattue, accablée', 'Désespérée'],
    ] },
    { cle: 'colere', nom: 'Colère', couleur: '#e0616b', livre: true, blocs: [
      ['Amère, mécontente', 'Irritée, frustrée', 'Agacée'],
      ['Fâchée', 'Exaspérée', 'Indignée'],
      ['Révoltée', 'Agressive, courroucée'],
      ['Furieuse, hors de moi', 'Enragée'],
    ] },
    { cle: 'joie', nom: 'Joie', couleur: '#efb0c4', livre: false, blocs: [
      ['Contente, satisfaite', 'Sereine, apaisée', 'Amusée'],
      ['Joyeuse', 'Enthousiaste', 'Fière'],
      ['Heureuse', 'Excitée, exaltée'],
      ['Euphorique', 'Comblée, transportée'],
    ] },
    { cle: 'tendresse', nom: 'Tendresse', couleur: '#56c3a4', livre: false, blocs: [
      ['Bienveillante', 'Touchée', 'Reconnaissante'],
      ['Affectueuse', 'Émue', 'Complice'],
      ['Aimante', 'Attendrie'],
      ['Emplie de gratitude', 'Bouleversée'],
    ] },
  ];

  P.famille = cle => P.FAMILLES.find(f => f.cle === cle) || null;

  // 1-3 = +, 4-6 = ++, 7-8 = +++, 9-10 = ++++. 0 ou hors bornes = pas de bloc.
  P.bloc = i => (i >= 1 && i <= 3) ? 0 : (i >= 4 && i <= 6) ? 1 : (i >= 7 && i <= 8) ? 2 : (i >= 9 && i <= 10) ? 3 : null;

  // Intensité proposée quand on choisit un qualificatif sans avoir bougé le curseur.
  P.intensiteDuBloc = b => [2, 5, 7, 9][b];

  P.iso = ts => { const d = new Date(ts); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  P.minuit = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
  P.addJours = (iso, n) => { const [y, m, d] = iso.split('-').map(Number); return P.iso(new Date(y, m - 1, d + n).getTime()); };

  P.tri = entrees => [...entrees].sort((a, b) => b.ts - a.ts);

  P.parJour = entrees => {
    const m = new Map();
    for (const e of P.tri(entrees)) {
      const j = P.iso(e.ts);
      if (!m.has(j)) m.set(j, []);
      m.get(j).push(e);
    }
    return [...m.entries()].map(([date, liste]) => ({ date, liste }));
  };

  // N derniers jours jusqu'à `finIso` inclus, jours vides compris — c'est la trame du graphe.
  P.trame = (entrees, finIso, n) => {
    const par = new Map(P.parJour(entrees).map(j => [j.date, j.liste]));
    const out = [];
    for (let k = n - 1; k >= 0; k--) {
      const date = P.addJours(finIso, -k);
      const liste = par.get(date) || [];
      const somme = liste.reduce((s, e) => s + (e.intensite || 0), 0);
      out.push({
        date,
        n: liste.length,
        moyenne: liste.length ? somme / liste.length : 0,
        dominante: P.dominante(liste),
      });
    }
    return out;
  };

  // La famille qui pèse le plus en intensité cumulée, pas juste en nombre :
  // une colère à 9 compte plus que deux agacements à 1.
  P.dominante = entrees => {
    const poids = {};
    for (const e of entrees) poids[e.fam] = (poids[e.fam] || 0) + Math.max(1, e.intensite || 0);
    const top = Object.entries(poids).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    return top ? top[0] : null;
  };

  P.repartition = entrees => {
    const n = {};
    for (const e of entrees) n[e.fam] = (n[e.fam] || 0) + 1;
    return P.FAMILLES.filter(f => n[f.cle]).map(f => ({ cle: f.cle, nom: f.nom, couleur: f.couleur, n: n[f.cle], pct: Math.round(100 * n[f.cle] / entrees.length) }))
      .sort((a, b) => b.n - a.n);
  };

  P.heures = entrees => {
    const h = new Array(24).fill(0);
    for (const e of entrees) h[new Date(e.ts).getHours()]++;
    return h;
  };

  P.topQuals = (entrees, n = 5) => {
    const c = {};
    for (const e of entrees) for (const q of (e.quals || [])) c[q] = (c[q] || 0) + 1;
    return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
  };

  // Le thermomètre de la p.103 se remplit tout seul : ce qu'elle a déjà noté
  // comme sensations pour cette famille à ce palier lui est reproposé.
  P.sensations = (entrees, fam, bloc) => {
    const vus = new Set(), out = [];
    for (const e of P.tri(entrees)) {
      const c = (e.corps || '').trim();
      if (!c || e.fam !== fam) continue;
      if (bloc != null && P.bloc(e.intensite) !== bloc) continue;
      const k = c.toLowerCase();
      if (vus.has(k)) continue;
      vus.add(k); out.push(c);
    }
    return out.slice(0, 4);
  };

  // -- echos : "quand est-ce que j'ai deja vecu ca ?" -----------------------
  // Deux moments se ressemblent d'abord par leur famille, ensuite par leur
  // palier, puis par les mots poses dessus. Rien de savant : c'est un score
  // lisible a la main, pour qu'on puisse expliquer pourquoi deux points sont relies.
  P.SEUIL = 3.5;

  const VIDES = new Set(('alors apres aussi avec avoir beaucoup cela cette comme dans deja depuis donc elle encore etre faire fait meme moins parce pour pourquoi quand quelque sans sont sous suis toujours tout toute tous tres vers voir etait ete cest jai').split(' '));

  P.motsCles = txt => {
    const brut = String(txt || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return [...new Set(brut.split(/[^a-z0-9]+/).filter(m => m.length >= 4 && !VIDES.has(m)))];
  };

  P.similarite = (a, b) => {
    if (!a || !b || a.fam !== b.fam) return 0;
    let s = 2;
    const ba = P.bloc(a.intensite), bb = P.bloc(b.intensite);
    if (ba != null && ba === bb) s += 1.5;
    const qa = new Set(a.quals || []);
    s += (b.quals || []).filter(q => qa.has(q)).length;
    const ma = new Set(P.motsCles((a.quoi || '') + ' ' + (a.corps || '')));
    const communs = P.motsCles((b.quoi || '') + ' ' + (b.corps || '')).filter(m => ma.has(m));
    return s + Math.min(2, 0.5 * communs.length);
  };

  P.echos = (entrees, cible, n = 3) => P.tri(entrees)
    .filter(e => e.id !== cible.id)
    .map(e => ({ e, score: P.similarite(cible, e), mots: P.motsCles((cible.quoi || '') + ' ' + (cible.corps || '')).filter(m => P.motsCles((e.quoi || '') + ' ' + (e.corps || '')).includes(m)) }))
    .filter(x => x.score >= P.SEUIL)
    .sort((x, y) => y.score - x.score || y.e.ts - x.e.ts)
    .slice(0, n);

  // Les points du graphe, en coordonnees 0..1, et les liens entre ceux qui se
  // ressemblent. Deux liens par point au maximum : au-dela c'est une pelote.
  P.constellation = (entrees, seuil = P.SEUIL) => {
    const es = P.tri(entrees).reverse();
    if (!es.length) return { points: [], liens: [] };
    const t0 = es[0].ts, span = (es[es.length - 1].ts - t0) || 1;
    const points = es.map(e => ({ e, x: (e.ts - t0) / span, y: (e.intensite || 0) / 10 }));
    const liens = [];
    points.forEach((_, a) => {
      points.map((__, b) => ({ b, s: a === b ? 0 : P.similarite(points[a].e, points[b].e) }))
        .filter(x => x.s >= seuil)
        .sort((x, y) => y.s - x.s)
        .slice(0, 2)
        .forEach(({ b, s }) => {
          const i = Math.min(a, b), j = Math.max(a, b);
          if (!liens.some(l => l.a === i && l.b === j)) liens.push({ a: i, b: j, s });
        });
    });
    return { points, liens };
  };

  P.resume = entrees => {
    if (!entrees.length) return { total: 0, moyenne: 0, forte: null };
    const avec = entrees.filter(e => e.intensite > 0);
    return {
      total: entrees.length,
      moyenne: avec.length ? Math.round(10 * avec.reduce((s, e) => s + e.intensite, 0) / avec.length) / 10 : 0,
      forte: P.tri(entrees).slice().sort((a, b) => b.intensite - a.intensite)[0],
    };
  };

  if (typeof module !== 'undefined') module.exports = P; else root.Gentiane = P;
})(typeof self !== 'undefined' ? self : this);
