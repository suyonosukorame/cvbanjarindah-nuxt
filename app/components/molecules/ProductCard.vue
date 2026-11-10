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

      <!-- TikTok Badge (pojok kanan atas - hanya jika ada tiktok_post_id) -->
      <button
        v-if="product.tiktok_post_id"
        type="button"
        class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg bg-slate-900/85 hover:bg-slate-900 text-white text-[10px] sm:text-xs font-semibold transition-all shadow-md backdrop-blur-xs"
        title="Lihat konten TikTok produk ini"
        @click.stop="showTikTok = true"
      >
        <svg class="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
        </svg>
        <span class="leading-none">TikTok</span>
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

        <!-- TikTok Button (full width - hanya jika ada tiktok_post_id) -->
        <button
          v-if="product.tiktok_post_id"
          type="button"
          class="w-full flex items-center justify-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold text-slate-600 hover:text-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 transition-all whitespace-nowrap"
          @click="showTikTok = true"
        >
          <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
          </svg>
          <span class="leading-none">Lihat di TikTok</span>
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

  <!-- TikTok Player Modal -->
  <MoleculesTikTokPlayerModal
    v-if="product.tiktok_post_id"
    :is-open="showTikTok"
    :post-id="product.tiktok_post_id"
    :title="product.name"
    @close="showTikTok = false"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product } from '~/types/product';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'view-details', product: Product): void;
}>();

const { addToCart } = useOrderCart();
const isAdded = ref(false);
const showTikTok = ref(false);

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
