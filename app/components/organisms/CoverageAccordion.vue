<template>
  <div class="space-y-3">
    <div
      v-for="(area, index) in areas"
      :key="area.id"
      class="border border-slate-200 rounded-lg overflow-hidden transition-all"
    >
      <!-- Accordion Header -->
      <button
        @click="toggleArea(index)"
        :class="[
          'w-full px-4 md:px-6 py-4 flex items-center justify-between transition-colors',
          expandedAreas[index]
            ? 'bg-primary/10 text-primary'
            : 'bg-white text-slate-900 hover:bg-slate-50'
        ]"
      >
        <div class="flex items-center gap-3 text-left">
          <svg
            class="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9H13V8.5c0-.83-.67-1.5-1.5-1.5S10 7.67 10 8.5V11H6.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5H10v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V14h3.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
          </svg>
          <div>
            <h3 class="font-bold text-sm md:text-base">{{ area.name }}</h3>
            <p class="text-xs md:text-sm text-slate-500 mt-0.5">{{ area.cities.length }} Kota</p>
          </div>
        </div>

        <!-- Chevron Icon -->
        <svg
          :class="[
            'w-5 h-5 flex-shrink-0 transition-transform duration-300',
            expandedAreas[index] ? 'rotate-180' : ''
          ]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      <!-- Accordion Content -->
      <Transition
        name="expand"
        @enter="enter"
        @leave="leave"
      >
        <div
          v-show="expandedAreas[index]"
          class="overflow-hidden"
        >
          <div class="px-4 md:px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div class="space-y-2">
              <p class="text-sm font-semibold text-slate-700 mb-3">
                📍 {{ area.cities.length }} Kota Terjangkau:
              </p>
              <ul class="space-y-2">
                <li
                  v-for="city in area.cities"
                  :key="city"
                  class="flex items-center gap-2 text-sm md:text-base text-slate-600"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {{ city }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CoverageArea {
  id: string;
  name: string;
  cities: string[];
  color?: string;
}

interface Props {
  areas: CoverageArea[];
}

const props = defineProps<Props>()

const expandedAreas = ref<boolean[]>([])

onMounted(() => {
  // Expand first area by default
  expandedAreas.value = props.areas.map((_, index) => index === 0)
})

const toggleArea = (index: number) => {
  expandedAreas.value[index] = !expandedAreas.value[index]
}

// Vue Transition hooks for smooth height animation
const enter = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = '0'
  htmlEl.style.overflow = 'hidden'
  
  // Trigger reflow to start transition
  void (htmlEl as any).offsetHeight
  
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  htmlEl.addEventListener('transitionend', () => {
    htmlEl.style.height = 'auto'
  }, { once: true })
}

const leave = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.height = htmlEl.scrollHeight + 'px'
  
  // Trigger reflow
  void (htmlEl as any).offsetHeight
  
  htmlEl.style.height = '0'
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: height 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  overflow: hidden;
}
</style>
