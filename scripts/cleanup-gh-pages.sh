#!/bin/bash

# Pflanzkalender - Cleanup Script for gh-pages Branch
# Removes sensitive files that should never be deployed to GitHub Pages

set -e

echo "🧹 Starting cleanup of gh-pages branch..."

# Check if we're on gh-pages branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "gh-pages" ]; then
    echo "⚠️  Not on gh-pages branch. Switching..."
    git fetch origin gh-pages
    git checkout gh-pages
    git pull origin gh-pages
fi

echo "📋 Current branch: $(git branch --show-current)"
echo "📁 Working directory: $(pwd)"
echo ""

# List of files/directories to remove
FILES_TO_REMOVE=(
    "node_modules/"
    "credentials.json"
    ".env"
    ".env.local"
    ".env.production"
    ".env.staging"
    ".env.testing"
    "*.jks"
    ".vscode/"
    ".husky/"
    "coverage/"
    ".expo/"
    ".templates/"
    ".venv/"
    "*.log"
)

REMOVED_COUNT=0
REMOVED_FILES=()

echo "🔍 Scanning for sensitive files..."
echo ""

for pattern in "${FILES_TO_REMOVE[@]}"; do
    # Check if files/directories exist matching the pattern
    if ls -d $pattern 2>/dev/null | grep -q .; then
        echo "  ❌ Found: $pattern"
        for item in $pattern; do
            if [ -e "$item" ] || [ -d "$item" ]; then
                REMOVED_FILES+=("$item")
                rm -rf "$item"
                ((REMOVED_COUNT++))
            fi
        done
    fi
done

echo ""

if [ $REMOVED_COUNT -eq 0 ]; then
    echo "✅ No sensitive files found - gh-pages is clean!"
    echo ""
    echo "📊 Summary:"
    echo "  Files removed: 0"
    echo "  Status: Clean ✓"
    exit 0
fi

echo "🗑️  Removed $REMOVED_COUNT sensitive file(s)/directory(ies):"
for file in "${REMOVED_FILES[@]}"; do
    echo "    - $file"
done
echo ""

# Stage all changes
git add -A

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit"
    exit 0
fi

# Commit changes
echo "💾 Committing cleanup..."
git commit -m "🧹 Security: Remove sensitive files from gh-pages

Removed files:
$(printf '- %s\n' "${REMOVED_FILES[@]}")

Automated cleanup to prevent Google Safe Browsing warnings."

echo ""
echo "📤 Pushing changes to remote..."
git push origin gh-pages

echo ""
echo "✅ Cleanup completed successfully!"
echo ""
echo "📊 Summary:"
echo "  Files removed: $REMOVED_COUNT"
echo "  Branch: gh-pages"
echo "  Status: Pushed ✓"
echo ""
echo "🔒 gh-pages branch is now secure!"
