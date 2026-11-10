<template>
  <Card padding="none" class="group overflow-hidden flex flex-col h-full border border-slate-100 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
    <!-- Image with Quick View Trigger on Click -->
    <div
      class="relative overflow-hidden cursor-pointer bg-slate-50 aspect-square"
      @click="$emit('view-details', product)"
    >
      <AtomsImage
        :src="product.image"
        :alt="product.name"
        :hover="true"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <!-- Hover Overlay -->
      <div class="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
        <span class="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white/95 text-slate-800 text-[11px] sm:text-xs font-bold shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
          <span class="material-symbols-outlined text-sm text-primary">visibility</span>
          Detail
        </span>
      </div>

      <!-- Social Media Badge (YouTube, Instagram, or TikTok) -->
      <button
        v-if="socialMedia"
        type="button"
        class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-white text-[10px] sm:text-xs font-semibold transition-all shadow-md backdrop-blur-xs hover:opacity-90 cursor-pointer"
        :class="socialMedia.badgeBg"
        :title="`Lihat konten ${socialMedia.label}`"
        @click.stop="showSocialMedia = true"
      >
        <span class="material-symbols-outlined text-xs sm:text-sm shrink-0 leading-none">{{ socialMedia.icon }}</span>
        <span class="leading-none">{{ socialMedia.label }}</span>
      </button>
    </div>
    
    <!-- Content Body (Super Responsive Padding: p-2.5 di mobile, p-4 di tablet, p-5 di desktop) -->
    <div class="p-2.5 sm:p-4 md:p-5 flex flex-col flex-1">
      <!-- Category & Brand Badge -->
      <div class="flex items-center justify-between gap-1.5 mb-1.5 sm:mb-2 min-w-0">
        <AtomsBadge
          :color="categoryColor"
          size="xs"
          class="shrink-0 max-w-[62%] sm:max-w-[68%] truncate text-[10px] sm:text-xs"
        >
          {{ product.category }}
        </AtomsBadge>
        <span
          v-if="product.brand"
          class="text-[10px] sm:text-xs font-medium text-slate-500 truncate text-right shrink min-w-0"
          :title="product.brand"
        >
          {{ product.brand }}
        </span>
      </div>
      
      <!-- Product Name (Clamped to 2 lines) -->
      <h3
        class="font-bold text-xs sm:text-sm md:text-base text-slate-900 mb-1 sm:mb-1.5 line-clamp-2 cursor-pointer hover:text-primary transition-colors leading-snug"
        :title="product.name"
        @click="$emit('view-details', product)"
      >
        {{ product.name }}
      </h3>
      
      <!-- Product Description (Clamped to 2 lines) -->
      <p class="text-slate-500 text-[11px] sm:text-xs md:text-sm line-clamp-2 mb-2.5 sm:mb-4 leading-relaxed">
        {{ product.description }}
      </p>
      
      <!-- Bottom Actions Pinned to Base -->
      <div class="mt-auto pt-1 sm:pt-2 space-y-1.5">
        <!-- 2 Action Buttons (Responsive Compact, No Text Wrapping) -->
        <div class="grid grid-cols-2 gap-1 sm:gap-1.5">
          <!-- + Order Button -->
          <button
            type="button"
            class="flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all border cursor-pointer whitespace-nowrap min-w-0 overflow-hidden"
            :class="[
              isAdded
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-orange-50 hover:bg-orange-100 text-primary border-orange-200'
            ]"
            title="Tambah ke Daftar Pesanan Grosir"
            @click="handleAddToCart"
          >
            <span class="material-symbols-outlined text-sm sm:text-base shrink-0">{{ isAdded ? 'check' : 'add_shopping_cart' }}</span>
            <span class="truncate leading-none">{{ isAdded ? 'Ditambah' : '+ Order' }}</span>
          </button>

          <!-- Tanya WA Button -->
          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-1 sm:px-2 bg-primary hover:bg-orange-600 text-white rounded-lg text-[11px] sm:text-xs font-bold transition-colors shadow-2xs whitespace-nowrap min-w-0 overflow-hidden"
            title="Tanya harga langsung ke WhatsApp"
          >
            <span class="material-symbols-outlined text-sm sm:text-base shrink-0">chat</span>
            <span class="truncate leading-none">Tanya WA</span>
          </a>
        </div>

        <!-- Social Media Button (YouTube / Instagram / TikTok) -->
        <button
          v-if="socialMedia"
          type="button"
          class="w-full flex items-center justify-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer"
          :class="[
            socialMedia.platform === 'youtube'
              ? 'border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600'
              : socialMedia.platform === 'instagram'
                ? 'border-pink-200 text-pink-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-pink-500'
                : 'border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900'
          ]"
          @click="showSocialMedia = true"
        >
          <span class="material-symbols-outlined text-xs sm:text-sm shrink-0">{{ socialMedia.icon }}</span>
          <span class="leading-none">Lihat di {{ socialMedia.label }}</span>
        </button>

        <!-- Quick View Link -->
        <button
          type="button"
          class="w-full py-0.5 sm:py-1 text-center text-[10px] sm:text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
          @click="$emit('view-details', product)"
        >
          Lihat Detail <span class="hidden sm:inline">Lengkap</span>
        </button>
      </div>
    </div>
  </Card>

  <!-- Universal Social Media Modal -->
  <MoleculesSocialMediaModal
    v-if="socialMedia"
    :is-open="showSocialMedia"
    :media-input="product.tiktok_post_id"
    :title="product.name"
    @close="showSocialMedia = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from '~/types/product';
import { parseSocialMedia } from '~/utils/socialEmbed';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'view-details', product: Product): void;
}>();

const { addToCart } = useOrderCart();
const isAdded = ref(false);
const showSocialMedia = ref(false);

const socialMedia = computed(() => parseSocialMedia(props.product.tiktok_post_id));

const handleAddToCart = () => {
  addToCart(props.product, 1, 'Karton');
  isAdded.value = true;
  setTimeout(() => {
    isAdded.value = false;
  }, 1500);
};

const categoryColor = computed(() => {
  const colors: Record<string, any> = {
    'Tissue': 'blue',
    'Masker': 'red',
    'Bayi': 'purple',
    'Kesehatan': 'emerald',
    'Kosmetik & Kecantikan': 'pink',
    'Perlengkapan Bayi': 'purple',
    'Garment & Pakaian': 'indigo',
    'Elektronik': 'amber',
    'Kelontongan': 'orange',
  };
  return colors[props.product.category] || 'primary';
});

// WhatsApp order message with product name
const whatsappUrl = computed(() => {
  const text = `Halo CV Banjar Indah, saya ingin tanya harga dan stok produk: *${props.product.name}* (${props.product.category}).`;
  return `https://wa.me/6285124502615?text=${encodeURIComponent(text)}`;
});
</script>
