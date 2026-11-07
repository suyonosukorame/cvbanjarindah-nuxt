/**
 * Cloudinary Types
 * Type definitions for Cloudinary integration
 */

export interface CloudinaryUploadResponse {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  tags: string[]
  bytes: number
  type: string
  etag: string
  placeholder: boolean
  url: string
  secure_url: string
  folder: string
  original_filename: string
  asset_id: string
}

export interface CloudinaryUploadOptions {
  folder?: string
  public_id?: string
  tags?: string[]
  context?: Record<string, string>
  transformation?: CloudinaryTransformation
  resource_type?: 'image' | 'video' | 'raw' | 'auto'
}

export interface CloudinaryTransformation {
  width?: number
  height?: number
  crop?: 'scale' | 'fit' | 'fill' | 'crop' | 'thumb' | 'limit'
  quality?: number | 'auto'
  format?: 'jpg' | 'png' | 'webp' | 'avif' | 'auto'
  fetch_format?: 'auto'
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west'
}

export interface CloudinaryError {
  message: string
  http_code: number
}

export interface UploadedImage {
  id: string
  url: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
  filename: string
  uploadedAt: Date
}

export interface FileValidation {
  maxSize?: number // in MB
  allowedTypes?: string[]
  maxFiles?: number
}

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface ImageOptimizationResult {
  original: {
    size: number
    format: string
    width: number
    height: number
  }
  optimized: {
    blob: Blob
    size: number
    format: string
    width: number
    height: number
  }
  reduction: {
    bytes: number
    percent: number
  }
}
