-- Simple Page Tracking Schema for CV Banjar Indah
-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.unique_visitors CASCADE;
DROP TABLE IF EXISTS public.page_visits CASCADE;
DROP FUNCTION IF EXISTS public.upsert_visitor CASCADE;

-- Create page_visits table
CREATE TABLE public.page_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  referrer VARCHAR(1000),
  user_agent TEXT,
  device_type VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  ip_address INET,
  session_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique_visitors table
CREATE TABLE public.unique_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID UNIQUE NOT NULL,
  first_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_visit TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_visits INTEGER NOT NULL DEFAULT 1,
  device_type VARCHAR(50),
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
  INSERT INTO public.unique_visitors (visitor_id, last_visit, total_visits)
  VALUES (p_visitor_id, NOW(), 1)
  ON CONFLICT (visitor_id) DO UPDATE
    SET last_visit = NOW(),
        total_visits = unique_visitors.total_visits + 1,
        updated_at = NOW();
END;
$$;

-- Enable RLS
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unique_visitors ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies
DROP POLICY IF EXISTS "insert_page_visits" ON public.page_visits;
CREATE POLICY "insert_page_visits" ON public.page_visits
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "select_page_visits" ON public.page_visits;
CREATE POLICY "select_page_visits" ON public.page_visits
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "select_unique_visitors" ON public.unique_visitors;
CREATE POLICY "select_unique_visitors" ON public.unique_visitors
  FOR SELECT TO anon, authenticated USING (true);

-- Grant execute permission on upsert_visitor function
REVOKE ALL ON FUNCTION public.upsert_visitor(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.upsert_visitor(UUID) TO anon, authenticated;

-- Create basic indexes
CREATE INDEX idx_page_visits_created_at ON public.page_visits(created_at DESC);
CREATE INDEX idx_page_visits_session_id ON public.page_visits(session_id);
CREATE INDEX idx_unique_visitors_visitor_id ON public.unique_visitors(visitor_id);