const CACHE_NAME = 'sabrina-vinyl-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './mini.html',
  './style.css',
  './app.js',
  './songs_data.js',
  './kiss-pattern.svg',
  './manifest.json',
  './favicon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './covers/short-n-sweet.png',
  './covers/emails-i-cant-send.png',
  './covers/fruitcake.png',
  './covers/singular-act-2.png',
  './covers/singular-act-1.png',
  './covers/evolution.png',
  './covers/eyes-wide-open.png',
  './covers/singles.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Audio files might be large, serve via network with cache fallback if stored
  if (url.pathname.includes('/audio/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Shell assets: Stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
