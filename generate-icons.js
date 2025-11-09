// Icon Generator Script for Money Tracker PWA
// Run with: node generate-icons.js
// Requires: npm install canvas (or use generate-icons.html in browser)

const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes required for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Icon Generator for Money Tracker PWA');
console.log('=====================================\n');

// Check if canvas is available
let Canvas;
try {
    Canvas = require('canvas');
    console.log('Canvas module found. Generating icons...\n');
} catch (error) {
    console.log('Canvas module not found.');
    console.log('Please either:');
    console.log('1. Install canvas: npm install canvas');
    console.log('2. Or use generate-icons.html in your browser to generate icons\n');
    console.log('Creating placeholder instructions...\n');
    
    // Create a simple SVG icon as fallback
    const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)" rx="100"/>
  <text x="256" y="320" font-size="200" text-anchor="middle" fill="white">💰</text>
</svg>`;
    
    fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);
    console.log('Created icon.svg as placeholder');
    console.log('Please convert this to PNG files at the required sizes or use generate-icons.html\n');
    process.exit(0);
}

// Generate icons
sizes.forEach(size => {
    const canvas = Canvas.createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Draw money emoji (using text)
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size * 0.5}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💰', size / 2, size / 2);

    // Add subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = Math.max(2, size * 0.02);
    ctx.strokeRect(0, 0, size, size);

    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    const filename = `icon-${size}x${size}.png`;
    const filepath = path.join(iconsDir, filename);
    fs.writeFileSync(filepath, buffer);
    console.log(`✓ Generated ${filename}`);
});

console.log(`\n✓ All icons generated successfully in ${iconsDir}/`);
console.log('Icons are ready for PWA installation!\n');

