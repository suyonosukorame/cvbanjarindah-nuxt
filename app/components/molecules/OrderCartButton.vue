<template>
  <button
    type="button"
    class="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs cursor-pointer select-none"
    :class="[
      totalItemsCount > 0
        ? 'bg-orange-50 hover:bg-orange-100 text-primary border border-orange-200'
        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
    ]"
    aria-label="Buka Daftar Pesanan"
    @click="openCart"
  >
    <div class="relative flex items-center">
      <span class="material-symbols-outlined text-lg sm:text-xl">shopping_cart</span>
      
      <!-- Badge Counter -->
      <span
        v-if="totalItemsCount > 0"
        class="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-150"
      >
        {{ totalItemsCount }}
      </span>
    </div>

    <span class="hidden sm:inline">Daftar Order</span>
  </button>
</template>

<script setup lang="ts">
const { totalItemsCount, openCart } = useOrderCart();
</script>

