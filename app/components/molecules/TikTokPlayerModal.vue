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
        class="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`TikTok: ${title}`"
        @click.self="$emit('close')"
      >
        <div class="relative w-full max-w-sm bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh]">
          <!-- Header -->
          <div class="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800 shrink-0">
            <div class="flex items-center gap-2 min-w-0">
              <!-- TikTok Icon SVG -->
              <div class="w-6 h-6 rounded-md bg-black flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
                </svg>
              </div>
              <span class="text-white text-xs sm:text-sm font-semibold truncate">{{ title }}</span>
            </div>
            <button
              type="button"
              class="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 shrink-0 cursor-pointer"
              aria-label="Tutup"
              @click="$emit('close')"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Video / Carousel Player Container -->
          <div class="relative w-full flex-1 overflow-hidden bg-black" style="min-height: 380px; max-height: 58vh;">
            <!-- Loading Spinner -->
            <div
              v-if="!loaded"
              class="absolute inset-0 flex items-center justify-center bg-slate-950 text-white/70 text-xs flex-col gap-3 z-10"
            >
              <div class="w-8 h-8 border-2 border-white/20 border-t-[#fe2c55] rounded-full animate-spin" />
              <span>Memuat konten TikTok...</span>
            </div>

            <!-- TikTok Iframe with Enhanced Attributes -->
            <iframe
              v-if="cleanPostId"
              :src="`https://www.tiktok.com/player/v1/${cleanPostId}?music_info=1&description=1&rel=0&autoplay=0`"
              class="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
              scrolling="no"
              @load="loaded = true"
            />
          </div>

          <!-- Footer Action & Smart Fallback CTA -->
          <div class="p-3 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2">
            <!-- Direct Watch Button (Bypasses any iframe CORS/ISP blocks) -->
            <a
              :href="directPostUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-[#fe2c55] via-[#ff0050] to-[#25f4ee] hover:opacity-95 text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md cursor-pointer"
            >
              <svg class="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
              </svg>
              <span>Putar Langsung di TikTok (HD + Musik)</span>
              <span class="material-symbols-outlined text-sm shrink-0">open_in_new</span>
            </a>

            <!-- Helper Note -->
            <p class="text-[10px] text-slate-400 text-center leading-tight">
              💡 Jika pemutaran di atas terhenti (kebijakan ISP/Chrome), klik tombol di atas untuk membuka reel di TikTok.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  isOpen: boolean;
  postId: string;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Lihat di TikTok',
});

defineEmits<{
  (e: 'close'): void;
}>();

const loaded = ref(false);

// Extract clean numerical ID if user pasted full URL
const cleanPostId = computed(() => {
  if (!props.postId) return '';
  const match = props.postId.match(/\d{15,25}/);
  return match ? match[0] : props.postId.trim();
});

// Construct direct link to post
const directPostUrl = computed(() => {
  if (props.postId.startsWith('http')) return props.postId;
  return `https://www.tiktok.com/@cvbanjarindah/photo/${cleanPostId.value}`;
});

watch(() => [props.isOpen, props.postId], ([open]) => {
  if (!open) loaded.value = false;
});
</script>
