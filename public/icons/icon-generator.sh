#!/bin/bash

# This script generates all the necessary icons for the PWA
# Requires ImageMagick to be installed

# Base icon (should be at least 512x512)
BASE_ICON="icon.png"

# PWA Icons
convert $BASE_ICON -resize 72x72 icon-72x72.png
convert $BASE_ICON -resize 96x96 icon-96x96.png
convert $BASE_ICON -resize 128x128 icon-128x128.png
convert $BASE_ICON -resize 144x144 icon-144x144.png
convert $BASE_ICON -resize 152x152 icon-152x152.png
convert $BASE_ICON -resize 192x192 icon-192x192.png
convert $BASE_ICON -resize 384x384 icon-384x384.png
convert $BASE_ICON -resize 512x512 icon-512x512.png

# Favicon
convert $BASE_ICON -resize 196x196 favicon-196.png

# iOS Icons
convert $BASE_ICON -resize 180x180 apple-icon-180.png

echo "Icons generated successfully!"
