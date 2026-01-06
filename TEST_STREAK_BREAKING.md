# 🧪 Detailed Guide: Testing Streak Breaking Mechanism

This guide walks you through testing your streak system without waiting a full day.

---

## 📋 Prerequisites

- Access to your Supabase Dashboard
- Your journal app running locally
- A logged-in account in your app

---

## 🎯 Step-by-Step Testing Process

### **STEP 1: Check Your Current Streak**

First, let's see what your current streak looks like.

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Log in to your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run this query to see your current streak:**
   ```sql
   SELECT 
     user_id,
     current_streak,
     longest_streak,
     last_journal_created_at,
     updated_at
   FROM streaks 
   WHERE user_id = auth.uid();
   ```

4. **What you'll see:**
   - `current_streak`: Your current streak number
   - `longest_streak`: Your best streak ever
   - `last_journal_created_at`: When you last created a journal (this is what we'll modify)
   - `updated_at`: When the streak was last updated

**📝 Note down these values** - you might want to restore them later!

---

### **STEP 2: Test Scenario 1 - Broken Streak (Reset to 1)**

This tests what happens when you skip a day (2+ days gap).

#### 2.1: Set the timestamp to 2 days ago

1. **In SQL Editor, run this:**
   ```sql
   UPDATE streaks 
   SET last_journal_created_at = NOW() - INTERVAL '2 days'
   WHERE user_id = auth.uid();
   ```

2. **Verify it worked:**
   ```sql
   SELECT 
     current_streak,
     last_journal_created_at,
     NOW() - last_journal_created_at AS time_ago
   FROM streaks 
   WHERE user_id = auth.uid();
   ```
   
   You should see `time_ago` showing approximately 2 days.

#### 2.2: Create a new journal entry

1. **Go to your app** (http://localhost:3000)
2. **Click "Start Journaling"** or navigate to `/journal`
3. **Fill out a journal entry:**
   - Add some text (any content)
   - Set a rating
   - Click "Save & Finish"

#### 2.3: Check the result

1. **Go back to home page**
2. **Check your streak** - it should now show **1** (reset from previous value)
3. **Verify in database:**
   ```sql
   SELECT 
     current_streak,
     longest_streak,
     last_journal_created_at
   FROM streaks 
   WHERE user_id = auth.uid();
   ```
   
   **Expected results:**
   - ✅ `current_streak` = 1
   - ✅ `last_journal_created_at` = today's timestamp
   - ✅ `longest_streak` = unchanged (unless this was your first streak)

---

### **STEP 3: Test Scenario 2 - Consecutive Days (Increment)**

This tests what happens when you journal on consecutive days.

#### 3.1: Set the timestamp to yesterday

1. **In SQL Editor, run:**
   ```sql
   UPDATE streaks 
   SET 
     last_journal_created_at = NOW() - INTERVAL '1 day',
     current_streak = 5  -- Set a test streak value
   WHERE user_id = auth.uid();
   ```

2. **Verify:**
   ```sql
   SELECT 
     current_streak,
     last_journal_created_at
   FROM streaks 
   WHERE user_id = auth.uid();
   ```
   
   Should show `current_streak = 5` and `last_journal_created_at` = yesterday

#### 3.2: Create a new journal entry

1. **In your app**, create another journal entry
2. **Save it**

#### 3.3: Check the result

1. **Check home page** - streak should be **6** (5 + 1)
2. **Verify in database:**
   ```sql
   SELECT 
     current_streak,
     longest_streak
   FROM streaks 
   WHERE user_id = auth.uid();
   ```
   
   **Expected results:**
   - ✅ `current_streak` = 6 (incremented from 5)
   - ✅ `longest_streak` = 6 (if 6 > previous longest)

---

### **STEP 4: Test Scenario 3 - Same Day (No Change)**

This tests that multiple journals on the same day don't increase the streak.

#### 4.1: Set timestamp to today

1. **In SQL Editor:**
   ```sql
   UPDATE streaks 
   SET 
     last_journal_created_at = NOW(),
     current_streak = 3
   WHERE user_id = auth.uid();
   ```

#### 4.2: Create another journal entry

1. **In your app**, create a new journal entry
2. **Save it**

#### 4.3: Check the result

1. **Check home page** - streak should still be **3** (not 4)
2. **Verify in database:**
   ```sql
   SELECT current_streak FROM streaks WHERE user_id = auth.uid();
   ```
   
   **Expected results:**
   - ✅ `current_streak` = 3 (unchanged)
   - ✅ `last_journal_created_at` = updated to latest timestamp

---

### **STEP 5: Test Scenario 4 - New Personal Record**

Test that longest streak updates correctly.

#### 5.1: Set up scenario

1. **In SQL Editor:**
   ```sql
   UPDATE streaks 
   SET 
     last_journal_created_at = NOW() - INTERVAL '1 day',
     current_streak = 9,
     longest_streak = 8  -- Current streak will exceed longest
   WHERE user_id = auth.uid();
   ```

#### 5.2: Create journal entry

1. **Create a new journal** in your app

#### 5.3: Check the result

1. **Check home page** - should show streak = 10
2. **Verify in database:**
   ```sql
   SELECT 
     current_streak,
     longest_streak
   FROM streaks 
   WHERE user_id = auth.uid();
   ```
   
   **Expected results:**
   - ✅ `current_streak` = 10
   - ✅ `longest_streak` = 10 (updated from 8)
   - ✅ You should see a celebration message in the app!

---

## 🔄 Complete Testing Checklist

Run through all scenarios in order:

- [ ] **Scenario 1**: Broken streak (2+ days) → Resets to 1
- [ ] **Scenario 2**: Consecutive days (yesterday) → Increments by 1
- [ ] **Scenario 3**: Same day → Stays the same
- [ ] **Scenario 4**: New record → Longest streak updates
- [ ] **Scenario 5**: First journal ever → Starts at 1

---

## 🧹 Cleanup: Reset to Normal

After testing, you can reset your streak to a normal state:

```sql
-- Option 1: Reset completely (start fresh)
UPDATE streaks 
SET 
  current_streak = 0,
  longest_streak = 0,
  last_journal_created_at = NULL
WHERE user_id = auth.uid();

-- Option 2: Set to realistic values
UPDATE streaks 
SET 
  current_streak = 1,
  longest_streak = 1,
  last_journal_created_at = NOW()
WHERE user_id = auth.uid();
```

---

## 🐛 Troubleshooting

### Problem: Query returns no rows
**Solution:** You might not have a streak record yet. Create a journal entry first, then try again.

### Problem: Can't update - permission denied
**Solution:** Make sure you're logged in to Supabase and using `auth.uid()` in your queries.

### Problem: Streak not updating after SQL change
**Solution:** 
1. Make sure you're updating the correct user_id
2. Check that `last_journal_created_at` actually changed
3. Try refreshing the app page

### Problem: Want to test with a specific date
**Solution:** Use a specific timestamp instead of intervals:
```sql
UPDATE streaks 
SET last_journal_created_at = '2024-01-15 10:00:00'::timestamp
WHERE user_id = auth.uid();
```

---

## 📊 Quick Reference: SQL Commands

### View current streak
```sql
SELECT * FROM streaks WHERE user_id = auth.uid();
```

### Set to 2 days ago (test broken streak)
```sql
UPDATE streaks 
SET last_journal_created_at = NOW() - INTERVAL '2 days'
WHERE user_id = auth.uid();
```

### Set to yesterday (test consecutive)
```sql
UPDATE streaks 
SET last_journal_created_at = NOW() - INTERVAL '1 day'
WHERE user_id = auth.uid();
```

### Set to today (test same day)
```sql
UPDATE streaks 
SET last_journal_created_at = NOW()
WHERE user_id = auth.uid();
```

### Reset everything
```sql
UPDATE streaks 
SET 
  current_streak = 0,
  longest_streak = 0,
  last_journal_created_at = NULL
WHERE user_id = auth.uid();
```

---

## ✅ Success Criteria

After running all tests, you should verify:

1. ✅ **Broken streak** correctly resets to 1
2. ✅ **Consecutive days** correctly increments
3. ✅ **Same day** doesn't change streak
4. ✅ **Longest streak** updates when exceeded
5. ✅ **UI shows correct values** on home page
6. ✅ **Toast messages** appear correctly (streak increased, reset, etc.)
7. ✅ **Celebrations** trigger for milestones (7, 30, 100 days)

---

## 💡 Pro Tips

1. **Keep a backup:** Before testing, note your current streak values
2. **Test one scenario at a time:** Don't mix scenarios
3. **Check both UI and database:** Verify the app matches the database
4. **Test edge cases:** What if streak is 0? What if longest is higher?
5. **Test on different days:** Try setting dates to different calendar days

---

## 🎯 Next Steps

After testing:
1. Reset your streak to normal values
2. Test the actual daily flow (create journal each day)
3. Verify streak works correctly in production

---

**Happy Testing! 🚀**


