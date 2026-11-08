<template>
  <div class="w-full">
    <!-- Tabs Header (Mobile-friendly) -->
    <div class="flex overflow-x-auto gap-2 mb-8 pb-2 -mx-4 px-4 scrollbar-hide">
      <button
        v-for="(pkg, index) in packages"
        :key="pkg.id"
        @click="activeTab = index"
        :class="[
          'px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex-shrink-0',
          activeTab === index
            ? 'bg-primary text-white shadow-lg'
            : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-primary'
        ]"
      >
        {{ pkg.icon }} {{ pkg.name }}
      </button>
    </div>

    <!-- Content Area -->
    <div class="relative">
      <!-- Active Package Card -->
      <Transition
        name="fade-slide"
        mode="out-in"
      >
        <div :key="packages[activeTab].id" class="w-full">
          <MoleculesPricingCard
            :name="packages[activeTab].name"
            :description="packages[activeTab].description"
            :icon="packages[activeTab].icon"
            :features="packages[activeTab].features"
            :highlighted="packages[activeTab].highlighted"
            :badge="packages[activeTab].badge"
          />
        </div>
      </Transition>
    </div>

    <!-- Tab Indicators (Dots) -->
    <div class="flex justify-center gap-2 mt-8">
      <button
        v-for="(_, index) in packages"
        :key="index"
        @click="activeTab = index"
        :class="[
          'w-2 h-2 rounded-full transition-all',
          activeTab === index
            ? 'bg-primary w-8'
            : 'bg-slate-300 hover:bg-slate-400'
        ]"
        :aria-label="`Go to package ${index + 1}`"
      />
    </div>

    <!-- Navigation Hints (Mobile) -->
    <div v-if="packages.length > 1" class="text-center mt-6 text-sm text-slate-500">
      {{ activeTab + 1 }} / {{ packages.length }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface PricingPackage {
  id: string;
  name: string;
  description: string;
  icon: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

interface Props {
  packages: PricingPackage[];
}

const props = defineProps<Props>()

const activeTab = ref(0)

// Auto-focus Business (highlighted) tab on mount if available
onMounted(() => {
  const highlightedIndex = props.packages.findIndex(pkg => pkg.highlighted)
  if (highlightedIndex !== -1) {
    activeTab.value = highlightedIndex
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
