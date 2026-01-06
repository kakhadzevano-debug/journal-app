# 📱 Mobile App Setup Guide

This guide will help you convert your Next.js journal app into a mobile app using Capacitor.

## Prerequisites

- Node.js installed
- For iOS: macOS with Xcode installed
- For Android: Android Studio installed
- Your app should be working in the browser first

## Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
```

## Step 2: Configure Next.js for Static Export

Capacitor needs a static export of your Next.js app. Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

**Important:** Static export means:
- No server-side API routes (they won't work)
- You'll need to use a separate backend or modify API calls
- Some Next.js features won't work

## Step 3: Build Static Export

```bash
npm run build
```

This creates an `out` folder with static files.

## Step 4: Initialize Capacitor

```bash
npx cap init
```

When prompted:
- App name: `Voice Journal` (or your app name)
- App ID: `com.yourname.journal` (use reverse domain format)
- Web dir: `out` (this is where Next.js exports to)

## Step 5: Add Platforms

### For Android:
```bash
npx cap add android
```

### For iOS (macOS only):
```bash
npx cap add ios
```

## Step 6: Sync Your App

After building, sync to native platforms:
```bash
npm run build
npx cap sync
```

## Step 7: Open in Native IDE

### Android:
```bash
npx cap open android
```
Opens Android Studio. Then:
1. Wait for Gradle sync
2. Click "Run" button (green play icon)
3. Choose an emulator or connected device

### iOS (macOS only):
```bash
npx cap open ios
```
Opens Xcode. Then:
1. Select your device/simulator
2. Click "Run" button (play icon)

## Step 8: Handle API Routes

**CRITICAL:** Next.js API routes (`/api/*`) won't work in static export.

**Options:**

### Option A: Use Supabase Client Directly (Recommended)
- Your API routes already use Supabase
- You can call Supabase directly from the client
- Update your code to use Supabase client instead of API routes

### Option B: Deploy API Routes Separately
- Deploy API routes to Vercel/Netlify
- Update API calls to point to deployed URL
- Example: `https://your-api.vercel.app/api/cleanup-text`

### Option C: Use Capacitor HTTP Plugin
- Install `@capacitor/http`
- Make HTTP requests to your deployed backend

## Step 9: Update API Calls

If you choose Option A (Supabase direct), you'll need to update:
- `/api/cleanup-text` → Call Google Gemini directly (with API key in app)
- `/api/delete-account` → Use Supabase Admin SDK (requires service role key)

**Security Note:** For mobile apps, you'll need to handle API keys differently. Consider:
- Using environment variables that are bundled (less secure)
- Using a backend API (more secure)
- Using Supabase Edge Functions (recommended)

## Step 10: Test on Device

1. Build: `npm run build`
2. Sync: `npx cap sync`
3. Open in IDE: `npx cap open android` or `npx cap open ios`
4. Run on device/emulator

## Troubleshooting

### Build Errors
- Make sure all API routes are handled
- Check for server-side only code
- Use `'use client'` directive where needed

### API Routes Not Working
- API routes don't work in static export
- Use one of the options above to handle backend calls

### CORS Issues
- If using separate backend, configure CORS
- Add your app's origin to allowed origins

### Environment Variables
- For mobile apps, use Capacitor's config
- Or bundle env vars (less secure but works)
- Or use a backend API (most secure)

## Next Steps After Setup

1. Test all features on mobile
2. Fix any mobile-specific issues
3. Test on real devices (not just emulators)
4. Optimize for mobile performance
5. Prepare for app store submission

## Important Notes

⚠️ **API Routes Limitation:**
- Next.js API routes require a server
- Static export = no server
- You'll need to refactor API calls

✅ **Recommended Approach:**
- Keep web version with API routes
- For mobile: use Supabase client directly OR deploy API to separate backend
- Or use Supabase Edge Functions for serverless backend

## Alternative: Progressive Web App (PWA)

Instead of native app, you could also make it a PWA:
- Works on mobile browsers
- Can be "installed" to home screen
- No app store needed
- Easier to maintain
- API routes work normally

Would you like me to set up PWA instead, or proceed with Capacitor?


