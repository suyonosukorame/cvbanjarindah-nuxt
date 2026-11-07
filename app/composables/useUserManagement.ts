/**
 * useUserManagement Composable
 * Handles user invitation, registration, and management
 */

export interface InvitationForm {
  email: string
  full_name?: string
  role: 'director' | 'manager' | 'employee'
  jabatan?: string
  departemen?: string
  nip?: string
}

export interface UserListItem {
  id: string
  full_name: string
  email: string
  role: string
  jabatan?: string
  departemen?: string
  status: string
  is_active: boolean
  last_login?: string
}

export const useUserManagement = () => {
  const { $supabase } = useNuxtApp()
  const { user } = useAuth()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  /**
   * Invite new user via email
   */
  const inviteUser = async (form: InvitationForm) => {
    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')
      if (!user.value) throw new Error('User tidak ditemukan')

      // Generate secure token
      const token = crypto.getRandomValues(new Uint8Array(32))
      const tokenHex = Array.from(token)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      // Create invitation record
      const { error: inviteError } = await $supabase
        .from('user_invitations')
        .insert({
          email: form.email,
          full_name: form.full_name || '',
          role: form.role,
          jabatan: form.jabatan,
          departemen: form.departemen,
          nip: form.nip,
          token: tokenHex,
          invited_by: user.value.id,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })

      if (inviteError) throw inviteError

      // TODO: Send invitation email with link:
      // /admin/register?token={tokenHex}
      // This would integrate with email service (SendGrid, Resend, etc)

      successMessage.value = `Undangan berhasil dikirim ke ${form.email}`
      return { token: tokenHex, email: form.email }
    } catch (err: any) {
      error.value = err.message || 'Gagal mengirim undangan'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Complete user registration via invitation token
   */
  const completeRegistration = async (
    token: string,
    fullName: string,
    password: string
  ) => {
    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')

      // Get invitation
      const { data: invitation, error: inviteError } = await $supabase
        .from('user_invitations')
        .select('*')
        .eq('token', token)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (inviteError) throw inviteError
      if (!invitation) throw new Error('Undangan tidak valid atau sudah kadaluarsa')

      // Create auth user
      const { data: authData, error: authError } = await $supabase.auth.signUp({
        email: invitation.email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Gagal membuat akun')

      // Create admin_users record
      const { error: profileError } = await $supabase
        .from('admin_users')
        .insert({
          id: authData.user.id,
          email: invitation.email,
          full_name: fullName,
          role: invitation.role,
          jabatan: invitation.jabatan,
          departemen: invitation.departemen,
          nip: invitation.nip,
          is_active: true,
          status: 'active',
          created_by: invitation.invited_by,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) throw profileError

      // Mark invitation as used
      const { error: updateError } = await $supabase
        .from('user_invitations')
        .update({
          is_used: true,
          used_at: new Date().toISOString(),
          used_by: authData.user.id
        })
        .eq('id', invitation.id)

      if (updateError) throw updateError

      successMessage.value = 'Akun berhasil dibuat!'
      return authData.user
    } catch (err: any) {
      error.value = err.message || 'Gagal menyelesaikan pendaftaran'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get list of all users
   */
  const getUsers = async (filters?: {
    role?: string
    departemen?: string
    status?: string
  }): Promise<UserListItem[]> => {
    loading.value = true
    error.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')

      let query = $supabase
        .from('admin_users')
        .select(
          'id, full_name, email, role, jabatan, departemen, status, is_active, last_login'
        )
        .order('created_at', { ascending: false })

      if (filters?.role) {
        query = query.eq('role', filters.role)
      }
      if (filters?.departemen) {
        query = query.eq('departemen', filters.departemen)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error: queryError } = await query

      if (queryError) throw queryError
      return (data || []) as UserListItem[]
    } catch (err: any) {
      error.value = err.message || 'Gagal mengambil data pengguna'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * Get single user details
   */
  const getUser = async (userId: string) => {
    loading.value = true
    error.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')

      const { data, error: queryError } = await $supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (queryError) throw queryError
      return data
    } catch (err: any) {
      error.value = err.message || 'Gagal mengambil data pengguna'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Update user details
   */
  const updateUser = async (
    userId: string,
    updates: Partial<UserListItem & { jabatan?: string; departemen?: string; nip?: string; supervisor_id?: string }>
  ) => {
    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')

      const { error: updateError } = await $supabase
        .from('admin_users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      successMessage.value = 'Data pengguna berhasil diperbarui'
      return true
    } catch (err: any) {
      error.value = err.message || 'Gagal memperbarui data pengguna'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Deactivate user
   */
  const deactivateUser = async (userId: string) => {
    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')

      const { error: updateError } = await $supabase
        .from('admin_users')
        .update({
          is_active: false,
          status: 'inactive',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      successMessage.value = 'Pengguna berhasil dinonaktifkan'
      return true
    } catch (err: any) {
      error.value = err.message || 'Gagal menonaktifkan pengguna'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete user
   */
  const deleteUser = async (userId: string) => {
    loading.value = true
    error.value = null
    successMessage.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')

      const { error: deleteError } = await $supabase
        .from('admin_users')
        .delete()
        .eq('id', userId)

      if (deleteError) throw deleteError

      successMessage.value = 'Pengguna berhasil dihapus'
      return true
    } catch (err: any) {
      error.value = err.message || 'Gagal menghapus pengguna'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Get invitation by token
   */
  const getInvitationByToken = async (token: string) => {
    loading.value = true
    error.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')

      const { data, error: queryError } = await $supabase
        .from('user_invitations')
        .select('*')
        .eq('token', token)
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (queryError) throw queryError
      if (!data) throw new Error('Undangan tidak valid atau sudah kadaluarsa')

      return data
    } catch (err: any) {
      error.value = err.message || 'Gagal mengambil data undangan'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Get pending invitations
   */
  const getPendingInvitations = async () => {
    loading.value = true
    error.value = null

    try {
      if (!$supabase) throw new Error('Supabase tidak tersedia')

      const { data, error: queryError } = await $supabase
        .from('user_invitations')
        .select('*')
        .eq('is_used', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (queryError) throw queryError
      return data || []
    } catch (err: any) {
      error.value = err.message || 'Gagal mengambil data undangan'
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    successMessage: readonly(successMessage),
    inviteUser,
    completeRegistration,
    getUsers,
    getUser,
    updateUser,
    deactivateUser,
    deleteUser,
    getInvitationByToken,
    getPendingInvitations
  }
}
