<template>
  <div class="inline-flex items-center gap-1.5">
    <!-- Stepper Controls -->
    <div class="inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
      <button
        type="button"
        :disabled="modelValue <= min"
        class="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Kurangi jumlah"
        @click="decrement"
      >
        <span class="material-symbols-outlined text-sm font-bold">remove</span>
      </button>

      <input
        type="number"
        :value="modelValue"
        :min="min"
        :max="max"
        class="w-10 h-7 text-center text-xs font-bold text-slate-900 border-x border-slate-100 bg-slate-50/50 focus:outline-none focus:bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        @input="handleInput"
      />

      <button
        type="button"
        :disabled="modelValue >= max"
        class="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Tambah jumlah"
        @click="increment"
      >
        <span class="material-symbols-outlined text-sm font-bold">add</span>
      </button>
    </div>

    <!-- Unit Selector (if enabled) -->
    <select
      v-if="showUnit"
      :value="unit"
      class="h-7 px-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:border-primary cursor-pointer transition-colors"
      @change="$emit('update:unit', ($event.target as HTMLSelectElement).value as OrderUnit)"
    >
      <option value="Karton">Karton</option>
      <option value="Dus">Dus</option>
      <option value="Lusin">Lusin</option>
      <option value="Bal">Bal</option>
      <option value="Pcs">Pcs</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { OrderUnit } from '~/types/cart';

interface Props {
  modelValue: number;
  unit?: OrderUnit;
  min?: number;
  max?: number;
  showUnit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 9999,
  unit: 'Karton',
  showUnit: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'update:unit', value: OrderUnit): void;
}>();

const increment = () => {
  if (props.modelValue < props.max) {
    emit('update:modelValue', props.modelValue + 1);
  }
};

const decrement = () => {
  if (props.modelValue > props.min) {
    emit('update:modelValue', props.modelValue - 1);
  }
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const val = parseInt(target.value, 10);
  if (!isNaN(val)) {
    const clamped = Math.max(props.min, Math.min(props.max, val));
    emit('update:modelValue', clamped);
  }
};
</script>

