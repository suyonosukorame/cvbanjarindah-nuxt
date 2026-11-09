import type { Product } from '~/types/product'

interface FilterState {
  categories: string[]
}

export const useProductFiltering = (allProducts: Ref<Product[]>, categories: Ref<string[]>) => {
  const searchQuery = ref('')
  const sortBy = ref('newest')
  const gridColumns = ref(6)
  const selectedFilters = ref<FilterState>({
    categories: ['Semua']
  })

  // Filter dan sort produk berdasarkan query, kategori, dan urutan
  const filteredAndSortedProducts = computed(() => {
    let results = [...allProducts.value]

    // 1. Apply category filter
    if (!selectedFilters.value.categories.includes('Semua')) {
      results = results.filter(product =>
        selectedFilters.value.categories.includes(product.category)
      )
    }

    // 2. Apply search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      results = results.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      )
    }

    // 3. Apply sorting
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
        // Sort by createdAt descending or by ID descending
        results.sort((a, b) => {
          if (b.createdAt && a.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          return String(b.id || '').localeCompare(String(a.id || ''))
        })
        break
    }

    return results
  })

  const resetFilters = () => {
    searchQuery.value = ''
    sortBy.value = 'newest'
    selectedFilters.value = { categories: ['Semua'] }
  }

  return {
    searchQuery,
    sortBy,
    selectedFilters,
    gridColumns,
    filteredAndSortedProducts,
    resetFilters
  }
}
