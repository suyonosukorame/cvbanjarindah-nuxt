<template>
  <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap"
      :class="[
        modelValue === tab.value
          ? 'bg-primary text-white shadow-xs'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
      ]"
      @click="$emit('update:modelValue', tab.value)"
    >
      <span v-if="tab.icon" class="material-symbols-outlined text-base leading-none">{{ tab.icon }}</span>
      <span>{{ tab.label }}</span>
      <span
        v-if="tab.count !== undefined"
        class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[11px] font-bold"
        :class="[
          modelValue === tab.value
            ? 'bg-white/20 text-white'
            : 'bg-slate-200 text-slate-800'
        ]"
      >
        {{ tab.count }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface StatusFilterTabItem {
  value: string;
  label: string;
  count?: number;
  icon?: string;
}

interface Props {
  modelValue: string;
  tabs: StatusFilterTabItem[];
}

defineProps<Props>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

