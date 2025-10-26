// Service Worker with aggressive cache invalidation
const CACHE_VERSION = 'v' + Date.now(); // New version on every deployment
const CACHE_NAME = 'pflanzkalender-' + CACHE_VERSION;

// IMPORTANT: Set to true to force unregister this service worker
const FORCE_UNREGISTER = false;

// Files to cache
const urlsToCache = [
  '/Pflanzkalender/',
  '/Pflanzkalender/index.html'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing version:', CACHE_VERSION);

  if (FORCE_UNREGISTER) {
    console.log('[ServiceWorker] FORCE_UNREGISTER is true - skipping cache setup');
    event.waitUntil(self.skipWaiting());
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
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
  console.log('[ServiceWorker] Activating version:', CACHE_VERSION);

  if (FORCE_UNREGISTER) {
    console.log('[ServiceWorker] FORCE_UNREGISTER is true - unregistering self');
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        // Delete ALL caches
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[ServiceWorker] Force deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }).then(() => {
        // Unregister this service worker
        return self.registration.unregister();
      }).then(() => {
        console.log('[ServiceWorker] Successfully unregistered');
        // Tell all clients to reload
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'FORCE_RELOAD' });
          });
        });
      })
    );
    return;
  }

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all old caches
          if (cacheName !== CACHE_NAME && cacheName.startsWith('pflanzkalender-')) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
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

// Fetch event - network first, then cache
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Always fetch index.html from network (aggressive cache-busting)
  if (url.pathname.endsWith('index.html') || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache the fresh response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Only use cache if offline
          return caches.match(event.request);
        })
    );
    return;
  }

  // For other requests: network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Use cache if network fails
        return caches.match(event.request);
      })
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker] Received SKIP_WAITING message');
    self.skipWaiting();
  }
});
