<template>
  <FormModal
    :visible="visible"
    title="Persetujuan Akun Admin"
    submit-label="Setujui & Aktifkan Akun"
    cancel-label="Batal"
    :loading="loading"
    @close="$emit('close')"
    @submit="handleApprove"
  >
    <div v-if="user" class="space-y-4">
      <!-- User Info Card -->
      <div class="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
        <div class="flex items-start gap-3">
          <div class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-500/20 text-amber-700 font-bold">
            {{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-slate-900 text-sm truncate">{{ user.name || 'Pengguna Baru' }}</h4>
            <p class="text-xs text-slate-600 truncate">{{ user.email }}</p>
            <div class="mt-2 flex items-center gap-2">
              <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Menunggu Persetujuan
              </span>
              <span v-if="user.created_at" class="text-[11px] text-slate-500">
                Mendaftar {{ formatDate(user.created_at) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Assign Role -->
      <FormSelect
        v-model="selectedRole"
        label="Tetapkan Role Akses"
        placeholder="Pilih role"
        required
        :options="roleOptions"
      />

      <!-- Assign Department (Optional) -->
      <FormInput
        v-model="department"
        label="Departemen (Opsional)"
        placeholder="Contoh: Operasional, Gudang, Sales"
      />

      <!-- Assign Job Title (Optional) -->
      <FormInput
        v-model="jabatan"
        label="Jabatan (Opsional)"
        placeholder="Contoh: Staff Distribusi, Admin Gudang"
      />

      <p class="text-xs text-slate-500 leading-relaxed">
        Setelah disetujui, akun ini akan langsung aktif dan pengguna dapat segera masuk ke portal admin menggunakan email dan kata sandi yang telah didaftarkannya.
      </p>
    </div>
  </FormModal>
</template>

<script setup lang="ts">
interface UserToApprove {
  id: string
  name: string
  email: string
  role?: string
  departemen?: string
  jabatan?: string
  created_at?: string
}

interface Props {
  visible: boolean
  user: UserToApprove | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  user: null,
  loading: false
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'approve', payload: { id: string; role: string; departemen?: string; jabatan?: string }): void
}>()

const selectedRole = ref('admin')
const department = ref('')
const jabatan = ref('')

const roleOptions = [
  { value: 'admin', label: 'Admin (Akses penuh konten & produk)' },
  { value: 'manager', label: 'Manager (Manajemen operasional)' },
  { value: 'editor', label: 'Editor (Kelola konten & katalog)' },
  { value: 'employee', label: 'Karyawan / Staf' },
  { value: 'super_admin', label: 'Super Admin (Akses mutlak & kelola user)' },
]

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      selectedRole.value = newUser.role && newUser.role !== 'guest' ? newUser.role : 'admin'
      department.value = newUser.departemen || ''
      jabatan.value = newUser.jabatan || ''
    }
  },
  { immediate: true }
)

const handleApprove = () => {
  if (!props.user) return
  emit('approve', {
    id: props.user.id,
    role: selectedRole.value,
    departemen: department.value.trim() || undefined,
    jabatan: jabatan.value.trim() || undefined
  })
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}
</script>

