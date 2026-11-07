<template>
  <div class="relative group inline-flex">
    <!-- Thumbnail Image -->
    <img 
      v-if="src"
      :src="src" 
      :alt="alt"
      class="w-12 h-12 md:w-14 md:h-14 object-cover rounded-lg cursor-pointer transition-all shadow-sm group-hover:shadow-md group-hover:scale-110 border border-slate-200"
      @click="emit('click')"
      @error="handleImageError"
    />
    
    <!-- No Image Placeholder -->
    <div 
      v-else
      class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-slate-400"
    >
      <AtomsIcon name="image_not_supported" size="sm" />
    </div>
    
    <!-- Hover Tooltip Preview (Desktop only) -->
    <div 
      v-if="src && showTooltip"
      class="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-3 z-50 pointer-events-none"
    >
      <div class="relative">
        <!-- Image Preview -->
        <img 
          :src="src" 
          :alt="alt"
          class="max-w-xs max-h-64 rounded-lg shadow-2xl border-2 border-white"
          @error="handleImageError"
        />
        
        <!-- Arrow Pointer -->
        <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
      </div>
    </div>
    
    <!-- Mobile Preview Button -->
    <button
      v-if="src && !showTooltip"
      type="button"
      @click="emit('click')"
      class="absolute top-0 right-0 -mt-1 -mr-1 p-1 bg-primary hover:bg-orange-600 text-white rounded-full shadow-md transition-colors opacity-0 group-hover:opacity-100"
      title="Preview image"
    >
      <AtomsIcon name="visibility" size="xs" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
})

const emit = defineEmits<{
  click: []
}>()

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f1f5f9" width="100" height="100"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo image%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
/* Prevent scale jump on hover */
.group:hover {
  z-index: 40;
}
</style>
