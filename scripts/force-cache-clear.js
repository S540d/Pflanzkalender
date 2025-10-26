const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Adding force cache clear script to index.html...');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Add aggressive cache clearing script at the very beginning of <head>
const forceClearScript = `
  <script>
    // FORCE CACHE CLEAR - This runs immediately before anything else
    (function() {
      console.log('[CacheClear] Starting aggressive cache cleanup...');

      // 1. Unregister ALL service workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          console.log('[CacheClear] Found ' + registrations.length + ' service worker(s)');
          for (let registration of registrations) {
            registration.unregister().then(function(success) {
              if (success) {
                console.log('[CacheClear] Unregistered service worker:', registration.scope);
              }
            });
          }
        });
      }

      // 2. Delete ALL caches
      if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
          console.log('[CacheClear] Found ' + cacheNames.length + ' cache(s)');
          return Promise.all(
            cacheNames.map(function(cacheName) {
              console.log('[CacheClear] Deleting cache:', cacheName);
              return caches.delete(cacheName);
            })
          );
        }).then(function() {
          console.log('[CacheClear] All caches deleted');
        });
      }

      // 3. Clear localStorage flag for version checking
      try {
        localStorage.removeItem('app-version');
        console.log('[CacheClear] Cleared app-version from localStorage');
      } catch (e) {
        console.error('[CacheClear] Could not clear localStorage:', e);
      }

      console.log('[CacheClear] Cache cleanup complete!');
    })();
  </script>
`;

// Insert right after <head> tag
html = html.replace('<head>', '<head>' + forceClearScript);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Force cache clear script added!');
