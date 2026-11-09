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
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-primary hover:bg-orange-600 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors shadow-xs"
        >
          <span class="material-symbols-outlined text-base">chat</span>
          <span>Tanya Harga</span>
        </a>

        <button
          type="button"
          class="w-full py-1 text-center text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          @click="$emit('view-details', product)"
        >
          Lihat Deskripsi Lengkap
        </button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Product } from '~/types/product';

interface Props {
  product: Product;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'view-details', product: Product): void;
}>();

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
