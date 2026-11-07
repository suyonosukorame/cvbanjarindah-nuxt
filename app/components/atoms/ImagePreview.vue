<template>
  <div class="relative group">
    <!-- Image Container - Square thumbnail (compact) -->
    <div 
      class="relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:ring-2 hover:ring-primary/50"
      :class="selected ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'"
      @click="showFullPreview = true"
    >
      <img 
        :src="src" 
        :alt="alt"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
      
      <!-- Overlay on hover -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        
        <!-- Expand Button (View Full) -->
        <button
          v-if="showView"
          type="button"
          @click.stop="showFullPreview = true"
          class="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          title="View full size"
        >
          <span class="material-symbols-outlined text-xl">fullscreen</span>
        </button>
        
        <!-- Delete Button -->
        <button
          v-if="showDelete"
          type="button"
          @click.stop="handleDelete"
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

    <!-- Full Preview Modal (OPSI 3 Hybrid) -->
    <Teleport to="body">
      <div 
        v-if="showFullPreview"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        @click.self="showFullPreview = false"
      >
        <div class="relative max-w-4xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
          <!-- Close Button -->
          <button
            type="button"
            @click="showFullPreview = false"
            class="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-lg"
            title="Close"
          >
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>

          <!-- Full Image (object-contain - utuh 100%) -->
          <img 
            :src="src" 
            :alt="alt"
            class="w-full h-auto max-h-[80vh] object-contain"
            @error="handleImageError"
          />

          <!-- Image Info Footer -->
          <div v-if="showFilename && filename" class="bg-slate-50 px-4 py-3 border-t border-slate-200">
            <p class="text-sm text-slate-600">
              <span class="font-medium">File:</span> {{ filename }}
            </p>
          </div>

          <!-- Actions Footer -->
          <div class="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              @click="showFullPreview = false"
              class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              v-if="showDelete"
              type="button"
              @click="handleDeleteFromModal"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <span class="material-symbols-outlined text-lg align-middle mr-1">delete</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>
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

const showFullPreview = ref(false)

function handleView() {
  emit('view')
}

function handleDelete() {
  emit('delete')
  showFullPreview.value = false
}

function handleDeleteFromModal() {
  emit('delete')
  showFullPreview.value = false
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f1f5f9" width="200" height="200"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E'
}
</script>
