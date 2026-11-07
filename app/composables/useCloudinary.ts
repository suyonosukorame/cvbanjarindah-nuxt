/**
 * useCloudinary Composable
 * Handles Cloudinary upload, delete, and image transformations
 */

import type { 
  CloudinaryUploadResponse, 
  CloudinaryUploadOptions,
  CloudinaryTransformation,
  UploadedImage,
  UploadProgress 
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
  
  /**
   * Upload file to Cloudinary
   */
  async function upload(
    file: File,
    options: CloudinaryUploadOptions = {}
  ): Promise<UploadedImage | null> {
    if (!cloudName || !uploadPreset) {
      error.value = 'Cloudinary configuration missing. Please set NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'
      return null
    }
    
    loading.value = true
    error.value = null
    progress.value = { loaded: 0, total: 0, percentage: 0 }
    
    try {
      const formData = new FormData()
      formData.append('file', file)
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
    
    // Methods
    upload,
    deleteImage,
    getOptimizedUrl,
    getThumbnail,
    validateFile,
    fileToDataUrl,
  }
}
