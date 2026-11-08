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
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-slate-600">Memuat produk...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-red-600 mb-4">⚠️ {{ error }}</p>
        <p class="text-slate-600">Menampilkan data cadangan...</p>
      </div>

      <!-- Products -->
      <OrganismsProductGrid
        v-else
        :products="filteredAndSortedProducts"
        :categories="categories"
        :selected-category="selectedCategory"
        :grid-columns="gridColumns"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

definePageMeta({
  layout: 'default',
})

const categories = ['Semua', 'Tissue', 'Masker', 'Bayi']

// Fetch products from Supabase
const { supabase } = useSupabase()
const allProducts = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const categoryMap = ref<Record<string, string>>({})

// Fetch categories first to build mapping
const fetchCategories = async () => {
  try {
    const { data, error: catError } = await supabase
      .from('categories')
      .select('id, name')
    
    if (!catError && data) {
      categoryMap.value = data.reduce((acc: Record<string, string>, cat: any) => {
        acc[cat.id] = cat.name
        return acc
      }, {})
    }
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

// Fetch products on mount
onMounted(async () => {
  try {
    loading.value = true
    
    // Fetch categories first
    await fetchCategories()
    
    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (fetchError) {
      console.error('Error fetching products:', fetchError)
      error.value = fetchError.message
      // Fallback to static data jika error
      const { products: staticProducts } = await import('~/data/products')
      allProducts.value = staticProducts
    } else {
      // Map Supabase data to Product type
      allProducts.value = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        category: getCategoryName(item.category_id),
        image: item.image_url || 'https://images.unsplash.com/photo-1584556326561-c8746083993b?w=400&h=300&fit=crop',
        featured: item.is_featured || false,
        price: item.price,
        stock: item.stock,
      }))
    }
  } catch (err: any) {
    console.error('Fetch error:', err)
    error.value = err.message
    // Fallback to static data
    const { products: staticProducts } = await import('~/data/products')
    allProducts.value = staticProducts
  } finally {
    loading.value = false
  }
})

// Helper function to map category_id to category name
const getCategoryName = (categoryId: string | null): string => {
  if (!categoryId) return 'Tissue'
  return categoryMap.value[categoryId] || 'Tissue'
}

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
