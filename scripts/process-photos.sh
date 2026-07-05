#!/usr/bin/env bash
# Processes originals in ~/Downloads/Leo/ into web-optimized JPEGs in ../photos/
# Produces variants sized by longest dimension (aspect preserved):
#   main = 1400px, -sm = 700px, -lg = 2400px (only for the 3 hero-tier photos).
# Uses sips (built into macOS).

set -euo pipefail

SRC="$HOME/Downloads/Leo"
DEST="$(dirname "$0")/../photos"
mkdir -p "$DEST"

# Photos that need a high-res -lg version for lightbox and hero
HI_RES=(
  "20231015_075300.jpg"     # leo-joy (hero)
  "20231015_074933.jpg"     # leo-grass (large body figure)
  "IMG-20251005-WA0003.jpg" # leo-wall
)

echo "Processing photos from $SRC → $DEST"

count=0
for src in "$SRC"/*.jpg "$SRC"/*.jpeg; do
  [ -e "$src" ] || continue
  base="$(basename "$src")"
  name="${base%.*}"
  # Slugify: replace spaces with underscores in output filename
  out_base="${name// /_}"

  # Main version: 1400px longest dimension, quality 85
  out_main="$DEST/${out_base}.jpg"
  sips -Z 1400 -s format jpeg -s formatOptions 85 "$src" --out "$out_main" > /dev/null

  # Mobile variant: 700px longest dimension, quality 82
  out_sm="$DEST/${out_base}-sm.jpg"
  sips -Z 700 -s format jpeg -s formatOptions 82 "$src" --out "$out_sm" > /dev/null

  # High-res variant for the 3 hero-tier photos (2400px longest dimension, quality 88)
  for hi in "${HI_RES[@]}"; do
    if [ "$base" = "$hi" ]; then
      out_lg="$DEST/${out_base}-lg.jpg"
      sips -Z 2400 -s format jpeg -s formatOptions 88 "$src" --out "$out_lg" > /dev/null
      break
    fi
  done

  count=$((count + 1))
  echo "  ✓ $base"
done

echo ""
echo "Processed $count photos → $DEST"
du -sh "$DEST"
