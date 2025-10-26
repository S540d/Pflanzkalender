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

# Add force cache clear
echo "Adding force cache clear..."
node scripts/force-cache-clear.js

# Add failsafe debug banner
echo "Adding failsafe debug banner..."
node scripts/add-failsafe-banner.js

# Add mobile debug overlay
echo "Adding mobile debug overlay..."
node scripts/add-mobile-debug.js

# Add loading diagnostics
echo "Adding loading diagnostics..."
node scripts/add-loading-diagnostics.js

# Create .nojekyll
cd dist
touch .nojekyll
cd ..

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Deployment complete!"
