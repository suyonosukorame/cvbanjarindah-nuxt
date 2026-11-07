<template>
  <div
    class="flex items-center gap-3"
    :class="{ 'cursor-pointer': clickable }"
    @click="clickable && $emit('click')"
  >
    <div
      class="flex items-center justify-center rounded-full font-bold text-white"
      :class="[
        sizeClasses,
        colorClasses
      ]"
    >
      {{ initials }}
    </div>
    <div v-if="!compact" class="min-w-0">
      <p class="text-sm font-semibold text-slate-900 truncate">{{ name }}</p>
      <p class="text-xs text-slate-500 truncate">{{ role }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  role?: string
  image?: string
  color?: 'blue' | 'purple' | 'green' | 'red' | 'yellow' | 'pink' | 'indigo'
  size?: 'sm' | 'md' | 'lg'
  compact?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  size: 'md',
  compact: false,
  clickable: false
})

defineEmits<{
  click: []
}>()

const initials = computed(() => {
  return props.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500'
  }
  return colors[props.color]
})
</script>
