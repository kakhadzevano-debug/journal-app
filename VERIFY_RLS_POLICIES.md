# RLS Policy Verification Guide

## 🎯 Objective
Verify that Row-Level Security (RLS) is properly enabled on all tables to ensure users can only access their own data.

---

## 📋 Step 1: Check Which Tables Need RLS

Your app uses these tables:
1. **journal_entries** - User journal entries
2. **streaks** - User streak tracking
3. **user_preferences** - User notification preferences

All three tables must have RLS enabled.

---

## 📋 Step 2: Verify RLS is Enabled in Supabase

### Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Policies** (or **Table Editor** → Select table → **RLS** tab)

### For Each Table, Verify:

#### ✅ Table 1: `journal_entries`

1. Go to **Table Editor** → `journal_entries`
2. Click on the **RLS** tab (or go to **Authentication** → **Policies** → Filter by `journal_entries`)
3. Verify:
   - ✅ **RLS Enabled:** Should show "Enabled" or a toggle that's ON
   - ✅ **Policies Exist:** Should see policies like:
     - "Users can view own journals" (SELECT policy)
     - "Users can insert own journals" (INSERT policy)
     - "Users can update own journals" (UPDATE policy)
     - "Users can delete own journals" (DELETE policy)

#### ✅ Table 2: `streaks`

1. Go to **Table Editor** → `streaks`
2. Click on the **RLS** tab
3. Verify:
   - ✅ **RLS Enabled:** Should show "Enabled"
   - ✅ **Policies Exist:** Should see:
     - "Users can view own streak" (SELECT policy)
     - "Users can update own streak" (ALL/UPDATE policy)

#### ✅ Table 3: `user_preferences`

1. Go to **Table Editor** → `user_preferences`
2. Click on the **RLS** tab
3. Verify:
   - ✅ **RLS Enabled:** Should show "Enabled"
   - ✅ **Policies Exist:** Should see:
     - "Users can view own preferences" (SELECT policy)
     - "Users can update own preferences" (ALL/UPDATE policy)

---

## 📋 Step 3: Run SQL Setup Files (If Not Already Done)

If you haven't run the SQL setup files yet, or if RLS is not enabled:

### Option A: Run SQL Files in Supabase SQL Editor

1. Go to **SQL Editor** in Supabase Dashboard
2. Run `supabase_streak_setup.sql`:
   - Copy the contents of `supabase_streak_setup.sql`
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Should see "Success. No rows returned" or similar

3. Run `supabase_notifications_setup.sql`:
   - Copy the contents of `supabase_notifications_setup.sql`
   - Paste into SQL Editor
   - Click "Run"
   - Should see "Success. No rows returned" or similar

### Option B: Enable RLS Manually (If tables exist but RLS is disabled)

If tables exist but RLS is not enabled, run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
```

---

## 📋 Step 4: Test RLS is Working (CRITICAL)

### Test with SQL Editor (Recommended)

1. **Create 2 Test Accounts:**
   - User A: test-a@example.com / password: test123
   - User B: test-b@example.com / password: test456

2. **Create Some Test Data:**
   - Log in as User A in your app
   - Create 2-3 journal entries
   - Log out
   - Log in as User B
   - Create 1-2 journal entries

3. **Test RLS in SQL Editor:**

   a. **Test as User A:**
   ```sql
   -- This will use your current session
   -- First, you need to set the role (this is tricky in SQL Editor)
   -- Better to test in the app itself (see below)
   ```

   b. **Test in Your App (Easier):**
   - Log in as User A
   - Note User A's journal entry IDs (check browser DevTools → Network → see API responses)
   - Log out
   - Log in as User B
   - Try to access User A's data (should fail - RLS blocks it)

### Test with Browser DevTools (Practical Test)

1. **Log in as User A:**
   - Open browser DevTools (F12)
   - Go to **Application** → **Local Storage** → `your-supabase-url`
   - Find the `auth-token` or session token
   - Copy User A's `user_id` from the token (or from Network tab when loading journals)

2. **Test Cross-User Access:**
   - Log in as User B
   - Open **Console** tab
   - Try to fetch User A's journals (should be blocked by RLS):
   ```javascript
   // This should return empty array (User B can't see User A's data)
   // The app already filters by user_id, so this is handled automatically
   ```

### Test with Two Browser Windows (Best Test)

1. **Window 1:** Log in as User A
   - Create a journal entry
   - Note the entry ID from Network tab

2. **Window 2 (Incognito):** Log in as User B
   - Try to manually edit User A's journal entry by ID
   - Should fail (RLS blocks it)

3. **Verify Data Isolation:**
   - User A should only see their own entries
   - User B should only see their own entries
   - Neither should see the other's data

---

## 📋 Step 5: Verify Policies Are Correct

### Check Policy SQL

In Supabase Dashboard → **Authentication** → **Policies**, verify each policy uses `auth.uid() = user_id`:

#### For `journal_entries`:
```sql
-- SELECT policy should be:
CREATE POLICY "Users can view own journals"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy should be:
CREATE POLICY "Users can insert own journals"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy should be:
CREATE POLICY "Users can update own journals"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE policy should be:
CREATE POLICY "Users can delete own journals"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);
```

#### For `streaks`:
```sql
-- SELECT policy should be:
CREATE POLICY "Users can view own streak"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE/ALL policy should be:
CREATE POLICY "Users can update own streak"
  ON streaks FOR ALL
  USING (auth.uid() = user_id);
