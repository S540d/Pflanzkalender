#!/bin/bash

# Build the app
echo "Building app..."
npx expo export --platform web --output-dir dist

# Fix paths for GitHub Pages
echo "Fixing paths for GitHub Pages..."
node scripts/fix-paths.js

# Create .nojekyll
cd dist
touch .nojekyll
cd ..

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Deployment complete!"
