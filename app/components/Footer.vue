<template>
  <footer class="bg-slate-900 text-white py-12 mt-20">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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

      <!-- Divider -->
      <div class="border-t border-slate-800 pt-8 mb-8">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <p class="text-slate-400 text-sm">
            Semua hak cipta dilindungi.
          </p>
          <div class="flex gap-4 mt-4 md:mt-0">
            <a href="#" class="text-slate-400 hover:text-white transition">Twitter</a>
            <a href="#" class="text-slate-400 hover:text-white transition">Facebook</a>
            <a href="#" class="text-slate-400 hover:text-white transition">Instagram</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Copyright with Stats -->
    <MoleculesFooterCopyright
      organization="CV Banjar Indah"
      developer-name="IonStack"
      developer-link="https://ionstack.vercel.app/"
      :stats="stats"
      :show-admin="true"
      admin-link="/admin/login"
    />
  </footer>
</template>

<script setup lang="ts">
// Footer with real-time stats from Supabase
const stats = ref({
  visits: 0,
  visitors: 0,
})

// Fetch stats from Supabase on component mount
onMounted(async () => {
  await fetchStats()
})

async function fetchStats() {
  try {
    const supabase = useSupabase()
    
    // Fetch visit count (total page views)
    const { count: visitCount } = await supabase
      .from('page_visits')
      .select('*', { count: 'exact', head: true })
    
    // Fetch unique visitors
    const { count: visitorCount } = await supabase
      .from('unique_visitors')
      .select('*', { count: 'exact', head: true })
    
    stats.value = {
      visits: visitCount || 0,
      visitors: visitorCount || 0,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Use default values on error
    stats.value = {
      visits: 0,
      visitors: 0,
    }
  }
}
</script>
