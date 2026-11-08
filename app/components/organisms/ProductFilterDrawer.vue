<template>
  <Teleport to="body">
    <Transition name="filter">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[60]"
        @keydown.esc="close"
      >
        <button
          type="button"
          aria-label="Tutup filter"
          class="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-sm"
          @click="close"
        />

        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-filter-title"
          class="filter-panel absolute inset-y-0 right-0 flex h-dvh w-[90vw] max-w-[360px] flex-col bg-white shadow-2xl dark:bg-gray-900 sm:w-[26rem] sm:max-w-none sm:rounded-l-2xl"
        >
          <header class="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-700">
            <h2 id="product-filter-title" class="text-lg font-bold text-gray-900 dark:text-white">
              Filter Produk
            </h2>
            <button
              type="button"
              @click="close"
              aria-label="Tutup filter"
              class="text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </header>

          <div class="flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <details class="rounded-xl border border-gray-200 dark:border-gray-700">
              <summary class="group flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">Kategori</span>
                <span class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ categorySummary }}
                  <svg class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div class="space-y-1 border-t border-gray-200 p-3 dark:border-gray-700">
                <label
                  v-for="category in categories"
                  :key="category"
                  class="group flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-1"
                >
                  <input
                    type="checkbox"
                    :checked="draftFilters.categories.includes(category)"
                    @change="toggleCategory(category)"
                    class="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700 transition-colors group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
                    {{ category }}
                  </span>
                </label>
              </div>
            </details>

            <details v-if="brands.length > 0" class="rounded-xl border border-gray-200 dark:border-gray-700">
              <summary class="group flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span class="text-sm font-semibold text-gray-900 dark:text-white">Brand</span>
                <span class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {{ brandSummary }}
                  <svg class="h-4 w-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div class="border-t border-gray-200 p-3 dark:border-gray-700">
                <MoleculesBrandFilterList
                  :brands="brands"
                  :selected-ids="draftFilters.brands"
                  @toggle="toggleBrand"
                />
              </div>
            </details>
          </div>

          <footer class="flex shrink-0 gap-3 border-t border-gray-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] dark:border-gray-700 dark:bg-gray-900 sm:p-6">
            <button
              type="button"
              @click="clearFilters"
              class="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Hapus Semua
            </button>
            <button
              type="button"
              @click="applyFilters"
              class="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Terapkan
            </button>
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ProductFilterOption } from '~/types/product'

interface FilterState {
  categories: string[]
  brands: string[]
}

interface Props {
  modelValue: boolean
  categories: string[]
  brands: ProductFilterOption[]
  selectedFilters: FilterState
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:selectedFilters', value: FilterState): void
}>()

const draftFilters = ref<FilterState>({
  categories: ['Semua'],
  brands: [],
})
let previousBodyOverflow: string | null = null

const categorySummary = computed(() => {
  const selectedCount = draftFilters.value.categories.filter(category => category !== 'Semua').length
  return selectedCount > 0 ? `${selectedCount} dipilih` : 'Semua'
})

const brandSummary = computed(() => draftFilters.value.brands.length > 0
  ? `${draftFilters.value.brands.length} dipilih`
  : `${props.brands.length} tersedia`)

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    draftFilters.value = {
      categories: [...props.selectedFilters.categories],
      brands: [...props.selectedFilters.brands],
    }

    if (import.meta.client) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
  } else {
    restoreBodyOverflow()
  }
})

const restoreBodyOverflow = () => {
  if (import.meta.client && previousBodyOverflow !== null) {
    document.body.style.overflow = previousBodyOverflow
    previousBodyOverflow = null
  }
}

const close = () => emit('update:modelValue', false)

const toggleCategory = (category: string) => {
  if (category === 'Semua') {
    draftFilters.value.categories = ['Semua']
    return
  }

  const selected = draftFilters.value.categories.filter(value => value !== 'Semua')
  const index = selected.indexOf(category)

  if (index >= 0) selected.splice(index, 1)
  else selected.push(category)

  draftFilters.value.categories = selected.length ? selected : ['Semua']
}

const toggleBrand = (brandId: string) => {
  const selected = draftFilters.value.brands
  const index = selected.indexOf(brandId)

  if (index >= 0) selected.splice(index, 1)
  else selected.push(brandId)
}

const clearFilters = () => {
  draftFilters.value = { categories: ['Semua'], brands: [] }
}

const applyFilters = () => {
  emit('update:selectedFilters', {
    categories: [...draftFilters.value.categories],
    brands: [...draftFilters.value.brands],
  })
  close()
}

onUnmounted(restoreBodyOverflow)
</script>

<style scoped>
.filter-enter-active,
.filter-leave-active {
  transition: opacity 0.25s ease;
}

.filter-enter-active .filter-panel,
.filter-leave-active .filter-panel {
  transition: transform 0.25s ease;
}

.filter-enter-from,
.filter-leave-to {
  opacity: 0;
}

.filter-enter-from .filter-panel,
.filter-leave-to .filter-panel {
  transform: translateX(100%);
}
</style>
