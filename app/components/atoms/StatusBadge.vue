<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
    :class="statusColor"
  >
    <span class="w-2 h-2 rounded-full" :class="statusDot" />
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  status: 'active' | 'inactive' | 'pending' | 'on_leave' | 'terminated' | string
}

const props = defineProps<Props>()

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  active: {
    label: 'Aktif',
    color: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    dot: 'bg-emerald-500'
  },
  pending: {
    label: 'Menunggu Persetujuan',
    color: 'bg-amber-100 text-amber-800 border border-amber-300',
    dot: 'bg-amber-500 animate-pulse'
  },
  inactive: {
    label: 'Nonaktif',
    color: 'bg-slate-100 text-slate-700 border border-slate-200',
    dot: 'bg-slate-400'
  },
  on_leave: {
    label: 'Cuti',
    color: 'bg-blue-100 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500'
  },
  terminated: {
    label: 'Dinonaktifkan',
    color: 'bg-red-100 text-red-700 border border-red-200',
    dot: 'bg-red-500'
  }
}

const statusLabel = computed(() => statusConfig[props.status]?.label || props.status || 'Tidak Diketahui')
const statusColor = computed(() => statusConfig[props.status]?.color || 'bg-slate-100 text-slate-700')
const statusDot = computed(() => statusConfig[props.status]?.dot || 'bg-slate-400')
</script>
