<template>
  <main class="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_1fr]">
    <!-- Branding Side (Desktop) -->
    <section class="hidden flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-3 font-bold text-lg hover:opacity-90 transition-opacity">
          <span class="material-symbols-outlined text-3xl text-orange-400">storefront</span>
          CV Banjar Indah
        </NuxtLink>
        <NuxtLink 
          to="/" 
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg border border-white/10"
        >
          <span class="material-symbols-outlined text-sm">arrow_back</span>
          <span>Website Utama</span>
        </NuxtLink>
      </div>
      <div class="max-w-lg">
        <p class="mb-3 text-sm font-semibold uppercase tracking-wider text-orange-300">Pendaftaran Staf</p>
        <h1 class="text-4xl font-bold leading-tight">Buat akun untuk mengakses portal administrasi.</h1>
      </div>
      <p class="text-sm text-slate-400">Pendaftaran akun baru akan melalui persetujuan Super Admin.</p>
    </section>

    <!-- Signup Form Side -->
    <section class="flex items-center justify-center p-5 sm:p-10">
      <div class="w-full max-w-md space-y-6">
        <!-- Top Back Link -->
        <div class="flex items-center justify-between pb-1">
          <NuxtLink 
            to="/" 
            class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-500 hover:text-primary transition-colors group"
          >
            <span class="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span>Kembali ke Website Utama</span>
          </NuxtLink>
          <span class="text-xs text-slate-400 hidden sm:inline">CV Banjar Indah</span>
        </div>

        <div>
          <p class="text-sm font-semibold text-primary">Registrasi Pengguna</p>
          <h2 class="mt-1 text-3xl font-bold text-slate-900">Daftar Akun Admin</h2>
          <p class="mt-2 text-sm text-slate-500">
            Lengkapi data di bawah ini untuk mengajukan akses ke portal administrasi.
          </p>
        </div>

        <!-- Alert Error -->
        <MoleculesAlert
          v-if="errorMessage"
          type="error"
          variant="left-accent"
          :description="errorMessage"
          closeable
          @close="errorMessage = ''"
        />

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="handleSignUp">
          <!-- Full Name -->
          <label class="block space-y-1.5">
            <span class="text-sm font-semibold text-slate-700">Nama Lengkap</span>
            <input
              v-model.trim="fullName"
              type="text"
              autocomplete="name"
              placeholder="Contoh: Budi Santoso"
              required
              class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </label>

          <!-- Email -->
          <label class="block space-y-1.5">
            <span class="text-sm font-semibold text-slate-700">Email</span>
            <input
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="nama@banjarindah.com"
              required
              class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </label>

          <!-- Departemen (Optional) -->
          <label class="block space-y-1.5">
            <span class="text-sm font-semibold text-slate-700">Departemen / Bagian (Opsional)</span>
            <input
              v-model.trim="department"
              type="text"
              placeholder="Contoh: Operasional, Gudang, Sales"
              class="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </label>

          <!-- Password -->
          <label class="block space-y-1.5">
            <span class="text-sm font-semibold text-slate-700">Kata Sandi</span>
            <div class="relative flex items-center">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Minimal 8 karakter"
                minlength="8"
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

          <!-- Confirm Password -->
          <label class="block space-y-1.5">
            <span class="text-sm font-semibold text-slate-700">Ulangi Kata Sandi</span>
            <div class="relative flex items-center">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Ulangi kata sandi Anda"
                minlength="8"
                required
                class="h-11 w-full rounded-lg border bg-white px-3 pr-10 text-sm outline-none transition"
                :class="passwordMismatch ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20'"
              />
              <button
                type="button"
                class="absolute right-2 grid h-8 w-8 place-items-center text-slate-400 hover:text-slate-600"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <span class="material-symbols-outlined text-lg">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <span v-if="passwordMismatch" class="block text-xs font-medium text-red-600">
              Konfirmasi kata sandi harus sama persis.
            </span>
          </label>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || passwordMismatch"
            class="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition shadow-sm mt-2"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
            {{ loading ? 'Mendaftarkan...' : 'Daftar Akun' }}
          </button>
        </form>

        <div class="pt-2 border-t border-slate-100 space-y-2 text-center text-sm text-slate-600">
          <p>
            Sudah punya akun admin?
            <NuxtLink to="/admin/login" class="font-bold text-primary hover:text-orange-700 ml-1">
              Masuk di sini
            </NuxtLink>
          </p>
          <p class="text-xs text-slate-400">
            Bukan staf CV Banjar Indah? 
            <NuxtLink to="/" class="text-primary hover:underline font-semibold ml-0.5">
              Kembali ke Beranda
            </NuxtLink>
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: 'Daftar Admin | CV Banjar Indah' });

