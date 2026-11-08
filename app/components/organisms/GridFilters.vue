<template>
  <div class="flex gap-4 overflow-x-auto pb-2">
    <button
      v-for="item in items"
      :key="item.value"
      @click="emit('update:modelValue', item.value)"
      :class="[
        'px-6 py-2 rounded-full font-bold whitespace-nowrap transition',
        isActive(item.value)
          ? 'bg-primary text-white shadow-md'
          : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
      ]"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * GridFilters
 * 
 * Reusable filter button component for grid filtering/categorization
 * 
 * Props:
 * - items: Array of { label: string, value: string }
 * - modelValue: Currently selected filter value
 * 
 * Emits:
 * - update:modelValue: When filter is changed
 * 
 * Example:
 * <GridFilters
 *   v-model="selectedCategory"
 *   :items="[
 *     { label: 'Semua', value: 'all' },
 *     { label: 'Tissue', value: 'tissue' },
 *     { label: 'Masker', value: 'masker' }
 *   ]"
 * />
 */

interface FilterItem {
  label: string
  value: string
}

interface Props {
  items: FilterItem[]
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isActive = (value: string) => value === props.modelValue
</script>
