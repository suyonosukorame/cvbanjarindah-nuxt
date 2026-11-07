<template>
  <div
    class="relative border-2 border-dashed rounded-lg transition-all cursor-pointer"
    :class="[
      isDragging 
        ? 'border-primary bg-primary/5 scale-[1.02]' 
        : 'border-slate-300 hover:border-primary/50 hover:bg-slate-50',
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="hidden"
      @change="handleFileSelect"
    />
    
    <div class="p-8 text-center">
      <!-- Icon -->
      <div class="mb-4 flex justify-center">
        <div 
          class="p-4 rounded-full transition-colors"
          :class="isDragging ? 'bg-primary/10' : 'bg-slate-100'"
        >
          <AtomsIcon 
            :name="icon" 
            size="xl" 
            :color="isDragging ? 'primary' : 'secondary'"
          />
        </div>
      </div>
      
      <!-- Text -->
      <div class="space-y-1">
        <p class="text-sm font-medium text-slate-700">
          {{ isDragging ? 'Drop files here' : title }}
        </p>
        <p class="text-xs text-slate-500">
          {{ description }}
        </p>
      </div>
      
      <!-- Browse Button -->
      <button
        v-if="showBrowseButton"
        type="button"
        class="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        @click.stop="triggerFileInput"
      >
        Browse Files
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  accept?: string
  multiple?: boolean
  disabled?: boolean
  icon?: string
  title?: string
  description?: string
  showBrowseButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  multiple: false,
  disabled: false,
  icon: 'cloud_upload',
  title: 'Drag & drop or click to upload',
  description: 'PNG, JPG, WEBP up to 5MB',
  showBrowseButton: true,
})

const emit = defineEmits<{
  'files-selected': [files: File[]]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function triggerFileInput() {
  if (props.disabled) return
  fileInputRef.value?.click()
}

function handleDragEnter(event: DragEvent) {
  if (props.disabled) return
  event.stopPropagation()
  isDragging.value = true
}

function handleDragOver(event: DragEvent) {
  if (props.disabled) return
  event.stopPropagation()
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  if (props.disabled) return
  event.stopPropagation()
  
  // Only set to false if leaving the component entirely
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x <= rect.left || x >= rect.right || y <= rect.top || y >= rect.bottom) {
    isDragging.value = false
  }
}

function handleDrop(event: DragEvent) {
  if (props.disabled) return
  event.stopPropagation()
  isDragging.value = false
  
  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length > 0) {
    emit('files-selected', files)
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    emit('files-selected', files)
  }
  
  // Reset input untuk allow re-upload file yang sama
  target.value = ''
}
</script>
