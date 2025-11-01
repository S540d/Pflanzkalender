const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// Check if this is testing build
const isTesting = process.env.TESTING === 'true';
const swFileName = isTesting ? 'service-worker-testing.js' : 'service-worker.js';

const swSourcePath = path.join(__dirname, '..', 'public', swFileName);
const swDestPath = path.join(distPath, 'service-worker.js');

// Copy service worker to dist
if (fs.existsSync(swSourcePath)) {
  // Update cache version in service worker with current timestamp
  let swContent = fs.readFileSync(swSourcePath, 'utf8');
  swContent = swContent.replace('Date.now()', Date.now().toString());

  fs.writeFileSync(swDestPath, swContent, 'utf8');
  console.log('✓ Copied service worker to dist with fresh cache version');
} else {
  console.warn('⚠ Service worker not found at:', swSourcePath);
}

// Add service worker registration to index.html
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');

  const baseUrl = isTesting ? '/Pflanzkalender-testing' : '/Pflanzkalender';

  const swRegistration = `
  <script>
    // Service Worker Registration with Update Check
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('${baseUrl}/service-worker.js')
          .then(function(registration) {
            console.log('[App] ServiceWorker registered:', registration.scope);

            // Check for updates every 30 seconds
            setInterval(function() {
              registration.update();
            }, 30000);

            // Listen for new service worker installation
            registration.addEventListener('updatefound', function() {
              const newWorker = registration.installing;

              newWorker.addEventListener('statechange', function() {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available - force reload
                  console.log('[App] New version available! Reloading...');

                  // Ask new service worker to skip waiting
                  newWorker.postMessage({ type: 'SKIP_WAITING' });

                  // Reload after a short delay
                  setTimeout(function() {
                    window.location.reload(true);
                  }, 1000);
                }
              });
            });
          })
          .catch(function(err) {
            console.error('[App] ServiceWorker registration failed:', err);
          });

        // Reload page when service worker takes control
        navigator.serviceWorker.addEventListener('controllerchange', function() {
          console.log('[App] Controller changed, reloading...');
          window.location.reload(true);
        });
      });
    }

    // Force clear cache on version mismatch
    (function checkVersion() {
      const currentVersion = document.querySelector('meta[name="version"]')?.content;
      const storedVersion = localStorage.getItem('app-version');

      if (storedVersion && storedVersion !== currentVersion) {
        console.log('[App] Version changed:', storedVersion, '->', currentVersion);
        console.log('[App] Clearing cache and reloading...');

        // Clear all caches
        if ('caches' in window) {
          caches.keys().then(function(names) {
            names.forEach(function(name) {
              caches.delete(name);
            });
          });
        }

        // Clear localStorage
        localStorage.clear();

        // Set new version and reload
        localStorage.setItem('app-version', currentVersion);
        window.location.reload(true);
      } else if (currentVersion) {
        localStorage.setItem('app-version', currentVersion);
      }
    })();
  </script>
  `;

  html = html.replace('</body>', swRegistration + '</body>');

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✓ Added service worker registration and version check to index.html');
} else {
  console.error('✗ index.html not found at:', indexPath);
}
