# How to Set Up Supabase Service Role Key for Account Deletion

## Why This Is Needed

The account deletion feature requires a **Service Role Key** from Supabase to permanently delete user accounts. Without this key, the deletion will fail and users will still be able to sign back in.

## Step 1: Get Your Service Role Key from Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API** (in the left sidebar)
4. Scroll down to **Project API keys**
5. Find the **`service_role`** key (NOT the `anon` key)
6. Click the **eye icon** to reveal it
7. **Copy the entire key** (it's a long string starting with `eyJ...`)

⚠️ **IMPORTANT SECURITY WARNING:**
- The service role key has **full admin access** to your database
- **NEVER** commit this key to git or expose it publicly
- **NEVER** use it in client-side code
- Only use it in server-side API routes (which we're doing)

## Step 2: Add It to Your Environment Variables

1. Open your project root directory
2. Open or create the file `.env.local` (if it doesn't exist)
3. Add this line:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
4. Replace `your-service-role-key-here` with the actual key you copied
5. Save the file

**Example `.env.local` file:**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.your-actual-key-continues-here
GEMINI_API_KEY=your-gemini-key-here
```

## Step 3: Restart Your Development Server

After adding the service role key:

1. **Stop** your current dev server (Ctrl+C in terminal)
2. **Start** it again:
   ```bash
   npm run dev
   ```

The environment variable will only be loaded when the server starts.

## Step 4: Test Account Deletion

1. Create a test account
2. Go to Settings → Delete My Account
3. Enter your password
4. Click "Confirm Delete"
5. Try to sign in again with the same email/password
6. **It should fail** - the account should be permanently deleted

## Troubleshooting

### "Service configuration error" message
- Check that `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local`
- Make sure you copied the **entire** key (it's very long)
- Restart your dev server after adding it
- Check for typos or extra spaces

### Account still exists after deletion
- Check the server console/terminal for error messages
- Verify the service role key is correct
- Make sure you're using the `service_role` key, not the `anon` key
- Check Supabase dashboard → Authentication → Users to see if the account was deleted

### "Failed to delete account" error
- Check server console for detailed error messages
- Verify your Supabase project is active
- Make sure you have proper permissions in Supabase

## For Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Go to your hosting platform's dashboard
2. Find **Environment Variables** or **Settings → Environment**
3. Add `SUPABASE_SERVICE_ROLE_KEY` with your service role key value
4. Save and redeploy

**Never commit `.env.local` to git** - it's already in `.gitignore`

## Security Best Practices

✅ **DO:**
- Keep the service role key secret
- Only use it in server-side code (API routes)
- Add it to `.env.local` for local development
- Add it to your hosting platform's environment variables for production

❌ **DON'T:**
- Commit it to git
- Use it in client-side code
- Share it publicly
- Use it for regular database operations (use the anon key instead)


