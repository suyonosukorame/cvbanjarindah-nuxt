<template>
  <main class="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_1fr]">
    <!-- Branding Side (Desktop) -->
    <section class="hidden flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
      <NuxtLink to="/" class="flex items-center gap-3 font-bold text-lg hover:opacity-90 transition-opacity">
        <span class="material-symbols-outlined text-3xl text-orange-400">storefront</span>
        CV Banjar Indah
      </NuxtLink>
      <div class="max-w-lg">
        <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-300">Portal Administrasi</p>
        <h1 class="text-4xl font-bold leading-tight">Kelola operasional dan konten bisnis Anda.</h1>
      </div>
      <p class="text-sm text-slate-400">Portal akses resmi staf & administrator CV Banjar Indah.</p>
    </section>

    <!-- Login Form Side -->
    <section class="flex items-center justify-center p-5 sm:p-10">
      <form class="w-full max-w-md space-y-6" @submit.prevent="submit">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 lg:hidden">
          <span class="material-symbols-outlined text-primary">storefront</span>
          CV Banjar Indah
        </NuxtLink>

        <div>
          <p class="text-sm font-semibold text-primary">Selamat datang</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-900">Masuk ke Portal Admin</h2>
          <p class="mt-2 text-sm text-slate-500">Gunakan email dan kata sandi admin Anda.</p>
        </div>

        <!-- Success Message from Signup -->
        <div
          v-if="infoMessage"
          role="status"
          class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 flex items-start gap-2"
        >
          <span class="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">check_circle</span>
          <span>{{ infoMessage }}</span>
        </div>

        <!-- Error Message -->
        <MoleculesAlert
          v-if="errorMessage"
          type="error"
          variant="left-accent"
          :description="errorMessage"
          closeable
          @close="errorMessage = ''"
        />

        <label class="block space-y-2">
          <span class="text-sm font-semibold text-slate-700">Email</span>
          <input
            v-model.trim="email"
            type="email"
            autocomplete="username"
            placeholder="nama@banjarindah.com"
            required
            class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
          />
        </label>

        <label class="block space-y-2">
          <span class="text-sm font-semibold text-slate-700">Kata sandi</span>
          <div class="relative flex items-center">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              required
              class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
            <button
              type="button"
              class="absolute right-2 grid h-8 w-8 place-items-center text-slate-400 hover:text-slate-600"
              @click="showPassword = !showPassword"
            >
              <span class="material-symbols-outlined text-lg">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </label>

        <button
          type="submit"
          :disabled="loading"
          class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition shadow-sm"
        >
          <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
          {{ loading ? 'Memeriksa...' : 'Masuk' }}
        </button>

        <p class="text-center text-sm text-slate-600 pt-2 border-t border-slate-100">
          Belum punya akun admin?
          <NuxtLink to="/admin/signup" class="font-bold text-primary hover:text-orange-700 ml-1">
            Daftar di sini
          </NuxtLink>
        </p>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: 'Masuk Admin | CV Banjar Indah' });

const route = useRoute();
const { login, loading } = useAuth();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const errorMessage = ref('');
const infoMessage = ref('');

onMounted(() => {
  if (route.query.status === 'pending') {
    infoMessage.value = 'Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan (approval) dari Super Admin sebelum dapat digunakan.';
  } else if (route.query.status === 'super_admin') {
    infoMessage.value = 'Selamat! Akun Super Admin pertama berhasil dibuat. Silakan masuk dengan email dan kata sandi Anda.';
  } else if (route.query.registered === '1') {
    infoMessage.value = 'Pendaftaran berhasil! Silakan masuk dengan akun Anda.';
  }
});

const submit = async () => {
  errorMessage.value = '';
  try {
    await login(email.value, password.value);
    const destination = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/admin')
      ? route.query.redirect
      : '/admin';
    await navigateTo(destination);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Tidak dapat masuk. Periksa kembali email dan kata sandi Anda.';
  }
};
</script>
