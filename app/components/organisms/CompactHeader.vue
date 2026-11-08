<template>
  <div class="sticky-header-wrapper">
    <!-- Static Header (for layout purposes) -->
    <div :style="{ height: headerHeight + 'px' }" />

    <!-- Sticky Container -->
    <div
      :class="[
        'sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-all duration-300',
        { 'shadow-md': isSticky }
      ]"
    >
      <!-- Title Section (Collapsible) -->
      <div
        :class="[
          'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 px-4 py-4 transition-all duration-300 overflow-hidden',
          { 'max-h-0 py-0': isTitleCollapsed }
        ]"
      >
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">{{ title }}</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ subtitle }}</p>
      </div>

      <!-- Controls Section (Search, Sort, Filter) -->
      <div class="px-4 py-4 space-y-3">
        <!-- Search Bar -->
        <MoleculesSearchBar
          :model-value="searchQuery"
          @update:model-value="emit('update:searchQuery', $event)"
        />

        <!-- Sort and Filter Row -->
        <div class="flex gap-3">
          <div class="flex-1">
            <MoleculesSortDropdown
              :model-value="sortBy"
              @update:model-value="emit('update:sortBy', $event)"
            />
          </div>
          <button
            @click="showFilterDrawer = true"
            :class="[
              'px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2 text-sm font-medium',
              hasActiveFilters
                ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span class="hidden sm:inline">Filter</span>
            <span
              v-if="hasActiveFilters"
              class="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-white text-blue-500 rounded-full"
            >
              {{ filterBadgeCount }}
            </span>
          </button>

          <!-- View Toggle -->
          <button
            @click="emit('update:gridColumns', gridColumns === 2 ? 3 : 2)"
            :class="[
              'px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2',
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
            ]"
            title="Ubah tampilan grid"
          >
            <svg v-if="gridColumns === 2" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM12 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM16 13a1 1 0 00-1 1v2a1 1 0 001 1h0a1 1 0 001-1v-2a1 1 0 00-1-1z" />
            </svg>
          </button>
        </div>

        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
          <div
            v-for="(item, index) in activeFiltersList"
            :key="index"
            class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
          >
            <span>{{ item }}</span>
            <button
              @click="removeFilter(index)"
              class="hover:text-blue-900 dark:hover:text-blue-100 transition-colors"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Drawer Modal -->
    <Transition name="slide-in">
      <div v-if="showFilterDrawer" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div
          @click="showFilterDrawer = false"
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        <!-- Drawer -->
        <div class="absolute bottom-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-l-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Filter Produk</h2>
              <button
                @click="showFilterDrawer = false"
                class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <!-- Category Filters -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Kategori</h3>
              <div class="space-y-2">
                <label
                  v-for="category in categories"
                  :key="category"
                  class="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    :checked="selectedFilters.categories.includes(category)"
                    @change="toggleFilter('categories', category)"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {{ category }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="clearFilters"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Hapus Semua
              </button>
              <button
                @click="showFilterDrawer = false"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  categories: string[]
  searchQuery: string
  sortBy: string
  selectedFilters: {
    categories: string[]
  }
  gridColumns: number
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'update:sortBy', value: string): void
  (e: 'update:selectedFilters', value: Props['selectedFilters']): void
  (e: 'update:gridColumns', value: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showFilterDrawer = ref(false)
const isSticky = ref(false)
const isTitleCollapsed = ref(false)
const headerHeight = ref(0)
const headerElement = ref<HTMLElement | null>(null)

const hasActiveFilters = computed(() => {
  return props.selectedFilters.categories.some(cat => cat !== 'Semua' && props.categories.includes(cat))
})

const filterBadgeCount = computed(() => {
  return props.selectedFilters.categories.filter(cat => cat !== 'Semua').length
})

const activeFiltersList = computed(() => {
  return props.selectedFilters.categories.filter(cat => cat !== 'Semua')
})

const toggleFilter = (type: 'categories', value: string) => {
  const newFilters = { ...props.selectedFilters }
  const index = newFilters[type].indexOf(value)
  
  if (index > -1) {
    newFilters[type].splice(index, 1)
  } else {
    // If selecting a specific category, remove 'Semua'
    if (value !== 'Semua') {
      const semuaIndex = newFilters[type].indexOf('Semua')
      if (semuaIndex > -1) {
        newFilters[type].splice(semuaIndex, 1)
      }
    }
    newFilters[type].push(value)
  }

  // If no categories selected, default to 'Semua'
  if (newFilters[type].length === 0) {
    newFilters[type] = ['Semua']
  }

  emit('update:selectedFilters', newFilters)
}

const removeFilter = (index: number) => {
  const newFilters = { ...props.selectedFilters }
  newFilters.categories.splice(index, 1)
  
  if (newFilters.categories.length === 0) {
    newFilters.categories = ['Semua']
  }
  
  emit('update:selectedFilters', newFilters)
}

const clearFilters = () => {
  emit('update:selectedFilters', {
    categories: ['Semua']
  })
}

onMounted(() => {
  headerElement.value = document.querySelector('.sticky-header-wrapper')
  
  const observer = new IntersectionObserver(
    ([entry]) => {
      isSticky.value = !entry.isIntersecting
      isTitleCollapsed.value = !entry.isIntersecting
    },
    { threshold: 0 }
  )

  if (headerElement.value) {
    observer.observe(headerElement.value)
  }
})
</script>

<style scoped>
.sticky-header-wrapper {
  --header-height: 0px;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: opacity 0.3s ease;
}

.slide-in-enter-active > div:last-child,
.slide-in-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.slide-in-enter-from,
.slide-in-leave-to {
  opacity: 0;
}

.slide-in-enter-from > div:last-child,
.slide-in-leave-to > div:last-child {
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .slide-in-enter-active > div:last-child,
  .slide-in-leave-active > div:last-child {
    transition: transform 0.3s ease;
  }

  .slide-in-enter-from > div:last-child,
  .slide-in-leave-to > div:last-child {
    transform: translateY(100%);
  }
}
</style>
