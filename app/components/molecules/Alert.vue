<template>
  <div
    role="alert"
    class="flex items-start gap-3 rounded-lg border px-4 py-3"
    :class="alertClasses"
  >
    <span class="material-symbols-outlined shrink-0 mt-0.5">{{ icon }}</span>
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold">{{ title }}</p>
      <p v-if="message" class="text-sm mt-1 opacity-90">{{ message }}</p>
    </div>
    <button
      v-if="closeable"
      type="button"
      @click="$emit('close')"
      class="shrink-0 p-1 hover:opacity-75 transition-opacity"
    >
      <span class="material-symbols-outlined text-lg">close</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  closeable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  closeable: true
})

defineEmits<{
  close: []
}>()

const alertConfig = {
  success: {
    classes: 'bg-green-50 border-green-200 text-green-900',
    icon: 'check_circle'
  },
  error: {
    classes: 'bg-red-50 border-red-200 text-red-900',
    icon: 'error'
  },
  warning: {
    classes: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    icon: 'warning'
  },
  info: {
    classes: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: 'info'
  }
}

const alertClasses = computed(() => alertConfig[props.type].classes)
const icon = computed(() => alertConfig[props.type].icon)
</script>
