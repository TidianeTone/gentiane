// Gentiane — le vocabulaire du livre (p.102), les themes, et les calculs purs.
// Une entrée : { id, ts, quoi, fam, intensite (0-10), quals: [], corps }.
// `quals` stocke toujours la CLÉ d'un qualificatif (sa forme féminine), jamais
// la forme affichée : changer d'accord ne doit pas casser un journal déjà écrit.
// `corps` = les sensations physiques du thermomètre de la p.103.
// Intensité 0 = pas encore posée. Les blocs + / ++ / +++ / ++++ suivent le tableau.
(function (root) {
  'use strict';
  const P = {};

  P.PALIERS = ['+', '++', '+++', '++++'];

  /* == accord grammatical ==================================================
     Un qualificatif est soit une chaîne (invariable), soit un triplet
     [féminin, masculin, sans accord]. Le troisième est une tournure nominale :
     personne n'est mis au masculin par défaut, et aucun point médian à lire. */

  P.ACCORDS = [
    { cle: 'f', nom: 'Au féminin', exemple: 'Je me sens affolée' },
    { cle: 'm', nom: 'Au masculin', exemple: 'Je me sens affolé' },
    { cle: 'n', nom: 'Sans accord', exemple: 'Je ressens de l’affolement' },
  ];

  const RANG = { f: 0, m: 1, n: 2 };

  // La forme affichée d'un qualificatif pour un accord donné.
  P.mot = (q, accord) => Array.isArray(q) ? (q[RANG[accord]] || q[0]) : q;
  // La clé stable d'un qualificatif : sa forme féminine.
  P.cle = q => Array.isArray(q) ? q[0] : q;

  P.FAMILLES = [
    { cle: 'peur', nom: 'Peur', couleur: 'var(--f-peur)', plein: 'var(--f-peur-p)', livre: true, blocs: [
      [['Dans l’appréhension, craintive', 'Dans l’appréhension, craintif', 'Dans l’appréhension'],
       ['Insécurisée, méfiante', 'Insécurisé, méfiant', 'En insécurité, sur mes gardes'],
       ['Nerveuse, stressée', 'Nerveux, stressé', 'Sous tension, du stress']],
      [['Inquiète, anxieuse', 'Inquiet, anxieux', 'De l’inquiétude, de l’anxiété'],
       ['Alarmée', 'Alarmé', 'En alerte'],
       ['Effrayée', 'Effrayé', 'De la frayeur']],
      [['Paniquée', 'Paniqué', 'En panique'],
       ['Affolée', 'Affolé', 'De l’affolement']],
      [['Submergée, impuissante, désorientée', 'Submergé, impuissant, désorienté', 'Submersion, impuissance, désorientation'],
       ['Terrifiée', 'Terrifié', 'De la terreur']],
    ] },
    { cle: 'tristesse', nom: 'Tristesse', couleur: 'var(--f-tristesse)', plein: 'var(--f-tristesse-p)', livre: true, blocs: [
      [['Chagrinée, peinée', 'Chagriné, peiné', 'Du chagrin, de la peine'],
       ['Cafardeuse', 'Cafardeux', 'Le cafard'],
       ['Blessée, déçue', 'Blessé, déçu', 'Blessure, déception']],
      ['Sentiment d’inutilité, d’abandon, d’impuissance',
       ['Malheureuse', 'Malheureux', 'Du malheur'],
       ['Déprimée', 'Déprimé', 'De la déprime']],
      [['Honteuse, coupable', 'Honteux, coupable', 'Honte, culpabilité'],
       ['Mélancolique', 'Mélancolique', 'Mélancolie']],
      [['Abattue, accablée', 'Abattu, accablé', 'Abattement, accablement'],
       ['Désespérée', 'Désespéré', 'Du désespoir']],
    ] },
    { cle: 'colere', nom: 'Colère', couleur: 'var(--f-colere)', plein: 'var(--f-colere-p)', livre: true, blocs: [
      [['Amère, mécontente', 'Amer, mécontent', 'Amertume, mécontentement'],
       ['Irritée, frustrée', 'Irrité, frustré', 'Irritation, frustration'],
       ['Agacée', 'Agacé', 'De l’agacement']],
      [['Fâchée', 'Fâché', 'De la contrariété'],
       ['Exaspérée', 'Exaspéré', 'De l’exaspération'],
       ['Indignée', 'Indigné', 'De l’indignation']],
      [['Révoltée', 'Révolté', 'De la révolte'],
       ['Agressive, courroucée', 'Agressif, courroucé', 'Agressivité, courroux']],
      [['Furieuse, hors de moi', 'Furieux, hors de moi', 'De la fureur, hors de moi'],
       ['Enragée', 'Enragé', 'De la rage']],
    ] },
    { cle: 'joie', nom: 'Joie', couleur: 'var(--f-joie)', plein: 'var(--f-joie-p)', livre: false, blocs: [
      [['Contente, satisfaite', 'Content, satisfait', 'Contentement, satisfaction'],
       ['Sereine, apaisée', 'Serein, apaisé', 'Sérénité, apaisement'],
       ['Amusée', 'Amusé', 'De l’amusement']],
      [['Joyeuse', 'Joyeux', 'Une joie franche'],
       ['Enthousiaste', 'Enthousiaste', 'De l’enthousiasme'],
       ['Fière', 'Fier', 'De la fierté']],
      [['Heureuse', 'Heureux', 'Du bonheur'],
       ['Excitée, exaltée', 'Excité, exalté', 'Excitation, exaltation']],
      [['Euphorique', 'Euphorique', 'De l’euphorie'],
       ['Comblée, transportée', 'Comblé, transporté', 'Plénitude, transport']],
    ] },
    { cle: 'tendresse', nom: 'Tendresse', couleur: 'var(--f-tendresse)', plein: 'var(--f-tendresse-p)', livre: false, blocs: [
      [['Bienveillante', 'Bienveillant', 'De la bienveillance'],
       ['Touchée', 'Touché', 'De l’émoi'],
       ['Reconnaissante', 'Reconnaissant', 'De la reconnaissance']],
      [['Affectueuse', 'Affectueux', 'De l’affection'],
       ['Émue', 'Ému', 'Une émotion vive'],
       ['Complice', 'Complice', 'De la complicité']],
      [['Aimante', 'Aimant', 'De l’amour'],
       ['Attendrie', 'Attendri', 'De l’attendrissement']],
      [['Emplie de gratitude', 'Empli de gratitude', 'Une immense gratitude'],
       ['Bouleversée', 'Bouleversé', 'Du bouleversement']],
    ] },
  ];

  P.famille = cle => P.FAMILLES.find(f => f.cle === cle) || null;

  // 1-3 = +, 4-6 = ++, 7-8 = +++, 9-10 = ++++. 0 ou hors bornes = pas de bloc.
  P.bloc = i => (i >= 1 && i <= 3) ? 0 : (i >= 4 && i <= 6) ? 1 : (i >= 7 && i <= 8) ? 2 : (i >= 9 && i <= 10) ? 3 : null;

  // Intensité proposée quand on choisit un qualificatif sans avoir bougé le curseur.
  P.intensiteDuBloc = b => [2, 5, 7, 9][b];

  // Le qualificatif tel qu'il doit s'afficher, à partir de sa clé stockée.
  P.motAffiche = (cle, accord) => {
    for (const f of P.FAMILLES) for (const bloc of f.blocs) for (const q of bloc) {
      if (P.cle(q) === cle) return P.mot(q, accord);
    }
    return cle;
  };

  /* == couleur : OKLCH vers sRGB ===========================================
     Tout le système de thèmes est calculé en OKLCH parce que la clarté y est
     perceptuelle : on peut promettre un écart de contraste et le tenir dans
     les sept mondes, en clair comme en sombre, sans le vérifier à l'œil.
     `node verif.js` refait le calcul WCAG sur chaque combinaison. */

  const gamma = u => u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;

  // OKLCH -> [r,g,b] linéaires, sans clamp : sert aussi à détecter le hors-gamut.
  const lineaire = (L, C, H) => {
    const h = H * Math.PI / 180, a = C * Math.cos(h), b = C * Math.sin(h);
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    const l = l_ * l_ * l_, m = m_ * m_ * m_, s = s_ * s_ * s_;
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    ];
  };

  // Hors gamut, on retire du chroma plutôt que d'écrêter les canaux : écrêter
  // fait tourner la teinte, et deux familles d'émotion finiraient par se ressembler.
  P.ok = (L, C, H) => {
    let c = C, rgb = lineaire(L, c, H);
    while (c > 0 && rgb.some(v => v < -0.0005 || v > 1.0005)) { c -= 0.004; rgb = lineaire(L, c, H); }
    return '#' + rgb.map(v => Math.round(gamma(Math.min(1, Math.max(0, v))) * 255).toString(16).padStart(2, '0')).join('');
  };

  const canal = v => { const u = v / 255; return u <= 0.04045 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4); };
  P.luminance = hex => {
    const n = parseInt(hex.slice(1), 16);
    return 0.2126 * canal(n >> 16 & 255) + 0.7152 * canal(n >> 8 & 255) + 0.0722 * canal(n & 255);
  };
  P.contraste = (a, b) => {
    const x = P.luminance(a), y = P.luminance(b);
    return Math.round(100 * ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05))) / 100;
  };

  /* == les mondes ==========================================================
     Un thème ne décrit que le SOL : le fond, les surfaces, l'encre, l'accent,
     la rampe. Les cinq couleurs d'émotion, elles, ne bougent jamais d'un monde
     à l'autre — c'est la grammaire que le patient et son psy apprennent. */

  P.THEMES = [
    { cle: 'jardin', nom: 'Jardin de nuit', souffle: 'Le bleu d’origine, un jardin après la tombée du jour.',
      h: 248, c: 0.038, ha: 58, rampe: [165, 258, 350] },
    { cle: 'aube', nom: 'Aube', souffle: 'Le ciel juste avant que le soleil se lève.',
      h: 20, c: 0.035, ha: 232, rampe: [32, 348, 286] },
    { cle: 'sous-bois', nom: 'Sous-bois', souffle: 'De la mousse, de l’écorce, une lumière qui passe entre les feuilles.',
      h: 150, c: 0.032, ha: 72, rampe: [140, 168, 96] },
    { cle: 'sable', nom: 'Sable', souffle: 'Du papier chaud, de l’argile, rien de froid nulle part.',
      h: 72, c: 0.030, ha: 214, rampe: [58, 28, 340] },
    { cle: 'lagon', nom: 'Lagon', souffle: 'De l’eau claire, du sel, beaucoup d’air.',
      h: 202, c: 0.036, ha: 38, rampe: [190, 214, 160] },
    { cle: 'prune', nom: 'Prune', souffle: 'Un velours sombre, un fruit très mûr.',
      h: 318, c: 0.040, ha: 88, rampe: [300, 340, 262] },
    { cle: 'encre', nom: 'Encre', souffle: 'Presque rien. Du gris, du papier, et les émotions seules en couleur.',
      h: 262, c: 0.010, ha: 24, rampe: [250, 268, 230] },
  ];

  P.theme = cle => P.THEMES.find(t => t.cle === cle) || P.THEMES[0];

  // Les cinq émotions : teinte fixe, chroma propre à chacune pour que la joie
  // (rose) et la colère (rouge) ne se confondent pas au coin de l'œil.
  P.TEINTES = [
    { cle: 'peur', h: 302, k: 0.88 },
    { cle: 'tristesse', h: 262, k: 0.95 },
    { cle: 'colere', h: 24, k: 1.30 },
    { cle: 'joie', h: 352, k: 0.78 },
    { cle: 'tendresse', h: 168, k: 1.00 },
  ];

  P.DEFAUTS = { theme: 'jardin', sombre: true, chaleur: 0.5, contraste: 0.5, texte: 0.5 };

  // L'echelle du texte : 0.5 est la taille dessinee, en dessous on resserre un
  // peu, au-dessus on va franchement plus loin — c'est le cote qui sert.
  P.echelleTexte = t => {
    const v = (typeof t === 'number' && t >= 0 && t <= 1) ? t : 0.5;
    return Math.round(100 * (v <= 0.5 ? 0.90 + 0.20 * v : 1 + 0.70 * (v - 0.5))) / 100;
  };

  const borne = (v, d) => (typeof v === 'number' && v >= 0 && v <= 1) ? v : d;

  // Le seul endroit où une couleur de l'interface est décidée.
  P.palette = (cleTheme, sombre, chaleur, contraste) => {
    const t = P.theme(cleTheme);
    const w = borne(chaleur, 0.5), k = borne(contraste, 0.5);
    const hn = t.h + (w - 0.5) * 26;           // la chaleur fait glisser la teinte du sol
    const cn = t.c * (0.55 + 0.9 * w);         // et la charge un peu plus en couleur
    const ok = P.ok;
    const out = { sombre: !!sombre };

    if (sombre) {
      const fL = 0.310 - 0.050 * k;
      out.fond = ok(fL, cn, hn);
      out.surf = ok(fL + 0.055, cn * 1.15, hn);
      out.surf2 = ok(fL + 0.105, cn * 1.25, hn);
      out.trait = ok(fL + 0.185, cn * 1.30, hn);
      out.ink = ok(0.905 + 0.075 * k, cn * 0.55, hn);
      out.ink2 = ok(0.755 + 0.025 * k, cn * 0.80, hn);
      out.action = ok(0.800, 0.105, t.ha);
      out.surRampe = ok(0.155, cn, hn);
      out.rampe = t.rampe.map((h, i) => ok([0.780, 0.755, 0.800][i], 0.095, h));
      out.familles = P.TEINTES.map(f => ({ cle: f.cle, a: ok(0.775, 0.105 * f.k, f.h), p: ok(0.775, 0.105 * f.k, f.h) }));
    } else {
      const fL = 0.962 + 0.020 * k;
      out.fond = ok(fL, cn * 0.55, hn);
      out.surf = ok(fL - 0.034, cn * 0.90, hn);
      out.surf2 = ok(fL - 0.072, cn * 1.00, hn);
      out.trait = ok(fL - 0.175, cn * 1.10, hn);
      out.ink = ok(0.305 - 0.105 * k, cn * 0.90, hn);
      out.ink2 = ok(0.455 - 0.050 * k, cn * 1.00, hn);
      out.action = ok(0.450, 0.120, t.ha);
      out.surRampe = ok(0.990, 0.008, hn);
      out.rampe = t.rampe.map((h, i) => ok([0.445, 0.425, 0.460][i], 0.100, h));
      out.familles = P.TEINTES.map(f => ({ cle: f.cle, a: ok(0.445, 0.125 * f.k, f.h), p: ok(0.425, 0.130 * f.k, f.h) }));
    }
    out.surPlein = sombre ? out.surRampe : ok(0.990, 0.008, hn);
    return out;
  };

  P.cssTheme = p =>
    '--fond:' + p.fond + ';--surf:' + p.surf + ';--surf2:' + p.surf2 + ';--trait:' + p.trait
    + ';--ink:' + p.ink + ';--ink2:' + p.ink2 + ';--action:' + p.action
    + ';--sur-rampe:' + p.surRampe + ';--sur-plein:' + p.surPlein
    + ';--rampe:linear-gradient(100deg,' + p.rampe[0] + ',' + p.rampe[1] + ' 46%,' + p.rampe[2] + ')'
    + p.familles.map(f => ';--f-' + f.cle + ':' + f.a + ';--f-' + f.cle + '-p:' + f.p).join('');

  /* == demonstration =======================================================
     Un journal fictif mais plausible, pose par rapport a l'instant present :
     il alimente les ecrans embarques dans la page destinee aux psychologues.
     Il ne touche jamais au localStorage — voir le mode demo de index.html. */

  P.DEMO = maintenant => {
    const J = 864e5, T = maintenant;
    return [
      [0, 'colere', 8, 'le voisin remet sa musique à fond', ['Révoltée'], 'mâchoire serrée', 0],
      [0.2, 'tendresse', 6, 'appel de ma sœur, elle a pensé à moi', ['Émue'], 'chaleur dans la poitrine', 0],
      [1, 'peur', 7, 'mail du travail ouvert à 22h', ['Paniquée'], 'ventre noué', 0],
      [1.4, 'tristesse', 4, 'ce que je n’ai pas encore envie de dire', ['Malheureuse'], '', 1],
      [2.6, 'colere', 7, 'musique du voisin, encore', ['Révoltée'], 'mâchoire serrée', 0],
      [3.2, 'joie', 5, 'balade au parc, il faisait doux', ['Sereine, apaisée'], '', 0],
      [4.5, 'peur', 9, 'rendez-vous médical demain', ['Terrifiée'], 'ventre noué', 0],
      [6, 'tristesse', 6, 'rangé les affaires du grenier', ['Déprimée'], 'fatiguée partout', 0],
      [8, 'tendresse', 7, 'le chat est venu dormir contre moi', ['Attendrie'], 'chaleur dans la poitrine', 0],
      [11, 'colere', 3, 'file d’attente à la poste', ['Agacée'], '', 0],
      [13, 'joie', 8, 'fini le dessin commencé en mai', ['Heureuse'], '', 0],
    ].map((x, i) => ({
      id: T - i * 1000, ts: T - x[0] * J - 3 * 36e5, fam: x[1], intensite: x[2],
      quoi: x[3], quals: x[4], corps: x[5], prive: !!x[6],
    }));
  };

  /* == accueil ============================================================= */

  // Ce que l'appli dit en ouvrant le journal. Des faits et un prénom, jamais
  // une félicitation : rien ici ne récompense le fait d'avoir noté.
  P.salut = (prenom, entrees, maintenant) => {
    const h = new Date(maintenant).getHours();
    const nom = (prenom || '').trim();
    // Pas de « Bonne nuit » : en francais c'est un au revoir, et a trois heures
    // du matin quelqu'un qui ouvre ce journal n'a pas besoin qu'on le renvoie au lit.
    const titre = (h >= 5 && h < 18 ? 'Bonjour' : 'Bonsoir') + (nom ? ' ' + nom : '');
    if (!entrees.length) return { titre, souffle: 'Rien n’est jugé ici, et rien ne sort de ce téléphone.' };
    const auj = P.iso(maintenant);
    const n = entrees.filter(e => P.iso(e.ts) === auj).length;
    if (n) return { titre, souffle: n === 1 ? 'Un moment noté aujourd’hui.' : n + ' moments notés aujourd’hui.' };
    // Surtout pas « ton dernier moment date d'il y a six jours » : c'est un
    // fait, et ca marche comme un reproche. Rien ici ne relance.
    return { titre, souffle: 'Rien n’est jugé ici, et rien ne sort de ce téléphone.' };
  };

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

  /* == mode séance =========================================================
     Ce que le patient tend à son psy. Trois fenêtres, aucune interprétation :
     on borne le temps, on rend les faits. */

  P.PERIODES = [
    { cle: 'semaine', nom: '7 jours' },
    { cle: 'mois', nom: '30 jours' },
    { cle: 'seance', nom: 'Depuis la dernière fois' },
  ];

  P.periode = (entrees, cle, maintenant, ancre) => {
    let debut, titre;
    if (cle === 'seance' && ancre) {
      debut = ancre;
      const j = Math.max(0, Math.round((P.minuit(P.iso(maintenant)) - P.minuit(P.iso(ancre))) / 864e5));
      titre = j === 0 ? 'Depuis ce matin' : j === 1 ? 'Depuis hier' : 'Depuis ' + j + ' jours';
    } else if (cle === 'mois') {
      debut = P.minuit(P.addJours(P.iso(maintenant), -29)); titre = 'Les 30 derniers jours';
    } else {
      cle = 'semaine';
      debut = P.minuit(P.addJours(P.iso(maintenant), -6)); titre = 'Les 7 derniers jours';
    }
    // Un moment marque prive n'est jamais rendu ici : c'est la condition pour
    // que le patient ose ecrire ce qu'il n'a pas encore envie de dire.
    const liste = P.tri(entrees.filter(e => e.ts >= debut && e.ts <= maintenant && !e.prive));
    return { cle, debut, titre, liste, jours: P.parJour(liste), resume: P.resume(liste), repartition: P.repartition(liste) };
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

  // « Les onze fois ou j'ai note ca. » Le compagnon de topQuals.
  P.momentsDuMot = (entrees, cle) => P.tri(entrees.filter(e => (e.quals || []).includes(cle)));

  P.topQuals = (entrees, n = 5) => {
    const c = {};
    for (const e of entrees) for (const q of (e.quals || [])) c[q] = (c[q] || 0) + 1;
    return Object.entries(c).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n);
  };

  // Le thermomètre de la p.103 se remplit tout seul : ce qui a déjà été noté
  // comme sensations pour cette famille à ce palier est reproposé.
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
  // palier, puis par les mots posés dessus. Rien de savant : c'est un score
  // lisible à la main, pour qu'on puisse expliquer pourquoi deux points sont reliés.
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

  // Les points du graphe, en coordonnées 0..1, et les liens entre ceux qui se
  // ressemblent. Deux liens par point au maximum : au-delà c'est une pelote.
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
