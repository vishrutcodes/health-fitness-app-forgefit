-- ============================================
-- ForgeFit Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Personal Records Table
CREATE TABLE personal_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  weight REAL NOT NULL,
  reps INTEGER NOT NULL DEFAULT 1,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Progress Records Table (body measurements)
CREATE TABLE progress_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  metric TEXT NOT NULL,
  value REAL NOT NULL,
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Enable Row Level Security
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_records ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies — users can only access their own data
CREATE POLICY "Users can view own PRs"
  ON personal_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own PRs"
  ON personal_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own PRs"
  ON personal_records FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress"
  ON progress_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON progress_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON progress_records FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Indexes for faster queries
CREATE INDEX idx_pr_user_id ON personal_records(user_id);
CREATE INDEX idx_pr_date ON personal_records(date DESC);
CREATE INDEX idx_progress_user_id ON progress_records(user_id);
CREATE INDEX idx_progress_date ON progress_records(date DESC);
