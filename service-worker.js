const CACHE_NAME = 'testy-igo-2026-offline-v20260325-images-hq';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './images/page_008_img_000.png',
  './images/page_008_img_001.png',
  './images/page_009_img_002.png',
  './images/page_009_img_004.png',
  './images/page_010_img_005.png',
  './images/page_055_img_006.png',
  './images/page_055_img_008.png',
  './images/page_055_img_009.png',
  './images/page_055_img_010.png',
  './images/page_058_img_011.png',
  './images/page_059_img_012.png',
  './images/page_059_img_013.png',
  './images/page_111_img_014.jpg',
  './images/page_112_img_015.jpg',
  './images/page_112_img_016.jpg',
  './images/page_112_img_017.jpg',
  './images/page_113_img_018.jpg',
  './images/page_113_img_019.jpg',
  './images/page_113_img_020.jpg',
  './images/page_114_img_021.jpg',
  './images/page_114_img_022.jpg',
  './images/page_114_img_023.jpg',
  './images/page_115_img_024.jpg',
  './images/page_115_img_025.jpg',
  './images/page_115_img_026.jpg',
  './images/page_116_img_027.jpg',
  './images/page_116_img_028.jpg',
  './images/page_116_img_029.png',
  './images/page_117_img_030.png',
  './images/page_117_img_031.png',
  './images/page_119_img_032.jpg',
  './images/page_120_img_033.jpg',
  './images/page_121_img_034.png',
  './images/page_121_img_035.png',
  './images/page_122_img_036.png',
  './images/page_122_img_037.png',
  './images/page_122_img_038.png',
  './images/page_123_img_039.png',
  './images/page_123_img_040.png',
  './images/page_124_img_041.png',
  './images/page_124_img_042.png',
  './images/page_125_img_043.png',
  './images/page_126_img_044.png',
  './images/page_126_img_045.png',
  './images/page_126_img_047.png',
  './images/page_127_img_049.png',
  './images/page_127_img_050.png',
  './images/page_127_img_052.png',
  './images/page_131_img_054.png'
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
  if (event.request.method !== 'GET') return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request, { ignoreSearch: true });
    try {
      const fresh = await fetch(event.request, { cache: 'no-store' });
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, fresh.clone());
      return fresh;
    } catch (error) {
      return cached || caches.match('./index.html');
    }
  })());
});
