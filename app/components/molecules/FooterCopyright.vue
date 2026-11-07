<template>
  <div class="bg-slate-900 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        
        <!-- Left: Copyright + Developer Credit -->
        <div class="flex flex-col md:flex-row items-center gap-3 text-sm text-slate-400">
          <!-- Copyright -->
          <span class="text-center md:text-left">
            © {{ hijriYear }} H {{ organization }}
          </span>
          
          <!-- Divider -->
          <span class="hidden md:inline text-slate-700">•</span>
          
          <!-- Developer Credit -->
          <span class="flex items-center gap-1.5">
            <span>Developed by</span>
            <a 
              :href="developerLink" 
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {{ developerName }}
            </a>
          </span>
        </div>

        <!-- Right: Stats + Admin -->
        <div class="flex items-center gap-3">
          
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
            v-if="showAdmin"
            :to="adminLink"
            class="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all border border-slate-700 hover:border-slate-600"
          >
            <AtomsIcon name="admin_panel_settings" size="sm" color="white" />
            <span>ADMIN</span>
          </NuxtLink>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hijriYear?: number
  organization?: string
  developerName?: string
  developerLink?: string
  stats?: {
    visits: number
    visitors: number
  }
  showAdmin?: boolean
  adminLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  organization: 'CV Banjar Indah',
  developerName: 'IonStack',
  developerLink: 'https://ionstack.vercel.app/',
  stats: () => ({ visits: 0, visitors: 0 }),
  showAdmin: true,
  adminLink: '/admin/login',
})

// Auto-calculate Hijri year from current Gregorian date
// Simplified approximation: Hijri year ≈ Gregorian year - 579
const hijriYear = computed(() => {
  if (props.hijriYear) return props.hijriYear
  const currentYear = new Date().getFullYear()
  return currentYear - 579 // Approximate conversion
})
</script>
