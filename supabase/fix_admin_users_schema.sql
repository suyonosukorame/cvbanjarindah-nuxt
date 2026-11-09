-- ============================================================================
-- FIX: admin_users schema untuk mendukung Opsi B (pending approval flow)
-- Jalankan script ini di Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/husyookxqozeowihrgbx/sql/new
-- ============================================================================

-- ============================================================================
-- STEP 1: Tambah kolom yang belum ada (safe - pakai IF NOT EXISTS)
-- ============================================================================
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS jabatan    VARCHAR(100);
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS departemen VARCHAR(100);
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS status     VARCHAR(50) NOT NULL DEFAULT 'active';

-- ============================================================================
-- STEP 2: Update CHECK constraint pada kolom 'role'
-- (tambahkan 'employee' dan 'director', 'manager' yang sebelumnya tidak ada)
-- ============================================================================
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_role_check
  CHECK (role IN ('super_admin', 'director', 'manager', 'employee', 'admin', 'editor'));

-- ============================================================================
-- STEP 3: Tambah CHECK constraint pada kolom 'status'
-- ============================================================================
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_status_check;
ALTER TABLE public.admin_users ADD CONSTRAINT admin_users_status_check
  CHECK (status IN ('active', 'pending', 'inactive', 'on_leave', 'terminated'));

-- ============================================================================
-- STEP 4: Index untuk performa query dashboard
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_admin_users_status    ON public.admin_users(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_role      ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON public.admin_users(is_active);

-- ============================================================================
-- STEP 5: Hapus SEMUA policy lama pada admin_users secara dinamis
-- (Memastikan tidak ada policy rekursif lama yang tertinggal di Supabase)
-- ============================================================================
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'admin_users' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.admin_users', pol.policyname);
    END LOOP;
END $$;

-- Fungsi Helper SECURITY DEFINER untuk pengecekan Super Admin (Update & Delete)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
  );
$$;

REVOKE ALL ON FUNCTION public.is_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_initial_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  current_user_id UUID := auth.uid();
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Login diperlukan untuk mengklaim admin pertama.';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('cvbanjarindah_initial_super_admin'));

  IF EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE role = 'super_admin' AND is_active = true
  ) THEN
    RETURN false;
  END IF;

  INSERT INTO public.admin_users (id, email, full_name, role, is_active, status)
  SELECT id, email, raw_user_meta_data ->> 'full_name', 'super_admin', true, 'active'
  FROM auth.users
  WHERE id = current_user_id
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.admin_users.full_name),
        role = 'super_admin',
        is_active = true,
        status = 'active',
        updated_at = NOW();

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_initial_super_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_initial_super_admin() TO authenticated;

-- Pastikan RLS aktif pada admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Pasang Policy Baru (Bebas Rekursi 100%)
-- ============================================================================

-- Policy 1: Pendaftaran hanya dapat membuat profil staf yang masih menunggu.
CREATE POLICY "Allow authenticated insert own profile" ON public.admin_users
  FOR INSERT TO authenticated
  WITH CHECK (
    id = auth.uid()
    AND role = 'employee'
    AND status = 'pending'
    AND is_active = false
  );

-- Policy 2: Pengguna membaca profilnya sendiri; Super Admin membaca semua akun.
CREATE POLICY "Super admins can read admin users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_super_admin());

-- Policy 3: Hanya Super Admin yang boleh mengubah profil/status pengguna.
CREATE POLICY "Super admins can update admin users" ON public.admin_users
  FOR UPDATE TO authenticated
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Policy 4: Hanya Super Admin yang boleh DELETE user
CREATE POLICY "Allow delete only super admin" ON public.admin_users
  FOR DELETE TO authenticated
  USING (public.is_super_admin());

-- ============================================================================
-- STEP 7: Sinkronisasi akun yang sudah terdaftar di auth.users tapi belum ada di admin_users
-- (Memulihkan user yang sempat daftar tapi profilnya tidak tersimpan)
-- ============================================================================
INSERT INTO public.admin_users (id, email, full_name, role, status, is_active, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1)),
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.admin_users WHERE role = 'super_admin') THEN 'super_admin'
    ELSE 'employee'
  END,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.admin_users WHERE role = 'super_admin') THEN 'active'
    ELSE 'pending'
  END,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.admin_users WHERE role = 'super_admin') THEN true
    ELSE false
  END,
  au.created_at,
  NOW()
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_users adm WHERE adm.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 8: Verifikasi — Tampilkan semua data admin_users saat ini
-- ============================================================================
SELECT
  id,
  email,
  full_name,
  role,
  status,
  is_active,
  departemen,
  jabatan,
  created_at
FROM public.admin_users
ORDER BY created_at DESC;

