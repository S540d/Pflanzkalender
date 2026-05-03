const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');

  const pwaMetaTags = `
    <link rel="manifest" href="/Pflanzkalender/manifest.json">
    <meta name="theme-color" content="#4CAF50">
    <meta name="description" content="Plant Calendar – Gartenaktivitäten mit halber Monatsauflösung planen und verwalten">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Pflanzkalender">
    <link rel="apple-touch-icon" href="/Pflanzkalender/icon-192.png">
    <link rel="icon" type="image/png" sizes="192x192" href="/Pflanzkalender/icon-192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/Pflanzkalender/icon-512.png">`;

  if (!html.includes('manifest.json')) {
    html = html.replace('</head>', pwaMetaTags + '\n  </head>');
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('✓ PWA meta-tags added to index.html');
  } else {
    console.log('✓ PWA meta-tags already present');
  }

  // Copy .well-known directory if exists
  const wellKnownSrc = path.join(__dirname, '..', 'public', '.well-known');
  const wellKnownDist = path.join(distPath, '.well-known');

  if (fs.existsSync(wellKnownSrc)) {
    fs.cpSync(wellKnownSrc, wellKnownDist, { recursive: true });
    console.log('✓ Copied .well-known directory to dist');
  }
} else {
  console.error('✗ dist/index.html not found');
  process.exit(1);
}
