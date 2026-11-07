<template>
  <div class="mb-8">
    <!-- Breadcrumb -->
    <nav v-if="breadcrumbs.length > 0" class="flex items-center gap-2 text-sm text-slate-600 mb-4">
      <NuxtLink to="/admin" class="hover:text-primary transition-colors">
        <span class="material-symbols-outlined text-lg align-middle">home</span>
      </NuxtLink>
      <span class="material-symbols-outlined text-lg">chevron_right</span>
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <NuxtLink
          v-if="crumb.to"
          :to="crumb.to"
          class="hover:text-primary transition-colors"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="text-slate-900 font-medium">{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="material-symbols-outlined text-lg">
          chevron_right
        </span>
      </template>
    </nav>

    <!-- Header -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">{{ title }}</h1>
        <p v-if="description" class="mt-2 text-slate-600">{{ description }}</p>
      </div>
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Breadcrumb {
  label: string
  to?: string
}

interface Props {
  title: string
  description?: string
  breadcrumbs?: Breadcrumb[]
}

withDefaults(defineProps<Props>(), {
  breadcrumbs: () => []
})
</script>
