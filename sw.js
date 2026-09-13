// L'appli marche hors ligne, mais une mise en ligne ne doit jamais rester
// coincée derrière un cache. Tout ce qui vient d'ici passe par le réseau
// d'abord, le cache ne sert que de filet quand il n'y a plus de reseau ;
// seul ce qui vient d'ailleurs (les polices) est servi par le cache d'abord.
// Le nouveau worker prend la main sans attendre.
const CACHE = 'gentiane-v11';
const SOCLE = ['./', 'index.html', 'gentiane.js', 'manifest.json', 'icone.svg'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SOCLE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const memeOrigine = new URL(req.url).origin === location.origin;

  // Le code de l'appli : le réseau décide, le cache rattrape hors ligne.
  if (memeOrigine) {
    e.respondWith(
      fetch(req)
        .then(r => {
          if (r.ok) caches.open(CACHE).then(c => c.put(req, r.clone()));
          return r;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
    );
    return;
  }

  // Le reste (polices) : le cache répond tout de suite, le réseau rafraîchit derrière.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(r => {
        if (r.ok) caches.open(CACHE).then(c => c.put(req, r.clone()));
        return r;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
