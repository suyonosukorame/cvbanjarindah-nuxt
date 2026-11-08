<template>
  <OrganismsResponsiveGridContainer
    :is-empty="products.length === 0"
    empty-message="Tidak ada produk di kategori ini"
    :columns="gridColumnSettings"
    :gap="{ mobile: 'gap-3', tablet: 'gap-4', desktop: 'gap-6' }"
  >
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
  gridColumns?: number
}

const props = defineProps<Props>()

const gridColumnSettings = computed(() => {
  const cols = props.gridColumns || 6
  return {
    mobile: Math.min(cols, 2),      // Max 2 kolom di mobile
    tablet: Math.min(cols, 3),      // Max 3 kolom di tablet
    desktop: Math.min(cols, 6)      // Max 6 kolom di desktop
  }
})
</script>
