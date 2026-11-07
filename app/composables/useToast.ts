/**
 * useToast Composable
 * Global toast notification system
 */

import type { ToastOptions, ToastInput } from '~/types/toast'

export function useToast() {
  const toasts = useState<ToastOptions[]>('toasts', () => [])
  
  function show(options: ToastInput) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const toast: ToastOptions = {
      id,
      variant: options.variant || 'info',
      title: options.title,
      message: options.message,
      closeable: options.closeable !== false,
      duration: options.duration !== undefined ? options.duration : 5000,
      show: true,
    }
    
    toasts.value.push(toast)
    
    return id
  }
  
  function success(message: string, title?: string) {
    return show({
      variant: 'success',
      title: title || 'Berhasil',
      message,
    })
  }
  
  function error(message: string, title?: string) {
    return show({
      variant: 'error',
      title: title || 'Gagal',
      message,
    })
  }
  
  function warning(message: string, title?: string) {
    return show({
      variant: 'warning',
      title: title || 'Peringatan',
      message,
    })
  }
  
  function info(message: string, title?: string) {
    return show({
      variant: 'info',
      title: title || 'Info',
      message,
    })
  }
  
  function remove(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }
  
  function clear() {
    toasts.value = []
  }
  
  return {
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear,
    toasts: readonly(toasts),
  }
}
