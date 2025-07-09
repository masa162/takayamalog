-- Create auth schema extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin user profile table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" 
ON profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND p.role = 'admin'
  )
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    CASE 
      WHEN NEW.email = 'admin@takayamalog.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update profile updated_at
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profile updates
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profile_updated_at();

-- Create function to check if current user is admin
CREATE OR REPLACE FUNCTION current_user_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create sessions table for tracking admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Enable RLS on admin_sessions
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admin sessions policies
CREATE POLICY "Admin can view their own sessions" 
ON admin_sessions FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Admin can manage their own sessions" 
ON admin_sessions FOR ALL 
USING (user_id = auth.uid());

-- Create function to log admin session
CREATE OR REPLACE FUNCTION log_admin_session(
  session_ip INET,
  session_user_agent TEXT
)
RETURNS UUID AS $$
DECLARE
  session_id UUID;
BEGIN
  -- Only allow if user is admin
  IF NOT current_user_is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  INSERT INTO admin_sessions (user_id, ip_address, user_agent)
  VALUES (auth.uid(), session_ip, session_user_agent)
  RETURNING id INTO session_id;

  RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update session activity
CREATE OR REPLACE FUNCTION update_session_activity(session_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE admin_sessions 
  SET last_activity = NOW()
  WHERE id = session_id
  AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default categories
INSERT INTO categories (name, slug, description, article_type, color, sort_order) VALUES
('店舗型風俗', 'soap-health', 'ソープランドやヘルスなどの店舗型風俗の体験談', 'fuzoku', '#ef4444', 1),
('デリヘル', 'delivery', 'デリヘルの体験談', 'fuzoku', '#f97316', 2),
('出会い系・マッチング', 'dating', '出会い系サイトやマッチングアプリの体験談', 'fuzoku', '#eab308', 3),
('新作レビュー', 'new-release', '最新のFANZA動画レビュー', 'fanza', '#22c55e', 4),
('女優特集', 'actress', 'AV女優の特集記事', 'fanza', '#06b6d4', 5),
('ジャンル別', 'genre', 'ジャンル別の動画分析', 'fanza', '#3b82f6', 6),
('トレンド分析', 'trend', '業界のトレンドや動向分析', 'research', '#8b5cf6', 7),
('市場調査', 'market', '市場調査レポート', 'research', '#ec4899', 8)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample admin profile if not exists
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@takayamalog.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "高山まさあき"}'::jsonb
)
ON CONFLICT (email) DO NOTHING;