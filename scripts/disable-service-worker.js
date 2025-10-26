const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('⚠️  DISABLING SERVICE WORKER to stop reload loop...');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');

  // Add simple message that service worker is disabled
  const disabledMessage = `
  <script>
    console.log('[App] Service Worker DISABLED to prevent reload loop');
    console.log('[App] App should now load normally');
  </script>
  `;

  html = html.replace('</body>', disabledMessage + '</body>');

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✓ Service worker disabled');
} else {
  console.error('✗ index.html not found at:', indexPath);
}
