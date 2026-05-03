const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// Determine base URL from environment or defaults
const isTesting = process.env.TESTING === 'true';
const baseUrl = isTesting ? '/Pflanzkalender-testing' : '/Pflanzkalender';

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');

  // Add missing PWA meta tags idempotently
  const tagsToAdd = [
    { tag: 'meta', attr: 'name="theme-color"', html: `<meta name="theme-color" content="#4CAF50">` },
    { tag: 'meta', attr: 'name="description"', html: `<meta name="description" content="Plant Calendar – Gartenaktivitäten mit halber Monatsauflösung planen und verwalten">` },
    { tag: 'meta', attr: 'name="apple-mobile-web-app-capable"', html: `<meta name="apple-mobile-web-app-capable" content="yes">` },
    { tag: 'meta', attr: 'name="apple-mobile-web-app-status-bar-style"', html: `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` },
    { tag: 'meta', attr: 'name="apple-mobile-web-app-title"', html: `<meta name="apple-mobile-web-app-title" content="Pflanzkalender">` },
    { tag: 'link', attr: 'rel="apple-touch-icon"', html: `<link rel="apple-touch-icon" href="${baseUrl}/icon-192.png">` },
    { tag: 'link', attr: 'rel="icon" type="image/png" sizes="192x192"', html: `<link rel="icon" type="image/png" sizes="192x192" href="${baseUrl}/icon-192.png">` },
    { tag: 'link', attr: 'rel="icon" type="image/png" sizes="512x512"', html: `<link rel="icon" type="image/png" sizes="512x512" href="${baseUrl}/icon-512.png">` },
  ];

  let addedCount = 0;
  for (const tag of tagsToAdd) {
    if (!html.includes(tag.attr)) {
      html = html.replace('</head>', tag.html + '\n  </head>');
      addedCount++;
    }
  }

  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`✓ PWA meta-tags: ${addedCount} new tags added to index.html`);

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
