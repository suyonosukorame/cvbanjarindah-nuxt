<template>
  <label class="block space-y-2">
    <div class="flex items-center justify-between">
      <span v-if="label" class="text-sm font-semibold text-slate-700">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </span>
      <span v-if="maxLength" class="text-xs text-slate-500">
        {{ modelValue.length }} / {{ maxLength }}
      </span>
    </div>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxLength"
      class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 disabled:text-slate-500 resize-none"
      :class="{ 'border-red-400 focus:border-red-500 focus:ring-red-100': error }"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="text-xs font-medium text-red-600">{{ error }}</p>
    <p v-if="helperText && !error" class="text-xs text-slate-500">{{ helperText }}</p>
  </label>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  helperText?: string
  rows?: number
  maxLength?: number
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  required: false,
  disabled: false,
  rows: 4,
  maxLength: undefined
})

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
