// Expo legt Asset-Dateien aus Paketen (z. B. die Ionicons-Schrift) unter
// dist/assets/node_modules/ ab. Dieser Pfad wird beim Deploy auf GitHub Pages
// verloren (.gitignore enthält `node_modules/`), die Icons erscheinen dann als
// leere Kästchen. Daher nach dem Export nach dist/assets/vendor/ umbenennen
// und alle Verweise in den JS-/HTML-Dateien anpassen.
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const from = path.join(distPath, 'assets', 'node_modules');
const to = path.join(distPath, 'assets', 'vendor');

if (!fs.existsSync(from)) {
  console.log('✓ Kein dist/assets/node_modules vorhanden – nichts umzubenennen');
  process.exit(0);
}

fs.renameSync(from, to);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(js|html|json)$/.test(entry.name) ? [full] : [];
  });
}

let changed = 0;
for (const file of walk(distPath)) {
  const content = fs.readFileSync(file, 'utf8');
  const updated = content.split('assets/node_modules/').join('assets/vendor/');
  if (updated !== content) {
    fs.writeFileSync(file, updated, 'utf8');
    changed++;
  }
}

console.log(`✓ assets/node_modules → assets/vendor (${changed} Dateien angepasst)`);
