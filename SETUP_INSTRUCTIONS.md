# Step-by-Step Setup Guide for Gemini API

## Step 1: Get Your Google Gemini API Key

1. **Open your web browser** and go to: https://aistudio.google.com/app/apikey

2. **Sign in** with your Google account
   - If you don't have a Google account, create one at https://accounts.google.com/signup

3. **Create an API Key**
   - Click the "Create API Key" button (or "Get API Key" if you see that)
   - You may be asked to create a Google Cloud project - just click "Create API Key in New Project" or select an existing project
   - Your API key will be displayed - it looks like a long string of letters and numbers

4. **Copy your API key**
   - Click the copy button or select and copy the entire key
   - **Important:** Keep this key secret! Don't share it publicly.

## Step 2: Create .env.local File

1. **Open your project folder** in File Explorer (or Finder on Mac)
   - The folder is: `C:\Users\happy\OneDrive\Desktop\Journal`

2. **Create a new file** named `.env.local`
   - Right-click in the folder → New → Text Document
   - Name it exactly: `.env.local` (including the dot at the beginning)
   - If Windows asks about the file extension, click "Yes" to keep it

3. **Open `.env.local` in a text editor** (Notepad, VS Code, etc.)

4. **Add your API key** to the file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   - Replace `your_actual_api_key_here` with the API key you copied in Step 1
   - Make sure there are NO spaces around the `=` sign
   - Example: `GEMINI_API_KEY=AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz`

5. **Save the file** (Ctrl+S or File → Save)

## Step 3: Verify .env.local is Protected

1. **Check that `.env.local` is in `.gitignore`**
   - Open the `.gitignore` file in your project
   - You should see `.env.local` or `.env*.local` listed
   - If not, add it (but it should already be there)

## Step 4: Restart Your Development Server

1. **Stop your current dev server** (if it's running)
   - In the terminal where `npm run dev` is running, press `Ctrl+C`

2. **Start it again:**
   ```bash
   npm run dev
   ```

3. **Wait for it to start** - you should see "Ready" message

## Step 5: Test It Out!

1. **Open your app** in the browser (usually http://localhost:3000)

2. **Go to the Journal page** (click "Start Journaling")

3. **Make sure the toggle is ON:**
   - You should see "AI Grammar Cleanup ✨" toggle at the top
   - It should be checked (ON) by default

4. **Record some voice:**
   - Click the microphone button in any text field
   - Speak something (e.g., "today was a good day i went to the store and bought some groceries")
   - Click stop when done

5. **Watch for the cleanup:**
   - You should see "Cleaning up..." with a spinner
   - After a few seconds, your text should be cleaned up with proper grammar

## Troubleshooting

### If you see "API key not configured" error:
- Make sure `.env.local` file exists in the project root (same folder as `package.json`)
- Make sure the file is named exactly `.env.local` (with the dot)
- Make sure you restarted the dev server after creating the file
- Check that your API key is correct (no extra spaces, correct format)

### If you see "Failed to clean up text" error:
- Check your browser console (F12) for error messages
- Check your terminal where `npm run dev` is running for error messages
- Verify your API key is valid at https://aistudio.google.com/app/apikey
- Make sure you haven't exceeded the free tier limits (1,500 requests/day)

### If the toggle doesn't appear:
- Make sure you're on the journal page (`/journal`)
- Check that the code was saved properly
- Try refreshing the page (Ctrl+R or F5)

## What Happens Next?

Once set up:
- ✅ Every time you stop recording, if toggle is ON, your text gets cleaned by AI
- ✅ It's FREE for up to 1,500 journal entries per day
- ✅ You can turn the toggle OFF anytime to use basic (free) grammar instead
- ✅ Your API key stays secure on your computer (never sent to browser)

## Need Help?

- Check the browser console (F12 → Console tab) for errors
- Check the terminal where `npm run dev` is running for server errors
- Make sure all packages are installed: `npm install`



