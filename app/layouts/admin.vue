<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <!-- Admin Navbar -->
    <nav class="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-2xl text-primary">admin_panel_settings</span>
            <h1 class="text-lg font-bold text-slate-900">CV Banjar Indah Admin</h1>
          </div>

          <!-- Navigation -->
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/admin/users"
              class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
              :class="route.path.includes('/users') ? 'text-primary' : ''"
            >
              Pengguna
            </NuxtLink>
            <NuxtLink
              to="/admin/dashboard"
              class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
              :class="route.path === '/admin/dashboard' ? 'text-primary' : ''"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/settings"
              class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
              :class="route.path === '/admin/settings' ? 'text-primary' : ''"
            >
              Pengaturan
            </NuxtLink>
          </div>

          <!-- User Menu -->
          <div class="flex items-center gap-4">
            <span class="hidden sm:inline text-sm text-slate-600">{{ currentUser?.name || 'Admin' }}</span>
            <button
              @click="logout"
              class="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-200 bg-white mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-600">
        <p>&copy; 2024 CV Banjar Indah. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const nuxt = useNuxtApp()

const currentUser = ref({ name: 'Admin' })

const logout = () => {
  try {
    router.push('/admin/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}
</script>

<style scoped>
/* Admin layout styles */
</style>
