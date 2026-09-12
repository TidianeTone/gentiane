// node verif.js — casse si le vocabulaire ou les calculs du journal cassent.
const P = require('./gentiane.js');
const assert = require('assert');

// -- vocabulaire ----------------------------------------------------------
assert.strictEqual(P.FAMILLES.length, 5);
assert.strictEqual(P.FAMILLES.filter(f => f.livre).length, 3, 'le livre ne liste que peur/tristesse/colère');
for (const f of P.FAMILLES) {
  assert.strictEqual(f.blocs.length, 4, f.cle + ' : quatre paliers');
  assert.ok(f.blocs.every(b => b.length >= 2), f.cle + ' : chaque palier a des mots');
}
assert.deepStrictEqual(P.famille('colere').blocs[3], ['Furieuse, hors de moi', 'Enragée']);
assert.ok(P.FAMILLES.every(f => f.blocs.every(b => b.every(m => !/·/.test(m)))), 'vocabulaire au féminin, sans point médian');

// -- paliers d'intensité --------------------------------------------------
assert.strictEqual(P.bloc(0), null, '0 = intensité pas encore posée');
assert.deepStrictEqual([1, 3, 4, 6, 7, 8, 9, 10].map(P.bloc), [0, 0, 1, 1, 2, 2, 3, 3]);
assert.strictEqual(P.bloc(11), null);
assert.strictEqual(P.bloc(P.intensiteDuBloc(2)), 2, 'l’intensité suggérée retombe dans son bloc');

// -- dates ----------------------------------------------------------------
const J = (iso, h) => new Date(...iso.split('-').map(Number).map((v, i) => i === 1 ? v - 1 : v), h || 12).getTime();
assert.strictEqual(P.iso(J('2026-09-11')), '2026-09-11');
assert.strictEqual(P.addJours('2026-03-01', -1), '2026-02-28');

const E = [
  { id: 1, ts: J('2026-09-09', 21), fam: 'peur', intensite: 8, quals: ['Affolée', 'Paniquée'] },
  { id: 2, ts: J('2026-09-11', 9), fam: 'colere', intensite: 4, quals: ['Agacée'] },
  { id: 3, ts: J('2026-09-11', 21), fam: 'joie', intensite: 6, quals: ['Fière', 'Affolée'] },
];

// -- regroupement ---------------------------------------------------------
const par = P.parJour(E);
assert.deepStrictEqual(par.map(j => j.date), ['2026-09-11', '2026-09-09'], 'le plus récent en premier');
assert.strictEqual(par[0].liste[0].id, 3, 'dans la journée aussi, le plus récent en premier');

// -- trame du graphe ------------------------------------------------------
const t = P.trame(E, '2026-09-11', 4);
assert.strictEqual(t.length, 4);
assert.deepStrictEqual(t.map(j => j.date), ['2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11']);
assert.deepStrictEqual(t[0], { date: '2026-09-08', n: 0, moyenne: 0, dominante: null }, 'un jour sans rien reste dans la trame');
assert.strictEqual(t[3].n, 2);
assert.strictEqual(t[3].moyenne, 5);
assert.strictEqual(t[3].dominante, 'joie', 'à nombre égal, l’intensité tranche');

// -- dominante ------------------------------------------------------------
assert.strictEqual(P.dominante([]), null);
assert.strictEqual(P.dominante([{ fam: 'peur', intensite: 9 }, { fam: 'joie', intensite: 3 }, { fam: 'joie', intensite: 3 }]), 'peur');
assert.strictEqual(P.dominante([{ fam: 'peur', intensite: 0 }, { fam: 'peur', intensite: 0 }, { fam: 'joie', intensite: 1 }]), 'peur',
  'une entrée sans intensité pèse quand même 1');

// -- répartition / heures / mots ------------------------------------------
const r = P.repartition(E);
assert.strictEqual(r.length, 3);
assert.strictEqual(r.reduce((s, x) => s + x.n, 0), 3);
assert.ok(r.every(x => x.pct === 33));
assert.strictEqual(P.heures(E)[21], 2);
assert.deepStrictEqual(P.topQuals(E, 2), [['Affolée', 2], ['Agacée', 1]]);

// -- sensations physiques rappelées ---------------------------------------
const C = [
  { ts: J('2026-09-01'), fam: 'colere', intensite: 9, corps: 'Poings fermés, cris' },
  { ts: J('2026-09-02'), fam: 'colere', intensite: 10, corps: 'poings FERMÉS, cris' },
  { ts: J('2026-09-03'), fam: 'colere', intensite: 2, corps: 'Front crispé' },
  { ts: J('2026-09-04'), fam: 'peur', intensite: 9, corps: 'Souffle coupé' },
  { ts: J('2026-09-05'), fam: 'colere', intensite: 9, corps: '   ' },
];
assert.deepStrictEqual(P.sensations(C, 'colere', 3), ['poings FERMÉS, cris'],
  'même famille, même palier, sans doublon de casse, le plus récent gagne');
assert.deepStrictEqual(P.sensations(C, 'colere', 0), ['Front crispé']);
assert.deepStrictEqual(P.sensations(C, 'peur', 0), [], 'pas de mélange entre familles');
assert.strictEqual(P.sensations(C, 'colere', null).length, 2, 'sans palier, toute la famille');
assert.deepStrictEqual(P.sensations([], 'colere', 0), []);

const res = P.resume(E);
assert.strictEqual(res.total, 3);
assert.strictEqual(res.moyenne, 6, '(8+4+6)/3');
assert.strictEqual(res.forte.id, 1);
assert.deepStrictEqual(P.resume([]), { total: 0, moyenne: 0, forte: null });
assert.strictEqual(P.resume([{ fam: 'peur', intensite: 0 }]).moyenne, 0, 'pas de division par zéro sur des entrées sans intensité');

console.log('verif ok');
