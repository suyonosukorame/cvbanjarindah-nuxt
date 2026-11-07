<template>
  <div v-if="show" class="w-full">
    <div class="flex items-center justify-between mb-1">
      <span class="text-xs font-medium text-slate-700">
        {{ label }}
      </span>
      <span class="text-xs text-slate-500">
        {{ percentage }}%
      </span>
    </div>
    <div class="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
      <div 
        class="h-full transition-all duration-300 ease-out rounded-full"
        :class="colorClass"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  percentage: number
  label?: string
  variant?: 'primary' | 'success' | 'danger'
  show?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Uploading...',
  variant: 'primary',
  show: true,
})

const colorClass = computed(() => {
  const variants = {
    primary: 'bg-primary',
    success: 'bg-green-500',
    danger: 'bg-red-500',
  }
  return variants[props.variant]
})
</script>
