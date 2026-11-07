<template>
  <span
    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
    :class="roleColor"
  >
    <span class="material-symbols-outlined text-sm">{{ roleIcon }}</span>
    {{ roleLabel }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  role: 'super_admin' | 'director' | 'manager' | 'employee'
}

const props = defineProps<Props>()

const roleConfig = {
  super_admin: {
    label: 'Super Admin',
    color: 'bg-purple-100 text-purple-700',
    icon: 'shield_admin'
  },
  director: {
    label: 'Direktur',
    color: 'bg-blue-100 text-blue-700',
    icon: 'person_4'
  },
  manager: {
    label: 'Manager',
    color: 'bg-amber-100 text-amber-700',
    icon: 'person_3'
  },
  employee: {
    label: 'Karyawan',
    color: 'bg-green-100 text-green-700',
    icon: 'person'
  }
}

const roleLabel = computed(() => roleConfig[props.role].label)
const roleColor = computed(() => roleConfig[props.role].color)
const roleIcon = computed(() => roleConfig[props.role].icon)
</script>
