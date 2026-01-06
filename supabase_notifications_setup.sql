-- Notification Preferences Setup for Journal App
-- Run this SQL in your Supabase SQL Editor

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_enabled BOOLEAN DEFAULT false,
  notification_hour INTEGER DEFAULT 9,
  notification_minute INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Security policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR ALL
  USING (auth.uid() = user_id);


