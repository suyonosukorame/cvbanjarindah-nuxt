<template>
  <div class="border-t transition-all duration-300" :class="borderClass">
    <!-- Collapsed Bar (Minimized State) -->
    <button
      v-if="!isExpanded"
      @click="toggleExpand"
      class="w-full px-4 py-3 flex items-center justify-between transition-colors"
      :class="collapsedClass"
    >
      <div class="flex items-center gap-3">
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          :class="iconBgClass"
        >
          <span class="material-symbols-outlined text-white text-lg">{{ icon }}</span>
        </div>
        <div class="flex-1 text-left">
          <h4 class="font-bold text-xs" :class="titleClass">{{ collapsedTitle }}</h4>
          <p class="text-[10px]" :class="subtitleClass">{{ collapsedSubtitle }}</p>
        </div>
      </div>
      
      <!-- Expand Icon -->
      <span class="material-symbols-outlined text-slate-400 text-xl">expand_less</span>
    </button>

    <!-- Expanded Content -->
    <Transition
      name="expand"
      @enter="onEnter"
      @leave="onLeave"
    >
      <div v-if="isExpanded" class="overflow-hidden">
        <div class="p-4" :class="expandedClass">
          <!-- Header with Collapse Button -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                :class="iconBgClass"
              >
                <span class="material-symbols-outlined text-white">{{ icon }}</span>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-sm" :class="titleClass">{{ expandedTitle }}</h4>
                <p class="text-xs" :class="subtitleClass">{{ expandedSubtitle }}</p>
              </div>
            </div>
            
            <!-- Minimize Button -->
            <button
              @click="toggleExpand"
              class="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
              aria-label="Minimize"
            >
              <span class="material-symbols-outlined text-slate-400 text-xl">expand_more</span>
            </button>
          </div>

          <!-- Card Content Slot -->
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  collapsedTitle?: string
  collapsedSubtitle?: string
  expandedTitle?: string
  expandedSubtitle?: string
  variant?: 'green' | 'blue' | 'orange' | 'purple'
  defaultExpanded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'info',
  collapsedTitle: 'Click to expand',
  collapsedSubtitle: 'View more details',
  expandedTitle: 'Details',
  expandedSubtitle: 'Additional information',
  variant: 'green',
  defaultExpanded: false,
})

const isExpanded = ref(props.defaultExpanded)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// Variant-based styling
const variantStyles = computed(() => {
  const variants = {
    green: {
      border: 'border-green-200',
      collapsed: 'bg-green-50 hover:bg-green-100',
      expanded: 'bg-gradient-to-r from-green-50 to-emerald-50',
      iconBg: 'bg-green-500',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
    },
    blue: {
      border: 'border-blue-200',
      collapsed: 'bg-blue-50 hover:bg-blue-100',
      expanded: 'bg-gradient-to-r from-blue-50 to-sky-50',
      iconBg: 'bg-blue-500',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
    },
    orange: {
      border: 'border-orange-200',
      collapsed: 'bg-orange-50 hover:bg-orange-100',
      expanded: 'bg-gradient-to-r from-orange-50 to-amber-50',
      iconBg: 'bg-orange-500',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
    },
    purple: {
      border: 'border-purple-200',
      collapsed: 'bg-purple-50 hover:bg-purple-100',
      expanded: 'bg-gradient-to-r from-purple-50 to-indigo-50',
      iconBg: 'bg-purple-500',
      title: 'text-slate-900',
      subtitle: 'text-slate-600',
    },
  }
  return variants[props.variant]
})

const borderClass = computed(() => variantStyles.value.border)
const collapsedClass = computed(() => variantStyles.value.collapsed)
const expandedClass = computed(() => variantStyles.value.expanded)
const iconBgClass = computed(() => variantStyles.value.iconBg)
const titleClass = computed(() => variantStyles.value.title)
const subtitleClass = computed(() => variantStyles.value.subtitle)

// Smooth height transition
const onEnter = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.style.overflow = 'hidden'
  
  void htmlEl.offsetHeight // Trigger reflow
  
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.addEventListener('transitionend', () => {
    htmlEl.style.height = 'auto'
  }, { once: true })
}

const onLeave = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  
  void htmlEl.offsetHeight // Trigger reflow
  
  htmlEl.style.height = '0'
}

// Expose method to parent
defineExpose({
  toggleExpand,
  isExpanded,
})
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  overflow: hidden;
}
</style>
