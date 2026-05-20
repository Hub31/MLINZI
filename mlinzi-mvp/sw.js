const CACHE_NAME = 'mlinzi-v3-cache-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// Install Event - Pre-cache core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching core dashboard assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing legacy asset cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve cached assets when offline, network fallback
self.addEventListener('fetch', (event) => {
  // Only cache GET requests (exclude webhooks or API requests)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Return cache match
        }

        return fetch(event.request)
          .then((networkResponse) => {
            // Check if response is valid before caching
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone response to add to cache
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for map tiles or external CDNs
            console.log('[Service Worker] Network request failed. Serving offline fallback...');
          });
      })
  );
});
