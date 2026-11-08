<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
    >
      <span class="flex items-center gap-2">
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span class="truncate">{{ getSortLabel }}</span>
      </span>
      <svg
        :class="['w-4 h-4 text-gray-400 transition-transform', { 'transform rotate-180': isOpen }]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isOpen"
          @click="isOpen = false"
          class="fixed inset-0 z-30"
        />
      </Transition>

      <Transition name="slide-up">
        <div
          v-if="isOpen"
          class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-40"
        >
          <button
            v-for="option in sortOptions"
            :key="option.value"
            @click="selectSort(option.value)"
            :class="[
              'w-full text-left px-4 py-3 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg',
              modelValue === option.value
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
          >
            <span class="flex items-center gap-2">
              <svg v-if="modelValue === option.value" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span v-else class="w-4" />
              {{ option.label }}
            </span>
          </button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = ref(false)

const sortOptions = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Nama A-Z', value: 'name-asc' },
  { label: 'Nama Z-A', value: 'name-desc' },
  { label: 'Harga Terendah', value: 'price-asc' },
  { label: 'Harga Tertinggi', value: 'price-desc' }
]

const getSortLabel = computed(() => {
  const option = sortOptions.find(o => o.value === props.modelValue)
  return option?.label || 'Urutkan'
})

const selectSort = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
