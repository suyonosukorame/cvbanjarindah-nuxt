<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="$emit('cancel')"
    >
      <div class="max-w-sm w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <!-- Icon & Title -->
        <div class="px-6 py-6 text-center">
          <div class="flex justify-center mb-4">
            <span :class="['material-symbols-outlined text-5xl', iconColor]">
              {{ icon }}
            </span>
          </div>
          <h2 class="text-lg font-bold text-slate-900">{{ title }}</h2>
          <p v-if="message" class="mt-2 text-sm text-slate-600">
            {{ message }}
          </p>
        </div>

        <!-- Actions -->
        <div class="border-t border-slate-200 px-6 py-4 flex justify-center gap-3 bg-slate-50">
          <button
            type="button"
            @click="$emit('cancel')"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            :disabled="loading"
            :class="[
              'px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors flex items-center gap-2',
              type === 'danger'
                ? 'bg-red-600 hover:bg-red-700 disabled:opacity-50'
                : 'bg-primary hover:bg-orange-600 disabled:opacity-50'
            ]"
            @click="$emit('confirm')"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  type?: 'default' | 'danger'
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  confirmLabel: 'Konfirmasi',
  cancelLabel: 'Batal',
  loading: false
})

defineEmits<{
  confirm: []
  cancel: []
}>()

const iconColor = computed(() => {
  return {
    default: 'text-primary',
    danger: 'text-red-600'
  }[props.type]
})

const icon = computed(() => {
  return {
    default: 'help',
    danger: 'warning'
  }[props.type]
})
</script>
