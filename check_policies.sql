-- Check if RLS policies exist for all tables
-- Run this in Supabase SQL Editor

-- Check policies for journal_entries
SELECT 
  tablename,
  policyname,
  cmd as command,
  CASE 
    WHEN qual::text LIKE '%auth.uid()%' THEN '✅ Correct (uses auth.uid())'
    ELSE '⚠️ Check condition'
  END as policy_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'journal_entries'
ORDER BY cmd;

-- Check policies for streaks
SELECT 
  tablename,
  policyname,
  cmd as command,
  CASE 
    WHEN qual::text LIKE '%auth.uid()%' THEN '✅ Correct (uses auth.uid())'
    ELSE '⚠️ Check condition'
  END as policy_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'streaks'
ORDER BY cmd;

-- Check policies for user_preferences
SELECT 
  tablename,
  policyname,
  cmd as command,
  CASE 
    WHEN qual::text LIKE '%auth.uid()%' THEN '✅ Correct (uses auth.uid())'
    ELSE '⚠️ Check condition'
  END as policy_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'user_preferences'
ORDER BY cmd;

-- Summary: Count policies per table
SELECT 
  tablename,
  COUNT(*) as policy_count,
  STRING_AGG(cmd::text, ', ' ORDER BY cmd) as commands
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('journal_entries', 'streaks', 'user_preferences')
GROUP BY tablename
ORDER BY tablename;


