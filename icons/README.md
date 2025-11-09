# Icons Directory

This directory should contain the following icon files for PWA support:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## How to Generate Icons

### Option 1: Browser (Easiest)
1. Open `generate-icons.html` in your browser
2. Click "Generate Icons"
3. Click "Download All Icons"
4. Extract the downloaded files to this folder

### Option 2: Node.js Script
1. Run: `npm install canvas` (if not already installed)
2. Run: `node generate-icons.js`
3. Icons will be generated in this folder

### Option 3: Manual
Create PNG files with the required sizes using any image editor.

## Icon Requirements

- Format: PNG
- Sizes: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
- Recommended: Square icons with rounded corners, money/currency theme
- Background: Should work on both light and dark backgrounds

