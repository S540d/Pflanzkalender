const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// Read index.html
let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with paths including /Pflanzkalender/
html = html.replace(/href="\/_expo/g, 'href="/Pflanzkalender/_expo');
html = html.replace(/src="\/_expo/g, 'src="/Pflanzkalender/_expo');
html = html.replace(/href="\/favicon/g, 'href="/Pflanzkalender/favicon');

// Add aggressive cache-busting meta tags
const timestamp = Date.now();
const version = require('../package.json').version;
const cacheBustingMeta = `
  <!-- Aggressive Cache Busting -->
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta name="version" content="${version}">
  <meta name="build-timestamp" content="${timestamp}">
  <meta name="last-modified" content="${new Date().toISOString()}">
`;

html = html.replace('</head>', cacheBustingMeta + '</head>');

// Add version info to body
const versionInfo = `
  <!-- Deployment Info: v${version} - ${new Date().toISOString()} -->
`;

html = html.replace('<body>', '<body>' + versionInfo);

// Write back
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✓ Fixed paths in index.html for GitHub Pages');
console.log(`✓ Added cache-busting headers (v${version}, timestamp: ${timestamp})`);
