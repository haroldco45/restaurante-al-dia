// Restaurantes al Día — service worker
// Red primero para la página y las noticias (siempre lo más nuevo); caché solo como respaldo sin señal.
const CACHE = 'rad-v2-2026-10-26';
const CORE = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.json', 'data/noticias.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // fotos, proxies y Google Noticias van directo a la red
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      const key = url.pathname.endsWith('noticias.json') ? 'data/noticias.json' : req;
      caches.open(CACHE).then(c => c.put(key, copy));
      return res;
    }).catch(() => caches.match(url.pathname.endsWith('noticias.json') ? 'data/noticias.json' : req).then(r => r || caches.match('index.html')))
  );
});
