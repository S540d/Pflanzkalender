const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Adding ultra-visible marker to index.html...');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Add HUGE, IMPOSSIBLE TO MISS marker - pure HTML, no JavaScript needed
const timestamp = new Date().toISOString();
const ultraVisibleMarker = `
  <!-- ULTRA VISIBLE MARKER - If you see this, the page loaded! -->
  <div style="
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: red;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
    font-family: Arial, sans-serif;
    z-index: 999999999;
    text-align: center;
    padding: 20px;
  ">
    <div style="font-size: 50px; margin-bottom: 20px;">🔴</div>
    <div>NEUE VERSION GELADEN!</div>
    <div style="font-size: 16px; margin-top: 20px;">Deployed: ${timestamp}</div>
    <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">
      Wenn Sie dies sehen, funktioniert HTML!<br>
      Diese Nachricht verschwindet in 5 Sekunden.
    </div>
  </div>
  <script>
    // Remove the marker after 5 seconds
    setTimeout(function() {
      var marker = document.body.firstElementChild;
      if (marker && marker.textContent.includes('NEUE VERSION')) {
        marker.style.display = 'none';
      }
    }, 5000);
  </script>
`;

// Insert as FIRST thing in body
html = html.replace('<body>', '<body>' + ultraVisibleMarker);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Ultra-visible marker added! Timestamp:', timestamp);
