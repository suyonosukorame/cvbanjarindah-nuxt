<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`TikTok: ${title}`"
        @click.self="$emit('close')"
      >
        <div class="relative w-full max-w-sm bg-black rounded-2xl overflow-hidden shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between p-3 bg-slate-900/90">
            <div class="flex items-center gap-2">
              <!-- TikTok Icon SVG -->
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
              </svg>
              <span class="text-white text-sm font-semibold truncate max-w-[200px]">{{ title }}</span>
            </div>
            <button
              type="button"
              class="text-white/80 hover:text-white transition-colors p-1"
              aria-label="Tutup"
              @click="$emit('close')"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- TikTok Iframe Player: 9:16 aspect ratio -->
          <div class="relative w-full" style="padding-bottom: 177.78%;">
            <div
              v-if="!loaded"
              class="absolute inset-0 flex items-center justify-center bg-slate-900 text-white/60 text-sm flex-col gap-3"
            >
              <div class="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
              <span>Memuat konten TikTok...</span>
            </div>
            <iframe
              v-if="postId"
              :src="`https://www.tiktok.com/player/v1/${postId}?rel=1&autoplay=0`"
              class="absolute inset-0 w-full h-full border-0"
              allowfullscreen
              allow="encrypted-media *; autoplay"
              scrolling="no"
              @load="loaded = true"
            />
          </div>

          <!-- Footer CTA -->
          <div class="p-3 bg-slate-900/90">
            <a
              href="https://www.tiktok.com/@cvbanjarindah"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
              </svg>
              Lihat Profil @cvbanjarindah
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
  postId: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Lihat di TikTok',
})

defineEmits<{
  (e: 'close'): void
}>()

const loaded = ref(false)

watch(() => [props.isOpen, props.postId], ([open]) => {
  if (!open) loaded.value = false
})
</script>
