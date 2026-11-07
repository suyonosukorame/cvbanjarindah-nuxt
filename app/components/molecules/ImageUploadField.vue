<template>
  <div class="space-y-3">
    <!-- Label -->
    <label v-if="label" class="block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <!-- Upload Zone (show when no image) -->
    <AtomsUploadZone
      v-if="!imageUrl && !previewUrl"
      :accept="accept"
      :disabled="loading"
      :title="uploadTitle"
      :description="uploadDescription"
      @files-selected="handleFilesSelected"
    />
    
    <!-- Image Preview (show when image exists) -->
    <div v-else class="space-y-3">
      <AtomsImagePreview
        :src="previewUrl || imageUrl"
        :alt="label || 'Uploaded image'"
        :loading="loading"
        :show-view="true"
        :show-delete="!disabled"
        :show-filename="showFilename"
        :filename="selectedFile?.name"
        @view="handleView"
        @delete="handleDelete"
      />
      
      <!-- Replace Button -->
      <button
        v-if="!disabled"
        type="button"
        @click="handleReplace"
        class="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
      >
        <AtomsIcon name="swap_horiz" size="sm" class="inline mr-2" />
        Replace Image
      </button>
    </div>
    
    <!-- Progress Bar -->
    <AtomsProgressBar
      v-if="loading"
      :percentage="uploadProgress"
      :label="`Uploading ${selectedFile?.name || 'image'}...`"
    />
    
    <!-- Error Message -->
    <p v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </p>
    
    <!-- Helper Text -->
    <p v-if="helperText && !errorMessage" class="text-xs text-slate-500">
      {{ helperText }}
    </p>
    
    <!-- Hidden File Input for Replace -->
    <input
      ref="replaceInputRef"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleReplaceFileSelect"
    />
  </div>
</template>

<script setup lang="ts">
import type { UploadedImage } from '~/types/cloudinary'

interface Props {
  modelValue: string // Image URL
  label?: string
  required?: boolean
  disabled?: boolean
  accept?: string
  maxSize?: number // in MB
  folder?: string
  uploadTitle?: string
  uploadDescription?: string
  helperText?: string
  showFilename?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSize: 5,
  uploadTitle: 'Click or drag image to upload',
  uploadDescription: 'PNG, JPG, WEBP up to 5MB',
  showFilename: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [image: UploadedImage]
  'upload-error': [error: string]
}>()

const { upload, validateFile, fileToDataUrl, loading, error } = useCloudinary()

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const errorMessage = ref<string>('')
const uploadProgress = ref(0)
const replaceInputRef = ref<HTMLInputElement | null>(null)

const imageUrl = computed(() => props.modelValue)

async function handleFilesSelected(files: File[]) {
  if (files.length === 0) return
  
  const file = files[0]
  await uploadFile(file)
}

async function uploadFile(file: File) {
  errorMessage.value = ''
  
  // Validate file
  const validation = validateFile(file, {
    maxSize: props.maxSize,
    allowedTypes: props.accept.split(',').map(t => t.trim()),
  })
  
  if (!validation.valid) {
    errorMessage.value = validation.error || 'Invalid file'
    return
  }
  
  // Set preview
  selectedFile.value = file
  previewUrl.value = await fileToDataUrl(file)
  
  // Upload to Cloudinary
  uploadProgress.value = 0
  const result = await upload(file, {
    folder: props.folder || 'uploads',
  })
  
  if (result) {
    // Success
    emit('update:modelValue', result.url)
    emit('upload-success', result)
    previewUrl.value = '' // Clear preview, use actual URL
    uploadProgress.value = 100
  } else {
    // Error
    const errMsg = error.value || 'Upload failed'
    errorMessage.value = errMsg
    emit('upload-error', errMsg)
    previewUrl.value = ''
    selectedFile.value = null
  }
}

function handleView() {
  const url = previewUrl.value || imageUrl.value
  if (url) {
    window.open(url, '_blank')
  }
}

function handleDelete() {
  emit('update:modelValue', '')
  previewUrl.value = ''
  selectedFile.value = null
  errorMessage.value = ''
}

function handleReplace() {
  replaceInputRef.value?.click()
}

function handleReplaceFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  if (files.length > 0) {
    uploadFile(files[0])
  }
  target.value = '' // Reset
}
</script>
