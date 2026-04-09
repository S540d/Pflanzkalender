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
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('${baseUrl}/service-worker.js')
          .then(function(registration) {
            // Periodically check for updates
            setInterval(function() { registration.update(); }, 60000);

            // When a new SW is found, ask it to take over immediately
            registration.addEventListener('updatefound', function() {
              var newWorker = registration.installing;
              newWorker.addEventListener('statechange', function() {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            });
          })
          .catch(function(err) {
            console.error('[SW] Registration failed:', err);
          });

        // Reload once when new SW takes control (flag prevents loop)
        var reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', function() {
          if (!reloading) {
            reloading = true;
            window.location.reload();
          }
        });
      });
    }
  </script>
  `;

  html = html.replace('</body>', swRegistration + '</body>');

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✓ Added service worker registration and version check to index.html');
} else {
  console.error('✗ index.html not found at:', indexPath);
}
