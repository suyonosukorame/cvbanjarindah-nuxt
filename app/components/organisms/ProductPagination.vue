<template>
  <nav
    aria-label="Navigasi halaman produk"
    class="flex items-center justify-center gap-2"
  >
    <button
      type="button"
      :disabled="page <= 1"
      aria-label="Halaman sebelumnya"
      class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      @click="changePage(page - 1)"
    >
      Sebelumnya
    </button>

    <button
      v-for="pageNumber in visiblePages"
      :key="pageNumber"
      type="button"
      :aria-current="pageNumber === page ? 'page' : undefined"
      :class="[
        'hidden h-10 min-w-10 rounded-lg border px-3 text-sm transition-colors sm:inline-flex sm:items-center sm:justify-center',
        pageNumber === page
          ? 'border-blue-600 bg-blue-600 font-semibold text-white'
          : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800'
      ]"
      @click="changePage(pageNumber)"
    >
      {{ pageNumber }}
    </button>

    <span class="px-1 text-sm text-gray-600 dark:text-gray-300 sm:hidden">
      {{ page }} / {{ totalPages }}
    </span>

    <button
      type="button"
      :disabled="page >= totalPages"
      aria-label="Halaman berikutnya"
      class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      @click="changePage(page + 1)"
    >
      Berikutnya
    </button>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  page: number
  pageSize: number
  total: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'update:page', value: number): void
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const visiblePages = computed(() => {
  const start = Math.max(1, Math.min(props.page - 2, totalPages.value - 4))
  const end = Math.min(totalPages.value, start + 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

const changePage = (page: number) => {
  emit('update:page', Math.max(1, Math.min(page, totalPages.value)))
}
</script>
