<template>
  <div class="w-full">
    <!-- Header Section -->
    <div v-if="title || subtitle || $slots.header" class="mb-8">
      <slot name="header">
        <div>
          <h2 v-if="title" class="text-3xl font-bold text-slate-900 mb-2">
            {{ title }}
          </h2>
          <p v-if="subtitle" class="text-slate-600 text-lg">
            {{ subtitle }}
          </p>
        </div>
      </slot>
    </div>

    <!-- Filters/Controls Section -->
    <div v-if="$slots.filters" class="mb-8">
      <slot name="filters" />
    </div>

    <!-- Grid Container -->
    <div :class="gridClasses">
      <slot />
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="text-center py-16">
      <slot name="empty">
        <div>
          <span class="material-symbols-outlined text-5xl text-slate-300 block mb-4">inbox</span>
          <p class="text-slate-600 text-lg">{{ emptyMessage }}</p>
        </div>
      </slot>
    </div>

    <!-- Pagination/Load More Section -->
    <div v-if="$slots.pagination" class="mt-8">
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ResponsiveGridContainer
 * 
 * Flexible responsive grid container for managing grid layout across multiple breakpoints.
 * Supports OPSI 2 responsive grid pattern: 2 cols mobile, 3 cols tablet, 4 cols desktop
 * 
 * Props:
 * - title: Optional title for grid
 * - subtitle: Optional subtitle
 * - columns: Object with responsive column counts
 * - gap: Object with responsive gap sizes
 * - isEmpty: Boolean to show empty state
 * - emptyMessage: Message to show when empty
 * 
 * Slots:
 * - header: Custom header section
 * - filters: Filter controls
 * - default: Grid items
 * - empty: Custom empty state
 * - pagination: Pagination controls
 * 
 * Example:
 * <ResponsiveGridContainer
 *   title="Produk Kami"
 *   :columns="{ mobile: 2, tablet: 3, desktop: 4 }"
 *   :isEmpty="products.length === 0"
 * >
 *   <template #filters>
 *     <FilterButtons />
 *   </template>
 *   <ProductCard v-for="product in products" :key="product.id" :product="product" />
 * </ResponsiveGridContainer>
 */

interface GridColumns {
  mobile?: number
  tablet?: number
  desktop?: number
}

interface GridGaps {
  mobile?: string
  tablet?: string
  desktop?: string
}

interface Props {
  title?: string
  subtitle?: string
  columns?: GridColumns
  gap?: GridGaps
  isEmpty?: boolean
  emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  subtitle: undefined,
  columns: () => ({ mobile: 2, tablet: 3, desktop: 4 }),
  gap: () => ({ mobile: 'gap-3', tablet: 'gap-4', desktop: 'gap-6' }),
  isEmpty: false,
  emptyMessage: 'Tidak ada item untuk ditampilkan'
})

// Generate responsive grid classes
const gridClasses = computed(() => {
  const { columns, gap } = props
  
  // Default responsive classes based on OPSI 2
  const baseClasses = ['grid', 'w-full']
  
  // Column classes
  const colClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }
  const tabletColClasses: Record<number, string> = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6'
  }
  const desktopColClasses: Record<number, string> = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6'
  }
  
  // Mobile columns (default to 2)
  if (columns.mobile) {
    baseClasses.push(colClasses[columns.mobile] || 'grid-cols-2')
  }
  
  // Tablet columns with md: prefix
  if (columns.tablet) {
    baseClasses.push(tabletColClasses[columns.tablet] || 'md:grid-cols-3')
  }
  
  // Desktop columns with lg: prefix
  if (columns.desktop) {
    baseClasses.push(desktopColClasses[columns.desktop] || 'lg:grid-cols-4')
  }
  
  // Gap classes
  if (gap.mobile) baseClasses.push(gap.mobile)
  if (gap.tablet) baseClasses.push(`md:${gap.tablet}`)
  if (gap.desktop) baseClasses.push(`lg:${gap.desktop}`)
  
  return baseClasses.join(' ')
})
</script>
