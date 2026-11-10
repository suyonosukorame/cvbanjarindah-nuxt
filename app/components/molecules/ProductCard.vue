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
        <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/95 text-slate-800 text-xs font-bold shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
          <span class="material-symbols-outlined text-sm text-primary">visibility</span>
          Detail
        </span>
      </div>

      <!-- TikTok Badge (pojok kanan atas - hanya jika ada tiktok_post_id) -->
      <button
        v-if="product.tiktok_post_id"
        type="button"
        class="absolute top-2 right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold transition-all shadow-md backdrop-blur-sm"
        title="Lihat konten TikTok produk ini"
        @click.stop="showTikTok = true"
      >
        <svg class="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
        </svg>
        <span>TikTok</span>
      </button>
    </div>
    
    <!-- Content Body (Flex Column) -->
    <div class="p-4 sm:p-5 flex flex-col flex-1">
      <!-- Category & Brand Badge -->
      <div class="flex items-center justify-between gap-2 mb-2">
        <AtomsBadge :color="categoryColor" size="sm" class="shrink-0 text-xs">
          {{ product.category }}
        </AtomsBadge>
        <span v-if="product.brand" class="text-xs font-medium text-slate-500 truncate text-right">
          {{ product.brand }}
        </span>
      </div>
      
      <!-- Product Name (Clamped to 2 lines) -->
      <h3
        class="font-bold text-sm sm:text-base text-slate-900 mb-1.5 line-clamp-2 cursor-pointer hover:text-primary transition-colors leading-snug"
        :title="product.name"
        @click="$emit('view-details', product)"
      >
        {{ product.name }}
      </h3>
      
      <!-- Product Description (Clamped to 2 lines) -->
      <p class="text-slate-500 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
        {{ product.description }}
      </p>
      
      <!-- Bottom Actions Pinned to Base -->
      <div class="mt-auto pt-2 space-y-1.5">
        <div class="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            class="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-bold transition-all border cursor-pointer"
            :class="[
              isAdded
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-orange-50 hover:bg-orange-100 text-primary border-orange-200'
            ]"
            title="Tambah ke Daftar Pesanan Grosir"
            @click="handleAddToCart"
          >
            <span class="material-symbols-outlined text-base">{{ isAdded ? 'check' : 'add_shopping_cart' }}</span>
            <span>{{ isAdded ? 'Ditambah' : '+ Order' }}</span>
          </button>

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center justify-center gap-1 py-2 px-2 bg-primary hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
            title="Tanya harga langsung ke WhatsApp"
          >
            <span class="material-symbols-outlined text-base">chat</span>
            <span>Tanya WA</span>
          </a>
        </div>

        <!-- TikTok Button (full width - hanya jika ada tiktok_post_id) -->
        <button
          v-if="product.tiktok_post_id"
          type="button"
          class="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-white hover:bg-slate-900 border border-slate-200 hover:border-slate-900 transition-all"
          @click="showTikTok = true"
        >
          <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
          </svg>
          <span>Lihat di TikTok</span>
        </button>

        <button
          type="button"
          class="w-full py-1 text-center text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
          @click="$emit('view-details', product)"
        >
          Lihat Deskripsi Lengkap
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
