const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const iconPath = path.join(assetsDir, 'icon.png');

if (!fs.existsSync(iconPath)) {
  console.error('✗ assets/icon.png not found');
  process.exit(1);
}

const requiredIcons = [
  { name: 'icon-192.png', px: 192 },
  { name: 'icon-192-maskable.png', px: 192 },
  { name: 'icon-512.png', px: 512 },
  { name: 'icon-512-maskable.png', px: 512 },
];

// Read PNG dimensions from IHDR chunk (bytes 16-23)
function getPngSize(filePath) {
  const buf = Buffer.alloc(24);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buf, 0, 24, 0);
  fs.closeSync(fd);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

let allOk = true;
for (const { name, px } of requiredIcons) {
  const filePath = path.join(assetsDir, name);
  if (!fs.existsSync(filePath)) {
    console.error(`✗ ${name} missing`);
    allOk = false;
    continue;
  }
  const { width, height } = getPngSize(filePath);
  if (width === px && height === px) {
    console.log(`✓ ${name} (${px}x${px})`);
  } else {
    console.error(`✗ ${name} has wrong size ${width}x${height}, expected ${px}x${px}`);
    allOk = false;
  }
}

if (!allOk) {
  console.error(
    '\n✗ PWA icon check failed. Resize icons with: sips -z <size> <size> assets/icon.png --out assets/<icon-name>.png'
  );
  process.exit(1);
}

console.log('✓ All PWA icon files present and correctly sized');
