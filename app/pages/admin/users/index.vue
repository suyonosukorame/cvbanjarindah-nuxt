<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Manajemen Pengguna</h1>
        <p class="text-slate-600 mt-1">Kelola staf, hak akses, dan persetujuan akun admin</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchUsers"
          :disabled="loading"
          class="flex items-center justify-center gap-2 px-3.5 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': loading }">refresh</span>
          Segarkan
        </button>

      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
          <span class="material-symbols-outlined text-2xl">group</span>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Pengguna</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-0.5">{{ users.length }}</h3>
        </div>
      </div>

      <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
          <span class="material-symbols-outlined text-2xl">verified_user</span>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Pengguna Aktif</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-0.5">{{ activeUsersCount }}</h3>
        </div>
      </div>

      <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-4" :class="{ 'border-amber-300 bg-amber-50/40': pendingUsersCount > 0 }">
        <div class="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
          <span class="material-symbols-outlined text-2xl" :class="{ 'animate-bounce': pendingUsersCount > 0 }">pending_actions</span>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-amber-700">Menunggu Persetujuan</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-0.5">{{ pendingUsersCount }}</h3>
        </div>
      </div>
    </div>

    <!-- Alert Messages -->
    <MoleculesAlert
      v-if="successMessage"
      type="success"
      variant="left-accent"
      :message="successMessage"
      closeable
      @close="successMessage = ''"
    />
    <MoleculesAlert
      v-if="errorMessage"
      type="error"
      variant="left-accent"
      :message="errorMessage"
      closeable
      @close="errorMessage = ''"
    />

    <!-- Users Table -->
    <div v-if="users.length > 0">
      <OrganismsUserManagementTable
        :users="users"
        :roles="availableRoles"
        :loading="loading"
        @selection-change="selectedUsers = $event"
      >
        <template #rowActions="{ user }">
          <div class="flex items-center justify-center gap-2">
            <!-- Quick Approve Button for Pending Users -->
            <button
              v-if="user.status === 'pending' || !user.is_active"
              @click="openApproveModal(user)"
              class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition shadow-xs"
              title="Setujui dan aktifkan pengguna ini"
            >
              <span class="material-symbols-outlined text-sm">check</span>
              Setujui
            </button>

            <!-- Edit Button -->
            <button
              @click="editUser(user)"
              class="text-primary hover:text-orange-600 font-medium text-sm transition-colors px-1"
              title="Edit pengguna"
            >
              Edit
            </button>

            <!-- Delete Button -->
            <button
              @click="confirmDelete(user)"
              class="text-red-600 hover:text-red-700 font-medium text-sm transition-colors px-1"
              title="Hapus pengguna"
            >
              Hapus
            </button>
          </div>
        </template>

        <template #bulkActions="{ selectedUsers: selected }">
          <button
            @click="showBulkDeleteConfirm = true"
            class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
          >
            Hapus Dipilih ({{ selected.length }})
          </button>
        </template>
      </OrganismsUserManagementTable>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="space-y-4">
      <MoleculesEmptyState
        icon="person"
        title="Belum ada pengguna"
        description="Belum ada data admin terdaftar. Pengguna baru dapat mendaftar melalui halaman pendaftaran dan menunggu persetujuan Super Admin."
        variant="info"
      />

      <!-- Debug Panel: tampil hanya jika ada fetchError -->
      <MoleculesAlert
        v-if="fetchError"
        type="warning"
        variant="card"
        title="Info Debug (Hanya terlihat oleh Admin)"
        description="Tabel admin_users kosong atau RLS memblokir query. Jalankan SQL migration fix_admin_users_schema.sql di Supabase SQL Editor jika diperlukan."
        :details="fetchError"
        details-title="Lihat detail error teknis"
      />
    </div>

    <!-- Approve User Modal -->
    <ApproveUserModal
      :visible="showApproveModal"
      :user="userToApprove"
      :loading="approveLoading"
      @close="showApproveModal = false"
      @approve="handleApproveSubmit"
    />

    <!-- Delete Confirmation -->
    <MoleculesConfirmDialog
      :visible="showDeleteConfirm"
      title="Hapus Pengguna"
      :message="`Apakah Anda yakin ingin menghapus pengguna ${userToDelete?.name || userToDelete?.email}? Tindakan ini tidak dapat dibatalkan.`"
      :loading="deleteLoading"
      @confirm="handleDeleteUser"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Bulk Delete Confirmation -->
    <MoleculesConfirmDialog
      :visible="showBulkDeleteConfirm"
      title="Hapus Pengguna Terpilih"
      :message="`Apakah Anda yakin ingin menghapus ${selectedUsers.size} pengguna yang dipilih? Tindakan ini tidak dapat dibatalkan.`"
      :loading="bulkDeleteLoading"
      @confirm="handleBulkDelete"
      @cancel="showBulkDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import ApproveUserModal from '~/components/molecules/ApproveUserModal.vue';

definePageMeta({
  middleware: 'auth',
  layout: 'admin'
});

useHead({ title: 'Manajemen Pengguna | CV Banjar Indah' });

const { $supabase } = useNuxtApp();

interface AdminUserRow {
  id: string
  name: string
  email: string
  role: string
  status: string
  is_active: boolean
  departemen?: string
  jabatan?: string
  created_at?: string
  avatar_url?: string
}

