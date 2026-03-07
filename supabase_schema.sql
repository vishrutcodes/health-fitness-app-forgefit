-- ForgeFit: Complete Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ═══════════════════════════════════════════════════════
-- TABLE 1: user_profiles — stores user profile + login info
-- ═══════════════════════════════════════════════════════
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  last_login TIMESTAMPTZ DEFAULT now(),
  login_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ═══════════════════════════════════════════════════════
-- TABLE 2: personal_records — PR entries (best lifts)
-- ═══════════════════════════════════════════════════════
CREATE TABLE personal_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_name TEXT NOT NULL,
  weight_kg DECIMAL(6,2) NOT NULL,
  reps INTEGER NOT NULL DEFAULT 1,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own records"
  ON personal_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records"
  ON personal_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records"
  ON personal_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records"
  ON personal_records FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_pr_user_exercise ON personal_records(user_id, exercise_name, logged_at);

-- ═══════════════════════════════════════════════════════
-- TABLE 3: progress_logs — workout session tracking
-- ═══════════════════════════════════════════════════════
CREATE TABLE progress_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_type TEXT NOT NULL,
  duration_minutes INTEGER,
  notes TEXT,
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'tired', 'bad')),
  body_weight_kg DECIMAL(5,2),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON progress_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs"
  ON progress_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs"
  ON progress_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own logs"
  ON progress_logs FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_progress_user ON progress_logs(user_id, logged_at);
