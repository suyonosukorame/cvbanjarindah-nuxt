-- =====================================================
-- WEBSITE STATISTICS TRACKING SCHEMA
-- For CV Banjar Indah Website
-- =====================================================

-- =====================================================
-- 1. PAGE VISITS TABLE
-- Tracks every page view with timestamp and metadata
-- =====================================================

CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  browser TEXT,
  os TEXT,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id UUID,
  
  -- Indexes for faster queries
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_page_visits_visited_at ON page_visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_url ON page_visits(page_url);
CREATE INDEX IF NOT EXISTS idx_page_visits_session_id ON page_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_country ON page_visits(country);

-- Add comment
COMMENT ON TABLE page_visits IS 'Stores every page visit with metadata for analytics';

-- =====================================================
-- 2. UNIQUE VISITORS TABLE
-- Tracks unique visitors with their first and last visit
-- =====================================================

CREATE TABLE IF NOT EXISTS unique_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID UNIQUE NOT NULL, -- Generated from fingerprint or cookie
  first_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_visits INTEGER DEFAULT 1,
  ip_address INET,
  country TEXT,
  city TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_unique_visitors_visitor_id ON unique_visitors(visitor_id);
CREATE INDEX IF NOT EXISTS idx_unique_visitors_first_visit ON unique_visitors(first_visit DESC);
CREATE INDEX IF NOT EXISTS idx_unique_visitors_last_visit ON unique_visitors(last_visit DESC);

-- Add comment
COMMENT ON TABLE unique_visitors IS 'Stores unique visitors identified by fingerprint or cookie';

-- =====================================================
-- 3. DAILY STATS TABLE (Aggregated)
-- Pre-aggregated daily statistics for faster dashboard queries
-- =====================================================

CREATE TABLE IF NOT EXISTS daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE UNIQUE NOT NULL,
  total_visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  mobile_visits INTEGER DEFAULT 0,
  desktop_visits INTEGER DEFAULT 0,
  tablet_visits INTEGER DEFAULT 0,
  top_page TEXT,
  top_country TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(stat_date DESC);

-- Add comment
COMMENT ON TABLE daily_stats IS 'Pre-aggregated daily statistics for faster queries';

-- =====================================================
-- 4. FUNCTIONS
-- Helper functions for stats management
-- =====================================================

-- Function to update visitor last visit time
CREATE OR REPLACE FUNCTION update_visitor_last_visit()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating updated_at
CREATE TRIGGER trigger_update_visitor_timestamp
  BEFORE UPDATE ON unique_visitors
  FOR EACH ROW
  EXECUTE FUNCTION update_visitor_last_visit();

