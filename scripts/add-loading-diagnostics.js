const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Adding loading diagnostics to index.html...');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Add loading diagnostics that run immediately
const loadingDiagnostics = `
  <script>
    // Track page load performance
    (function() {
      const startTime = Date.now();

      // Track what gets loaded
      const loadedResources = {
        scripts: [],
        stylesheets: [],
        failed: []
      };

      // Monitor all script tags
      document.addEventListener('DOMContentLoaded', function() {
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(function(script) {
          const src = script.src;

          script.addEventListener('load', function() {
            loadedResources.scripts.push(src);
            console.log('[Loading] ✅ Script loaded:', src);
          });

          script.addEventListener('error', function() {
            loadedResources.failed.push(src);
            console.error('[Loading] ❌ Script failed:', src);
          });
        });

        // Check if app root exists
        setTimeout(function() {
          const root = document.getElementById('root');
          if (!root) {
            console.error('[Loading] ❌ No root element found!');
          } else if (root.children.length === 0) {
            console.error('[Loading] ❌ Root element is empty - app not rendering');
            console.log('[Loading] Loaded scripts:', loadedResources.scripts.length);
            console.log('[Loading] Failed scripts:', loadedResources.failed.length);
          } else {
            console.log('[Loading] ✅ App rendered successfully');
          }
        }, 3000);
      });

      // Log page load complete
      window.addEventListener('load', function() {
        const loadTime = Date.now() - startTime;
        console.log('[Loading] Page load complete in ' + loadTime + 'ms');
      });
    })();
  </script>
`;

// Insert right after <head> tag
html = html.replace('<head>', '<head>' + loadingDiagnostics);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Loading diagnostics added!');
