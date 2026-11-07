<template>
  <span 
    class="material-symbols-outlined select-none"
    :class="[sizeClass, colorClass]"
    :style="{ fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}` }"
  >
    {{ name }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'white' | 'slate'
  fill?: boolean
  weight?: 300 | 400 | 500 | 600 | 700
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'slate',
  fill: false,
  weight: 400,
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'text-base',      // 16px
    md: 'text-xl',        // 20px
    lg: 'text-2xl',       // 24px
    xl: 'text-3xl',       // 30px
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  const colors = {
    primary: 'text-primary',
    secondary: 'text-slate-600',
    success: 'text-green-500',
    danger: 'text-red-500',
    white: 'text-white',
    slate: 'text-slate-700',
  }
  return colors[props.color]
})
</script>
