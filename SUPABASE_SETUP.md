# Supabase Authentication Setup Guide

## ✅ What I've Done For You

I've automatically set up:
- ✅ Installed Supabase packages
- ✅ Created Supabase client configuration (`lib/supabase.js`)
- ✅ Created AuthProvider component (`app/providers/AuthProvider.js`)
- ✅ Updated layout to include AuthProvider
- ✅ Created login page (`app/login/page.js`)
- ✅ Created register page (`app/register/page.js`)
- ✅ Created middleware for route protection (`middleware.js`)
- ✅ Updated home page with login/logout buttons
- ✅ Updated storage.js to use Supabase instead of localStorage
- ✅ Updated journal and history pages to use async storage functions

## 📋 What You Need To Do

### Step 1: Create Supabase Account & Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Click "New Project"
5. Fill in:
   - **Project name**: "Journal App" (or your choice)
   - **Database password**: Create a strong password (SAVE THIS - you'll need it!)
   - **Region**: Choose closest to you
   - **Pricing plan**: Free
6. Click "Create new project" (takes 1-2 minutes to set up)

### Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Create Environment Variables File

1. In your project root directory, create a file named `.env.local`
2. Add these lines (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste this SQL code:

```sql
-- Create journal_entries table
CREATE TABLE journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  rating DECIMAL(3,1),
  liked TEXT,
  didnt_like TEXT,
  other_thoughts TEXT,
  tomorrow_plans TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX idx_journal_entries_date ON journal_entries(user_id, date DESC);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own entries
CREATE POLICY "Users can view own entries"
  ON journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own entries
CREATE POLICY "Users can insert own entries"
  ON journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own entries
CREATE POLICY "Users can update own entries"
  ON journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own entries
CREATE POLICY "Users can delete own entries"
  ON journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click "Run" (or press Ctrl+Enter) to execute the SQL

### Step 5: Configure Email Authentication (Optional but Recommended)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure "Email" is enabled
3. (Optional) Configure email templates under **Authentication** → **Email Templates**

### Step 6: Restart Your Development Server

1. Stop your current dev server (Ctrl+C)
2. Start it again:

```bash
npm run dev
```

### Step 7: Test It Out!

1. Open your app in the browser
2. You should see a "Sign In" button in the top right
3. Click it and create a new account
4. Try creating a journal entry
5. Check your Supabase dashboard → **Table Editor** → **journal_entries** to see your data!

## 🔒 Security Features Already Implemented

- ✅ Row Level Security (RLS) - Users can only see their own data
- ✅ Route protection - Journal and history pages require login
- ✅ Secure authentication - Passwords are hashed by Supabase
- ✅ Session management - Automatic session handling

## 🐛 Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists in your project root
- Make sure the variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your dev server after creating/updating `.env.local`

### "User not authenticated" error
- Make sure you're logged in
- Check that the middleware is working (try accessing `/journal` without logging in - should redirect to `/login`)

### Database errors
- Make sure you ran the SQL schema setup (Step 4)
- Check Supabase dashboard → **Table Editor** to see if `journal_entries` table exists
- Check **Authentication** → **Policies** to see if RLS policies are set up

### Can't see my old entries
- Old entries were stored in localStorage (client-side only)
- New entries will be stored in Supabase (server-side, secure)
- You'll need to create new entries after setting up Supabase
- (We can create a migration script later if you have important data to migrate)

## 📝 Next Steps (After Setup Works)

Once authentication is working:
1. Test creating, editing, and deleting entries
2. Test the streak counter
3. Test the history page
4. Consider adding:
   - Password reset functionality
   - Email verification
   - OAuth providers (Google, Apple, etc.)
   - User profile page

## 🎉 You're Done!

Your app now has:
- ✅ Secure user authentication
- ✅ Database-backed storage (no more localStorage limits!)
- ✅ User data isolation (each user only sees their own entries)
- ✅ Scalable infrastructure (ready for thousands of users)

Enjoy your secure journaling app! 🚀



