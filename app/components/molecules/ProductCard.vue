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
