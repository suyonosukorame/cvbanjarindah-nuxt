<template>
  <div>
    <!-- Smart Header with Search, Sort, Filter -->
    <OrganismsCompactHeader
      title="Produk Kami"
      subtitle="Jelajahi koleksi lengkap produk berkualitas dari CV Banjar Indah"
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

    <!-- Product Grid -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <OrganismsProductGrid
        :products="filteredAndSortedProducts"
        :categories="categories"
        :selected-category="selectedCategory"
        :grid-columns="gridColumns"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { products } from '~/data/products'

definePageMeta({
  layout: 'default',
})

const categories = ['Semua', 'Tissue', 'Masker', 'Bayi']
const allProducts = ref(products)

// Use filtering composable
const {
  searchQuery,
  sortBy,
  selectedFilters,
  gridColumns,
  filteredAndSortedProducts,
} = useProductFiltering(allProducts, ref(categories))

// Computed category filter
const selectedCategory = computed(() => {
  if (selectedFilters.value.categories.includes('Semua')) {
    return 'Semua'
  }
  return selectedFilters.value.categories[0] || 'Semua'
})
</script>
