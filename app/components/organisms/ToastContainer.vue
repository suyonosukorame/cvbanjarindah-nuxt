<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-50 pointer-events-none flex flex-col gap-3"
      role="region"
      aria-label="Notifications"
    >
      <AtomsToast
        v-for="toast in toasts"
        :key="toast.id"
        :show="toast.show"
        :variant="toast.variant"
        :title="toast.title"
        :message="toast.message"
        :closeable="toast.closeable"
        :duration="toast.duration"
        @close="removeToast(toast.id)"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastOptions } from '~/types/toast'

const toastState = useState<ToastOptions[]>('toasts', () => [])

const toasts = computed(() => toastState.value)

function removeToast(id: string) {
  const index = toastState.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toastState.value[index].show = false
    // Remove from array after animation
    setTimeout(() => {
      toastState.value = toastState.value.filter(t => t.id !== id)
    }, 300)
  }
}
</script>
