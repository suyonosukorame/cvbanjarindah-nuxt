<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 p-4">
    <Card class="w-full max-w-md p-8 space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span class="material-symbols-outlined text-primary text-2xl">person_add</span>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-slate-900">Selamat Datang</h1>
        <p class="text-slate-600 text-sm">Lengkapi registrasi akun Anda</p>
      </div>

      <!-- Loading state -->
      <div v-if="isVerifying" class="flex items-center justify-center py-8">
        <div class="text-center space-y-3">
          <div class="animate-spin">
            <span class="material-symbols-outlined text-4xl text-primary">progress_activity</span>
          </div>
          <p class="text-slate-600 text-sm">Memverifikasi undangan...</p>
        </div>
      </div>

      <!-- Token Invalid -->
      <div v-else-if="tokenInvalid">
        <EmptyState
          icon="error_outline"
          title="Undangan Tidak Valid"
          description="Token undangan tidak ditemukan atau sudah kadaluarsa. Silakan minta undangan baru dari administrator."
          variant="error"
        />
      </div>

      <!-- Registration Form -->
      <form v-else class="space-y-4" @submit.prevent="handleRegister">
        <!-- Email display -->
        <div class="p-3 bg-slate-100 rounded-lg">
          <p class="text-xs text-slate-600 uppercase font-semibold">Email Terdaftar</p>
          <p class="text-sm font-medium text-slate-900">{{ invitationData?.email }}</p>
        </div>

        <!-- Name field -->
        <FormInput
          v-model="form.name"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap Anda"
          required
          :error="errors.name"
          @blur="validateField('name')"
        />

        <!-- Password field -->
        <FormInput
          v-model="form.password"
          type="password"
          label="Password"
          placeholder="Minimal 8 karakter"
          required
          :error="errors.password"
          helper-text="Gunakan kombinasi huruf, angka, dan simbol"
          @blur="validateField('password')"
        />

        <!-- Confirm Password field -->
        <FormInput
          v-model="form.confirmPassword"
          type="password"
          label="Konfirmasi Password"
          placeholder="Ulangi password Anda"
          required
          :error="errors.confirmPassword"
          @blur="validateField('confirmPassword')"
        />

        <!-- Password strength indicator (optional) -->
        <div v-if="form.password" class="space-y-2">
          <div class="flex items-center gap-2 text-xs text-slate-600">
            <span class="material-symbols-outlined text-base">info</span>
            <span>Password strength: {{ passwordStrength }}</span>
          </div>
          <div class="flex gap-1 h-1">
            <div
              v-for="i in 4"
              :key="i"
              class="flex-1 rounded-full transition-colors"
              :class="[
                i <= strengthScore ? strengthColor : 'bg-slate-200'
              ]"
            />
          </div>
        </div>

        <!-- Terms checkbox -->
        <FormCheckbox
          v-model="form.agreeTerms"
          label="Saya setuju dengan syarat dan ketentuan"
          required
          :error="errors.agreeTerms"
        />

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="!isFormValid || registerLoading"
          class="w-full px-4 py-2 text-white bg-primary rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          <span v-if="registerLoading" class="material-symbols-outlined animate-spin">progress_activity</span>
          <span>{{ registerLoading ? 'Mendaftar...' : 'Daftar' }}</span>
        </button>

        <!-- Login link -->
        <p class="text-center text-sm text-slate-600">
          Sudah punya akun?
          <NuxtLink to="/admin/login" class="text-primary font-medium hover:text-orange-600">
            Masuk di sini
          </NuxtLink>
        </p>
      </form>

      <!-- Alert Messages -->
      <Alert
        v-if="errorMessage"
        type="error"
        :message="errorMessage"
        @close="errorMessage = ''"
      />
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank'
})

const route = useRoute()
const { $fetch } = useNuxtApp()

const token = computed(() => route.query.token as string)

const form = ref({
  name: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const errors = ref({})
const isVerifying = ref(true)
const tokenInvalid = ref(false)
const registerLoading = ref(false)
const errorMessage = ref('')
const invitationData = ref(null)

const isFormValid = computed(() =>
  form.value.name.trim().length >= 3 &&
  form.value.password.length >= 8 &&
  form.value.password === form.value.confirmPassword &&
  form.value.agreeTerms &&
  !Object.values(errors.value).some(error => error)
)

const strengthScore = computed(() => {
  if (!form.value.password) return 0
  let score = 0
  if (form.value.password.length >= 8) score++
  if (form.value.password.length >= 12) score++
  if (/[a-z]/.test(form.value.password) && /[A-Z]/.test(form.value.password)) score++
  if (/\d/.test(form.value.password) && /[!@#$%^&*]/.test(form.value.password)) score++
  return score
})

const strengthColor = computed(() => {
  if (strengthScore.value === 1) return 'bg-red-500'
  if (strengthScore.value === 2) return 'bg-yellow-500'
  if (strengthScore.value === 3) return 'bg-blue-500'
  return 'bg-green-500'
})

const passwordStrength = computed(() => {
  if (strengthScore.value === 1) return 'Lemah'
  if (strengthScore.value === 2) return 'Cukup'
  if (strengthScore.value === 3) return 'Kuat'
  if (strengthScore.value === 4) return 'Sangat Kuat'
  return 'Sangat Lemah'
})

// Verify token on mount
onMounted(async () => {
  if (!token.value) {
    tokenInvalid.value = true
    errorMessage.value = 'Token undangan tidak ditemukan'
    isVerifying.value = false
    return
  }

  try {
    const data = await $fetch('/api/auth/verify-invitation', {
      query: { token: token.value }
    })
    
    invitationData.value = data
    isVerifying.value = false
  } catch (error) {
    tokenInvalid.value = true
    errorMessage.value = 'Token undangan tidak valid atau sudah kadaluarsa'
    isVerifying.value = false
  }
})

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

    case 'password':
      if (form.value.password.length < 8) {
        newErrors.password = 'Password harus minimal 8 karakter'
      } else if (!/[a-z]/.test(form.value.password) || !/[A-Z]/.test(form.value.password)) {
        newErrors.password = 'Password harus mengandung huruf besar dan kecil'
      } else {
        delete newErrors.password
      }
      break

    case 'confirmPassword':
      if (form.value.confirmPassword !== form.value.password) {
        newErrors.confirmPassword = 'Password tidak cocok'
      } else {
        delete newErrors.confirmPassword
      }
      break

    case 'agreeTerms':
      if (!form.value.agreeTerms) {
        newErrors.agreeTerms = 'Anda harus menyetujui syarat dan ketentuan'
      } else {
        delete newErrors.agreeTerms
      }
      break
  }

  errors.value = newErrors
}

const handleRegister = async () => {
  // Validate all fields
  validateField('name')
  validateField('password')
  validateField('confirmPassword')
  validateField('agreeTerms')

  if (!isFormValid.value) {
    errorMessage.value = 'Silakan lengkapi semua field dengan benar'
    return
  }

  registerLoading.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        token: token.value,
        name: form.value.name,
        password: form.value.password
      }
    })

    // Redirect to login with success message
    await navigateTo({
      path: '/admin/login',
      query: { registered: 'true' }
    })
  } catch (error) {
    errorMessage.value = 'Pendaftaran gagal. Silakan coba lagi.'
    console.error('Registration failed:', error)
  } finally {
    registerLoading.value = false
  }
}
</script>

<style scoped>
/* Page styles */
</style>