const users = ref<AdminUserRow[]>([]);
const loading = ref(false);
const fetchError = ref<string | null>(null);
const showApproveModal = ref(false);
const userToApprove = ref<AdminUserRow | null>(null);
const approveLoading = ref(false);

const showDeleteConfirm = ref(false);
const showBulkDeleteConfirm = ref(false);
const userToDelete = ref<AdminUserRow | null>(null);
const selectedUsers = ref(new Set<string>());
const deleteLoading = ref(false);
const bulkDeleteLoading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const availableRoles = ['super_admin', 'admin', 'manager', 'editor', 'employee', 'staff'];

const activeUsersCount = computed(() => {
  return users.value.filter(u => u.is_active && u.status === 'active').length;
});

const pendingUsersCount = computed(() => {
  return users.value.filter(u => !u.is_active || u.status === 'pending').length;
});

onMounted(async () => {
  await fetchUsers();
});

// Fetch users directly from Supabase admin_users table
const fetchUsers = async () => {
  if (!$supabase) {
    errorMessage.value = 'Koneksi database belum terhubung.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  fetchError.value = null;

  try {
    const { data, error } = await $supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    users.value = (data || []).map((u: any) => ({
      id: u.id,
      name: u.full_name || u.email?.split('@')[0] || 'Pengguna',
      email: u.email,
      role: u.role || 'employee',
      status: u.status || (u.is_active ? 'active' : 'pending'),
      is_active: Boolean(u.is_active),
      departemen: u.departemen || '',
      jabatan: u.jabatan || '',
      created_at: u.created_at,
      avatar_url: u.avatar_url || ''
    }));

    // Jika data kosong, simpan info untuk debug panel
    if (users.value.length === 0) {
      fetchError.value = 'Query berhasil tapi data kosong. Kemungkinan:\n' +
        '1. RLS policy memblokir SELECT (jalankan fix_admin_users_schema.sql)\n' +
        '2. Belum ada user yang berhasil mendaftar (insert ke admin_users gagal)\n' +
        '3. Schema kolom status/role belum diperbarui';
    }
  } catch (error: any) {
    const errMsg = error.message || 'Gagal memuat data pengguna dari Supabase.';
    errorMessage.value = errMsg;
    fetchError.value = `Code: ${error.code || 'unknown'}\nMessage: ${errMsg}\nDetails: ${error.details || '-'}\nHint: ${error.hint || '-'}`;
    console.error('Failed to fetch users:', error);
  } finally {
    loading.value = false;
  }
};

// Open approval modal
const openApproveModal = (user: AdminUserRow) => {
  userToApprove.value = user;
  showApproveModal.value = true;
};

// Handle approval submission
const handleApproveSubmit = async (payload: { id: string; role: string; departemen?: string; jabatan?: string }) => {
  if (!$supabase) return;

  approveLoading.value = true;
  try {
    const { error } = await $supabase
      .from('admin_users')
      .update({
        is_active: true,
        status: 'active',
        role: payload.role,
        departemen: payload.departemen || null,
        jabatan: payload.jabatan || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.id);

    if (error) throw error;

    successMessage.value = `Akun ${userToApprove.value?.name || userToApprove.value?.email} berhasil disetujui dan diaktifkan dengan role ${payload.role}!`;
    showApproveModal.value = false;
    userToApprove.value = null;
    await fetchUsers();
  } catch (error: any) {
    errorMessage.value = error.message || 'Gagal menyetujui pengguna.';
    console.error('Failed to approve user:', error);
  } finally {
    approveLoading.value = false;
  }
};

const confirmDelete = (user: AdminUserRow) => {
  userToDelete.value = user;
  showDeleteConfirm.value = true;
};

// Delete user directly from Supabase
const handleDeleteUser = async () => {
  if (!userToDelete.value || !$supabase) return;

  deleteLoading.value = true;
  try {
    const { error } = await $supabase
      .from('admin_users')
      .delete()
      .eq('id', userToDelete.value.id);

    if (error) throw error;

    successMessage.value = 'Pengguna berhasil dihapus';
    showDeleteConfirm.value = false;
    userToDelete.value = null;
    await fetchUsers();
  } catch (error: any) {
    errorMessage.value = error.message || 'Gagal menghapus pengguna';
    console.error('Failed to delete user:', error);
  } finally {
    deleteLoading.value = false;
  }
};

// Bulk delete users
const handleBulkDelete = async () => {
  if (selectedUsers.value.size === 0 || !$supabase) return;

  bulkDeleteLoading.value = true;
  try {
    const { error } = await $supabase
      .from('admin_users')
      .delete()
      .in('id', Array.from(selectedUsers.value));

    if (error) throw error;

    successMessage.value = `${selectedUsers.value.size} pengguna berhasil dihapus`;
    showBulkDeleteConfirm.value = false;
    selectedUsers.value.clear();
    await fetchUsers();
  } catch (error: any) {
    errorMessage.value = error.message || 'Gagal menghapus pengguna terpilih';
    console.error('Failed to bulk delete users:', error);
  } finally {
    bulkDeleteLoading.value = false;
  }
};

const editUser = (user: AdminUserRow) => {
  navigateTo(`/admin/users/${user.id}/edit`);
};
</script>
