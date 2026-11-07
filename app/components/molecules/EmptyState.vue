<template>
  <div class="flex flex-col items-center justify-center py-12 px-4">
    <!-- Icon -->
    <div
      class="flex items-center justify-center w-16 h-16 rounded-full mb-4"
      :class="iconBackgroundClass"
    >
      <span
        class="material-symbols-outlined text-4xl"
        :class="iconColor"
      >
        {{ icon }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-slate-900 mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p class="text-sm text-slate-600 text-center max-w-xs mb-6">
      {{ description }}
    </p>

    <!-- Action button -->
    <button
      v-if="actionLabel"
      type="button"
      class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-orange-600 transition-colors"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>

    <!-- Alternative link -->
    <a
      v-if="altLink"
      :href="altLink.href"
      class="mt-3 text-sm text-primary hover:text-orange-600 font-medium transition-colors"
    >
      {{ altLink.label }}
    </a>
  </div>
</template>

<script setup lang="ts">
interface AltLink {
  label: string
  href: string
}

interface Props {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  altLink?: AltLink
  variant?: 'default' | 'info' | 'warning' | 'error' | 'success'
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'inbox',
  variant: 'default'
})

const iconBackgroundClass = computed(() => {
  const variants: Record<string, string> = {
    default: 'bg-slate-100',
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
    success: 'bg-green-100'
  }
  return variants[props.variant] || variants.default
})

const iconColor = computed(() => {
  const variants: Record<string, string> = {
    default: 'text-slate-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    success: 'text-green-600'
  }
  return variants[props.variant] || variants.default
})

defineEmits<{
  action: []
}>()
</script>
