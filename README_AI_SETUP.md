# AI Grammar Cleanup Setup Guide

## Step 1: Get Your Google Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy the API key (it will look like a long string)

## Step 2: Create .env.local File

1. In your project root directory, create a file named `.env.local`
2. Add your API key:
   ```
   GEMINI_API_KEY=your-actual-key-here
   ```
3. Save the file

**Important:** The `.env.local` file is already in `.gitignore`, so your API key will never be committed to git.

## Step 3: Restart Your Development Server

After creating `.env.local`, restart your Next.js dev server:
```bash
npm run dev
```

## How It Works

### Architecture Overview

1. **Browser (VoiceTextarea Component)**
   - User records voice
   - Text is transcribed
   - When user clicks stop, if AI cleanup is enabled:
     - Sends text to `/api/cleanup-text` endpoint
     - Shows loading indicator
     - Receives cleaned text
     - Updates the textarea

2. **Server (API Route: `/app/api/cleanup-text/route.js`)**
   - Receives text from browser
   - Calls Google Gemini API with your API key (secure on server)
   - Returns cleaned text
   - API key is NEVER exposed to browser

3. **Security**
   - API key stored in `.env.local` (not in git)
   - All API calls go through Next.js API route
   - Browser never sees the API key
   - Key only exists on the server

### Code Explanation

#### API Route (`app/api/cleanup-text/route.js`)

```javascript
// This runs on the SERVER, not in the browser
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request) {
  // Get API key from environment variable (server-side only)
  const apiKey = process.env.GEMINI_API_KEY
  
  // Create Gemini client
  const genAI = new GoogleGenerativeAI(apiKey)
  
  // Get text from request
  const { text } = await request.json()
  
  // Get the model (using gemini-1.5-flash for fast responses)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  // Call Gemini API
  const result = await model.generateContent(prompt)
  const response = await result.response
  const cleanedText = response.text()
  
  // Return cleaned text
  return Response.json({ cleanedText })
}
```

#### VoiceTextarea Component Changes

1. **Added `enableAICleanup` prop**: Controls whether to use AI cleanup
2. **Added `isCleaning` state**: Shows loading indicator
3. **Modified stop recording handler**: 
   - If AI cleanup enabled → calls API
   - If disabled → uses basic grammar function
   - Always handles errors gracefully

#### Journal Page Changes

1. **Added toggle state**: `enableAICleanup` (default: true)
2. **Added toggle UI**: Checkbox with label and cost note
3. **Passes prop to VoiceTextarea**: All textareas use the same setting

## Cost Estimate

Google Gemini 1.5 Flash pricing (as of 2024):
- Input: ~$0.075 per 1M tokens
- Output: ~$0.30 per 1M tokens

Average journal entry: ~100-200 tokens
Estimated cost: ~$0.0001-0.0002 (less than 1 cent per entry)

**Note:** Gemini Flash is significantly cheaper than Claude, making it more cost-effective for this use case.

## Troubleshooting

### API Key Not Working
- Make sure `.env.local` exists in project root
- Make sure API key is correct
- Restart dev server after creating `.env.local`

### API Calls Failing
- Check browser console for errors
- Check server terminal for error messages
- Verify API key is valid at https://aistudio.google.com/app/apikey
- Make sure you have API credits/billing set up in Google Cloud Console

### Text Not Updating
- Check if toggle is ON
- Check browser console for errors
- Verify API route is working (check Network tab)
