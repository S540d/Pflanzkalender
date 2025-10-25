#!/bin/bash

# Temporär metro.config.js für Testing anpassen
echo "Patching metro.config for testing environment..."

cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configure public path for GitHub Pages Testing
config.transformer = {
  ...config.transformer,
  publicPath: '/Pflanzkalender-testing/',
};

module.exports = config;
EOF

echo "✓ Metro config patched for testing"
