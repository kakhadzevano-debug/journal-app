# How to Access Your Journal App on Your Phone

## Quick Setup (Local Network)

### Step 1: Restart Your Dev Server
The dev server needs to be restarted to allow network access. Stop the current server (Ctrl+C) and run:
```bash
npm run dev
```

### Step 2: Make Sure Phone and Computer Are on Same WiFi
- Your phone and computer must be connected to the same WiFi network
- Check that both devices are on the same network

### Step 3: Access on Your Phone
Open your phone's web browser (Chrome, Safari, etc.) and go to:

```
http://192.168.86.65:3000
```

**Note:** If this IP doesn't work, you can find your computer's IP address by:
- Windows: Open Command Prompt and type `ipconfig`, look for "IPv4 Address" under your WiFi adapter
- The IP will be something like `192.168.x.x` or `10.x.x.x`

### Step 4: Test It
- You should see your journal app home page
- Try creating a journal entry
- Voice recording should work (you'll need to allow microphone access on your phone)

---

## Alternative Options

### Option 2: Deploy to Vercel (Free, Permanent)
1. Create a free account at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` in your project folder
4. Follow the prompts
5. Your app will get a public URL like `your-app.vercel.app`
6. Access it from anywhere, anytime!

### Option 3: Use ngrok (Temporary Public URL)
1. Sign up at https://ngrok.com (free tier available)
2. Install ngrok
3. Run: `ngrok http 3000`
4. You'll get a public URL like `https://abc123.ngrok.io`
5. Share this URL with yourself or access from anywhere

### Option 4: Build Native Mobile App (Advanced)
For a true mobile app experience, you can use Capacitor to convert your web app into iOS/Android apps. This requires:
- Additional setup
- App store accounts
- More complex deployment

---

## Troubleshooting

### Can't Access from Phone
1. **Check firewall**: Windows Firewall might be blocking port 3000
   - Go to Windows Defender Firewall → Allow an app
   - Make sure Node.js is allowed
   - Or temporarily disable firewall to test

2. **Check IP address**: Your IP might have changed
   - Run `ipconfig` again to get current IP
   - Make sure you're using the correct IP

3. **Check WiFi**: Ensure both devices are on the same network

4. **Try different browser**: Some browsers have stricter security

### Microphone Not Working on Phone
- Make sure you allow microphone permissions when prompted
- Check phone settings → Privacy → Microphone → Allow for your browser

### App Looks Different on Phone
- This is normal! The app is responsive and will adapt to your phone's screen
- You can test different screen sizes in Chrome DevTools (F12 → Device Toolbar)

---

## Security Note

When accessing via local network (Option 1), only devices on your WiFi can access it. This is safe for development.

For production use, consider deploying to Vercel or another hosting service for better security and reliability.



