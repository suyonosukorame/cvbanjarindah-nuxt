<template>
  <div class="space-y-4">
    <!-- Header with search & actions -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex-1">
        <label class="relative block">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari data..."
            class="h-10 w-full rounded-lg border border-slate-300 bg-white pl-4 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
        </label>
      </div>
      <slot name="actions" />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-slate-200">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-left text-xs font-semibold text-slate-700"
              :style="{ width: column.width }"
            >
              {{ column.label }}
            </th>
            <th v-if="$slots.rowActions" class="px-4 py-3 text-center text-xs font-semibold text-slate-700 w-20">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in filteredData"
            :key="index"
            class="border-b border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3 text-sm text-slate-700"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
            <td v-if="$slots.rowActions" class="px-4 py-3 text-center">
              <slot name="rowActions" :row="row" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div
        v-if="filteredData.length === 0"
        class="flex items-center justify-center p-8 text-slate-500"
      >
        <div class="text-center">
          <span class="material-symbols-outlined text-4xl mb-2 block">inbox</span>
          <p class="text-sm">Data tidak ditemukan</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination" class="flex items-center justify-between text-sm text-slate-600">
      <span>
        Menampilkan {{ startIndex + 1 }} hingga {{ endIndex }} dari {{ filteredData.length }} data
      </span>
      <div class="flex gap-2">
        <button
          :disabled="currentPage === 0"
          class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
          @click="currentPage--"
        >
          Sebelumnya
        </button>
        <span class="px-3 py-1">Halaman {{ currentPage + 1 }} dari {{ totalPages }}</span>
        <button
          :disabled="currentPage >= totalPages - 1"
          class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
          @click="currentPage++"
        >
          Berikutnya
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  key: string
  label: string
  width?: string
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
  pagination?: boolean
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  pagination: true,
  pageSize: 10
})

const searchQuery = ref('')
const currentPage = ref(0)

const filteredData = computed(() => {
  let filtered = props.data

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(query)
      )
    )
  }

  if (!props.pagination) return filtered

  const start = currentPage.value * props.pageSize
  return filtered.slice(start, start + props.pageSize)
})

const totalPages = computed(() => {
  const total = props.data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  ).length
  return Math.ceil(total / props.pageSize)
})

const startIndex = computed(() => currentPage.value * props.pageSize)
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, props.data.length))
</script>
