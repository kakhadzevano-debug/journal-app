-- Streak Tracking Database Setup for Journal App
-- Run this SQL in your Supabase SQL Editor

-- Ensure journal_entries table has created_at column
ALTER TABLE journal_entries 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Create streaks table
CREATE TABLE IF NOT EXISTS streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_journal_created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Security policies
CREATE POLICY "Users can view own streak"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own streak"
  ON streaks FOR ALL
  USING (auth.uid() = user_id);

