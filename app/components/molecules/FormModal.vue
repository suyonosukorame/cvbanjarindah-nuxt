<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="$emit('close')"
    >
      <div class="relative max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900">{{ title }}</h2>
          <button
            type="button"
            @click="$emit('close')"
            class="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <span class="material-symbols-outlined text-2xl text-slate-500">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <slot />
        </div>

        <!-- Actions Footer -->
        <div class="border-t border-slate-200 px-6 py-4 flex justify-end gap-3 bg-slate-50">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {{ cancelLabel }}
          </button>
          <button
            type="button"
            :disabled="submitDisabled || loading"
            class="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            @click="$emit('submit')"
          >
            <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
            {{ submitLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  title: string
  submitLabel?: string
  cancelLabel?: string
  loading?: boolean
  submitDisabled?: boolean
}

withDefaults(defineProps<Props>(), {
  submitLabel: 'Simpan',
  cancelLabel: 'Batal',
  loading: false,
  submitDisabled: false
})

defineEmits<{
  close: []
  submit: []
}>()
</script>
