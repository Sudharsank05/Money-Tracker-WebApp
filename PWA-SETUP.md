# PWA Setup Guide

This guide will help you set up the Money Tracker as a Progressive Web App (PWA) for both Android and iOS.

## Prerequisites

- A web server (required for PWA to work - cannot use file:// protocol)
- Modern web browser (Chrome, Edge, Safari, Firefox)

## Step 1: Generate Icons

You need to generate icon files for the PWA. Choose one of these methods:

### Method 1: Using Browser (Recommended - No Dependencies)

1. Open `generate-icons.html` in your web browser
2. Click "Generate Icons" to preview
3. Click "Download All Icons" to download all icon files
4. Extract the downloaded icons to the `icons/` folder

### Method 2: Using Node.js Script

1. Install Node.js if you haven't already
2. Install canvas package: `npm install canvas`
3. Run the script: `node generate-icons.js`
4. Icons will be generated in the `icons/` folder

### Method 3: Manual Creation

Create PNG icons with these sizes and save them in the `icons/` folder:
- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

## Step 2: Set Up Web Server

PWAs require HTTPS (or localhost) to work. You have several options:

### Option 1: Local Development Server

**Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Node.js (http-server):**
```bash
npm install -g http-server
http-server -p 8000
```

**PHP:**
```bash
php -S localhost:8000
```

### Option 2: Deploy to Web Hosting

Deploy to any static hosting service:
- **Netlify**: Drag and drop your folder
- **Vercel**: Connect your GitHub repo
- **GitHub Pages**: Push to GitHub and enable Pages
- **Firebase Hosting**: Use Firebase CLI

### Option 3: HTTPS with ngrok (for testing)

```bash
# Install ngrok
# Run your local server, then:
ngrok http 8000
```

## Step 3: Install on Android

1. Open the website in Chrome or Edge browser
2. You'll see an install prompt, or:
3. Go to Settings → Install App
4. Tap "Install App" button
5. The app will be added to your home screen

## Step 4: Install on iOS

1. Open the website in Safari browser
2. Tap the Share button (📤)
3. Scroll down and tap "Add to Home Screen"
4. Customize the name if needed
5. Tap "Add"
6. The app will appear on your home screen

## Features When Installed as PWA

✅ **Offline Support**: App works without internet connection
✅ **Home Screen Icon**: Quick access from home screen
✅ **Standalone Mode**: Opens without browser UI
✅ **Fast Loading**: Cached assets load instantly
✅ **App-like Experience**: Full-screen, native feel

## Troubleshooting

### Icons not showing
- Make sure all icon files are in the `icons/` folder
- Check that icon paths in `manifest.json` are correct
- Clear browser cache and reload

### Service Worker not registering
- Make sure you're using HTTPS or localhost (not file://)
- Check browser console for errors
- Verify `sw.js` file is accessible

### Install prompt not showing
- **Android**: Make sure you're using Chrome/Edge and the site meets PWA criteria
- **iOS**: Use Safari and follow the manual installation steps
- Check that manifest.json is valid

### App not working offline
- Clear cache and reinstall the app
- Check service worker registration in browser DevTools
- Verify all assets are being cached

## Testing PWA Features

1. **Offline Test**: 
   - Install the app
   - Turn off internet
   - App should still work

2. **Update Test**:
   - Make changes to files
   - Reload the app
   - Service worker will update automatically

3. **Install Test**:
   - Check install button appears
   - Install and verify it works standalone

## Browser Support

- ✅ Chrome/Edge (Android & Desktop): Full support
- ✅ Safari (iOS): Full support (manual install)
- ✅ Firefox: Good support
- ⚠️ Safari (Desktop): Limited support

## Next Steps

- Customize app name and colors in `manifest.json`
- Add more app shortcuts in `manifest.json`
- Enhance offline functionality in `sw.js`
- Add push notifications (requires server)

## Need Help?

Check browser console for errors and verify:
1. All files are accessible via web server
2. manifest.json is valid JSON
3. Service worker is registered
4. Icons are in correct format and location

