<template>
  <footer class="bg-slate-900 text-white mt-20">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- 4-Column Grid: About, Products, Menu, Contact -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <!-- About -->
        <div>
          <h3 class="font-bold text-lg mb-4">CV Banjar Indah</h3>
          <p class="text-slate-300 text-sm leading-relaxed">
            Distributor terpercaya produk tissue, masker, dan perlengkapan bayi berkualitas di Kalimantan.
          </p>
        </div>

        <!-- Products -->
        <div>
          <h4 class="font-bold mb-4">Produk</h4>
          <ul class="space-y-2 text-slate-300 text-sm">
            <li><a href="#" class="hover:text-white transition">Tissue</a></li>
            <li><a href="#" class="hover:text-white transition">Masker</a></li>
            <li><a href="#" class="hover:text-white transition">Perlengkapan Bayi</a></li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-bold mb-4">Menu</h4>
          <ul class="space-y-2 text-slate-300 text-sm">
            <li><NuxtLink to="/" class="hover:text-white transition">Home</NuxtLink></li>
            <li><NuxtLink to="/tentang" class="hover:text-white transition">Tentang</NuxtLink></li>
            <li><NuxtLink to="/kontak" class="hover:text-white transition">Kontak</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-bold mb-4">Hubungi Kami</h4>
          <div class="space-y-2 text-slate-300 text-sm">
            <p>📍 Kalimantan</p>
            <p>📞 (Hubungi via kontak)</p>
            <p>✉️ info@cvbanjarindah.com</p>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Copyright, Socials, Stats, Admin -->
      <div class="border-t border-slate-800 pt-6">
        <div class="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
          
          <!-- Left: Copyright -->
          <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm text-slate-400">
            <span>© {{ hijriYear }} H CV Banjar Indah</span>
            <span class="hidden sm:inline text-slate-700">•</span>
            <span class="flex items-center gap-1.5">
              <span>Developed by</span>
              <a 
                href="https://ionstack.vercel.app/" 
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                IonStack
              </a>
            </span>
          </div>

          <!-- Center: Social Links -->
          <div class="flex items-center gap-4 justify-center">
            <a href="#" class="text-slate-400 hover:text-white transition text-sm">Twitter</a>
            <span class="text-slate-700">•</span>
            <a href="#" class="text-slate-400 hover:text-white transition text-sm">Facebook</a>
            <span class="text-slate-700">•</span>
            <a href="#" class="text-slate-400 hover:text-white transition text-sm">Instagram</a>
          </div>

          <!-- Right: Stats + Admin -->
          <div class="flex items-center gap-3 justify-center md:justify-end">
            <!-- Visit Counter -->
            <MoleculesStatCounter
              icon="monitoring"
              label="Visits"
              :value="stats.visits"
            />

            <!-- Visitor Counter -->
            <MoleculesStatCounter
              icon="group"
              label="Visitors"
              :value="stats.visitors"
            />

            <!-- Admin Button -->
            <NuxtLink
              to="/admin/login"
              class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-all border border-slate-700 hover:border-slate-600"
            >
              <AtomsIcon name="admin_panel_settings" size="sm" color="white" />
              <span>ADMIN</span>
            </NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer with reactive stats shared with usePageTracking
const { stats, fetchStats } = usePageTracking()

// Auto-calculate Hijri year from current Gregorian date
const hijriYear = computed(() => {
  const currentYear = new Date().getFullYear()
  return currentYear - 579 // Approximate conversion
})

// Initial stats fetch on mount
onMounted(async () => {
  await fetchStats()
})
</script>
