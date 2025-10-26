const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Processing Testing Deployment...');

if (!fs.existsSync(indexPath)) {
  console.error('ERROR: index.html not found');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Fix paths
html = html.replace(/href="\/_expo/g, 'href="/Pflanzkalender-testing/_expo');
html = html.replace(/src="\/_expo/g, 'src="/Pflanzkalender-testing/_expo');
html = html.replace(/href="\/favicon/g, 'href="/Pflanzkalender-testing/favicon');
html = html.replace(/src="\/favicon/g, 'src="/Pflanzkalender-testing/favicon');

// Add banner (NOTE: Other debug banners may already be present - don't override them!)
const testingBanner = `
<div style="position: fixed; top: 0; left: 0; right: 0; background: #ff9800; color: #000; padding: 8px; text-align: center; font-weight: bold; z-index: 99999999;">
  ⚠️ TESTING ENVIRONMENT
</div>
`;
// Insert at beginning of body, not head, to not interfere with other scripts
html = html.replace('<body>', '<body>' + testingBanner);

// Add cache-busting
const timestamp = Date.now();
const version = require('../package.json').version + '-testing';
const cacheBusting = `
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta name="version" content="${version}">
<meta name="build-timestamp" content="${timestamp}">
`;
html = html.replace('</head>', cacheBusting + '</head>');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Testing deployment prepared!');
