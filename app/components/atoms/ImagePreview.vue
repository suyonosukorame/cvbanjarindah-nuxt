<template>
  <div class="relative group">
    <!-- Image Container -->
    <div 
      class="relative aspect-square rounded-lg overflow-hidden border-2 transition-all"
      :class="selected ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'"
    >
      <img 
        :src="src" 
        :alt="alt"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      
      <!-- Overlay on hover -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        
        <!-- View Button -->
        <button
          v-if="showView"
          type="button"
          @click="handleView"
          class="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          title="View full size"
        >
          <AtomsIcon name="visibility" size="sm" color="slate" />
        </button>
        
        <!-- Delete Button -->
        <button
          v-if="showDelete"
          type="button"
          @click="handleDelete"
          class="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          title="Delete image"
        >
          <AtomsIcon name="delete" size="sm" color="danger" />
        </button>
      </div>
      
      <!-- Loading Overlay -->
      <div 
        v-if="loading"
        class="absolute inset-0 bg-white/80 flex items-center justify-center"
      >
        <div class="animate-spin">
          <AtomsIcon name="sync" size="lg" color="primary" />
        </div>
      </div>
    </div>
    
    <!-- Filename (optional) -->
    <p v-if="showFilename && filename" class="mt-2 text-xs text-slate-600 truncate">
      {{ filename }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  filename?: string
  selected?: boolean
  loading?: boolean
  showView?: boolean
  showDelete?: boolean
  showFilename?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Image preview',
  selected: false,
  loading: false,
  showView: true,
  showDelete: true,
  showFilename: false,
})

const emit = defineEmits<{
  view: []
  delete: []
}>()

function handleView() {
  emit('view')
}

function handleDelete() {
  emit('delete')
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E'
}
</script>