```

#### For `user_preferences`:
```sql
-- SELECT policy should be:
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE/ALL policy should be:
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
```

---

## 📋 Step 6: Quick Verification Checklist

Use this checklist to verify RLS is working:

- [ ] `journal_entries` table has RLS enabled
- [ ] `journal_entries` has SELECT, INSERT, UPDATE, DELETE policies
- [ ] `streaks` table has RLS enabled
- [ ] `streaks` has SELECT and UPDATE policies
- [ ] `user_preferences` table has RLS enabled
- [ ] `user_preferences` has SELECT and UPDATE policies
- [ ] All policies use `auth.uid() = user_id` condition
- [ ] Tested with 2 accounts - data is isolated ✅
- [ ] User A cannot see User B's data ✅
- [ ] User B cannot see User A's data ✅

---

## 🔍 How to Check RLS Status in Supabase Dashboard

### Method 1: Table Editor

1. Go to **Table Editor**
2. Select a table (e.g., `journal_entries`)
3. Look for **RLS** indicator:
   - Green icon/badge = RLS enabled ✅
   - Gray icon/badge = RLS disabled ❌
4. Click on the table name to see details
5. Look for "RLS Enabled: Yes/No" in the table info

### Method 2: SQL Query

Run this SQL in SQL Editor to check RLS status:

```sql
-- Check RLS status for all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('journal_entries', 'streaks', 'user_preferences')
ORDER BY tablename;
```

Expected output:
```
schemaname | tablename          | rls_enabled
-----------|-------------------|-------------
public     | journal_entries   | true
public     | streaks           | true
public     | user_preferences  | true
```

If `rls_enabled` is `false` for any table, you need to enable it.

---

## 🔍 Check Policies Exist

Run this SQL to see all policies:

```sql
-- List all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('journal_entries', 'streaks', 'user_preferences')
ORDER BY tablename, policyname;
```

You should see multiple policies for each table.

---

## ❌ If RLS is NOT Enabled

If you find that RLS is disabled on any table:

### Option 1: Run the Setup SQL Files

1. Copy contents of `supabase_streak_setup.sql`
2. Paste into SQL Editor
3. Run it
4. Copy contents of `supabase_notifications_setup.sql`
5. Paste into SQL Editor
6. Run it

### Option 2: Enable RLS Manually

Run this SQL:

```sql
-- Enable RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Then create policies (see SQL setup files for policy definitions)
```

---

## ✅ Success Criteria

RLS is properly configured if:

1. ✅ All three tables have RLS enabled
2. ✅ Each table has appropriate policies (SELECT, INSERT, UPDATE, DELETE where needed)
3. ✅ All policies use `auth.uid() = user_id` condition
4. ✅ Tested with 2 accounts - data isolation works
5. ✅ Users can only see/modify their own data

---

## 🚨 What to Do If RLS is Missing

If RLS is not enabled or policies are missing:

1. **Run the SQL setup files** (see Step 3)
2. **Verify RLS is enabled** (see Step 2)
3. **Test data isolation** (see Step 4)
4. **If still not working**, check:
   - Are you using the correct Supabase project?
   - Are the table names correct?
   - Is your Supabase client properly configured?

---

## 📝 Notes

- **RLS is CRITICAL for security** - without it, users could potentially access other users' data
- **Always test with 2 accounts** to verify data isolation
- **Your app code already filters by `user_id`**, but RLS provides an additional security layer at the database level
- **RLS works at the database level**, so even if someone bypasses your app code, they still can't access other users' data

---

**Estimated Time:** 15 minutes

**Next Step:** After verifying RLS, test data isolation with 2 accounts to confirm everything works correctly.


