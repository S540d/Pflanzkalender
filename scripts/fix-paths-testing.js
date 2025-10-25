const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// Read index.html
let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with paths including /Pflanzkalender-testing/
html = html.replace(/href="\/_expo/g, 'href="/Pflanzkalender-testing/_expo');
html = html.replace(/src="\/_expo/g, 'src="/Pflanzkalender-testing/_expo');
html = html.replace(/href="\/favicon/g, 'href="/Pflanzkalender-testing/favicon');

// Add testing environment banner
const testingBanner = `
<div style="position: fixed; top: 0; left: 0; right: 0; background: #ff9800; color: #000; padding: 8px; text-align: center; font-weight: bold; z-index: 9999;">
  ⚠️ TESTING ENVIRONMENT - Not for production use
</div>
<style>
  body { padding-top: 40px !important; }
</style>
`;

html = html.replace('</head>', testingBanner + '</head>');

// Write back
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✓ Fixed paths in index.html for Testing GitHub Pages');
console.log('✓ Added testing environment banner');
