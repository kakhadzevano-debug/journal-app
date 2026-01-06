# 🔒 How to Check RLS Status in Supabase

**Step-by-step guide to verify Row Level Security is enabled**

---

## 📋 STEP 1: Open Supabase Dashboard

1. **Go to:** https://app.supabase.com
2. **Sign in** with your Supabase account
3. **Select your project** from the dashboard
   - Look for your project name (e.g., "Voice Journal" or your project name)

---

## 📋 STEP 2: Navigate to Table Editor

1. **In the left sidebar**, look for these sections:
   - Table Editor
   - Database
   - Authentication
   - etc.

2. **Click on "Table Editor"** (or "Database" → "Tables")
   - This shows all your database tables

---

## 📋 STEP 3: Check RLS Status

You should see a list of tables. Look for these 3 tables:

### Table 1: `journal_entries`
1. **Find the row** with table name `journal_entries`
2. **Look at the "RLS" column** (usually near the right side)
3. **Check the status:**
   - ✅ **ON** (green badge/indicator) = Good! RLS is enabled
   - ❌ **OFF** (red/gray badge) = Problem! RLS needs to be enabled

### Table 2: `streaks`
1. **Find the row** with table name `streaks`
2. **Look at the "RLS" column**
3. **Check the status:**
   - ✅ **ON** = Good!
   - ❌ **OFF** = Needs to be enabled

### Table 3: `user_preferences`
1. **Find the row** with table name `user_preferences`
2. **Look at the "RLS" column**
3. **Check the status:**
   - ✅ **ON** = Good!
   - ❌ **OFF** = Needs to be enabled

---

## 📋 STEP 4: What You Should See

### ✅ CORRECT (RLS Enabled):
```
Table Name          | RLS    | ...
--------------------|--------|----
journal_entries     | ON ✅  | ...
streaks             | ON ✅  | ...
user_preferences    | ON ✅  | ...
```

### ❌ INCORRECT (RLS Disabled):
```
Table Name          | RLS    | ...
--------------------|--------|----
journal_entries     | OFF ❌ | ...
streaks             | OFF ❌ | ...
user_preferences    | OFF ❌ | ...
```

---

## 📋 STEP 5: If RLS is OFF (How to Enable)

If any table shows **RLS = OFF**, you need to enable it:

### Option A: Enable via SQL Editor (Recommended)

1. **Click "SQL Editor"** in the left sidebar
2. **Click "New query"**
3. **Copy and paste this SQL:**

```sql
-- Enable RLS on journal_entries
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Enable RLS on streaks
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
```

4. **Click "Run"** (or press Ctrl+Enter)
5. **Wait for success message**
6. **Go back to Table Editor** and verify RLS is now ON

### Option B: Enable via Table Settings

1. **Click on the table name** (e.g., `journal_entries`)
2. **Look for "Settings" or "Table Settings"**
3. **Find "Row Level Security" toggle**
4. **Turn it ON**
5. **Repeat for other tables**

---

## 📋 STEP 6: Verify Policies Exist

Even if RLS is ON, you need policies. Let's check:

1. **Click "SQL Editor"** in left sidebar
2. **Click "New query"**
3. **Copy and paste this SQL:**

```sql
-- Check policies for journal_entries
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'journal_entries';

-- Check policies for streaks
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'streaks';

-- Check policies for user_preferences
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'user_preferences';
```

4. **Click "Run"**
5. **Check results:**
   - ✅ Should see policies listed (SELECT, INSERT, UPDATE, DELETE)
   - ❌ If empty, policies are missing

---

## 📋 STEP 7: If Policies Are Missing

If the query above shows no policies, you need to create them:

1. **Go to SQL Editor**
2. **Run the SQL from these files:**
   - `supabase_streak_setup.sql` (for streaks table)
   - `supabase_notifications_setup.sql` (for user_preferences table)
   - Check if you have SQL for journal_entries policies

**Or create policies manually:**

```sql
-- Policies for journal_entries
CREATE POLICY "Users can view own journals"
  ON journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own journals"
  ON journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals"
  ON journal_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals"
  ON journal_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for streaks (if not already created)
CREATE POLICY "Users can view own streak"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON streaks FOR ALL
  USING (auth.uid() = user_id);

-- Policies for user_preferences (if not already created)
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);
```

---

## ✅ FINAL CHECKLIST

After following all steps, verify:

- [ ] `journal_entries` table shows **RLS = ON**
- [ ] `streaks` table shows **RLS = ON**
- [ ] `user_preferences` table shows **RLS = ON**
- [ ] Policies exist for all 3 tables (checked via SQL query)
- [ ] All policies use `auth.uid() = user_id` (users can only access their own data)

---

## 🎯 WHAT TO REPORT BACK

After checking, tell me:

**✅ "All 3 tables show RLS = ON"** → Ready to proceed!

**🟡 "RLS is ON but I'm not sure about policies"** → I'll help verify policies

**🔴 "One or more tables show RLS = OFF"** → I'll help enable it

**❓ "I can't find the Table Editor"** → I'll provide alternative instructions

---

## 📸 VISUAL GUIDE (What to Look For)

### In Table Editor:
```
┌─────────────────────┬──────┬─────────────┐
│ Table Name          │ RLS  │ ...         │
├─────────────────────┼──────┼─────────────┤
│ journal_entries     │ ON ✅│ ...         │
│ streaks             │ ON ✅│ ...         │
│ user_preferences    │ ON ✅│ ...         │
└─────────────────────┴──────┴─────────────┘
```

### RLS Column Indicators:
- **Green badge/checkmark** = ON ✅
- **Red badge/X** = OFF ❌
- **Gray/empty** = OFF ❌

---

**Ready? Go to https://app.supabase.com and follow the steps above!**


