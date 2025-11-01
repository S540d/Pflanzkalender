const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

console.log('Fixing paths for Pflanzkalender-testing deployment...');

// Read index.html
let html = fs.readFileSync(indexPath, 'utf8');

// Replace all absolute paths with /Pflanzkalender-testing/ prefix
html = html.replace(/href="\/_expo/g, 'href="/Pflanzkalender-testing/_expo');
html = html.replace(/src="\/_expo/g, 'src="/Pflanzkalender-testing/_expo');
html = html.replace(/href="\/favicon/g, 'href="/Pflanzkalender-testing/favicon');
html = html.replace(/src="\/favicon/g, 'src="/Pflanzkalender-testing/favicon');

// Write back
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✓ Fixed all paths for Pflanzkalender-testing deployment');
