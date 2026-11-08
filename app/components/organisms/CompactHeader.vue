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
            @click="emit('update:gridColumns', gridColumns === 2 ? gridMaxColumns : 2)"
            :class="[
              'px-4 py-2.5 rounded-lg border transition-all flex items-center gap-2',
              'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'
            ]"
            :title="`Tampilkan ${gridColumns === 2 ? gridMaxColumns : 2} kolom`"
            :aria-label="`Tampilkan ${gridColumns === 2 ? gridMaxColumns : 2} kolom`"
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
            v-for="item in activeFiltersList"
            :key="`${item.type}-${item.value}`"
            class="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
          >
            <span>{{ item.label }}</span>
            <button
              @click="removeFilter(item)"
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

    <OrganismsProductFilterDrawer
      :model-value="showFilterDrawer"
      :categories="categories"
      :brands="brands"
      :selected-filters="normalizedSelectedFilters"
      @update:model-value="showFilterDrawer = $event"
      @update:selected-filters="emit('update:selectedFilters', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ProductFilterOption } from '~/types/product'

interface Props {
  title: string
  subtitle: string
  categories: string[]
  brands?: ProductFilterOption[]
  searchQuery: string
  sortBy: string
  selectedFilters: {
    categories: string[]
    brands?: string[]
  }
  gridColumns: number
  gridMaxColumns?: number
}

interface Emits {
  (e: 'update:searchQuery', value: string): void
  (e: 'update:sortBy', value: string): void
  (e: 'update:selectedFilters', value: { categories: string[]; brands: string[] }): void
  (e: 'update:gridColumns', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  brands: () => [],
  gridMaxColumns: 3
})
const emit = defineEmits<Emits>()

const showFilterDrawer = ref(false)
const isSticky = ref(false)
const isTitleCollapsed = ref(false)
const headerHeight = ref(0)
const headerElement = ref<HTMLElement | null>(null)

const normalizedSelectedFilters = computed(() => ({
  categories: props.selectedFilters.categories,
  brands: props.selectedFilters.brands ?? [],
}))

const activeFiltersList = computed(() => [
  ...props.selectedFilters.categories
    .filter(category => category !== 'Semua' && props.categories.includes(category))
    .map(value => ({ type: 'categories' as const, value, label: value })),
  ...(props.selectedFilters.brands ?? []).map(value => ({
    type: 'brands' as const,
    value,
    label: props.brands.find(brand => brand.id === value)?.name ?? value,
  })),
])

const hasActiveFilters = computed(() => activeFiltersList.value.length > 0)
const filterBadgeCount = computed(() => activeFiltersList.value.length)

const removeFilter = (filter: { type: 'categories' | 'brands'; value: string }) => {
  const newFilters = { ...props.selectedFilters }

  if (filter.type === 'categories') {
    newFilters.categories = newFilters.categories.filter(value => value !== filter.value)
  } else {
    newFilters.brands = (newFilters.brands ?? []).filter(value => value !== filter.value)
  }

  if (newFilters.categories.length === 0) {
    newFilters.categories = ['Semua']
  }

  emit('update:selectedFilters', {
    categories: newFilters.categories,
    brands: newFilters.brands ?? [],
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
</style>
