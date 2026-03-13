-- Profiles table to store user metadata
CREATE TABLE profiles (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  skills TEXT[] DEFAULT '{}',
  preferred_role TEXT,
  location TEXT,
  experience_level TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table to store scraped job listings
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  description TEXT,
  apply_url TEXT UNIQUE,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved jobs table for user bookmarks
CREATE TABLE saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- RLS (Row Level Security) Policies

-- Profiles: Users can only read/write their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Jobs: Everyone can read jobs, but only service-role/admin can insert (system handles scraping)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view jobs" ON jobs FOR SELECT USING (true);

-- Saved Jobs: Users can only manage their own saved jobs
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
