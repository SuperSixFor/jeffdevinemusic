#!/bin/bash
# ================================================================
# Devine Music — Site Repo Setup
# Run once after cloning or on a new machine
# ================================================================

set -e

echo "Setting up jeffdevinemusic site repo..."

# Init git if not already
if [ ! -d ".git" ]; then
  git init
  git branch -M main
  echo "Git initialized"
fi

# Confirm CNAME is present
if [ ! -f "CNAME" ]; then
  echo "jeffdevinemusic.com" > CNAME
  echo "CNAME created"
fi

# Create any missing asset dirs
mkdir -p assets/images assets/fonts assets/scores score-pages

echo ""
echo "Done. Next steps:"
echo "  1. Create repo on GitHub: github.com/new"
echo "     Name: jeffdevinemusic (or jeffdevinemusic.com)"
echo "     Visibility: Public (required for GitHub Pages free tier)"
echo ""
echo "  2. Push:"
echo "     git add ."
echo "     git commit -m 'Initial site'"
echo "     git remote add origin https://github.com/YOURUSERNAME/jeffdevinemusic.git"
echo "     git push -u origin main"
echo ""
echo "  3. GitHub Settings → Pages → Branch: main → /(root)"
echo "  4. Add custom domain: jeffdevinemusic.com"
echo "  5. Point DNS A records to:"
echo "     185.199.108.153"
echo "     185.199.109.153"
echo "     185.199.110.153"
echo "     185.199.111.153"
