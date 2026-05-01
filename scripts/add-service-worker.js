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

// Copy and patch manifest.json to dist
const manifestSourcePath = path.join(__dirname, '..', 'public', 'manifest.json');
const manifestDestPath = path.join(distPath, 'manifest.json');
if (fs.existsSync(manifestSourcePath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestSourcePath, 'utf8'));
  if (isTesting) {
    manifest.start_url = '/Pflanzkalender-testing/';
    manifest.scope = '/Pflanzkalender-testing/';
    manifest.name = 'Pflanzkalender (Testing)';
    manifest.icons = manifest.icons.map(icon => ({
      ...icon,
      src: icon.src.replace('/Pflanzkalender/', '/Pflanzkalender-testing/'),
    }));
  }
  fs.writeFileSync(manifestDestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✓ Copied manifest.json to dist');
} else {
  console.warn('⚠ manifest.json not found at:', manifestSourcePath);
}

// Add service worker registration to index.html
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');

  const baseUrl = isTesting ? '/Pflanzkalender-testing' : '/Pflanzkalender';

  const buildTimestamp = Date.now();

  const swRegistration = `
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('${baseUrl}/service-worker.js?v=${buildTimestamp}')
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

  // Inject PWA meta tags if not already present
  if (!html.includes('rel="manifest"')) {
    const manifestUrl = `${baseUrl}/manifest.json`;
    const pwaMetaTags = `
  <link rel="manifest" href="${manifestUrl}">
  <meta name="theme-color" content="#4CAF50">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="Pflanzkalender">
  <meta name="mobile-web-app-capable" content="yes">`;
    html = html.replace('</head>', pwaMetaTags + '\n</head>');
    console.log('✓ Injected PWA meta tags into index.html');
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✓ Added service worker registration and version check to index.html');
} else {
  console.error('✗ index.html not found at:', indexPath);
}
