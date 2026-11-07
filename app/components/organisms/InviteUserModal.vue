<template>
  <FormModal
    :visible="visible"
    title="Undang Pengguna Baru"
    submit-label="Kirim Undangan"
    cancel-label="Batal"
    :loading="loading"
    :submit-disabled="!isFormValid"
    @close="$emit('close')"
    @submit="handleSubmit"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Name field -->
      <FormInput
        v-model="form.name"
        label="Nama Lengkap"
        placeholder="Contoh: Budi Santoso"
        required
        :error="errors.name"
        @blur="validateField('name')"
      />

      <!-- Email field -->
      <FormInput
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="contoh@banjarindah.com"
        required
        :error="errors.email"
        @blur="validateField('email')"
      />

      <!-- Role selection -->
      <FormSelect
        v-model="form.role"
        label="Role"
        placeholder="Pilih role pengguna"
        required
        :options="roleOptions"
        :error="errors.role"
        @blur="validateField('role')"
      />

      <!-- Department selection -->
      <FormSelect
        v-model="form.department"
        label="Departemen (Opsional)"
        placeholder="Pilih departemen"
        :options="departmentOptions"
        :disabled="!form.role || form.role === 'super_admin'"
      />

      <!-- Permissions checkboxes -->
      <div class="space-y-3 p-3 bg-slate-50 rounded-lg">
        <label class="text-xs font-semibold text-slate-700 uppercase">Izin Khusus (Opsional)</label>
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
      </div>

      <!-- Expiration date for invitation -->
      <FormInput
        v-model="form.expiresAt"
        type="date"
        label="Undangan Berlaku Sampai"
        required
        :error="errors.expiresAt"
        :min="minExpirationDate"
        @blur="validateField('expiresAt')"
      />

      <!-- Send notification checkbox -->
      <FormCheckbox
        v-model="form.sendNotification"
        label="Kirim Email Pemberitahuan"
        description="Pemberitahu pengguna tentang undangan ini melalui email"
      />

      <!-- Invitation message -->
      <div v-if="form.sendNotification">
        <FormTextarea
          v-model="form.message"
          label="Pesan Undangan (Opsional)"
          placeholder="Tambahkan pesan personal untuk pengguna..."
          rows="4"
          :max-length="200"
          helperText="Maksimal 200 karakter"
        />
      </div>

      <!-- Alert messages -->
      <Alert
        v-if="successMessage"
        type="success"
        :message="successMessage"
      />
      <Alert
        v-if="errorMessage"
        type="error"
        :message="errorMessage"
      />
    </form>
  </FormModal>
</template>

<script setup lang="ts">
interface RoleOption {
  value: string
  label: string
  description?: string
}

interface DepartmentOption {
  value: string
  label: string
}

interface Props {
  visible: boolean
  roles?: RoleOption[]
  departments?: DepartmentOption[]
  loading?: boolean
}

interface InvitationForm {
  name: string
  email: string
  role: string
  department: string
  permissions: {
    canManageUsers: boolean
    canManageRoles: boolean
    canViewReports: boolean
    canExport: boolean
  }
  expiresAt: string
  sendNotification: boolean
  message: string
}

interface ValidationErrors {
  name?: string
  email?: string
  role?: string
  expiresAt?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  roles: () => [
    { value: 'super_admin', label: 'Super Admin', description: 'Akses penuh ke sistem' },
    { value: 'admin', label: 'Admin', description: 'Mengelola pengguna dan konten' },
    { value: 'supervisor', label: 'Supervisor', description: 'Mengelola tim' },
    { value: 'staff', label: 'Staff', description: 'Pengguna reguler' },
    { value: 'guest', label: 'Guest', description: 'Akses terbatas' }
  ],
  departments: () => [
    { value: 'it', label: 'IT' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Keuangan' },
    { value: 'operations', label: 'Operasional' },
    { value: 'sales', label: 'Penjualan' },
    { value: 'marketing', label: 'Marketing' }
  ]
})

const form = ref<InvitationForm>({
  name: '',
  email: '',
  role: '',
  department: '',
  permissions: {
    canManageUsers: false,
    canManageRoles: false,
    canViewReports: false,
    canExport: false
  },
  expiresAt: '',
  sendNotification: true,
  message: ''
})

const errors = ref<ValidationErrors>({})
const successMessage = ref('')
const errorMessage = ref('')

const minExpirationDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const roleOptions = computed(() => {
  return props.roles.map(role => ({
    value: role.value,
    label: role.label
  }))
})

const departmentOptions = computed(() => {
  return props.departments.map(dept => ({
    value: dept.value,
    label: dept.label
  }))
})

const isFormValid = computed(() => {
  return (
    form.value.name.trim() !== '' &&
    form.value.email.trim() !== '' &&
    isValidEmail(form.value.email) &&
    form.value.role !== '' &&
    form.value.expiresAt !== '' &&
    new Date(form.value.expiresAt) >= new Date(minExpirationDate.value)
  )
})

const validateField = (field: keyof ValidationErrors) => {
  const newErrors = { ...errors.value }

  switch (field) {
    case 'name':
      if (form.value.name.trim().length < 3) {
        newErrors.name = 'Nama harus minimal 3 karakter'
      } else {
        delete newErrors.name
      }
      break

    case 'email':
      if (!isValidEmail(form.value.email)) {
        newErrors.email = 'Email tidak valid'
      } else {
        delete newErrors.email
      }
      break

    case 'role':
      if (!form.value.role) {
        newErrors.role = 'Role harus dipilih'
      } else {
        delete newErrors.role
      }
      break

    case 'expiresAt':
      if (!form.value.expiresAt) {
        newErrors.expiresAt = 'Tanggal kadaluarsa harus ditentukan'
      } else if (new Date(form.value.expiresAt) < new Date(minExpirationDate.value)) {
        newErrors.expiresAt = 'Tanggal harus minimal besok'
      } else {
        delete newErrors.expiresAt
      }
      break
  }

  errors.value = newErrors
}

const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const handleSubmit = async () => {
  // Validate all fields
  Object.keys(form.value).forEach(field => {
    validateField(field as keyof ValidationErrors)
  })

  if (!isFormValid.value) {
    return
  }

  emit('submit', form.value)
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    role: '',
    department: '',
    permissions: {
      canManageUsers: false,
      canManageRoles: false,
      canViewReports: false,
      canExport: false
    },
    expiresAt: '',
    sendNotification: true,
    message: ''
  }
  errors.value = {}
  successMessage.value = ''
  errorMessage.value = ''
}

const emit = defineEmits<{
  close: []
  submit: [form: InvitationForm]
}>()

// Reset form when modal closes
watch(() => props.visible, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

defineExpose({
  resetForm,
  setSuccessMessage: (msg: string) => {
    successMessage.value = msg
  },
  setErrorMessage: (msg: string) => {
    errorMessage.value = msg
  }
})
</script>
