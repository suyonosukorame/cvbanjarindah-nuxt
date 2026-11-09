<template>
  <footer class="bg-slate-900 text-white mt-20">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- 4-Column Grid: About, Products, Menu, Contact -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <!-- About -->
        <div>
          <h3 class="font-bold text-lg mb-4">CV. Banjar Indah</h3>
          <p class="text-slate-300 text-sm leading-relaxed mb-3">
            Suplier & Mitra Usaha Terpercaya di Kalsel-Teng. Distributor resmi produk Kesehatan, Kosmetik, Baby, Garment, Elektronik, dan Kelontongan.
          </p>
          <p class="text-xs text-orange-400 font-medium">
            📍 Jl. Mahoni No. 98 RT.12, Banjarmasin Sel., Kalimantan Selatan 70248
          </p>
        </div>

        <!-- Products -->
        <div>
          <h4 class="font-bold mb-4">Kategori Produk</h4>
          <ul class="space-y-1.5 text-slate-300 text-sm">
            <li><NuxtLink to="/produk" class="hover:text-white transition">Kesehatan</NuxtLink></li>
            <li><NuxtLink to="/produk" class="hover:text-white transition">Kosmetik & Kecantikan</NuxtLink></li>
            <li><NuxtLink to="/produk" class="hover:text-white transition">Perlengkapan Bayi</NuxtLink></li>
            <li><NuxtLink to="/produk" class="hover:text-white transition">Garment / Pakaian</NuxtLink></li>
            <li><NuxtLink to="/produk" class="hover:text-white transition">Elektronik</NuxtLink></li>
            <li><NuxtLink to="/produk" class="hover:text-white transition">Kelontongan</NuxtLink></li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-bold mb-4">Menu</h4>
          <ul class="space-y-2 text-slate-300 text-sm">
            <li><NuxtLink to="/" class="hover:text-white transition">Home</NuxtLink></li>
            <li><NuxtLink to="/tentang" class="hover:text-white transition">Tentang Kami</NuxtLink></li>
            <li><NuxtLink to="/produk" class="hover:text-white transition">Katalog Produk</NuxtLink></li>
            <li><NuxtLink to="/area" class="hover:text-white transition">Area Distribusi</NuxtLink></li>
            <li><NuxtLink to="/kontak" class="hover:text-white transition">Kontak & Kemitraan</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-bold mb-4">Hubungi Kami</h4>
          <div class="space-y-2.5 text-slate-300 text-sm">
            <p class="flex items-start gap-2">
              <span class="text-orange-400 shrink-0">📍</span>
              <a
                href="https://www.google.com/maps/place/CV.+BANJAR+INDAH/@-3.3497959,114.6158106,218m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2de42134376274ed:0x90bd2166e2f785f0!8m2!3d-3.3497972!4d114.6164557!16s%2Fg%2F11jfsbcy6f"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-orange-400 transition leading-relaxed"
              >
                Jl. Mahoni No. 98 RT.12, Komplek Banjar Indah Permai, Pemurus Dalam, Banjarmasin Sel., Kalsel 70248
              </a>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-orange-400">⏰</span>
              <span>08.30 - 17.00 WITA (Minggu Tutup)</span>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-orange-400">🤳</span>
              <a href="https://wa.me/6285124502615?text=Halo%20CV%20Banjar%20Indah,%20saya%20tertarik%20untuk%20order/kemitraan." target="_blank" rel="noopener noreferrer" class="hover:text-white hover:underline transition">
                0851-2450-2615 (Order / WA)
              </a>
            </p>
            <p class="flex items-center gap-2">
              <span class="text-orange-400">✉️</span>
              <span>info@cvbanjarindah.com</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Section: Copyright, Socials, Stats, Admin -->
      <div class="border-t border-slate-800 pt-6">
        <div class="flex flex-col gap-4 md:gap-0 md:flex-row md:items-center md:justify-between">
          
          <!-- Left: Copyright -->
          <div class="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-sm text-slate-400">
            <span>© {{ hijriYear }} H CV. Banjar Indah</span>
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
            <a
              href="https://www.instagram.com/cvbanjarindah/"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 text-slate-400 hover:text-pink-400 transition text-sm font-medium"
            >
              <span>Instagram</span>
            </a>
            <span class="text-slate-700">•</span>
            <a
              href="https://www.tiktok.com/@cvbanjarindah"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 text-slate-400 hover:text-white transition text-sm font-medium"
            >
              <span>TikTok</span>
            </a>
            <span class="text-slate-700">•</span>
            <a
              href="https://wa.me/6285124502615?text=Halo%20CV%20Banjar%20Indah,%20saya%20tertarik%20untuk%20order/kemitraan."
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition text-sm font-medium"
            >
              <span>WhatsApp</span>
            </a>
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
