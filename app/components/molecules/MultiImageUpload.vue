<template>
  <div class="space-y-4">
    <!-- Label -->
    <div v-if="label" class="flex items-center justify-between">
      <label class="block text-sm font-medium text-slate-700">
        {{ label }}
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <span class="text-xs text-slate-500">
        {{ images.length }} / {{ maxFiles }} images
      </span>
    </div>
    
    <!-- Upload Zone -->
    <AtomsUploadZone
      v-if="images.length < maxFiles"
      :accept="accept"
      :multiple="true"
      :disabled="loading || images.length >= maxFiles"
      :title="uploadTitle"
      :description="uploadDescription"
      @files-selected="handleFilesSelected"
    />
    
    <!-- Images Grid -->
    <div 
      v-if="images.length > 0"
      class="grid gap-4"
      :class="gridClass"
    >
      <AtomsImagePreview
        v-for="(image, index) in images"
        :key="image"
        :src="image"
        :alt="`Image ${index + 1}`"
        :loading="loadingIndex === index"
        :show-view="true"
        :show-delete="!disabled"
        @view="handleView(image)"
        @delete="handleDelete(index)"
      />
    </div>
    
    <!-- Upload Progress -->
    <div v-if="loading" class="space-y-2">
      <AtomsProgressBar
        :percentage="uploadProgress"
        :label="`Uploading ${currentFileName}...`"
      />
      <p class="text-xs text-slate-500 text-center">
        {{ uploadedCount }} / {{ totalFilesToUpload }} uploaded
      </p>
    </div>
    
    <!-- Error Messages -->
    <div v-if="errors.length > 0" class="space-y-1">
      <p 
        v-for="(error, index) in errors"
        :key="index"
        class="text-sm text-red-600"
      >
        {{ error }}
      </p>
    </div>
    
    <!-- Helper Text -->
    <p v-if="helperText && errors.length === 0" class="text-xs text-slate-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { UploadedImage } from '~/types/cloudinary'

interface Props {
  modelValue: string[] // Array of image URLs
  label?: string
  required?: boolean
  disabled?: boolean
  accept?: string
  maxSize?: number // in MB per file
  maxFiles?: number
  folder?: string
  uploadTitle?: string
  uploadDescription?: string
  helperText?: string
  columns?: 2 | 3 | 4 | 5
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSize: 5,
  maxFiles: 10,
  uploadTitle: 'Click or drag images to upload',
  uploadDescription: 'PNG, JPG, WEBP up to 5MB each',
  columns: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'upload-success': [images: UploadedImage[]]
  'upload-error': [errors: string[]]
}>()

const { upload, validateFile, loading, error } = useCloudinary()

const images = computed(() => props.modelValue)
const errors = ref<string[]>([])
const uploadProgress = ref(0)
const loadingIndex = ref<number | null>(null)
const currentFileName = ref('')
const uploadedCount = ref(0)
const totalFilesToUpload = ref(0)

const gridClass = computed(() => {
  const cols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
  }
  return cols[props.columns]
})

async function handleFilesSelected(files: File[]) {
  if (files.length === 0) return
  
  // Check max files limit
  const remainingSlots = props.maxFiles - images.value.length
  if (remainingSlots <= 0) {
    errors.value = ['Maximum number of images reached']
    return
  }
  
  const filesToUpload = files.slice(0, remainingSlots)
  await uploadFiles(filesToUpload)
}

async function uploadFiles(files: File[]) {
  errors.value = []
  uploadedCount.value = 0
  totalFilesToUpload.value = files.length
  
  const uploadedImages: UploadedImage[] = []
  const newUrls: string[] = []
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    currentFileName.value = file.name
    loadingIndex.value = images.value.length + i
    
    // Validate
    const validation = validateFile(file, {
      maxSize: props.maxSize,
      allowedTypes: props.accept.split(',').map(t => t.trim()),
    })
    
    if (!validation.valid) {
      errors.value.push(`${file.name}: ${validation.error}`)
      continue
    }
    
    // Upload
    uploadProgress.value = Math.round(((i + 1) / files.length) * 100)
    const result = await upload(file, {
      folder: props.folder || 'uploads',
    })
    
    if (result) {
      uploadedImages.push(result)
      newUrls.push(result.url)
      uploadedCount.value++
    } else {
      errors.value.push(`${file.name}: ${error.value || 'Upload failed'}`)
    }
  }
  
  // Update model
  if (newUrls.length > 0) {
    emit('update:modelValue', [...images.value, ...newUrls])
    emit('upload-success', uploadedImages)
  }
  
  if (errors.value.length > 0) {
    emit('upload-error', errors.value)
  }
  
  loadingIndex.value = null
  currentFileName.value = ''
  uploadProgress.value = 0
}

function handleView(imageUrl: string) {
  window.open(imageUrl, '_blank')
}

function handleDelete(index: number) {
  const newImages = [...images.value]
  newImages.splice(index, 1)
  emit('update:modelValue', newImages)
}
</script>
