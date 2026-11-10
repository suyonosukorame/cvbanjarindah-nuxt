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
        v-if="isOpen && parsed"
        class="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="`${parsed.label}: ${title}`"
        @click.self="$emit('close')"
      >
        <div class="relative w-full max-w-sm sm:max-w-md bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh]">
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800 shrink-0">
            <div class="flex items-center gap-2 min-w-0">
              <!-- Platform Icon Badge -->
              <div
                class="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                :class="parsed.badgeBg"
              >
                <!-- YouTube Icon -->
                <svg v-if="parsed.platform === 'youtube'" class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>

                <!-- Instagram Icon -->
                <svg v-else-if="parsed.platform === 'instagram'" class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>

                <!-- TikTok Icon -->
                <svg v-else class="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
                </svg>
              </div>

              <!-- Title & Platform Tag -->
              <div class="min-w-0">
                <span class="text-white text-xs sm:text-sm font-semibold truncate block">{{ title }}</span>
                <span class="text-[10px] text-slate-400 block">{{ parsed.label }}</span>
              </div>
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

          <!-- Video / Feed Media Container -->
          <div
            class="relative w-full flex-1 overflow-hidden bg-black"
            :style="playerContainerStyle"
          >
            <!-- Loading Indicator -->
            <div
              v-if="!loaded"
              class="absolute inset-0 flex items-center justify-center bg-slate-950 text-white/70 text-xs flex-col gap-3 z-10"
            >
              <div class="w-8 h-8 border-2 border-white/20 border-t-primary rounded-full animate-spin" />
              <span>Memuat konten {{ parsed.label }}...</span>
            </div>

            <!-- YouTube Iframe Player -->
            <iframe
              v-if="parsed.platform === 'youtube'"
              :src="parsed.embedUrl"
              class="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              @load="loaded = true"
            />

            <!-- Instagram Feed / Reels Iframe -->
            <iframe
              v-else-if="parsed.platform === 'instagram'"
              :src="parsed.embedUrl"
              class="w-full h-full border-0 absolute inset-0 bg-white"
              allowtransparency="true"
              allowfullscreen="true"
              scrolling="no"
              @load="loaded = true"
            />

            <!-- TikTok Iframe Player -->
            <iframe
              v-else-if="parsed.platform === 'tiktok'"
              :src="parsed.embedUrl"
              class="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
              scrolling="no"
              @load="loaded = true"
            />
          </div>

          <!-- Footer Action & Direct Link CTA -->
          <div class="p-3 bg-slate-900 border-t border-slate-800 shrink-0 space-y-2">
            <!-- Direct Open Button -->
            <a
              :href="parsed.directUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r text-white font-bold rounded-xl text-xs sm:text-sm transition shadow-md cursor-pointer hover:opacity-95"
              :class="parsed.gradientClass"
            >
              <span>{{ parsed.actionText }}</span>
              <span class="material-symbols-outlined text-sm shrink-0">open_in_new</span>
            </a>

            <!-- Helper Note -->
            <p v-if="parsed.platform === 'tiktok'" class="text-[10px] text-slate-400 text-center leading-tight">
              💡 Jika pemutaran di atas dibatasi oleh provider ISP, klik tombol di atas untuk membuka di aplikasi TikTok.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { parseSocialMedia } from '~/utils/socialEmbed';

interface Props {
  isOpen: boolean;
  mediaInput: string;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Media Produk',
});

defineEmits<{
  (e: 'close'): void;
}>();

const loaded = ref(false);

const parsed = computed(() => parseSocialMedia(props.mediaInput));

const playerContainerStyle = computed(() => {
  if (!parsed.value) return {};
  if (parsed.value.platform === 'youtube') {
    // 16:9 for YouTube
    return { minHeight: '260px', height: '320px', maxHeight: '50vh' };
  }
  // 9:16 or vertical for TikTok / Instagram
  return { minHeight: '380px', height: '58vh', maxHeight: '600px' };
});

watch(() => [props.isOpen, props.mediaInput], ([open]) => {
  if (!open) loaded.value = false;
});
</script>

