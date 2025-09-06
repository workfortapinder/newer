const CACHE_NAME = 'va-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key === CACHE_NAME ? undefined : caches.delete(key)))
      )
    )
  );
  self.clients.claim();
});

// Network falling back to cache for navigations, and cache-first for static requests
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle same-origin requests
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  // HTML navigations: try network, fallback to cache, then offline page
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (err) {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(req);
          return (
            cached || (await cache.match('/offline')) || Response.error()
          );
        }
      })()
    );
    return;
  }

  // Static assets: cache-first
  if (
    req.destination === 'style' ||
    req.destination === 'script' ||
    req.destination === 'image' ||
    req.destination === 'font'
  ) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached ||
          fetch(req)
            .then((res) => {
              const resClone = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
              return res;
            })
            .catch(() => cached || Response.error())
      )
    );
  }
});
