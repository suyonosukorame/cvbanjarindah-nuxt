<template>
  <OrganismsResponsiveGridContainer
    :is-empty="products.length === 0"
    empty-message="Tidak ada produk di kategori ini"
    :columns="{ mobile: 2, tablet: 3, desktop: 4 }"
    :gap="{ mobile: 'gap-3', tablet: 'gap-4', desktop: 'gap-6' }"
  >
    <!-- Filters Slot -->
    <template #filters>
      <OrganismsGridFilters
        :model-value="selectedCategory"
        :items="filterItems"
        @update:model-value="emit('update:selectedCategory', $event)"
      />
    </template>

    <!-- Products Grid Items -->
    <MoleculesProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </OrganismsResponsiveGridContainer>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product'

interface Props {
  products: Product[]
  categories: string[]
  selectedCategory: string
}

interface Emits {
  (e: 'update:selectedCategory', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Convert categories to filter items format
const filterItems = computed(() => {
  return props.categories.map(category => ({
    label: category,
    value: category
  }))
})
</script>
