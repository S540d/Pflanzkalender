const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

const isTesting = process.env.TESTING === 'true';
const baseUrl = isTesting ? '/Pflanzkalender-testing' : '/Pflanzkalender';

if (!fs.existsSync(indexPath)) {
  console.error('✗ dist/index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

if (html.includes('id="pwa-splash"')) {
  console.log('✓ Splash screen already present in index.html, skipping');
  process.exit(0);
}

const splashHtml = `
  <style>
    #pwa-splash {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #1a7a4a;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      transition: opacity 0.35s ease;
    }
    #pwa-splash.fade-out {
      opacity: 0;
      pointer-events: none;
    }
    #pwa-splash img {
      width: 128px;
      height: 128px;
      border-radius: 28px;
    }
  </style>
  <div id="pwa-splash">
    <img src="${baseUrl}/icon-512.png" alt="Pflanzkalender" />
  </div>
  <script>
    (function () {
      var splash = document.getElementById('pwa-splash');
      if (!splash) return;
      var hidden = false;
      function hideSplash() {
        if (hidden) return;
        hidden = true;
        splash.classList.add('fade-out');
        setTimeout(function () { splash.style.display = 'none'; }, 350);
      }
      // Hide once React has mounted content into the root
      var root = document.getElementById('root') || document.body;
      var observer = new MutationObserver(function () {
        if (root.children.length > 1 || (root.id === 'root' && root.children.length > 0)) {
          observer.disconnect();
          hideSplash();
        }
      });
      observer.observe(root, { childList: true });
      // Fallback: hide after 4 s regardless
      setTimeout(hideSplash, 4000);
    })();
  </script>`;

html = html.replace('<body>', '<body>' + splashHtml);
fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ PWA splash screen injected into index.html');
