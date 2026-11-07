<template>
  <div class="flex items-center gap-2">
    <!-- Thumbnail -->
    <AtomsImageThumbnail 
      :src="imageUrl"
      :alt="itemName"
      :show-tooltip="true"
      @click="openModal"
    />
    
    <!-- Image Info (optional) -->
    <div v-if="showInfo" class="flex-1 min-w-0">
      <p class="text-sm font-medium text-slate-700 truncate">{{ itemName }}</p>
      <p v-if="showUrl" class="text-xs text-slate-500 truncate">{{ truncateUrl(imageUrl) }}</p>
    </div>
    
    <!-- Preview Modal -->
    <MoleculesImagePreviewModal
      :is-open="isModalOpen"
      :image-url="imageUrl"
      :image-alt="itemName"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  imageUrl?: string
  itemName?: string
  showInfo?: boolean
  showUrl?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showInfo: false,
  showUrl: false,
})

const isModalOpen = ref(false)

function openModal() {
  if (props.imageUrl) {
    isModalOpen.value = true
  }
}

function truncateUrl(url: string, length: number = 30): string {
  if (!url) return ''
  if (url.length <= length) return url
  return url.substring(0, length) + '...'
}
</script>
