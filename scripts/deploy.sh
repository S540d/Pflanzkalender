#!/bin/bash

# Build the app
echo "Building app..."
npx expo export --platform web --output-dir dist

# Fix paths for GitHub Pages
echo "Fixing paths for GitHub Pages..."
cd dist

# Update index.html to use relative paths
if [ -f "index.html" ]; then
  sed -i '' 's|href="/|href="./|g' index.html
  sed -i '' 's|src="/|src="./|g' index.html
  echo "Updated index.html paths"
fi

# Create .nojekyll to prevent GitHub from processing files
touch .nojekyll

cd ..

# Deploy to gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Deployment complete!"
