import type { User } from '@supabase/supabase-js';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  role: 'super_admin' | 'director' | 'manager' | 'employee';
  jabatan?: string;
  departemen?: string;
  is_active: boolean;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
}

export interface UserPermissions {
  can_create_users: boolean;
  can_delete_users: boolean;
  can_edit_users: boolean;
  can_view_reports: boolean;
  can_manage_content: boolean;
  can_manage_roles: boolean;
  can_view_all_data: boolean;
  can_export_data: boolean;
}

export const useAuth = () => {
  const { $supabase } = useNuxtApp();
  const user = useState<AdminUser | null>('admin-user', () => null);
  const userRole = useState<string | null>('admin-user-role', () => null);
  const userPermissions = useState<UserPermissions | null>('admin-user-permissions', () => null);
  const loading = useState('admin-auth-loading', () => false);
  const isInitialized = useState('admin-auth-init', () => false);

  const checkAuth = async (skipCache = false) => {
    if (!$supabase) return null;
    
    if (!skipCache && isInitialized.value && user.value) {
      return user.value;
    }

    try {
      const { data: sessionData, error: sessionError } = await $supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!sessionData.session?.user) {
        user.value = null;
        userRole.value = null;
        userPermissions.value = null;
        isInitialized.value = true;
        return null;
      }

      // Check admin profile
      const { data: adminProfile, error: profileError } = await $supabase
        .from('admin_users')
        .select(`
          id,
          email,
          full_name,
          role,
          jabatan,
          departemen,
          is_active,
          status
        `)
        .eq('id', sessionData.session.user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;

      if (!adminProfile) {
        user.value = null;
        userRole.value = null;
        userPermissions.value = null;
        isInitialized.value = true;
        return null;
      }

      if (!adminProfile.is_active) {
        user.value = null;
        userRole.value = null;
        userPermissions.value = null;
        isInitialized.value = true;
        return null;
      }

      // Get role permissions
      const { data: permissions, error: permError } = await $supabase
        .from('role_permissions')
        .select(`
          can_create_users,
          can_delete_users,
          can_edit_users,
          can_view_reports,
          can_manage_content,
          can_manage_roles,
          can_view_all_data,
          can_export_data
        `)
        .eq('role', adminProfile.role)
        .maybeSingle();

      if (permError) throw permError;

      user.value = adminProfile as AdminUser;
      userRole.value = adminProfile.role;
      userPermissions.value = permissions || null;
      isInitialized.value = true;
      
      return user.value;
    } catch (error) {
      user.value = null;
      userRole.value = null;
      userPermissions.value = null;
      isInitialized.value = true;
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    if (!$supabase) throw new Error('Konfigurasi Supabase belum tersedia.');

    loading.value = true;
    try {
      const { data, error } = await $supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check admin status specifically
      const { data: profile } = await $supabase
        .from('admin_users')
        .select('id, is_active, status')
        .eq('id', data.user.id)
        .maybeSingle();

      if (!profile) {
        await $supabase.auth.signOut();
        throw new Error('Akun ini belum terdaftar di sistem portal admin.');
      }

      if (!profile.is_active || profile.status === 'pending') {
        await $supabase.auth.signOut();
        throw new Error('Akun Anda masih menunggu persetujuan (approval) dari Super Admin sebelum dapat masuk.');
      }

      const adminUser = await checkAuth(true);
      return adminUser;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    if (!$supabase) return;

    loading.value = true;
    try {
      const { error } = await $supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
      userRole.value = null;
      userPermissions.value = null;
      await navigateTo('/admin/login');
    } finally {
      loading.value = false;
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return userPermissions.value?.[permission] === true || false;
  };

  const canViewPage = (requiredRoles: string[]): boolean => {
    return userRole.value ? requiredRoles.includes(userRole.value) : false;
  };

  return {
    user,
    userRole,
    userPermissions,
    loading,
    login,
    logout,
    checkAuth,
    hasPermission,
    canViewPage
  };
};