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

    <!-- Optimization Preview Modal -->
    <MoleculesImageOptimizationPreview
      :visible="showOptimizationPreview"
      :optimizing="optimizing"
      :optimization-percent="optimizationProgress"
      :optimization-result="optimizationResult"
      :preview-url="previewUrl"
      @confirm="confirmUpload"
      @cancel="cancelUpload"
    />
    
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
import type { UploadedImage, ImageOptimizationResult } from '~/types/cloudinary'

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
  showOptimization?: boolean // Show optimization preview before upload
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSize: 5,
  uploadTitle: 'Click or drag image to upload',
  uploadDescription: 'PNG, JPG, WEBP up to 5MB',
  showFilename: false,
  showOptimization: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [image: UploadedImage]
  'upload-error': [error: string]
}>()

const { upload, validateFile, fileToDataUrl, convertToWebP, loading, error, optimizationProgress } = useCloudinary()
const toast = useToast()

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const errorMessage = ref<string>('')
const uploadProgress = ref(0)
const replaceInputRef = ref<HTMLInputElement | null>(null)
const showOptimizationPreview = ref(false)
const optimizing = ref(false)
const optimizationResult = ref<ImageOptimizationResult | null>(null)
const pendingFile = ref<File | null>(null)

const imageUrl = computed(() => props.modelValue)

async function handleFilesSelected(files: File[]) {
  if (files.length === 0) return
  
  const file = files[0]
  await prepareUpload(file)
}

async function prepareUpload(file: File) {
  errorMessage.value = ''
  
  // Validate file
  const validation = validateFile(file, {
    maxSize: props.maxSize,
    allowedTypes: props.accept.split(',').map(t => t.trim()),
  })
  
  if (!validation.valid) {
    errorMessage.value = validation.error || 'Invalid file'
    emit('upload-error', errorMessage.value)
    toast.error(errorMessage.value)
    return
  }
  
  // Set preview
  selectedFile.value = file
  previewUrl.value = await fileToDataUrl(file)
  pendingFile.value = file
  
  // Show optimization preview if enabled
  if (props.showOptimization && isOptimizableImage(file.type)) {
    showOptimizationPreview.value = true
    optimizing.value = true
    optimizationResult.value = null
    
    // Start optimization in background
    setTimeout(async () => {
      const result = await convertToWebP(file, 0.9)
      optimizationResult.value = result
      optimizing.value = false
    }, 100)
  } else {
    // Upload directly without optimization preview
    await uploadFile(file)
  }
}

function isOptimizableImage(mimeType: string): boolean {
  const optimizableFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
  return optimizableFormats.includes(mimeType)
}

async function confirmUpload() {
  if (pendingFile.value) {
    showOptimizationPreview.value = false
    await uploadFile(pendingFile.value)
    pendingFile.value = null
  }
}

function cancelUpload() {
  showOptimizationPreview.value = false
  previewUrl.value = ''
  selectedFile.value = null
  pendingFile.value = null
  errorMessage.value = ''
}

async function uploadFile(file: File) {
  errorMessage.value = ''
  
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
    toast.success(`Gambar berhasil diunggah`)
  } else {
    // Error
    const errMsg = error.value || 'Upload failed'
    errorMessage.value = errMsg
    emit('upload-error', errMsg)
    previewUrl.value = ''
    selectedFile.value = null
    toast.error(errMsg)
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
    prepareUpload(files[0])
  }
  target.value = '' // Reset
}
</script>
