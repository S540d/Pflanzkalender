const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Adding bundle load monitor...');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Find the main bundle script tag
const bundleMatch = html.match(/<script src="([^"]*_expo\/static\/js\/web\/[^"]+\.js)"[^>]*>/);

if (!bundleMatch) {
  console.error('ERROR: Could not find bundle script tag!');
  process.exit(1);
}

const bundlePath = bundleMatch[1];
console.log('Found bundle:', bundlePath);

// Add monitoring script BEFORE the bundle loads
const monitorScript = `
  <script>
    (function() {
      var bundlePath = '${bundlePath}';
      var bundleLoaded = false;
      var bundleError = false;

      // Monitor the script tag
      window.addEventListener('DOMContentLoaded', function() {
        var scripts = document.querySelectorAll('script[src*="_expo"]');
        scripts.forEach(function(script) {
          script.addEventListener('load', function() {
            bundleLoaded = true;
            console.log('[Bundle] ✅ Bundle loaded successfully:', script.src);
          });

          script.addEventListener('error', function(e) {
            bundleError = true;
            console.error('[Bundle] ❌ Bundle failed to load:', script.src);
            console.error('[Bundle] Error:', e);
          });
        });

        // Check after 5 seconds
        setTimeout(function() {
          if (!bundleLoaded && !bundleError) {
            console.warn('[Bundle] ⚠️ Bundle neither loaded nor errored after 5s - still loading?');
          }
        }, 5000);
      });
    })();
  </script>
`;

// Insert before </head>
html = html.replace('</head>', monitorScript + '</head>');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Bundle monitor added!');
