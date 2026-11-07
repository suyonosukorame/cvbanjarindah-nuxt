<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Manajemen Pengguna</h1>
        <p class="text-slate-600 mt-1">Kelola pengguna dan izin akses sistem</p>
      </div>
      <button
        @click="showInviteModal = true"
        class="flex items-center justify-center gap-2 px-4 py-2 text-white bg-primary rounded-lg hover:bg-orange-600 transition-colors self-start sm:self-auto"
      >
        <span class="material-symbols-outlined text-lg">person_add</span>
        Undang Pengguna
      </button>
    </div>

    <!-- Users Table -->
    <div v-if="users.length > 0">
      <UserManagementTable
        :users="users"
        :roles="availableRoles"
        :loading="loading"
        @selection-change="selectedUsers = $event"
      >
        <template #rowActions="{ user }">
          <div class="flex items-center gap-2">
            <button
              @click="editUser(user)"
              class="text-primary hover:text-orange-600 font-medium text-sm transition-colors"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(user)"
              class="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
            >
              Hapus
            </button>
          </div>
        </template>

        <template #bulkActions="{ selectedUsers }">
          <button
            @click="showBulkDeleteConfirm = true"
            class="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm font-medium"
          >
            Hapus Dipilih
          </button>
        </template>
      </UserManagementTable>
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        icon="person"
        title="Belum ada pengguna"
        description="Mulai dengan mengundang pengguna pertama ke sistem"
        action-label="Undang Pengguna Pertama"
        variant="info"
        @action="showInviteModal = true"
      />
    </div>

    <!-- Invite Modal -->
    <InviteUserModal
      :visible="showInviteModal"
      @close="showInviteModal = false"
      @submit="handleInviteSubmit"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :visible="showDeleteConfirm"
      title="Hapus Pengguna"
      :message="`Apakah Anda yakin ingin menghapus pengguna ${userToDelete?.name}? Tindakan ini tidak dapat dibatalkan.`"
      :loading="deleteLoading"
      @confirm="handleDeleteUser"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Bulk Delete Confirmation -->
    <ConfirmDialog
      :visible="showBulkDeleteConfirm"
      title="Hapus Pengguna Terpilih"
      :message="`Apakah Anda yakin ingin menghapus ${selectedUsers.size} pengguna yang dipilih? Tindakan ini tidak dapat dibatalkan.`"
      :loading="bulkDeleteLoading"
      @confirm="handleBulkDelete"
      @cancel="showBulkDeleteConfirm = false"
    />

    <!-- Alert Messages -->
    <Alert
      v-if="successMessage"
      type="success"
      :message="successMessage"
      @close="successMessage = ''"
    />
    <Alert
      v-if="errorMessage"
      type="error"
      :message="errorMessage"
      @close="errorMessage = ''"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const { $fetch } = useNuxtApp()

const users = ref([])
const showInviteModal = ref(false)
const showDeleteConfirm = ref(false)
const showBulkDeleteConfirm = ref(false)
const userToDelete = ref(null)
const selectedUsers = ref(new Set())
const loading = ref(false)
const deleteLoading = ref(false)
const bulkDeleteLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const availableRoles = ['super_admin', 'admin', 'supervisor', 'staff', 'guest']

// Fetch users on mount
onMounted(async () => {
  await fetchUsers()
})

const fetchUsers = async () => {
  loading.value = true
  try {
    users.value = await $fetch('/api/users', {
      method: 'GET'
    })
  } catch (error) {
    errorMessage.value = 'Gagal memuat data pengguna'
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

const handleInviteSubmit = async (form) => {
  try {
    await $fetch('/api/users/invite', {
      method: 'POST',
      body: form
    })
    
    successMessage.value = `Undangan berhasil dikirim ke ${form.email}`
    showInviteModal.value = false
    
    // Refresh users list
    await fetchUsers()
  } catch (error) {
    errorMessage.value = 'Gagal mengirim undangan'
    console.error('Failed to invite user:', error)
  }
}

const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteConfirm.value = true
}

const handleDeleteUser = async () => {
  if (!userToDelete.value) return

  deleteLoading.value = true
  try {
    await $fetch(`/api/users/${userToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    successMessage.value = 'Pengguna berhasil dihapus'
    showDeleteConfirm.value = false
    userToDelete.value = null
    await fetchUsers()
  } catch (error) {
    errorMessage.value = 'Gagal menghapus pengguna'
    console.error('Failed to delete user:', error)
  } finally {
    deleteLoading.value = false
  }
}

const handleBulkDelete = async () => {
  if (selectedUsers.value.size === 0) return

  bulkDeleteLoading.value = true
  try {
    await $fetch('/api/users/bulk-delete', {
      method: 'POST',
      body: {
        ids: Array.from(selectedUsers.value)
      }
    })
    
    successMessage.value = `${selectedUsers.value.size} pengguna berhasil dihapus`
    showBulkDeleteConfirm.value = false
    selectedUsers.value.clear()
    await fetchUsers()
  } catch (error) {
    errorMessage.value = 'Gagal menghapus pengguna'
    console.error('Failed to bulk delete users:', error)
  } finally {
    bulkDeleteLoading.value = false
  }
}

const editUser = (user) => {
  navigateTo(`/admin/users/${user.id}/edit`)
}
</script>

<style scoped>
/* Page styles */
</style>
