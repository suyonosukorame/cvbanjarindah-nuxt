<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Page Header -->
    <div class="flex items-center gap-4">
      <button
        @click="$router.back()"
        class="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <span class="material-symbols-outlined">arrow_back</span>
      </button>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Edit Pengguna</h1>
        <p class="text-slate-600 mt-1">Perbarui informasi dan izin pengguna</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <SkeletonLoader count="6" />
    </div>

    <!-- Form -->
    <div v-else class="space-y-6">
      <!-- User Info Card -->
      <Card class="p-6 space-y-4">
        <h2 class="text-lg font-semibold text-slate-900">Informasi Pengguna</h2>

        <FormInput
          v-model="form.name"
          label="Nama Lengkap"
          placeholder="Contoh: Budi Santoso"
          :error="errors.name"
          @blur="validateField('name')"
        />

        <FormInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="email@banjarindah.com"
          disabled
        />

        <FormSelect
          v-model="form.role"
          label="Role"
          :options="roleOptions"
          :error="errors.role"
          @blur="validateField('role')"
        />

        <FormSelect
          v-model="form.department"
          label="Departemen"
          :options="departmentOptions"
          :disabled="form.role === 'super_admin'"
        />
      </Card>

      <!-- Permissions Card -->
      <Card class="p-6 space-y-4">
        <h2 class="text-lg font-semibold text-slate-900">Izin Khusus</h2>

        <FormCheckbox
          v-model="form.permissions.canManageUsers"
          label="Kelola Pengguna"
          description="Buat, edit, hapus pengguna lain"
          :disabled="form.role === 'staff' || form.role === 'guest'"
        />

        <FormCheckbox
          v-model="form.permissions.canManageRoles"
          label="Kelola Role"
          description="Ubah role dan izin pengguna"
          :disabled="form.role !== 'super_admin' && form.role !== 'admin'"
        />

        <FormCheckbox
          v-model="form.permissions.canViewReports"
          label="Lihat Laporan"
          description="Akses laporan dan analitik"
          :disabled="form.role === 'guest'"
        />

        <FormCheckbox
          v-model="form.permissions.canExport"
          label="Ekspor Data"
          description="Ekspor data ke berbagai format"
          :disabled="form.role === 'staff' || form.role === 'guest'"
        />
      </Card>

      <!-- Status Card -->
      <Card class="p-6 space-y-4">
        <h2 class="text-lg font-semibold text-slate-900">Status</h2>

        <FormSelect
          v-model="form.status"
          label="Status Pengguna"
          :options="statusOptions"
        />

        <FormCheckbox
          v-model="form.isVerified"
          label="Email Terverifikasi"
          description="Pengguna telah memverifikasi email mereka"
        />
      </Card>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end">
        <button
          @click="$router.back()"
          class="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Batal
        </button>
        <button
          @click="handleSave"
          :disabled="!isFormValid || saveLoading"
          class="px-4 py-2 text-white bg-primary rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
        >
          <span v-if="saveLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
          Simpan Perubahan
        </button>
      </div>

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
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const route = useRoute()
const { $supabase } = useNuxtApp()

const form = ref({
  name: '',
  email: '',
  role: 'staff',
  department: '',
  permissions: {
    canManageUsers: false,
    canManageRoles: false,
    canViewReports: false,
    canExport: false
  },
  status: 'active',
  isVerified: false
})

const errors = ref({})
const isLoading = ref(false)
const saveLoading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'staff', label: 'Staff' },
  { value: 'guest', label: 'Guest' }
]

const departmentOptions = [
  { value: 'it', label: 'IT' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Keuangan' },
  { value: 'operations', label: 'Operasional' },
  { value: 'sales', label: 'Penjualan' },
  { value: 'marketing', label: 'Marketing' }
]

const statusOptions = [
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
  { value: 'pending', label: 'Tertunda' }
]

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && form.value.role !== ''
})

// Load user data
onMounted(async () => {
  await loadUser()
})

const loadUser = async () => {
  if (!$supabase) return
  isLoading.value = true
  try {
    const { data: user, error } = await $supabase
      .from('admin_users')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (error) throw error

    if (user) {
      form.value.name = user.full_name || ''
      form.value.email = user.email || ''
      form.value.role = user.role || 'employee'
      form.value.department = user.departemen || ''
      form.value.status = user.status || (user.is_active ? 'active' : 'pending')
    }
  } catch (error) {
    errorMessage.value = 'Gagal memuat data pengguna'
    console.error('Failed to load user:', error)
  } finally {
    isLoading.value = false
  }
}

const validateField = (field) => {
  const newErrors = { ...errors.value }

  switch (field) {
    case 'name':
      if (form.value.name.trim().length < 3) {
        newErrors.name = 'Nama harus minimal 3 karakter'
      } else {
        delete newErrors.name
      }
      break

    case 'role':
      if (!form.value.role) {
        newErrors.role = 'Role harus dipilih'
      } else {
        delete newErrors.role
      }
      break
  }

  errors.value = newErrors
}

const handleSave = async () => {
  // Validate all fields
  validateField('name')
  validateField('role')

  if (!isFormValid.value) {
    errorMessage.value = 'Silakan lengkapi semua field yang wajib'
    return
  }

  saveLoading.value = true
  try {
    if (!$supabase) throw new Error('Koneksi database tidak tersedia')

    const { error } = await $supabase
      .from('admin_users')
      .update({
        full_name: form.value.name,
        role: form.value.role,
        departemen: form.value.department || null,
        status: form.value.status,
        is_active: form.value.status === 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', route.params.id)

    if (error) throw error

    successMessage.value = 'Pengguna berhasil diperbarui'
    setTimeout(() => {
      navigateTo('/admin/users')
    }, 1500)
  } catch (error) {
    errorMessage.value = 'Gagal menyimpan perubahan'
    console.error('Failed to update user:', error)
  } finally {
    saveLoading.value = false
  }
}
</script>

<style scoped>
/* Page styles */
</style>
