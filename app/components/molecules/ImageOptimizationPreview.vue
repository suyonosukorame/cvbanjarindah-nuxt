<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <!-- Header -->
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-slate-900">Image Optimization Preview</h3>
        <p class="mt-1 text-sm text-slate-600">Your image will be converted to WebP format for better performance</p>
      </div>

      <!-- Status -->
      <div v-if="optimizing" class="mb-4 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-slate-700">Optimizing image...</span>
          <span class="text-sm text-slate-500">{{ optimizationPercent }}%</span>
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div 
            class="h-full bg-primary transition-all duration-300"
            :style="{ width: `${optimizationPercent}%` }"
          />
        </div>
      </div>

      <!-- Image Preview & Stats -->
      <div v-else class="mb-4 space-y-4">
        <!-- Original Image Preview -->
        <div class="rounded-lg bg-slate-50 p-4">
          <img 
            v-if="previewUrl" 
            :src="previewUrl" 
            alt="Original image" 
            class="mb-3 max-h-40 w-full rounded-md border border-slate-200 object-contain"
          >
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-xs font-medium text-slate-600">Original</span>
              <div class="mt-1 font-semibold text-slate-900">{{ formatFileSize(originalSize) }}</div>
              <div class="text-xs text-slate-500">{{ originalDimensions }}</div>
            </div>
            <div>
              <span class="text-xs font-medium text-slate-600">Optimized (WebP)</span>
              <div class="mt-1 font-semibold text-slate-900">{{ formatFileSize(optimizedSize) }}</div>
              <div class="text-xs text-slate-500">{{ optimizedDimensions }}</div>
            </div>
          </div>
        </div>

        <!-- Reduction Summary -->
        <div class="rounded-lg border-2 border-green-200 bg-green-50 p-3">
          <div class="flex items-center justify-between">
            <div>
              <span class="block text-xs font-medium text-green-700">Size Reduction</span>
              <span class="block text-sm font-semibold text-green-900 mt-1">
                {{ formatFileSize(originalSize - optimizedSize) }} 
                <span class="text-lg">({{ reductionPercent }}%)</span>
              </span>
            </div>
            <span class="material-symbols-outlined text-3xl text-green-600">check_circle</span>
          </div>
        </div>

        <!-- Details -->
        <div class="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div class="flex justify-between text-xs">
            <span class="text-slate-600">Original Format</span>
            <span class="font-medium text-slate-900">{{ originalFormat }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-600">Optimized Format</span>
            <span class="font-medium text-slate-900">WebP</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-600">Original Dimensions</span>
            <span class="font-medium text-slate-900">{{ originalDimensions }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-600">Optimized Dimensions</span>
            <span class="font-medium text-slate-900">{{ optimizedDimensions }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-600">Quality</span>
            <span class="font-medium text-slate-900">90%</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          type="button"
          :disabled="optimizing"
          class="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="emit('cancel')"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="optimizing"
          class="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          @click="emit('confirm')"
        >
          {{ optimizing ? 'Optimizing...' : 'Upload' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageOptimizationResult } from '~/composables/useCloudinary'

interface Props {
  visible: boolean
  optimizing?: boolean
  optimizationPercent?: number
  optimizationResult?: ImageOptimizationResult | null
  previewUrl?: string
}

const props = withDefaults(defineProps<Props>(), {
  optimizing: false,
  optimizationPercent: 0,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const { formatFileSize } = useCloudinary()

const originalSize = computed(() => props.optimizationResult?.original.size || 0)
const optimizedSize = computed(() => props.optimizationResult?.optimized.size || 0)
const reductionPercent = computed(() => props.optimizationResult?.reduction.percent || 0)
const originalFormat = computed(() => props.optimizationResult?.original.format?.toUpperCase() || 'Unknown')

const originalDimensions = computed(() => {
  if (!props.optimizationResult) return ''
  const { width, height } = props.optimizationResult.original
  return `${width}×${height}px`
})

const optimizedDimensions = computed(() => {
  if (!props.optimizationResult) return ''
  const { width, height } = props.optimizationResult.optimized
  return `${width}×${height}px`
})
</script>
