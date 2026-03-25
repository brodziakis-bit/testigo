const CACHE_NAME = 'testy-igo-2026-offline-v20260324-desktop-install-fix';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.method !== 'GET') return;

  // ignoruj rozszerzenia, devtools, chrome:// itd.
  if (!url.protocol.startsWith('http')) return;

  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });

    try {
      const fresh = await fetch(event.request, { cache: 'no-store' });

      // zapisuj do cache tylko http/https
      if (fresh && fresh.ok && url.protocol.startsWith('http')) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, fresh.clone());
      }

      return fresh;
    } catch (error) {
      return cached || caches.match('./index.html');
    }
  })());
});
