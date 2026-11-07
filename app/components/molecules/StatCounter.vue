<template>
  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/40 rounded-lg backdrop-blur-sm">
    <AtomsIcon 
      :name="icon" 
      size="sm" 
      color="success"
      :fill="true"
    />
    <span class="text-xs text-slate-300 font-medium">{{ label }}</span>
    <AtomsStatBadge 
      :value="value" 
      variant="default"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  label: string
  value: number
}

defineProps<Props>()
</script>
