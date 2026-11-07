<template>
  <Teleport to="body">
    <!-- Modal Backdrop -->
    <Transition name="fade">
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Modal Content -->
        <div class="relative max-w-4xl max-h-[90vh] w-full">
          
          <!-- Close Button -->
          <button
            type="button"
            @click="close"
            class="absolute -top-12 right-0 p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <AtomsIcon name="close" size="lg" />
          </button>
          
          <!-- Image Container -->
          <div class="relative bg-white rounded-lg overflow-hidden">
            <img 
              :src="imageUrl" 
              :alt="imageAlt"
              class="w-full h-auto max-h-[80vh] object-contain"
              @error="handleImageError"
            />
            
            <!-- Loading Spinner -->
            <div 
              v-if="isLoading"
              class="absolute inset-0 bg-white/50 flex items-center justify-center"
            >
              <div class="animate-spin">
                <AtomsIcon name="sync" size="lg" color="primary" />
              </div>
            </div>
          </div>
          
          <!-- Info Bar -->
          <div class="mt-4 flex items-center justify-between bg-slate-900 text-white p-4 rounded-lg">
            <div class="flex-1">
              <p class="text-sm font-semibold">{{ imageAlt || 'Image Preview' }}</p>
              <p class="text-xs text-slate-400 mt-1 truncate">{{ imageUrl }}</p>
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center gap-3 ml-4">
              <!-- Download Button -->
              <button
                type="button"
                @click="downloadImage"
                class="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="Download image"
              >
                <AtomsIcon name="download" size="sm" color="white" />
              </button>
              
              <!-- Open External Button -->
              <a
                :href="imageUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2 hover:bg-slate-800 rounded-lg transition-colors inline-flex"
                title="Open in Cloudinary"
              >
                <AtomsIcon name="open_in_new" size="sm" color="white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen?: boolean
  imageUrl?: string
  imageAlt?: string
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  imageUrl: '',
  imageAlt: 'Image Preview',
})

const emit = defineEmits<{
  close: []
}>()

const isLoading = ref(false)

function close() {
  emit('close')
}

function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f1f5f9" width="400" height="400"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage failed to load%3C/text%3E%3C/svg%3E'
}

async function downloadImage() {
  if (!props.imageUrl) return
  
  try {
    isLoading.value = true
    
    // Extract filename from URL or use default
    const urlParts = props.imageUrl.split('/')
    const filename = urlParts[urlParts.length - 1] || 'image.jpg'
    
    // Create blob from image
    const response = await fetch(props.imageUrl)
    const blob = await response.blob()
    
    // Create download link
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading image:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
