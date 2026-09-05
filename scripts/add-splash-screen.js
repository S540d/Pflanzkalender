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

// Preload the splash icon in <head> so it's already decoded by the time the
// splash div paints instead of popping in after a bare background flash.
const preloadLink = `\n  <link rel="preload" as="image" href="${baseUrl}/icon-192.png" fetchpriority="high">`;
const htmlWithPreload = html.replace('</head>', preloadLink + '\n</head>');

const splashHtml = `
  <style>
    #pwa-splash {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #1a7a4a;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 1;
      transition: opacity 0.4s ease;
    }
    #pwa-splash.fade-out {
      opacity: 0;
      pointer-events: none;
    }
    #pwa-splash .pwa-splash-icon-wrap {
      position: relative;
      width: 112px;
      height: 112px;
      animation: pwa-splash-in 0.5s ease-out;
    }
    #pwa-splash .pwa-splash-ring {
      position: absolute;
      inset: -14px;
      border-radius: 32px;
      border: 3px solid rgba(255, 255, 255, 0.35);
      border-top-color: rgba(255, 255, 255, 0.9);
      animation: pwa-splash-spin 1.1s linear infinite;
    }
    #pwa-splash img {
      width: 112px;
      height: 112px;
      border-radius: 26px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
      animation: pwa-splash-pulse 1.8s ease-in-out infinite;
    }
    #pwa-splash span {
      margin-top: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: rgba(255, 255, 255, 0.92);
      animation: pwa-splash-fade-in 0.5s ease-out 0.1s both;
    }
    @keyframes pwa-splash-in {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes pwa-splash-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pwa-splash-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.06); }
    }
    @keyframes pwa-splash-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      #pwa-splash img { animation: none; }
      #pwa-splash .pwa-splash-ring { animation: none; }
    }
  </style>
  <div id="pwa-splash">
    <div class="pwa-splash-icon-wrap">
      <div class="pwa-splash-ring"></div>
      <img src="${baseUrl}/icon-192.png" alt="" fetchpriority="high" decoding="async" />
    </div>
    <span>Pflanzkalender</span>
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
        setTimeout(function () { splash.style.display = 'none'; }, 400);
      }
      // Hide once React has mounted content into the root.
      // Only observe #root — using document.body as fallback would fire
      // immediately because the body already contains the splash div.
      var root = document.getElementById('root');
      if (root) {
        var observer = new MutationObserver(function () {
          if (root.children.length > 0) {
            observer.disconnect();
            hideSplash();
          }
        });
        observer.observe(root, { childList: true });
      }
      // Fallback: hide after 3 s regardless, so a slow bundle never leaves
      // the splash on screen indefinitely.
      setTimeout(hideSplash, 3000);
    })();
  </script>`;

const updatedHtml = htmlWithPreload.replace('<body>', '<body>' + splashHtml);
if (updatedHtml === htmlWithPreload) {
  console.error('✗ Could not inject splash screen: <body> tag not found in index.html');
  process.exit(1);
}
fs.writeFileSync(indexPath, updatedHtml, 'utf8');
console.log('✓ PWA splash screen injected into index.html');
