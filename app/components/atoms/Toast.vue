<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <div
      v-if="show"
      class="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border shadow-lg p-4"
      :class="variantClass"
      role="alert"
    >
      <!-- Icon -->
      <div class="shrink-0">
        <AtomsIcon :name="iconName" :color="iconColor" size="md" />
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p v-if="title" class="font-semibold text-sm mb-0.5" :class="titleClass">
          {{ title }}
        </p>
        <p class="text-sm" :class="messageClass">
          {{ message }}
        </p>
      </div>
      
      <!-- Close Button -->
      <button
        v-if="closeable"
        @click="close"
        class="shrink-0 -mr-1 -mt-1 p-1 rounded hover:bg-black/5 transition-colors"
        aria-label="Close"
      >
        <AtomsIcon name="close" size="sm" :color="iconColor" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  show?: boolean
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  closeable?: boolean
  duration?: number // auto close after X ms (0 = manual close only)
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  variant: 'info',
  closeable: true,
  duration: 5000,
})

const emit = defineEmits<{
  close: []
}>()

const variantClass = computed(() => {
  const variants = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }
  return variants[props.variant]
})

const titleClass = computed(() => {
  const classes = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
  }
  return classes[props.variant]
})

const messageClass = computed(() => {
  const classes = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  }
  return classes[props.variant]
})

const iconName = computed(() => {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  return icons[props.variant]
})

const iconColor = computed(() => {
  const colors = {
    success: 'success' as const,
    error: 'danger' as const,
    warning: 'danger' as const,
    info: 'primary' as const,
  }
  return colors[props.variant]
})

function close() {
  emit('close')
}

// Auto close after duration
let timeoutId: ReturnType<typeof setTimeout> | null = null

watch(() => props.show, (isShown) => {
  if (isShown && props.duration > 0) {
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
}, { immediate: true })

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>
