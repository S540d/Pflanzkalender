const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const iconPath = path.join(assetsDir, 'icon.png');

if (!fs.existsSync(iconPath)) {
  console.error('✗ assets/icon.png not found');
  process.exit(1);
}

// Expected PWA icon files (must be provided as properly sized assets)
const requiredIcons = [
  { name: 'icon-192.png', size: '192x192' },
  { name: 'icon-192-maskable.png', size: '192x192 (maskable)' },
  { name: 'icon-512.png', size: '512x512' },
  { name: 'icon-512-maskable.png', size: '512x512 (maskable)' },
];

let allPresent = true;
for (const { name, size } of requiredIcons) {
  const filePath = path.join(assetsDir, name);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${name} (${size}) exists`);
  } else {
    console.warn(`⚠ ${name} (${size}) missing – using icon.png as fallback for deploy`);
    fs.copyFileSync(iconPath, filePath);
    allPresent = false;
  }
}

if (!allPresent) {
  console.warn(
    '\n⚠ Some PWA icons were missing and were filled with unresized copies of icon.png.'
  );
  console.warn('For a correct PWA install experience, provide properly sized icons:');
  console.warn('  - icon-192*.png: exactly 192x192 px');
  console.warn('  - icon-512*.png: exactly 512x512 px');
  console.warn('  - Maskable variants: apply 10% safe-zone padding');
  console.warn('See Phase 5 (Play Store) in Issue #47 for the sharp-based implementation.');
} else {
  console.log('✓ All PWA icon files present');
}
