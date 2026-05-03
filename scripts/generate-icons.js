const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const iconPath = path.join(assetsDir, 'icon.png');

if (!fs.existsSync(iconPath)) {
  console.error('✗ assets/icon.png not found');
  process.exit(1);
}

// Icon size definitions (matching manifest.json declarations)
const iconSizes = [
  { name: 'icon-192.png', targetSize: 192 },
  { name: 'icon-192-maskable.png', targetSize: 192, maskable: true },
  { name: 'icon-512.png', targetSize: 512 },
  { name: 'icon-512-maskable.png', targetSize: 512, maskable: true }
];

// PLACEHOLDER IMPLEMENTATION:
// Currently copies original icon without resizing.
// For production, use 'sharp' library to properly resize:
//   npm install sharp
//   const sharp = require('sharp');
//   await sharp(iconPath)
//     .resize(targetSize, targetSize)
//     .png()
//     .toFile(outputPath);

iconSizes.forEach(({ name, targetSize, maskable }) => {
  const outputPath = path.join(assetsDir, name);
  fs.copyFileSync(iconPath, outputPath);
  const note = maskable ? ' (maskable variant)' : '';
  console.log(`✓ Copied ${name} (placeholder - no resize${note})`);
});

console.log('\n⚠️  PLACEHOLDER: Icons must be resized properly for production PWA.');
console.log('TODO: Install sharp and implement proper icon resizing:');
console.log('  - icon-192*.png: exactly 192x192 pixels');
console.log('  - icon-512*.png: exactly 512x512 pixels');
console.log('  - Maskable variants: 10% safe zone padding');
console.log('See: https://github.com/S540d/Pflanzkalender/issues/47 Phase 5');
