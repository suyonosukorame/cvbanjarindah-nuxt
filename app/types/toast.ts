/**
 * Toast Notification Types
 */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  id: string
  variant: ToastVariant
  title?: string
  message: string
  closeable?: boolean
  duration?: number
  show?: boolean
}

export interface ToastInput {
  variant?: ToastVariant
  title?: string
  message: string
  closeable?: boolean
  duration?: number
}
