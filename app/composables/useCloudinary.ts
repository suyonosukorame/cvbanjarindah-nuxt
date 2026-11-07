/**
 * useCloudinary Composable
 * Handles Cloudinary upload, delete, and image transformations
 * Includes smart WebP conversion for optimization
 */

import type { 
  CloudinaryUploadResponse, 
  CloudinaryUploadOptions,
  CloudinaryTransformation,
  UploadedImage,
  UploadProgress,
  ImageOptimizationResult
} from '~/types/cloudinary'

export function useCloudinary() {
  const config = useRuntimeConfig()
  
  // Cloudinary credentials from env
  const cloudName = config.public.cloudinaryCloudName
  const uploadPreset = config.public.cloudinaryUploadPreset
  
  // State
  const loading = ref(false)
  const progress = ref<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  })
  const error = ref<string | null>(null)
  const optimizationProgress = ref(0)
  
  /**
   * Convert image to WebP format for optimization
   * Reduces file size by 60-80% while maintaining quality
   */
  async function convertToWebP(
    file: File,
    quality: number = 0.9
  ): Promise<ImageOptimizationResult | null> {
    try {
      optimizationProgress.value = 0
      
      // Read original image
      const reader = new FileReader()
      const imageData = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      
      optimizationProgress.value = 20
      
      // Create image element
      const img = new Image()
      const imageLoaded = await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = imageData
      })
      
      optimizationProgress.value = 40
      
      // Get original dimensions
      const originalWidth = img.width
      const originalHeight = img.height
      
      // Calculate new dimensions if image is too large
      // Max width 2000px for optimal web delivery
      const MAX_WIDTH = 2000
      let width = originalWidth
      let height = originalHeight
      
      if (originalWidth > MAX_WIDTH) {
        const ratio = MAX_WIDTH / originalWidth
        width = MAX_WIDTH
        height = Math.round(originalHeight * ratio)
      }
      
      optimizationProgress.value = 50
      
      // Create canvas and convert to WebP
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Could not get canvas context')
      
      ctx.drawImage(img, 0, 0, width, height)
      
      optimizationProgress.value = 70
      
      // Convert to WebP Blob
      const webpBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Canvas conversion failed'))
          },
          'image/webp',
          quality
        )
      })
      
      optimizationProgress.value = 90
      
      // Calculate optimization stats
      const originalSize = file.size
      const optimizedSize = webpBlob.size
      const reductionBytes = originalSize - optimizedSize
      const reductionPercent = Math.round((reductionBytes / originalSize) * 100)
      
      optimizationProgress.value = 100
      
      return {
        original: {
          size: originalSize,
          format: file.type.split('/')[1] || 'unknown',
          width: originalWidth,
          height: originalHeight,
        },
        optimized: {
          blob: webpBlob,
          size: optimizedSize,
          format: 'webp',
          width,
          height,
        },
        reduction: {
          bytes: reductionBytes,
          percent: reductionPercent,
        },
      }
    } catch (err: any) {
      error.value = err.message || 'WebP conversion failed'
      console.error('WebP conversion error:', err)
      return null
    }
  }
  
  /**
   * Optimize image before upload (convert to WebP)
   */
  async function optimizeImage(
    file: File,
    options: {
      quality?: number // 0-1, default 0.9
      autoConvert?: boolean // default true
    } = {}
  ): Promise<File | null> {
    const { quality = 0.9, autoConvert = true } = options
    
    // Skip optimization for certain cases
    if (!autoConvert) return file
    
    // Check if already WebP
    if (file.type === 'image/webp') return file
    
    // Check if supported format for conversion
    const supportedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']
    if (!supportedFormats.includes(file.type)) return file
    
    try {
      const result = await convertToWebP(file, quality)
      if (!result) return null
      
      // Convert Blob to File
      const webpFile = new File(
        [result.optimized.blob],
        file.name.replace(/\.[^.]+$/, '.webp'),
        { type: 'image/webp' }
      )
      
      return webpFile
    } catch (err) {
      console.error('Image optimization error:', err)
      return file // Fallback to original
    }
  }
  
  /**
   * Format bytes to human readable size
   */
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  /**
   * Upload file to Cloudinary
   */
  async function upload(
    file: File,
    options: CloudinaryUploadOptions & { 
      quality?: number
      optimize?: boolean 
    } = {}
  ): Promise<UploadedImage | null> {
    if (!cloudName || !uploadPreset) {
      error.value = 'Cloudinary configuration missing. Please set NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'
      return null
    }
    
    loading.value = true
    error.value = null
    progress.value = { loaded: 0, total: 0, percentage: 0 }
    
    try {
      // Optimize image first (convert to WebP if applicable)
      let uploadFile = file
      if (options.optimize !== false) {
        const optimized = await optimizeImage(file, {
          quality: options.quality || 0.9,
          autoConvert: true,
        })
        if (optimized) uploadFile = optimized
      }
      
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('upload_preset', uploadPreset)
      
      // Optional parameters
      if (options.folder) formData.append('folder', options.folder)
      if (options.public_id) formData.append('public_id', options.public_id)
      if (options.tags) formData.append('tags', options.tags.join(','))
      if (options.resource_type) formData.append('resource_type', options.resource_type)
      
      // Upload to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Upload failed')
      }
      
      const data: CloudinaryUploadResponse = await response.json()
      
      // Format response
      const uploadedImage: UploadedImage = {
        id: data.asset_id,
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
        format: data.format,
        size: data.bytes,
        filename: data.original_filename,
        uploadedAt: new Date(data.created_at),
      }
      
      progress.value = { loaded: 100, total: 100, percentage: 100 }
      return uploadedImage
      
    } catch (err: any) {
      error.value = err.message || 'Upload failed'
      console.error('Cloudinary upload error:', err)
      return null
      
    } finally {
      loading.value = false
      optimizationProgress.value = 0
    }
  }
  
  /**
   * Delete image from Cloudinary
   * Note: Requires server-side API endpoint for security
   */
  async function deleteImage(publicId: string): Promise<boolean> {
    loading.value = true
    error.value = null
    
    try {
      // Call your API endpoint to delete
      const response = await $fetch('/api/cloudinary/delete', {
        method: 'POST',
        body: { publicId },
      })
      
      return true
      
    } catch (err: any) {
      error.value = err.message || 'Delete failed'
      console.error('Cloudinary delete error:', err)
      return false
      
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Get optimized Cloudinary URL with transformations
   */
  function getOptimizedUrl(
    publicId: string,
    transformation: CloudinaryTransformation = {}
  ): string {
    if (!cloudName) return ''
    
    const {
      width,
      height,
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
      fetch_format = 'auto',
      gravity = 'auto',
    } = transformation
    
    let transformStr = 'f_auto,q_auto'
    
    if (width) transformStr += `,w_${width}`
    if (height) transformStr += `,h_${height}`
    if (crop) transformStr += `,c_${crop}`
    if (gravity) transformStr += `,g_${gravity}`
    
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${publicId}`
  }
  
  /**
   * Get thumbnail URL
   */
  function getThumbnail(publicId: string, size: number = 200): string {
    return getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      gravity: 'auto',
    })
  }
  
  /**
   * Validate file before upload
   */
  function validateFile(
    file: File,
    options: {
      maxSize?: number // in MB
      allowedTypes?: string[]
    } = {}
  ): { valid: boolean; error?: string } {
    const { maxSize = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] } = options
    
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      }
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      return {
        valid: false,
        error: `File size too large. Max size: ${maxSize}MB`,
      }
    }
    
    return { valid: true }
  }
  
  /**
   * Convert File to data URL for preview
   */
  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  
  return {
    // State
    loading: readonly(loading),
    progress: readonly(progress),
    error: readonly(error),
    optimizationProgress: readonly(optimizationProgress),
    
    // Methods
    upload,
    deleteImage,
    getOptimizedUrl,
    getThumbnail,
    validateFile,
    fileToDataUrl,
    convertToWebP,
    optimizeImage,
    formatFileSize,
  }
}

// Export types
export type { ImageOptimizationResult }
