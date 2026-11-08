<template>
  <div class="w-full">
    <!-- Compact Header with Search, Sort, Filter -->
    <OrganismsCompactHeader
      :title="title"
      :subtitle="subtitle"
      :categories="categories"
      :search-query="searchQuery"
      :sort-by="sortBy"
      :selected-filters="selectedFilters"
      :grid-columns="gridColumns"
      @update:search-query="searchQuery = $event"
      @update:sort-by="sortBy = $event"
      @update:selected-filters="selectedFilters = $event"
      @update:grid-columns="gridColumns = $event"
    />

    <!-- Featured Products Grid -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Empty State -->
      <div
        v-if="filteredProducts.length === 0"
        class="text-center py-16"
      >
        <svg
          class="w-16 h-16 mx-auto text-slate-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p class="text-slate-500 text-lg">Tidak ada produk yang sesuai</p>
        <p class="text-slate-400 text-sm mt-1">Coba ubah filter atau pencarian Anda</p>
      </div>

      <!-- Products Grid -->
      <div
        v-else
        :class="[
          'grid gap-4 md:gap-6',
          gridColumns === 2
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        ]"
      >
        <MoleculesProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Results Count -->
      <div class="text-center mt-12 text-sm text-slate-500">
        Menampilkan {{ filteredProducts.length }} dari {{ allProducts.length }} produk
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

interface Props {
  title?: string
  subtitle?: string
  products: Product[]
  categories: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Produk Unggulan',
  subtitle: 'Pilihan terbaik dari koleksi kami'
})

const searchQuery = ref('')
const sortBy = ref('newest')
const gridColumns = ref(2)
const selectedFilters = ref({
  categories: ['Semua']
})

const allProducts = computed(() => props.products)

// Filter dan sort products
const filteredProducts = computed(() => {
  let results = [...props.products]

  // Apply category filter
  if (!selectedFilters.value.categories.includes('Semua')) {
    results = results.filter(product =>
      selectedFilters.value.categories.includes(product.category)
    )
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    )
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'name-asc':
      results.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      results.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'price-asc':
      results.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'price-desc':
      results.sort((a, b) => (b.price || 0) - (a.price || 0))
      break
    case 'newest':
    default:
      // Keep original order
      break
  }

  return results
})
</script>
