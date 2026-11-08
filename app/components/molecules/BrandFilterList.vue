<template>
  <div>
    <input
      v-model="searchQuery"
      type="search"
      placeholder="Cari brand..."
      aria-label="Cari brand"
      class="mb-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
    />

    <div class="max-h-52 space-y-2 overflow-y-auto overscroll-contain pr-1">
      <label
        v-for="brand in filteredBrands"
        :key="brand.id"
        class="group flex cursor-pointer items-center gap-3"
      >
        <input
          type="checkbox"
          :checked="selectedIds.includes(brand.id)"
          @change="emit('toggle', brand.id)"
          class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span class="text-sm text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
          {{ brand.name }}
        </span>
      </label>

      <p v-if="filteredBrands.length === 0" class="py-3 text-center text-sm text-gray-500 dark:text-gray-400">
        Brand tidak ditemukan.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductFilterOption } from '~/types/product'

interface Props {
  brands: ProductFilterOption[]
  selectedIds: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'toggle', brandId: string): void
}>()

const searchQuery = ref('')

const filteredBrands = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()
  if (!query) return props.brands

  return props.brands.filter(brand =>
    brand.name.toLocaleLowerCase().includes(query)
  )
})
</script>
