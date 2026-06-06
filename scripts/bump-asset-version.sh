#!/usr/bin/env bash
# Bump CSS/JS cache-bust version for Neutral Frame.
# Copies canonical assets → versioned filenames and updates all *.html refs.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION_FILE="$ROOT/assets/version.txt"
ASSETS="$ROOT/assets"

if [[ -f "$VERSION_FILE" ]]; then
  OLD="$(tr -d '[:space:]' < "$VERSION_FILE")"
  if [[ "$OLD" =~ ^[0-9]+$ ]]; then
    NEW=$((OLD + 1))
  else
    NEW=1
  fi
else
  NEW=1
fi

printf '%s\n' "$NEW" > "$VERSION_FILE"

cp "$ASSETS/styles.css" "$ASSETS/styles.v${NEW}.css"
cp "$ASSETS/top-slideshow.js" "$ASSETS/top-slideshow.v${NEW}.js"
cp "$ASSETS/photograph-page.js" "$ASSETS/photograph-page.v${NEW}.js"

# Remove previous versioned copies (keep canonical sources).
for path in "$ASSETS"/styles.v*.css "$ASSETS"/top-slideshow.v*.js "$ASSETS"/photograph-page.v*.js; do
  [[ -e "$path" ]] || continue
  base="$(basename "$path")"
  if [[ "$base" != "styles.v${NEW}.css" && "$base" != "top-slideshow.v${NEW}.js" && "$base" != "photograph-page.v${NEW}.js" ]]; then
    rm -f "$path"
  fi
done

for html in "$ROOT"/*.html; do
  [[ -f "$html" ]] || continue
  sed -i '' \
    -e "s|assets/styles\.v[0-9][0-9]*\.css|assets/styles.v${NEW}.css|g" \
    -e "s|assets/styles\.css|assets/styles.v${NEW}.css|g" \
    -e "s|assets/top-slideshow\.v[0-9][0-9]*\.js|assets/top-slideshow.v${NEW}.js|g" \
    -e "s|assets/top-slideshow\.js|assets/top-slideshow.v${NEW}.js|g" \
    -e "s|assets/photograph-page\.v[0-9][0-9]*\.js|assets/photograph-page.v${NEW}.js|g" \
    -e "s|assets/photograph-page\.js|assets/photograph-page.v${NEW}.js|g" \
    "$html"
done

echo "Asset version bumped to v${NEW}"
