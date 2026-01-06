# Quick RLS Verification Guide

## 🎯 5-Minute Quick Check

Follow these steps to quickly verify RLS is enabled:

---

## Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar

---

## Step 2: Run Verification Query

Copy and paste this SQL into the SQL Editor:

```sql
-- Check RLS status for all tables
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('journal_entries', 'streaks', 'user_preferences')
ORDER BY tablename;
```

**Expected Result:**
```
tablename          | rls_status
-------------------|------------
journal_entries    | ✅ ENABLED
streaks            | ✅ ENABLED
user_preferences   | ✅ ENABLED
```

---

## Step 3: Check Policies Exist

Run this query to see all policies:

```sql
-- List all RLS policies
SELECT 
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('journal_entries', 'streaks', 'user_preferences')
ORDER BY tablename, cmd;
```

**Expected Result:** Should show policies for each table (SELECT, INSERT, UPDATE, DELETE for journal_entries; SELECT and ALL for streaks and user_preferences)

---

## Step 4: Run Setup SQL Files (If Needed)

If RLS is **NOT enabled** on any table:

### Option A: Use the SQL files in your project

1. Open `supabase_streak_setup.sql` in your code editor
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Should see "Success. No rows returned"

6. Repeat for `supabase_notifications_setup.sql`

### Option B: Use the verification script

1. Open `verify_rls_status.sql` in your code editor
2. Find the section "STEP 3: Enable RLS"
3. Uncomment the ALTER TABLE statements for tables that need RLS
4. Copy and run in SQL Editor

---

## Step 5: Verify journal_entries Has Policies

The `journal_entries` table might not have RLS policies yet. If the verification query shows it's missing policies, run this SQL:

```sql
-- Enable RLS on journal_entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for journal_entries
CREATE POLICY "Users can view own journals"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journals"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);
```

---

## ✅ Success Checklist

After running the verification, check:

- [ ] All 3 tables show "✅ ENABLED" in RLS status
- [ ] `journal_entries` has 4 policies (SELECT, INSERT, UPDATE, DELETE)
- [ ] `streaks` has 2 policies (SELECT, ALL/UPDATE)
- [ ] `user_preferences` has 2 policies (SELECT, ALL/UPDATE)
- [ ] All policies use `auth.uid() = user_id` condition

---

## 🧪 Quick Test (Optional)

To verify RLS is working:

1. Create 2 test accounts in your app
2. Log in as User A, create a journal entry
3. Log out, log in as User B
4. **Expected:** User B should NOT see User A's journal entry
5. **Expected:** User B can only see their own entries

---

## ❓ Troubleshooting

### "Table does not exist"
- The `journal_entries` table might not exist yet
- Create it first using Supabase Table Editor
- Or run your app's initial setup

### "Policy already exists"
- That's OK! The policies are already set up
- You can ignore the error or use `CREATE POLICY IF NOT EXISTS` (PostgreSQL 9.5+)

### "Permission denied"
- Make sure you're logged into Supabase with proper permissions
- You need to be the project owner or have admin access

---

**Time Estimate:** 5-10 minutes

**Next Step:** Once RLS is verified, you're ready to proceed with launch! ✅

