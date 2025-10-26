const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Adding mobile debug overlay to index.html...');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Add mobile debug overlay that shows errors visually
const mobileDebugScript = `
  <style>
    #mobile-debug-overlay {
      position: fixed;
      top: 60px;
      left: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.95);
      color: #00ff00;
      padding: 15px;
      font-family: monospace;
      font-size: 11px;
      z-index: 999999;
      max-height: 80vh;
      overflow-y: auto;
      border: 2px solid #00ff00;
      border-radius: 5px;
      display: none;
    }
    #mobile-debug-overlay.visible {
      display: block;
    }
    #mobile-debug-overlay .error {
      color: #ff4444;
      margin: 5px 0;
      border-left: 3px solid #ff4444;
      padding-left: 8px;
    }
    #mobile-debug-overlay .info {
      color: #00ff00;
      margin: 5px 0;
    }
    #mobile-debug-overlay .warning {
      color: #ffaa00;
      margin: 5px 0;
      border-left: 3px solid #ffaa00;
      padding-left: 8px;
    }
    #mobile-debug-overlay .timestamp {
      color: #888;
      font-size: 9px;
    }
    #mobile-debug-toggle {
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: #00ff00;
      color: black;
      padding: 10px 15px;
      border-radius: 20px;
      z-index: 9999999;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
  </style>
  <div id="mobile-debug-toggle">DEBUG</div>
  <div id="mobile-debug-overlay">
    <div style="font-weight: bold; margin-bottom: 10px; color: white;">📱 Mobile Debug Console</div>
    <div id="debug-log"></div>
  </div>
  <script>
    (function() {
      // Mobile Debug Logger
      const debugOverlay = document.getElementById('mobile-debug-overlay');
      const debugLog = document.getElementById('debug-log');
      const debugToggle = document.getElementById('mobile-debug-toggle');
      let isVisible = true; // Start visible to show initial loading

      debugOverlay.classList.add('visible');

      debugToggle.addEventListener('click', function() {
        isVisible = !isVisible;
        if (isVisible) {
          debugOverlay.classList.add('visible');
        } else {
          debugOverlay.classList.remove('visible');
        }
      });

      function addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = type;
        entry.innerHTML = '<span class="timestamp">[' + timestamp + ']</span> ' + message;
        debugLog.appendChild(entry);
        debugLog.scrollTop = debugLog.scrollHeight;
      }

      // Log initial info
      addLog('🚀 App starting...', 'info');
      addLog('User Agent: ' + navigator.userAgent, 'info');
      addLog('Screen: ' + window.innerWidth + 'x' + window.innerHeight, 'info');
      addLog('Base URL: ' + window.location.href, 'info');

      // Intercept console methods
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = function(...args) {
        addLog(args.join(' '), 'info');
        originalLog.apply(console, args);
      };

      console.error = function(...args) {
        addLog('❌ ' + args.join(' '), 'error');
        originalError.apply(console, args);
      };

      console.warn = function(...args) {
        addLog('⚠️ ' + args.join(' '), 'warning');
        originalWarn.apply(console, args);
      };

      // Catch all unhandled errors
      window.addEventListener('error', function(event) {
        addLog('❌ ERROR: ' + event.message + ' at ' + event.filename + ':' + event.lineno, 'error');
      });

      // Catch unhandled promise rejections
      window.addEventListener('unhandledrejection', function(event) {
        addLog('❌ PROMISE REJECTION: ' + (event.reason?.message || event.reason), 'error');
      });

      // Check if React bundle loads
      addLog('⏳ Waiting for React to load...', 'info');

      // Check after 3 seconds if React loaded
      setTimeout(function() {
        if (typeof React === 'undefined') {
          addLog('❌ React not loaded after 3s - bundle may have failed', 'error');
        } else {
          addLog('✅ React is loaded', 'info');
        }
      }, 3000);

      // Check after 5 seconds if app rendered
      setTimeout(function() {
        const appRoot = document.getElementById('root');
        if (appRoot && appRoot.children.length === 0) {
          addLog('❌ App root is empty - React app not rendering', 'error');
        } else if (appRoot && appRoot.children.length > 0) {
          addLog('✅ App rendered successfully', 'info');
        }
      }, 5000);

      // Log service worker status
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          if (registrations.length > 0) {
            addLog('ℹ️ Service Workers found: ' + registrations.length, 'info');
            registrations.forEach(function(reg) {
              addLog('  - Scope: ' + reg.scope, 'info');
            });
          } else {
            addLog('ℹ️ No Service Workers registered', 'info');
          }
        });
      }

      // Log cache status
      if ('caches' in window) {
        caches.keys().then(function(names) {
          if (names.length > 0) {
            addLog('ℹ️ Caches found: ' + names.join(', '), 'info');
          } else {
            addLog('ℹ️ No caches found', 'info');
          }
        });
      }

      // Check if main bundle exists
      addLog('🔍 Checking for main bundle...', 'info');
      fetch(window.location.origin + window.location.pathname + '_expo/static/js/web/entry-*.js'.replace('*', ''))
        .then(function() {
          addLog('✅ Main bundle found', 'info');
        })
        .catch(function() {
          addLog('⚠️ Could not verify main bundle', 'warning');
        });

      addLog('📊 Debug logger initialized', 'info');
    })();
  </script>
`;

// Insert right after <head> tag (before other scripts)
html = html.replace('<head>', '<head>' + mobileDebugScript);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Mobile debug overlay added!');
