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

// Write back
fs.writeFileSync(indexPath, html, 'utf8');

console.log('✓ Fixed paths in index.html for GitHub Pages');
