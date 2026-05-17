#!/bin/bash

# Build the app
echo "Building app..."
npx expo export --platform web --output-dir dist

# Fix paths for GitHub Pages
echo "Fixing paths for GitHub Pages..."
node scripts/fix-paths.js

# Add service worker and cache busting
echo "Adding service worker and cache busting..."
node scripts/add-service-worker.js

# Generate PWA icons
echo "Generating PWA icons..."
node scripts/generate-icons.js

# Copy icons to dist
echo "Copying icons to dist..."
cp assets/icon-*.png dist/ || echo "No icons to copy"

# Add force cache clear
echo "Adding force cache clear..."
node scripts/force-cache-clear.js

# Add PWA meta tags and .well-known
echo "Adding PWA meta tags and .well-known..."
node scripts/add-pwa-meta-tags.js

# Add failsafe debug banner
echo "Adding failsafe debug banner..."
node scripts/add-failsafe-banner.js

# Add mobile debug overlay
echo "Adding mobile debug overlay..."
node scripts/add-mobile-debug.js

# Add loading diagnostics
echo "Adding loading diagnostics..."
node scripts/add-loading-diagnostics.js

# SPA 404 fallback so GitHub Pages serves the app for deep links (Expo Router)
echo "Creating SPA 404 fallback..."
cp dist/index.html dist/404.html

# Create .nojekyll
cd dist
touch .nojekyll
cd ..

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Deployment complete!"
