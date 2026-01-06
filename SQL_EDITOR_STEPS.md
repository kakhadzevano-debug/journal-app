# 📝 How to Run SQL in Supabase SQL Editor

**Step-by-step guide to check RLS status**

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Open SQL Editor
1. **Look at the LEFT SIDEBAR** in Supabase dashboard
2. **Find "SQL Editor"** (it's usually near the top, below "Table Editor")
3. **Click on "SQL Editor"**

### Step 2: Create New Query
1. **Look for a button** that says:
   - "New query" OR
   - "+" (plus icon) OR
   - "New" button
2. **Click it** to create a new SQL query tab

### Step 3: Paste the SQL
1. **Copy this SQL code:**

```sql
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity THEN 'ON ✅' 
    ELSE 'OFF ❌' 
  END as "RLS Status"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('journal_entries', 'streaks', 'user_preferences')
ORDER BY tablename;
```

2. **Paste it** into the SQL Editor text box

### Step 4: Run the Query
1. **Look for a "Run" button** (usually green, at the top or bottom)
2. **Click "Run"** 
   - OR press **Ctrl+Enter** (Windows)
   - OR press **Cmd+Enter** (Mac)

### Step 5: See Results
1. **Results will appear below** the SQL editor
2. **You'll see a table** with 2 columns:
   - `tablename` - The name of the table
   - `RLS Status` - Either "ON ✅" or "OFF ❌"

---

## 📊 WHAT YOU'LL SEE

### ✅ If Tables Exist and RLS is ON:
```
tablename          | RLS Status
-------------------|-----------
journal_entries    | ON ✅
streaks            | ON ✅
user_preferences   | ON ✅
```

### ❌ If RLS is OFF:
```
tablename          | RLS Status
-------------------|-----------
journal_entries    | OFF ❌
streaks            | OFF ❌
user_preferences   | OFF ❌
```

### ⚠️ If Tables Don't Exist:
```
(No rows returned)
```

---

## 🎯 QUICK SUMMARY

1. ✅ Click "SQL Editor" in left sidebar
2. ✅ Click "New query" button
3. ✅ Paste the SQL code
4. ✅ Click "Run" button (or Ctrl+Enter)
5. ✅ Check the results table

---

## ❓ TROUBLESHOOTING

**"I don't see SQL Editor"**
- Look in the left sidebar
- It might be under a menu (click the hamburger icon)
- It's usually near "Table Editor" or "Database"

**"I don't see a Run button"**
- Look at the top of the SQL editor
- Or try pressing **Ctrl+Enter** on your keyboard
- Some versions have a play icon ▶️ instead of "Run"

**"I see an error message"**
- Make sure you copied the entire SQL code
- Check for any typos
- Make sure you're in the right project

---

**Yes, run it in SQL Editor! Follow the steps above and tell me what results you get!** 🚀


