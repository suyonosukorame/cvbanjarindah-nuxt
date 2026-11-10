<template>
  <div>
    <OrganismsCompactHeader
      title="Produk Kami"
      subtitle="Jelajahi koleksi lengkap produk berkualitas dari CV Banjar Indah"
      :categories="categories"
      :brands="brandOptions"
      :search-query="searchQuery"
      :sort-by="sortBy"
      :selected-filters="selectedFilters"
      :grid-columns="gridColumns"
      :grid-max-columns="6"
      @update:search-query="searchQuery = $event"
      @update:sort-by="sortBy = $event"
      @update:selected-filters="selectedFilters = $event"
      @update:grid-columns="gridColumns = $event"
    />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p class="text-slate-600">Memuat produk...</p>
        </div>
      </div>

      <div v-else-if="error" class="py-20 text-center">
        <p class="mb-4 text-red-600">⚠️ {{ error }}</p>
        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          @click="loadCatalog"
        >
          Coba lagi
        </button>
      </div>

      <template v-else>
        <p class="mb-5 text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
          Menampilkan {{ resultStart }}–{{ resultEnd }} dari {{ totalProducts }} produk
        </p>

        <OrganismsProductGrid
          :products="products"
          :categories="categories"
          :selected-category="selectedCategory"
          :grid-columns="gridColumns"
        />

        <OrganismsProductPagination
          v-if="totalProducts > pageSize"
          v-model:page="page"
          :page-size="pageSize"
          :total="totalProducts"
          class="mt-8"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product, ProductFilterOption } from '~/types/product'

definePageMeta({
  layout: 'default',
})

const pageSize = 24
const categoriesData = ref<ProductFilterOption[]>([])
const brandOptions = ref<ProductFilterOption[]>([])
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const totalProducts = ref(0)
const searchQuery = ref('')
const sortBy = ref('newest')
const page = ref(1)
const gridColumns = ref(6)
const selectedFilters = ref({
  categories: ['Semua'],
  brands: [] as string[],
})

const { supabase } = useSupabase()
let latestRequestId = 0
let searchDebounce: ReturnType<typeof setTimeout> | undefined

const categories = computed(() => [
  'Semua',
  ...categoriesData.value.map(category => category.name),
])

const selectedCategory = computed(() => selectedFilters.value.categories[0] || 'Semua')
const resultStart = computed(() => totalProducts.value === 0 ? 0 : (page.value - 1) * pageSize + 1)
const resultEnd = computed(() => Math.min(page.value * pageSize, totalProducts.value))

const loadFilterOptions = async () => {
  const [categoryResult, brandResult] = await Promise.all([
    supabase
      .from('categories')
      .select('id, name')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
    supabase
      .from('brands')
      .select('id, name')
      .eq('is_active', true)
      .order('name', { ascending: true }),
  ])

  if (categoryResult.error) throw categoryResult.error
  if (brandResult.error) throw brandResult.error

  categoriesData.value = categoryResult.data ?? []
  brandOptions.value = brandResult.data ?? []
}

const loadProducts = async () => {
  const requestId = ++latestRequestId
  loading.value = true
  error.value = null

  try {
    let query = supabase
      .from('products')
      .select(
        'id, name, description, image_url, price, stock, is_featured, created_at, category_id, brand_id, tiktok_post_id',
        { count: 'exact' },
      )
      .eq('status', 'active')

    const searchTerm = searchQuery.value.trim()
    if (searchTerm) {
      const escapedSearchTerm = searchTerm.replace(/[\\"]/g, '\\$&')
      query = query.or(
        `name.ilike."%${escapedSearchTerm}%",description.ilike."%${escapedSearchTerm}%"`,
      )
    }

    if (!selectedFilters.value.categories.includes('Semua')) {
      const selectedCategoryIds = categoriesData.value
        .filter(category => selectedFilters.value.categories.includes(category.name))
        .map(category => category.id)

      if (selectedCategoryIds.length === 0) {
        products.value = []
        totalProducts.value = 0
        return
      }

      query = query.in('category_id', selectedCategoryIds)
    }

    if (selectedFilters.value.brands.length > 0) {
      query = query.in('brand_id', selectedFilters.value.brands)
    }

    switch (sortBy.value) {
      case 'name-asc':
        query = query.order('name', { ascending: true })
        break
      case 'name-desc':
        query = query.order('name', { ascending: false })
        break
      case 'price-asc':
        query = query.order('price', { ascending: true, nullsFirst: false })
        break
      case 'price-desc':
        query = query.order('price', { ascending: false, nullsFirst: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    query = query.order('id', { ascending: true })

    const from = (page.value - 1) * pageSize
    const { data, error: queryError, count } = await query.range(from, from + pageSize - 1)

    if (requestId !== latestRequestId) return
    if (queryError) throw queryError

    const resultCount = count ?? 0
    const lastPage = Math.max(1, Math.ceil(resultCount / pageSize))
    totalProducts.value = resultCount

    if (page.value > lastPage) {
      page.value = lastPage
      return
    }

    products.value = (data ?? []).map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      category: categoriesData.value.find(category => category.id === item.category_id)?.name || 'Lainnya',
      image: item.image_url || 'https://images.unsplash.com/photo-1584556326561-c8746083993b?w=400&h=300&fit=crop',
      featured: item.is_featured || false,
      price: item.price === null ? null : Number(item.price),
      stock: item.stock,
      brandId: item.brand_id,
      brand: brandOptions.value.find(brand => brand.id === item.brand_id)?.name,
      createdAt: item.created_at,
      tiktok_post_id: item.tiktok_post_id || null,
    }))
  } catch (fetchError) {
    if (requestId !== latestRequestId) return
    error.value = fetchError instanceof Error ? fetchError.message : 'Gagal memuat produk.'
    products.value = []
    totalProducts.value = 0
  } finally {
    if (requestId === latestRequestId) loading.value = false
  }
}

const scheduleProductFetch = (delay = 0) => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    void loadProducts()
  }, delay)
}

const loadCatalog = async () => {
  loading.value = true
  error.value = null

  try {
    await loadFilterOptions()
    await loadProducts()
  } catch (fetchError) {
    error.value = fetchError instanceof Error ? fetchError.message : 'Gagal memuat filter produk.'
    loading.value = false
  }
}

watch(searchQuery, () => {
  if (page.value !== 1) page.value = 1
  scheduleProductFetch(300)
})

watch([
  sortBy,
  () => selectedFilters.value.categories.join(','),
  () => selectedFilters.value.brands.join(','),
], () => {
  if (page.value !== 1) page.value = 1
  scheduleProductFetch()
})

watch(page, () => scheduleProductFetch())

onMounted(loadCatalog)

onUnmounted(() => {
  if (searchDebounce) clearTimeout(searchDebounce)
  latestRequestId += 1
})
</script>
