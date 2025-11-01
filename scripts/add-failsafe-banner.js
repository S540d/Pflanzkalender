const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Adding failsafe debug banner to index.html...');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Add a HUGE, IMPOSSIBLE TO MISS banner at the top
const failsafeBanner = `
  <div id="failsafe-banner" style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    z-index: 99999999;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    border-bottom: 4px solid #fff;
  ">
    <div style="font-size: 24px; margin-bottom: 10px;">🔍 DEBUG MODUS</div>
    <div id="status-message" style="font-size: 14px; margin-bottom: 10px;">⏳ Seite lädt...</div>
    <div style="font-size: 12px; opacity: 0.9;">Wenn diese Nachricht verschwindet, funktioniert JavaScript!</div>
  </div>
  <script>
    // This script runs IMMEDIATELY and updates the banner
    (function() {
      var statusMsg = document.getElementById('status-message');
      var banner = document.getElementById('failsafe-banner');

      // Step 1: JavaScript is running
      statusMsg.innerHTML = '✅ JavaScript läuft!';
      statusMsg.style.color = '#00ff00';

      // Step 2: Check if DOM loaded
      document.addEventListener('DOMContentLoaded', function() {
        statusMsg.innerHTML = '✅ DOM geladen! Warte auf React...';

        // Step 3: Check if React loaded after 2 seconds
        setTimeout(function() {
          if (typeof React !== 'undefined') {
            statusMsg.innerHTML = '✅ React geladen! App sollte rendern...';
          } else {
            statusMsg.innerHTML = '❌ React nicht gefunden!';
            statusMsg.style.color = '#ff4444';
          }
        }, 2000);

        // Step 4: Check if app rendered after 5 seconds
        setTimeout(function() {
          var root = document.getElementById('root');
          if (root && root.children.length > 0) {
            statusMsg.innerHTML = '✅ APP FUNKTIONIERT!';
            statusMsg.style.color = '#00ff00';
            // Hide banner after success
            setTimeout(function() {
              banner.style.display = 'none';
            }, 3000);
          } else {
            statusMsg.innerHTML = '❌ APP RENDERT NICHT! Root ist leer.';
            statusMsg.style.color = '#ff4444';
            // Keep banner visible to show error
          }
        }, 5000);
      });

      // Catch any errors
      window.addEventListener('error', function(e) {
        statusMsg.innerHTML = '❌ FEHLER: ' + e.message;
        statusMsg.style.color = '#ff4444';
        banner.style.background = 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)';
      });
    })();
  </script>
`;

// Insert right after <body> tag - FIRST THING in body
html = html.replace('<body>', '<body>' + failsafeBanner);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Failsafe debug banner added!');
