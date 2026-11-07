<template>
  <div class="space-y-4">
    <!-- Tab buttons -->
    <div class="flex gap-2 border-b border-slate-200 -mb-px overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'px-4 py-3 text-sm font-medium transition-colors border-b-2',
          activeTab === tab.id
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-600 hover:text-slate-900'
        ]"
        @click="$emit('update:activeTab', tab.id)"
      >
        <span v-if="tab.icon" class="material-symbols-outlined text-lg align-middle mr-2">
          {{ tab.icon }}
        </span>
        {{ tab.label }}
        <span v-if="tab.badge" class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
          {{ tab.badge }}
        </span>
      </button>
    </div>

    <!-- Tab content -->
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Tab {
  id: string
  label: string
  icon?: string
  badge?: string | number
}

interface Props {
  tabs: Tab[]
  activeTab: string
}

defineProps<Props>()

defineEmits<{
  'update:activeTab': [id: string]
}>()
</script>
