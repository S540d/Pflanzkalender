// Service Worker for Testing Environment with aggressive cache invalidation
const CACHE_VERSION = 'v' + Date.now(); // New version on every deployment
const CACHE_NAME = 'pflanzkalender-testing-' + CACHE_VERSION;

// Files to cache
const urlsToCache = [
  '/Pflanzkalender-testing/',
  '/Pflanzkalender-testing/index.html'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker-Testing] Installing version:', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker-Testing] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force activation immediately
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker-Testing] Activating version:', CACHE_VERSION);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all old caches
          if (cacheName !== CACHE_NAME && cacheName.startsWith('pflanzkalender-testing-')) {
            console.log('[ServiceWorker-Testing] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - always fetch from network in testing (no cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        // Only use cache if offline
        return caches.match(event.request);
      })
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker-Testing] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});
