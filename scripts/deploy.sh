#!/bin/bash

# Build the app
echo "Building app..."
npx expo export --platform web --output-dir dist

# Prepare for GitHub Pages
echo "Preparing for GitHub Pages..."
cd dist

# Create .nojekyll to prevent GitHub from processing files
touch .nojekyll

cd ..

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Deployment complete!"
