<template>
  <label class="flex items-start gap-3 cursor-pointer group">
    <div class="relative pt-1">
      <input
        :checked="modelValue"
        type="checkbox"
        :disabled="disabled"
        class="sr-only peer"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <!-- Custom checkbox -->
      <div
        class="w-5 h-5 rounded border-2 border-slate-300 bg-white transition-all peer-checked:bg-primary peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30 disabled:bg-slate-100 disabled:border-slate-200 disabled:cursor-not-allowed"
      >
        <!-- Checkmark icon -->
        <span
          v-if="modelValue"
          class="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-lg leading-none"
        >
          check
        </span>
      </div>
    </div>

    <!-- Label & description -->
    <div class="flex-1 space-y-1">
      <span
        v-if="label"
        class="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors"
      >
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </span>
      <p v-if="description" class="text-xs text-slate-500">{{ description }}</p>
      <p v-if="error" class="text-xs font-medium text-red-600">{{ error }}</p>
    </div>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: boolean
  label?: string
  description?: string
  required?: boolean
  disabled?: boolean
  error?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: false,
  required: false,
  disabled: false
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
