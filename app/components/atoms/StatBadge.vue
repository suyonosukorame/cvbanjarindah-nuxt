<template>
  <span 
    class="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold transition-colors"
    :class="variantClass"
  >
    {{ formattedValue }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  value: number
  variant?: 'default' | 'primary' | 'success'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})

const variantClass = computed(() => {
  const variants = {
    default: 'bg-slate-700/80 text-white',
    primary: 'bg-primary/90 text-white',
    success: 'bg-green-500/90 text-white',
  }
  return variants[props.variant]
})

// Format number dengan separator ribuan
const formattedValue = computed(() => {
  return new Intl.NumberFormat('id-ID').format(props.value)
})
</script>
