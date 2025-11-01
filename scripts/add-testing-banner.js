const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// Read index.html
let html = fs.readFileSync(indexPath, 'utf8');

// Add testing environment banner
const testingBanner = `
<div style="position: fixed; top: 0; left: 0; right: 0; background: #ff9800; color: #000; padding: 8px; text-align: center; font-weight: bold; z-index: 9999; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
  ⚠️ TESTING ENVIRONMENT - Not for production use
</div>
<style>
  body { padding-top: 40px !important; }
</style>
`;

html = html.replace('</head>', testingBanner + '</head>');

// Add aggressive cache-busting for testing
const timestamp = Date.now();
const version = require('../package.json').version + '-testing';
const cacheBustingMeta = `
  <!-- Aggressive Cache Busting (Testing) -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta name="version" content="${version}">
  <meta name="build-timestamp" content="${timestamp}">
  <meta name="last-modified" content="${new Date().toISOString()}">
`;

html = html.replace('</head>', cacheBustingMeta + '</head>');

// Write back
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✓ Added testing environment banner to index.html');
console.log(`✓ Added cache-busting headers (${version}, timestamp: ${timestamp})`);

