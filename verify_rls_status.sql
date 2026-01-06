-- RLS Verification and Setup Script
-- Run this in Supabase SQL Editor to check RLS status and set it up if needed

-- ============================================
-- STEP 1: Check RLS Status for All Tables
-- ============================================

-- Check if RLS is enabled on each table
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('journal_entries', 'streaks', 'user_preferences')
ORDER BY tablename;

-- ============================================
-- STEP 2: Check Existing Policies
-- ============================================

-- List all RLS policies for your tables
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  CASE 
    WHEN qual IS NOT NULL THEN qual::text
    ELSE 'N/A'
  END as policy_condition
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('journal_entries', 'streaks', 'user_preferences')
ORDER BY tablename, policyname;

-- ============================================
-- STEP 3: Enable RLS (Run only if needed)
-- ============================================

-- Uncomment and run these if RLS is not enabled:

-- Enable RLS on journal_entries (if not already enabled)
-- ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Enable RLS on streaks (if not already enabled)
-- ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_preferences (if not already enabled)
-- ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create Policies for journal_entries (if needed)
-- ============================================

-- Uncomment and run if journal_entries doesn't have policies:

-- Drop existing policies if they exist (optional - only if you need to recreate)
-- DROP POLICY IF EXISTS "Users can view own journals" ON journal_entries;
-- DROP POLICY IF EXISTS "Users can insert own journals" ON journal_entries;
-- DROP POLICY IF EXISTS "Users can update own journals" ON journal_entries;
-- DROP POLICY IF EXISTS "Users can delete own journals" ON journal_entries;

-- Create SELECT policy (users can view their own journals)
-- CREATE POLICY "Users can view own journals"
--   ON journal_entries FOR SELECT
--   USING (auth.uid() = user_id);

-- Create INSERT policy (users can insert their own journals)
-- CREATE POLICY "Users can insert own journals"
--   ON journal_entries FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- Create UPDATE policy (users can update their own journals)
-- CREATE POLICY "Users can update own journals"
--   ON journal_entries FOR UPDATE
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- Create DELETE policy (users can delete their own journals)
-- CREATE POLICY "Users can delete own journals"
--   ON journal_entries FOR DELETE
--   USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Summary Query (Run after setup)
-- ============================================

-- Verify everything is set up correctly
SELECT 
  'journal_entries' as table_name,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'journal_entries'

UNION ALL

SELECT 
  'streaks' as table_name,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'streaks'

UNION ALL

SELECT 
  'user_preferences' as table_name,
  COUNT(*) as policy_count,
  STRING_AGG(policyname, ', ' ORDER BY policyname) as policies
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'user_preferences';


