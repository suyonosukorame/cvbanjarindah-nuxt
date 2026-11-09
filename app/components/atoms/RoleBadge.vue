<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
    :class="roleColor"
  >
    <span class="material-symbols-outlined text-sm">{{ roleIcon }}</span>
    {{ roleLabel }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  role: 'super_admin' | 'director' | 'manager' | 'employee' | 'admin' | 'editor' | 'staff' | string
}

const props = defineProps<Props>()

const roleConfig: Record<string, { label: string; color: string; icon: string }> = {
  super_admin: {
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-700 border border-purple-200',
    icon: 'shield_person'
  },
  director: {
    label: 'Direktur',
    color: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: 'person_4'
  },
  manager: {
    label: 'Manager',
    color: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    icon: 'person_3'
  },
  admin: {
    label: 'Admin',
    color: 'bg-orange-100 text-orange-700 border border-orange-200',
    icon: 'admin_panel_settings'
  },
  editor: {
    label: 'Editor',
    color: 'bg-teal-100 text-teal-700 border border-teal-200',
    icon: 'edit_note'
  },
  employee: {
    label: 'Karyawan',
    color: 'bg-slate-100 text-slate-700 border border-slate-200',
    icon: 'badge'
  },
  staff: {
    label: 'Staf',
    color: 'bg-green-100 text-green-700 border border-green-200',
    icon: 'person'
  }
}

const roleLabel = computed(() => roleConfig[props.role]?.label || props.role || 'Staf')
const roleColor = computed(() => roleConfig[props.role]?.color || 'bg-slate-100 text-slate-700 border border-slate-200')
const roleIcon = computed(() => roleConfig[props.role]?.icon || 'person')
</script>
