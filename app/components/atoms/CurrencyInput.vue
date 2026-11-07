<template>
  <div class="space-y-2">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Input Container -->
    <div class="relative">
      <!-- Prefix (Rp) -->
      <div v-if="showCurrencyPrefix" class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <span class="text-slate-500 font-medium">Rp</span>
      </div>
      
      <!-- Input Field -->
      <input
        :value="displayValue"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        :readonly="readonly"
        :disabled="disabled"
        :class="[
          'w-full h-10 rounded-lg border px-3 py-2 text-sm outline-none transition-all',
          showCurrencyPrefix ? 'pl-10' : 'pl-3',
          'focus:border-primary focus:ring-2 focus:ring-primary/20',
          'disabled:bg-slate-50 disabled:cursor-not-allowed',
          readonly ? 'bg-slate-50' : '',
          error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-300'
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <!-- Suffix Info (optional) -->
      <div v-if="showInfo" class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <span class="text-xs text-slate-400">
          {{ info }}
        </span>
      </div>
    </div>
    
    <!-- Display Value (optional, for reference) -->
    <div v-if="showPreview && modelValue" class="text-xs text-slate-500">
      {{ formatRupiah(modelValue) }}
    </div>
    
    <!-- Helper Text -->
    <p v-if="helperText && !error" class="text-xs text-slate-500">
      {{ helperText }}
    </p>
    
    <!-- Error Message -->
    <p v-if="error" class="text-xs text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: number
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  type?: 'text' | 'number'
  min?: number
  max?: number
  showCurrencyPrefix?: boolean
  showPreview?: boolean
  showInfo?: string
  minValue?: number
  maxValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  placeholder: '0',
  type: 'text',
  showCurrencyPrefix: true,
  showPreview: false,
  showInfo: '',
  minValue: 0,
  maxValue: Number.MAX_SAFE_INTEGER,
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'blur': []
  'change': [value: number]
}>()

const { formatNumber, parseRupiah, formatRupiah } = useCurrency()

const displayValue = computed(() => {
  if (props.modelValue === 0 || !props.modelValue) return ''
  return formatNumber(props.modelValue)
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const input = target.value
  
  // Parse input to get numeric value
  const parsed = parseRupiah(input)
  
  // Validate min/max
  let value = parsed
  if (props.minValue !== undefined && value < props.minValue) {
    value = props.minValue
  }
  if (props.maxValue !== undefined && value > props.maxValue) {
    value = props.maxValue
  }
  
  // Update display (formatted without Rp prefix)
  target.value = formatNumber(value)
  
  // Emit the numeric value
  emit('update:modelValue', value)
}

function handleBlur() {
  emit('blur')
  
  // Ensure value is valid
  if (props.modelValue < props.minValue!) {
    emit('update:modelValue', props.minValue || 0)
  }
  if (props.maxValue && props.modelValue > props.maxValue) {
    emit('update:modelValue', props.maxValue)
  }
}

function handleKeydown(event: KeyboardEvent) {
  // Allow only numbers, backspace, delete, tab, arrow keys, etc.
  const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', '.']
  const isNumber = event.key >= '0' && event.key <= '9'
  
  if (!allowed.includes(event.key) && !isNumber && !event.ctrlKey && !event.metaKey) {
    event.preventDefault()
  }
}
</script>
