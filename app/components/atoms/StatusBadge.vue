<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
    :class="statusColor"
  >
    <span class="w-2 h-2 rounded-full" :class="statusDot" />
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  status: 'active' | 'inactive' | 'on_leave' | 'terminated'
}

const props = defineProps<Props>()

const statusConfig = {
  active: {
    label: 'Aktif',
    color: 'bg-green-100 text-green-700',
    dot: 'bg-green-500'
  },
  inactive: {
    label: 'Nonaktif',
    color: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-500'
  },
  on_leave: {
    label: 'Cuti',
    color: 'bg-yellow-100 text-yellow-700',
    dot: 'bg-yellow-500'
  },
  terminated: {
    label: 'Keluar',
    color: 'bg-red-100 text-red-700',
    dot: 'bg-red-500'
  }
}

const statusLabel = computed(() => statusConfig[props.status].label)
const statusColor = computed(() => statusConfig[props.status].color)
const statusDot = computed(() => statusConfig[props.status].dot)
</script>