-- Function to upsert visitor (insert or update)
CREATE OR REPLACE FUNCTION upsert_visitor(
  p_visitor_id UUID,
  p_ip_address INET DEFAULT NULL,
  p_country TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO unique_visitors (visitor_id, ip_address, country, city)
  VALUES (p_visitor_id, p_ip_address, p_country, p_city)
  ON CONFLICT (visitor_id) 
  DO UPDATE SET
    last_visit = NOW(),
    total_visits = unique_visitors.total_visits + 1,
    updated_at = NOW()
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get total stats
CREATE OR REPLACE FUNCTION get_total_stats()
RETURNS TABLE(
  total_visits BIGINT,
  unique_visitors BIGINT,
  today_visits BIGINT,
  today_visitors BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT AS total_visits,
    (SELECT COUNT(DISTINCT visitor_id)::BIGINT FROM unique_visitors) AS unique_visitors,
    (SELECT COUNT(*)::BIGINT FROM page_visits WHERE visited_at >= CURRENT_DATE) AS today_visits,
    (SELECT COUNT(*)::BIGINT FROM unique_visitors WHERE last_visit >= CURRENT_DATE) AS today_visitors;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable public read access, admin write access
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to INSERT visits (for tracking)
CREATE POLICY "Allow anonymous insert visits"
  ON page_visits
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow anonymous users to SELECT count (for displaying stats)
CREATE POLICY "Allow anonymous select count visits"
  ON page_visits
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow authenticated users full access
CREATE POLICY "Allow authenticated full access visits"
  ON page_visits
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow anonymous users to INSERT/UPDATE visitors
CREATE POLICY "Allow anonymous upsert visitors"
  ON unique_visitors
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update visitors"
  ON unique_visitors
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Policy: Allow anonymous users to SELECT count visitors
CREATE POLICY "Allow anonymous select count visitors"
  ON unique_visitors
  FOR SELECT
  TO anon
  USING (true);

-- Policy: Allow authenticated users full access visitors
CREATE POLICY "Allow authenticated full access visitors"
  ON unique_visitors
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Allow all users to read daily stats
CREATE POLICY "Allow all read daily_stats"
  ON daily_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Only authenticated can write daily stats
CREATE POLICY "Allow authenticated write daily_stats"
  ON daily_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 6. SAMPLE DATA (Optional - for testing)
-- Uncomment to insert sample data
-- =====================================================

-- Insert sample visits
-- INSERT INTO page_visits (page_url, page_title, device_type, browser, country, city) VALUES
-- ('/', 'Home - CV Banjar Indah', 'desktop', 'Chrome', 'Indonesia', 'Jakarta'),
-- ('/produk', 'Produk - CV Banjar Indah', 'mobile', 'Safari', 'Indonesia', 'Surabaya'),
-- ('/tentang', 'Tentang - CV Banjar Indah', 'desktop', 'Firefox', 'Indonesia', 'Bandung'),
-- ('/area', 'Area - CV Banjar Indah', 'tablet', 'Chrome', 'Indonesia', 'Medan'),
-- ('/kontak', 'Kontak - CV Banjar Indah', 'mobile', 'Chrome', 'Indonesia', 'Semarang');

-- Insert sample unique visitors
-- INSERT INTO unique_visitors (visitor_id, country, city, total_visits) VALUES
-- (gen_random_uuid(), 'Indonesia', 'Jakarta', 5),
-- (gen_random_uuid(), 'Indonesia', 'Surabaya', 3),
-- (gen_random_uuid(), 'Indonesia', 'Bandung', 8),
-- (gen_random_uuid(), 'Indonesia', 'Medan', 2),
-- (gen_random_uuid(), 'Indonesia', 'Semarang', 1);

-- =====================================================
-- 7. VIEWS FOR ANALYTICS
-- Pre-built views for common analytics queries
-- =====================================================

-- View: Today's stats
CREATE OR REPLACE VIEW view_today_stats AS
SELECT 
  COUNT(*)::INTEGER AS today_visits,
  COUNT(DISTINCT session_id)::INTEGER AS today_sessions,
  COUNT(DISTINCT ip_address)::INTEGER AS today_unique_ips
FROM page_visits
WHERE visited_at >= CURRENT_DATE;

-- View: Top pages (last 30 days)
CREATE OR REPLACE VIEW view_top_pages AS
SELECT 
  page_url,
  page_title,
  COUNT(*)::INTEGER AS visit_count,
  COUNT(DISTINCT session_id)::INTEGER AS unique_sessions
FROM page_visits
WHERE visited_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY page_url, page_title
ORDER BY visit_count DESC
LIMIT 10;

-- View: Visitor growth (last 30 days)
CREATE OR REPLACE VIEW view_visitor_growth AS
SELECT 
  DATE(visited_at) AS visit_date,
  COUNT(*)::INTEGER AS total_visits,
  COUNT(DISTINCT session_id)::INTEGER AS unique_sessions
FROM page_visits
WHERE visited_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(visited_at)
ORDER BY visit_date DESC;

-- View: Device breakdown
CREATE OR REPLACE VIEW view_device_stats AS
SELECT 
  device_type,
  COUNT(*)::INTEGER AS visit_count,
  ROUND((COUNT(*)::NUMERIC / (SELECT COUNT(*) FROM page_visits) * 100), 2) AS percentage
FROM page_visits
GROUP BY device_type
ORDER BY visit_count DESC;

-- View: Top countries
CREATE OR REPLACE VIEW view_top_countries AS
SELECT 
  country,
  COUNT(*)::INTEGER AS visit_count,
  COUNT(DISTINCT session_id)::INTEGER AS unique_sessions
FROM page_visits
WHERE country IS NOT NULL
GROUP BY country
ORDER BY visit_count DESC
LIMIT 10;

-- =====================================================
-- GRANTS (Make sure anon role can access)
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT ON page_visits TO anon;
GRANT SELECT, INSERT, UPDATE ON unique_visitors TO anon;
GRANT SELECT ON daily_stats TO anon;
GRANT EXECUTE ON FUNCTION upsert_visitor TO anon;
GRANT EXECUTE ON FUNCTION get_total_stats TO anon;

-- Grant authenticated users full access
GRANT ALL ON page_visits TO authenticated;
GRANT ALL ON unique_visitors TO authenticated;
GRANT ALL ON daily_stats TO authenticated;

-- =====================================================
-- COMPLETED!
-- Execute this entire file in Supabase SQL Editor
-- =====================================================

-- Quick test query
SELECT 
  'Schema created successfully!' AS status,
  (SELECT COUNT(*) FROM page_visits) AS total_visits,
  (SELECT COUNT(*) FROM unique_visitors) AS unique_visitors;
