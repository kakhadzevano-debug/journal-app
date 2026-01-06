-- ============================================
-- QUICK REFERENCE: Streak Testing SQL Queries
-- Copy and paste these into Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: VIEW YOUR CURRENT STREAK
-- ============================================
-- Run this first to see your current streak data
SELECT 
  user_id,
  current_streak,
  longest_streak,
  last_journal_created_at,
  updated_at,
  NOW() - last_journal_created_at AS time_since_last_journal
FROM streaks 
WHERE user_id = auth.uid();

-- ============================================
-- TEST SCENARIO 1: BROKEN STREAK (Reset to 1)
-- ============================================
-- This simulates skipping a day (2+ days gap)
-- Expected: Streak resets to 1 when you create a new journal

-- Set last journal to 2 days ago
UPDATE streaks 
SET last_journal_created_at = NOW() - INTERVAL '2 days'
WHERE user_id = auth.uid();

-- Verify it worked
SELECT 
  current_streak,
  last_journal_created_at,
  NOW() - last_journal_created_at AS time_ago
FROM streaks 
WHERE user_id = auth.uid();

-- After creating a journal, check result:
SELECT 
  current_streak,
  longest_streak,
  last_journal_created_at
FROM streaks 
WHERE user_id = auth.uid();
-- Expected: current_streak = 1

-- ============================================
-- TEST SCENARIO 2: CONSECUTIVE DAYS (Increment)
-- ============================================
-- This simulates journaling on consecutive days
-- Expected: Streak increments by 1

-- Set last journal to yesterday and set a test streak
UPDATE streaks 
SET 
  last_journal_created_at = NOW() - INTERVAL '1 day',
  current_streak = 5  -- Change this to any number you want to test
WHERE user_id = auth.uid();

-- Verify
SELECT 
  current_streak,
  last_journal_created_at
FROM streaks 
WHERE user_id = auth.uid();

-- After creating a journal, check result:
SELECT 
  current_streak,
  longest_streak
FROM streaks 
WHERE user_id = auth.uid();
-- Expected: current_streak = 6 (5 + 1)

-- ============================================
-- TEST SCENARIO 3: SAME DAY (No Change)
-- ============================================
-- This simulates creating multiple journals on the same day
-- Expected: Streak stays the same

-- Set last journal to today
UPDATE streaks 
SET 
  last_journal_created_at = NOW(),
  current_streak = 3  -- Set any test value
WHERE user_id = auth.uid();

-- Verify
SELECT 
  current_streak,
  last_journal_created_at
FROM streaks 
WHERE user_id = auth.uid();

-- After creating a journal, check result:
SELECT current_streak FROM streaks WHERE user_id = auth.uid();
-- Expected: current_streak = 3 (unchanged)

-- ============================================
-- TEST SCENARIO 4: NEW PERSONAL RECORD
-- ============================================
-- This tests that longest_streak updates correctly
-- Expected: longest_streak updates when current exceeds it

-- Set up scenario where current will exceed longest
UPDATE streaks 
SET 
  last_journal_created_at = NOW() - INTERVAL '1 day',
  current_streak = 9,
  longest_streak = 8  -- Current will exceed this
WHERE user_id = auth.uid();

-- After creating a journal, check result:
SELECT 
  current_streak,
  longest_streak
FROM streaks 
WHERE user_id = auth.uid();
-- Expected: current_streak = 10, longest_streak = 10

-- ============================================
-- TEST SCENARIO 5: FIRST JOURNAL EVER
-- ============================================
-- This tests the first journal creation
-- Expected: Streak starts at 1

-- Reset completely
UPDATE streaks 
SET 
  current_streak = 0,
  longest_streak = 0,
  last_journal_created_at = NULL
WHERE user_id = auth.uid();

-- Or delete and let it auto-create:
-- DELETE FROM streaks WHERE user_id = auth.uid();

-- After creating a journal, check result:
SELECT 
  current_streak,
  longest_streak
FROM streaks 
WHERE user_id = auth.uid();
-- Expected: current_streak = 1, longest_streak = 1

-- ============================================
-- CLEANUP: Reset to Normal State
-- ============================================

-- Option 1: Reset to fresh start
UPDATE streaks 
SET 
  current_streak = 0,
  longest_streak = 0,
  last_journal_created_at = NULL
WHERE user_id = auth.uid();

-- Option 2: Set to realistic starting values
UPDATE streaks 
SET 
  current_streak = 1,
  longest_streak = 1,
  last_journal_created_at = NOW()
WHERE user_id = auth.uid();

-- ============================================
-- ADVANCED: Test with Specific Dates
-- ============================================

-- Set to a specific date (e.g., 3 days ago)
UPDATE streaks 
SET last_journal_created_at = NOW() - INTERVAL '3 days'
WHERE user_id = auth.uid();

-- Set to a specific timestamp
UPDATE streaks 
SET last_journal_created_at = '2024-01-15 10:00:00'::timestamp
WHERE user_id = auth.uid();

-- ============================================
-- UTILITY: Check All Your Data
-- ============================================

-- View your streak data
SELECT * FROM streaks WHERE user_id = auth.uid();

-- View your journal entries (to see created_at timestamps)
SELECT 
  id,
  date,
  created_at,
  updated_at
FROM journal_entries 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If you get "no rows returned", create a journal entry first
-- Then run the queries again

-- If you get permission errors, make sure you're logged in
-- and using auth.uid() in your queries

-- To see all users' streaks (if you have admin access):
-- SELECT * FROM streaks;


