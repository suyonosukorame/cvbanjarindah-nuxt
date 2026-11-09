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
-- STEP 5: Pastikan RLS (Row Level Security) aktif
-- ============================================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 6: Drop semua policy lama lalu buat ulang dengan benar
-- ============================================================================

-- Policy: Siapapun yang sudah auth bisa INSERT dirinya sendiri (untuk signup)
DROP POLICY IF EXISTS "Users can insert own profile"           ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated users can insert profile" ON public.admin_users;
CREATE POLICY "Users can insert own profile" ON public.admin_users
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- Policy: User bisa baca profil dirinya sendiri
DROP POLICY IF EXISTS "Users can view own profile" ON public.admin_users;
CREATE POLICY "Users can view own profile" ON public.admin_users
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Policy: Super Admin bisa baca SEMUA user (termasuk pending)
DROP POLICY IF EXISTS "Super admin can view all users" ON public.admin_users;
CREATE POLICY "Super admin can view all users" ON public.admin_users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users sa
      WHERE sa.id = auth.uid()
        AND sa.role = 'super_admin'
        AND sa.is_active = true
    )
  );

-- Policy: Super Admin bisa UPDATE semua user (untuk approve)
DROP POLICY IF EXISTS "Super admin can update all users" ON public.admin_users;
CREATE POLICY "Super admin can update all users" ON public.admin_users
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users sa
      WHERE sa.id = auth.uid()
        AND sa.role = 'super_admin'
        AND sa.is_active = true
    )
  );

-- Policy: Super Admin bisa DELETE user
DROP POLICY IF EXISTS "Super admin can delete users" ON public.admin_users;
CREATE POLICY "Super admin can delete users" ON public.admin_users
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users sa
      WHERE sa.id = auth.uid()
        AND sa.role = 'super_admin'
        AND sa.is_active = true
    )
  );

-- Policy: User bisa UPDATE profil dirinya sendiri (email, nama, dll)
DROP POLICY IF EXISTS "Users can update own profile" ON public.admin_users;
CREATE POLICY "Users can update own profile" ON public.admin_users
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

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

