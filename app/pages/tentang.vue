<template>
  <div>
    <!-- Hero Section -->
    <SectionsHeroSection
      variant="gradient"
      size="large"
      title="Tentang CV Banjar Indah"
      subtitle="Distributor terpercaya produk berkualitas di Kalimantan sejak tahun 2010"
    />

    <!-- About Content -->
    <section class="py-16 max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <img
          :src="corporateVisionFlyer"
          alt="Visi dan misi CV Banjar Indah"
          class="h-auto w-full rounded-xl"
          loading="lazy"
        />
        
        <div>
          <h2 class="text-3xl font-black mb-6 text-slate-900">
            Visi Kami
          </h2>
          <p class="text-slate-600 mb-6 leading-relaxed">
            Menjadi distributor produk consumer goods terdepan di Kalimantan dengan menghadirkan 
            produk berkualitas tinggi dan layanan terbaik untuk memenuhi kebutuhan masyarakat.
          </p>
          
          <h2 class="text-3xl font-black mb-6 text-slate-900">
            Misi Kami
          </h2>
          <ul class="space-y-3">
            <li 
              v-for="mission in missions"
              :key="mission"
              class="flex gap-3 text-slate-600"
            >
              <span class="text-primary mt-1">✓</span>
              <span>{{ mission }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Stats -->
      <div class="mb-16">
        <OrganismsStatsSection :stats="companyStats" />
      </div>

      <!-- Values -->
      <div class="mb-16">
        <SectionsSectionHeading title="Nilai-Nilai Kami" />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="value in companyValues"
            :key="value.id"
            class="text-white rounded-2xl p-8 shadow-lg h-full flex flex-col justify-between overflow-hidden"
            :style="{
              backgroundImage: `linear-gradient(135deg, var(--color-start), var(--color-end))`,
              '--color-start': value.colorStart || '#10b981',
              '--color-end': value.colorEnd || '#059669'
            }"
          >
            <div>
              <div class="text-5xl mb-4">{{ value.icon }}</div>
              <h3 class="font-black text-xl mb-3">{{ value.title }}</h3>
            </div>
            <p class="text-opacity-90 text-white text-sm leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <MoleculesCard padding="lg" class="bg-slate-50">
        <SectionsSectionHeading title="Tim Kami" />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="member in teamMembers"
            :key="member.id"
            class="text-center"
          >
            <AtomsImage
              :src="member.image"
              :alt="member.name"
              rounded="full"
              aspect="square"
              :hover="false"
              class="w-32 h-32 mx-auto mb-4 shadow-lg"
            />
            <h4 class="font-bold text-lg text-slate-900">
              {{ member.name }}
            </h4>
            <p class="text-slate-600 text-sm">
              {{ member.role }}
            </p>
          </div>
        </div>
      </MoleculesCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import corporateVisionFlyer from '~/assets/images/cv-banjar-indah-corporate-vision-flyer.webp'

definePageMeta({
  layout: 'default',
});

const missions = [
  'Menyediakan produk berkualitas dengan harga kompetitif',
  'Memberikan layanan distribusi yang cepat dan tepat waktu',
  'Membangun kemitraan jangka panjang dengan pelanggan',
  'Berkontribusi pada pertumbuhan ekonomi lokal',
];

// Fetch dynamic data from Supabase
const { supabase } = useSupabase()
const companyStats = ref<any[]>([])
const teamMembers = ref<any[]>([])
const companyValues = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    loading.value = true
    
    // Calculate real company stats
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    
    const { count: partnerCount } = await supabase
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'converted')
    
    const { count: areaCount } = await supabase
      .from('distribution_areas')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    
    const { count: brandCount } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    
    companyStats.value = [
      { id: '1', label: 'Produk Tersedia', value: productCount || 50, suffix: '+', icon: 'inventory_2' },
      { id: '2', label: 'Mitra Bisnis', value: partnerCount || 200, suffix: '+', icon: 'handshake' },
      { id: '3', label: 'Kota Distribusi', value: areaCount || 15, suffix: '+', icon: 'location_city' },
      { id: '4', label: 'Brand Partner', value: brandCount || 10, suffix: '+', icon: 'stars' },
    ]
    
    // Team Members & Values - static data (rarely changed)
    const { teamMembers: staticTeam, companyValues: staticValues } = await import('~/data/content')
    teamMembers.value = staticTeam
    companyValues.value = staticValues
    
  } catch (error) {
    console.error('Error fetching about page data:', error)
    // Fallback to static data
    const { companyStats: staticStats, teamMembers: staticTeam, companyValues: staticValues } = await import('~/data/content')
    companyStats.value = staticStats
    teamMembers.value = staticTeam
    companyValues.value = staticValues
  } finally {
    loading.value = false
  }
})
</script>
