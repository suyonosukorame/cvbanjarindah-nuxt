<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <!-- Admin Navbar -->
    <nav class="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Desktop Navigation -->
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <NuxtLink to="/admin" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span class="material-symbols-outlined text-2xl text-primary">admin_panel_settings</span>
            <h1 class="text-lg font-bold text-slate-900">CV Banjar Indah Admin</h1>
          </NuxtLink>

          <!-- Desktop Menu -->
          <div class="hidden md:flex items-center gap-8">
            <div class="flex items-center gap-6">
              <!-- Dashboard -->
              <NuxtLink
                to="/admin"
                class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                :class="route.path === '/admin' ? 'text-primary border-b-2 border-primary pb-1' : ''"
              >
                Dashboard
              </NuxtLink>

              <!-- Kontrol (Products) -->
              <NuxtLink
                to="/admin/kontrol"
                class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                :class="route.path.includes('kontrol') ? 'text-primary border-b-2 border-primary pb-1' : ''"
              >
                Kontrol
              </NuxtLink>

              <!-- Kategori -->
              <NuxtLink
                to="/admin/kategori"
                class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                :class="route.path.includes('kategori') ? 'text-primary border-b-2 border-primary pb-1' : ''"
              >
                Kategori
              </NuxtLink>

              <!-- Brand -->
              <NuxtLink
                to="/admin/brand"
                class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                :class="route.path.includes('brand') ? 'text-primary border-b-2 border-primary pb-1' : ''"
              >
                Brand
              </NuxtLink>

              <!-- Pertanyaan -->
              <NuxtLink
                to="/admin/inquiries"
                class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                :class="route.path.includes('inquiries') ? 'text-primary border-b-2 border-primary pb-1' : ''"
              >
                Pertanyaan
              </NuxtLink>

              <!-- Profil -->
              <NuxtLink
                to="/admin/profile"
                class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                :class="route.path.includes('profile') ? 'text-primary border-b-2 border-primary pb-1' : ''"
              >
                Profil
              </NuxtLink>

              <!-- User Management -->
              <NuxtLink
                to="/admin/users"
                class="text-sm font-medium text-slate-700 hover:text-primary transition-colors"
                :class="route.path.includes('/users') ? 'text-primary border-b-2 border-primary pb-1' : ''"
              >
                Pengguna
              </NuxtLink>
            </div>

            <!-- User Menu -->
            <div class="flex items-center gap-3 pl-6 border-l border-slate-200">
              <span class="text-sm text-slate-600">{{ currentUser?.name || 'Admin' }}</span>
              <button
                @click="logout"
                class="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-slate-200 py-3 space-y-1">
          <NuxtLink
            to="/admin"
            class="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
            :class="route.path === '/admin' ? 'bg-primary text-white' : ''"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/admin/kontrol"
            class="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
            :class="route.path.includes('kontrol') ? 'bg-primary text-white' : ''"
          >
            Kontrol
          </NuxtLink>
          <NuxtLink
            to="/admin/kategori"
            class="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
            :class="route.path.includes('kategori') ? 'bg-primary text-white' : ''"
          >
            Kategori
          </NuxtLink>
          <NuxtLink
            to="/admin/brand"
            class="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
            :class="route.path.includes('brand') ? 'bg-primary text-white' : ''"
          >
            Brand
          </NuxtLink>
          <NuxtLink
            to="/admin/inquiries"
            class="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
            :class="route.path.includes('inquiries') ? 'bg-primary text-white' : ''"
          >
            Pertanyaan
          </NuxtLink>
          <NuxtLink
            to="/admin/profile"
            class="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
            :class="route.path.includes('profile') ? 'bg-primary text-white' : ''"
          >
            Profil
          </NuxtLink>
          <NuxtLink
            to="/admin/users"
            class="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded transition-colors"
            :class="route.path.includes('/users') ? 'bg-primary text-white' : ''"
          >
            Pengguna
          </NuxtLink>
          <div class="border-t border-slate-200 pt-3 mt-3">
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
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

const currentUser = ref({ name: 'Admin' })
const mobileMenuOpen = ref(false)

const logout = () => {
  try {
    router.push('/admin/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Close mobile menu when route changes
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
/* Admin layout styles */
</style>
