<template>
  <div :class="{ 'space-y-4': variant === 'table' }">
    <template v-if="variant === 'table'">
      <div v-for="i in count" :key="i" class="space-y-3">
        <div class="h-12 bg-slate-200 rounded-lg animate-pulse" />
      </div>
    </template>
    <template v-else-if="variant === 'card'">
      <div v-for="i in count" :key="i" class="space-y-3 p-4 border border-slate-200 rounded-lg">
        <div class="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
        <div class="h-4 bg-slate-200 rounded animate-pulse w-full" />
        <div class="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
      </div>
    </template>
    <template v-else-if="variant === 'text'">
      <div v-for="i in count" :key="i" class="h-4 bg-slate-200 rounded animate-pulse mb-2" />
    </template>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'table' | 'card' | 'text'
  count?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'table',
  count: 3
})
</script>
