-- OPSI 2: Multi-Level User Management System
-- Adds role hierarchy, permissions, and user invitations
-- Run after admin_schema.sql

-- ============================================================================
-- STEP 1: Update admin_users table with new fields
-- ============================================================================

ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS jabatan VARCHAR(100);
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS departemen VARCHAR(100);
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS nip VARCHAR(50) UNIQUE;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS alamat TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS tanggal_lahir DATE;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave', 'terminated'));
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS supervisor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Update role constraint to include new roles
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_role_check CHECK (role IN ('super_admin', 'director', 'manager', 'employee', 'admin', 'editor'));

CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_departemen ON public.admin_users(departemen);
CREATE INDEX IF NOT EXISTS idx_admin_users_status ON public.admin_users(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_supervisor ON public.admin_users(supervisor_id);

-- ============================================================================
-- STEP 2: Create role_permissions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  can_create_users BOOLEAN DEFAULT false,
  can_delete_users BOOLEAN DEFAULT false,
  can_edit_users BOOLEAN DEFAULT false,
  can_view_reports BOOLEAN DEFAULT false,
  can_manage_content BOOLEAN DEFAULT false,
  can_manage_roles BOOLEAN DEFAULT false,
  can_manage_departments BOOLEAN DEFAULT false,
  can_view_all_data BOOLEAN DEFAULT false,
  can_export_data BOOLEAN DEFAULT false,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.role_permissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Insert default role permissions
INSERT INTO public.role_permissions (role, description, can_create_users, can_delete_users, can_edit_users, can_view_reports, can_manage_content, can_manage_roles, can_manage_departments, can_view_all_data, can_export_data)
VALUES
  ('super_admin', 'Super Administrator - Full system access', true, true, true, true, true, true, true, true, true),
  ('director', 'Director - Can manage team and view reports', false, false, false, true, true, false, false, false, true),
  ('manager', 'Manager - Can manage subordinates and view reports', false, false, false, true, false, false, false, false, false),
  ('employee', 'Employee - Can view personal data only', false, false, false, false, false, false, false, false, false)
ON CONFLICT (role) DO UPDATE SET
  description = EXCLUDED.description,
  can_create_users = EXCLUDED.can_create_users,
  can_delete_users = EXCLUDED.can_delete_users,
  can_edit_users = EXCLUDED.can_edit_users,
  can_view_reports = EXCLUDED.can_view_reports,
  can_manage_content = EXCLUDED.can_manage_content,
  can_manage_roles = EXCLUDED.can_manage_roles,
  can_manage_departments = EXCLUDED.can_manage_departments,
  can_view_all_data = EXCLUDED.can_view_all_data,
  can_export_data = EXCLUDED.can_export_data;

-- ============================================================================
-- STEP 3: Create user_invitations table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('director', 'manager', 'employee')),
  jabatan VARCHAR(100),
  departemen VARCHAR(100),
  nip VARCHAR(50),
  token VARCHAR(255) UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT false,
  invited_by UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  used_at TIMESTAMPTZ,
  used_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_token ON public.user_invitations(token);
CREATE INDEX IF NOT EXISTS idx_user_invitations_is_used ON public.user_invitations(is_used);
CREATE INDEX IF NOT EXISTS idx_user_invitations_expires ON public.user_invitations(expires_at);

-- ============================================================================
-- STEP 4: Create audit_logs table (optional, for tracking changes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  table_name VARCHAR(100),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================================================
-- STEP 5: Enable RLS on new tables
-- ============================================================================

ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Create RLS Policies for role_permissions
-- ============================================================================

DROP POLICY IF EXISTS "Public read role permissions" ON public.role_permissions;
CREATE POLICY "Public read role permissions" ON public.role_permissions
  FOR SELECT USING (true);

-- ============================================================================
-- STEP 7: Create RLS Policies for user_invitations
-- ============================================================================

DROP POLICY IF EXISTS "Super admin can manage all invitations" ON public.user_invitations;
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.user_invitations;

CREATE POLICY "Super admin can manage all invitations" ON public.user_invitations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

CREATE POLICY "Users can view their own invitations" ON public.user_invitations
  FOR SELECT TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ============================================================================
-- STEP 8: Create RLS Policies for audit_logs
-- ============================================================================

DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Super admin can view all audit logs" ON public.audit_logs;

CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admin can view all audit logs" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
    )
  );

-- ============================================================================
-- STEP 9: Helper Functions
-- ============================================================================

-- Function: Get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS VARCHAR(50)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.admin_users WHERE id = user_id AND is_active = true;
$$;

-- Function: Check if user has permission
CREATE OR REPLACE FUNCTION public.has_permission(user_id UUID, permission_name VARCHAR)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN permission_name = 'create_users' THEN
      (SELECT can_create_users FROM public.role_permissions
       WHERE role = (SELECT role FROM public.admin_users WHERE id = user_id AND is_active = true))
    WHEN permission_name = 'delete_users' THEN
      (SELECT can_delete_users FROM public.role_permissions
       WHERE role = (SELECT role FROM public.admin_users WHERE id = user_id AND is_active = true))
    WHEN permission_name = 'edit_users' THEN
      (SELECT can_edit_users FROM public.role_permissions
       WHERE role = (SELECT role FROM public.admin_users WHERE id = user_id AND is_active = true))
    WHEN permission_name = 'view_reports' THEN
      (SELECT can_view_reports FROM public.role_permissions
       WHERE role = (SELECT role FROM public.admin_users WHERE id = user_id AND is_active = true))
    WHEN permission_name = 'manage_content' THEN
      (SELECT can_manage_content FROM public.role_permissions
       WHERE role = (SELECT role FROM public.admin_users WHERE id = user_id AND is_active = true))
    WHEN permission_name = 'manage_roles' THEN
      (SELECT can_manage_roles FROM public.role_permissions
       WHERE role = (SELECT role FROM public.admin_users WHERE id = user_id AND is_active = true))
    WHEN permission_name = 'view_all_data' THEN
      (SELECT can_view_all_data FROM public.role_permissions
       WHERE role = (SELECT role FROM public.admin_users WHERE id = user_id AND is_active = true))
    ELSE false
  END;
$$;

-- Function: Create audit log entry
CREATE OR REPLACE FUNCTION public.log_audit(
  p_user_id UUID,
  p_action VARCHAR,
  p_table_name VARCHAR,
  p_record_id UUID,
  p_old_values JSONB,
  p_new_values JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, table_name, record_id, old_values, new_values)
  VALUES (p_user_id, p_action, p_table_name, p_record_id, p_old_values, p_new_values)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_user_role(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
REVOKE ALL ON FUNCTION public.has_permission(UUID, VARCHAR) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_permission(UUID, VARCHAR) TO authenticated;
REVOKE ALL ON FUNCTION public.log_audit(UUID, VARCHAR, VARCHAR, UUID, JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.log_audit(UUID, VARCHAR, VARCHAR, UUID, JSONB, JSONB) TO authenticated;

-- ============================================================================
-- STEP 10: Grant permissions to authenticated users
-- ============================================================================

GRANT SELECT ON public.role_permissions TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;

-- ============================================================================
-- Done! Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Create backend composables (useUserManagement, enhanced useAuth)
-- 3. Create frontend pages (/admin/users, /admin/register, etc)
-- ============================================================================
