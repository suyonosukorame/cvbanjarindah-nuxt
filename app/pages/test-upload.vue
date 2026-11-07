<template>
  <div class="min-h-screen bg-slate-50 py-12">
    <div class="max-w-4xl mx-auto px-4">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 mb-2">
          Cloudinary Upload Test
        </h1>
        <p class="text-slate-600">
          Test single and multiple image upload components
        </p>
      </div>

      <!-- Configuration Status -->
      <div class="mb-8 p-4 rounded-lg border" :class="configStatus.class">
        <div class="flex items-start gap-3">
          <AtomsIcon :name="configStatus.icon" :color="configStatus.iconColor" />
          <div>
            <h3 class="font-semibold text-sm mb-1">{{ configStatus.title }}</h3>
            <p class="text-sm opacity-90">{{ configStatus.message }}</p>
            <div v-if="!isConfigured" class="mt-2 text-xs space-y-1 opacity-75">
              <p>1. Set NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env</p>
              <p>2. Set NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env</p>
              <p>3. Restart dev server</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        
        <!-- Test 1: Single Image Upload -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            Test 1: Single Image Upload
          </h2>
          <p class="text-sm text-slate-600 mb-6">
            Upload satu gambar, preview, replace, atau delete
          </p>
          
          <MoleculesImageUploadField
            v-model="singleImage"
            label="Product Image"
            required
            folder="test/products"
            helper-text="Upload product image, PNG/JPG/WEBP up to 5MB"
            :disabled="!isConfigured"
            @upload-success="handleSingleUploadSuccess"
            @upload-error="handleUploadError"
          />

          <!-- Result Display -->
          <div v-if="singleImage" class="mt-4 p-4 bg-slate-50 rounded-lg">
            <p class="text-xs font-medium text-slate-700 mb-2">Uploaded URL:</p>
            <code class="text-xs text-primary break-all">{{ singleImage }}</code>
          </div>
        </div>

        <!-- Test 2: Multiple Images Upload -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            Test 2: Multiple Images Upload
          </h2>
          <p class="text-sm text-slate-600 mb-6">
            Upload multiple gambar sekaligus dengan gallery view
          </p>
          
          <MoleculesMultiImageUpload
            v-model="multipleImages"
            label="Product Gallery"
            :max-files="5"
            :columns="3"
            folder="test/gallery"
            helper-text="Upload up to 5 images for gallery"
            :disabled="!isConfigured"
            @upload-success="handleMultiUploadSuccess"
            @upload-error="handleUploadError"
          />

          <!-- Result Display -->
          <div v-if="multipleImages.length > 0" class="mt-4 p-4 bg-slate-50 rounded-lg">
            <p class="text-xs font-medium text-slate-700 mb-2">
              Uploaded URLs ({{ multipleImages.length }}):
            </p>
            <div class="space-y-1">
              <code 
                v-for="(url, index) in multipleImages" 
                :key="url"
                class="block text-xs text-primary break-all"
              >
                {{ index + 1 }}. {{ url }}
              </code>
            </div>
          </div>
        </div>

        <!-- Test 3: Logo Upload (Custom Settings) -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">
            Test 3: Logo Upload (Custom)
          </h2>
          <p class="text-sm text-slate-600 mb-6">
            Upload logo dengan custom settings (max 2MB, PNG only)
          </p>
          
          <MoleculesImageUploadField
            v-model="logoImage"
            label="Brand Logo"
            folder="test/logos"
            :max-size="2"
            accept="image/png,image/svg+xml"
            upload-title="Upload brand logo"
            upload-description="PNG or SVG, max 2MB, recommended 512x512px"
            :disabled="!isConfigured"
            @upload-success="handleLogoUploadSuccess"
            @upload-error="handleUploadError"
          />

          <!-- Result Display -->
          <div v-if="logoImage" class="mt-4 p-4 bg-slate-50 rounded-lg">
            <p class="text-xs font-medium text-slate-700 mb-2">Logo URL:</p>
            <code class="text-xs text-primary break-all">{{ logoImage }}</code>
          </div>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="successMessage" class="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-start gap-3">
            <AtomsIcon name="check_circle" color="success" />
            <div>
              <p class="text-sm font-medium text-green-900">Upload Success!</p>
              <p class="text-xs text-green-700 mt-1">{{ successMessage }}</p>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-3">
            <AtomsIcon name="error" color="danger" />
            <div>
              <p class="text-sm font-medium text-red-900">Upload Failed</p>
              <p class="text-xs text-red-700 mt-1">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Clear All Button -->
        <div class="flex justify-center">
          <button
            @click="clearAll"
            class="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Clear All Images
          </button>
        </div>

      </div>

      <!-- Back to Home -->
      <div class="mt-8 text-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors"
        >
          <AtomsIcon name="arrow_back" size="sm" />
          Back to Home
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { UploadedImage } from '~/types/cloudinary'

const config = useRuntimeConfig()

// Check if Cloudinary is configured
const isConfigured = computed(() => {
  return !!(config.public.cloudinaryCloudName && config.public.cloudinaryUploadPreset)
})

const configStatus = computed(() => {
  if (isConfigured.value) {
    return {
      class: 'bg-green-50 border-green-200',
      icon: 'check_circle',
      iconColor: 'success' as const,
      title: '✅ Cloudinary Configured',
      message: `Cloud Name: ${config.public.cloudinaryCloudName} | Upload Preset: ${config.public.cloudinaryUploadPreset}`,
    }
  } else {
    return {
      class: 'bg-yellow-50 border-yellow-200',
      icon: 'warning',
      iconColor: 'danger' as const,
      title: '⚠️ Cloudinary Not Configured',
      message: 'Please configure Cloudinary environment variables in .env file',
    }
  }
})

// State
const singleImage = ref('')
const multipleImages = ref<string[]>([])
const logoImage = ref('')
const successMessage = ref('')
const errorMessage = ref('')

// Handlers
function handleSingleUploadSuccess(image: UploadedImage) {
  successMessage.value = `Single image uploaded: ${image.filename} (${Math.round(image.size / 1024)}KB)`
  errorMessage.value = ''
  console.log('Single upload success:', image)
  
  // Auto clear message after 5s
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

function handleMultiUploadSuccess(images: UploadedImage[]) {
  successMessage.value = `${images.length} images uploaded successfully!`
  errorMessage.value = ''
  console.log('Multi upload success:', images)
  
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

function handleLogoUploadSuccess(image: UploadedImage) {
  successMessage.value = `Logo uploaded: ${image.width}x${image.height}px`
  errorMessage.value = ''
  console.log('Logo upload success:', image)
  
  setTimeout(() => {
    successMessage.value = ''
  }, 5000)
}

function handleUploadError(error: string | string[]) {
  const errorMsg = Array.isArray(error) ? error.join(', ') : error
  errorMessage.value = errorMsg
  successMessage.value = ''
  console.error('Upload error:', error)
  
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

function clearAll() {
  singleImage.value = ''
  multipleImages.value = []
  logoImage.value = ''
  successMessage.value = ''
  errorMessage.value = ''
}

// Set page meta
useHead({
  title: 'Cloudinary Upload Test - CV Banjar Indah',
})
</script>
