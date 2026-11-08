-- Page Tracking Schema for CV Banjar Indah
-- Creates tables and functions for tracking page visits and unique visitors

-- Create page_visits table
CREATE TABLE IF NOT EXISTS public.page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  referrer VARCHAR(1000),
  user_agent TEXT,
  device_type VARCHAR(50) CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  browser VARCHAR(50),
  os VARCHAR(50),
  ip_address INET,
  session_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique_visitors table
CREATE TABLE IF NOT EXISTS public.unique_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID UNIQUE NOT NULL,
  first_visit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_visit_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_visits INTEGER NOT NULL DEFAULT 1,
  device_type VARCHAR(50) CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  browser VARCHAR(50),
  os VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create upsert_visitor function
CREATE OR REPLACE FUNCTION public.upsert_visitor(p_visitor_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.unique_visitors (visitor_id, last_visit_at, total_visits)
  VALUES (p_visitor_id, NOW(), 1)
  ON CONFLICT (visitor_id) DO UPDATE
    SET last_visit_at = NOW(),
        total_visits = unique_visitors.total_visits + 1,
        updated_at = NOW();
END;
$$;

-- Enable RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unique_visitors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for page_visits
DROP POLICY IF EXISTS "Anyone can insert page visits" ON public.page_visits;
DROP POLICY IF EXISTS "Public can read aggregated page visit data" ON public.page_visits;
DROP POLICY IF EXISTS "Admin can manage page visits" ON public.page_visits;

CREATE POLICY "Anyone can insert page visits" ON public.page_visits
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can read aggregated page visit data" ON public.page_visits
  FOR SELECT TO anon, authenticated
  USING (EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE));

CREATE POLICY "Admin can manage page visits" ON public.page_visits
  FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

-- RLS Policies for unique_visitors
DROP POLICY IF EXISTS "Public can read visitor stats" ON public.unique_visitors;
DROP POLICY IF EXISTS "Admin can manage visitors" ON public.unique_visitors;

CREATE POLICY "Public can read visitor stats" ON public.unique_visitors
  FOR SELECT TO anon, authenticated
  USING (EXTRACT(YEAR FROM last_visit_at) = EXTRACT(YEAR FROM CURRENT_DATE));

CREATE POLICY "Admin can manage visitors" ON public.unique_visitors
  FOR ALL TO authenticated USING (public.is_active_admin()) WITH CHECK (public.is_active_admin());

-- Grant execute permission on upsert_visitor function
REVOKE ALL ON FUNCTION public.upsert_visitor(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_visitor(UUID) TO anon, authenticated;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON public.page_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_visits_session_id ON public.page_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_page_url ON public.page_visits(page_url);
CREATE INDEX IF NOT EXISTS idx_unique_visitors_last_visit ON public.unique_visitors(last_visit_at DESC);
CREATE INDEX IF NOT EXISTS idx_unique_visitors_visitor_id ON public.unique_visitors(visitor_id);

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER set_page_visits_updated_at
  BEFORE UPDATE ON public.page_visits
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE TRIGGER set_unique_visitors_updated_at
  BEFORE UPDATE ON public.unique_visitors
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Seed some demo data (optional)
INSERT INTO public.unique_visitors (visitor_id, total_visits)
SELECT 
  gen_random_uuid(),
  FLOOR(RANDOM() * 10) + 1
FROM generate_series(1, 5)
ON CONFLICT DO NOTHING;