const { $supabase } = useNuxtApp();
const fullName = ref('');
const email = ref('');
const department = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const passwordMismatch = computed(() => {
  return Boolean(confirmPassword.value) && password.value !== confirmPassword.value;
});

const handleSignUp = async () => {
  if (passwordMismatch.value) {
    errorMessage.value = 'Kata sandi dan konfirmasi kata sandi tidak cocok.';
    return;
  }

  if (password.value.length < 8) {
    errorMessage.value = 'Kata sandi minimal 8 karakter.';
    return;
  }

  if (!$supabase) {
    errorMessage.value = 'Koneksi ke database belum terkonfigurasi.';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    // Daftar via Supabase Auth
    const { data: authData, error: authError } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
        },
      },
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('Gagal membuat user di Supabase Auth.');
    }

    // Semua pendaftaran dimulai sebagai pending. RPC hanya mengaktifkan admin
    // pertama secara atomik jika sistem memang belum memiliki Super Admin.
    const profilePayload = {
      id: authData.user.id,
      email: email.value,
      full_name: fullName.value,
      role: 'employee',
      is_active: false,
      status: 'pending',
      departemen: department.value || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await $supabase
      .from('admin_users')
      .upsert(profilePayload);

    if (profileError) {
      // Profile insert gagal — rollback: hapus user dari auth agar tidak ada orphan account
      console.error('Error inserting admin_users record:', profileError);
      await $supabase.auth.signOut();

      // Berikan pesan spesifik berdasarkan kode error
      if (profileError.code === '23514') {
        // Check constraint violation (kolom role/status belum di-update)
        throw new Error(
          `Gagal menyimpan profil: nilai tidak valid (${profileError.message}). ` +
          'Hubungi Super Admin untuk memperbarui schema database.'
        );
      } else if (profileError.code === '42703') {
        // Kolom tidak ada (status/jabatan/departemen belum di-ALTER)
        throw new Error(
          'Gagal menyimpan profil: struktur database belum diperbarui. ' +
          'Hubungi Super Admin untuk menjalankan SQL migration.'
        );
      } else if (profileError.code === '42501') {
        // RLS policy blocking insert
        throw new Error(
          'Gagal menyimpan profil: akses ditolak (RLS). ' +
          'Hubungi Super Admin untuk memperbarui kebijakan akses database.'
        );
      } else {
        throw new Error(`Gagal menyimpan profil akun: ${profileError.message}`);
      }
    }

    const { data: claimedInitialAdmin, error: claimError } = await $supabase
      .rpc('claim_initial_super_admin');

    if (claimError) throw claimError;

    // Sign out agar pengguna pending tidak langsung masuk ke portal admin.
    await $supabase.auth.signOut();

    const redirectStatus = claimedInitialAdmin ? 'super_admin' : 'pending';
    await navigateTo(`/admin/login?status=${redirectStatus}`);
  } catch (err) {
    console.error('Signup error:', err);
    errorMessage.value = err instanceof Error ? err.message : 'Terjadi kesalahan saat pendaftaran. Silakan coba lagi.';
  } finally {
    loading.value = false;
  }
};
</script>
