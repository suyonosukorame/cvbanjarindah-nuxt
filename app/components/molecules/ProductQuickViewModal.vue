<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen && product"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs"
        role="dialog"
        aria-modal="true"
        :aria-label="product.name"
        @click.self="handleClose"
      >
        <!-- Modal Card -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="scale-95 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-95 opacity-0"
        >
          <div
            v-if="isOpen && product"
            class="relative w-full max-w-3xl overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col"
          >
            <!-- Close Button -->
            <button
              type="button"
              class="absolute top-4 right-4 z-10 grid w-9 h-9 place-items-center rounded-full bg-white/90 hover:bg-slate-100 text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200 transition-colors"
              aria-label="Tutup"
              @click="handleClose"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>

            <!-- Modal Content (Scrollable) -->
            <div class="overflow-y-auto p-6 sm:p-8">
              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start"
              >
                <!-- Product Image Container -->
                <div class="space-y-3">
                  <!-- Tab switcher: Foto | TikTok -->
                  <div v-if="product.tiktok_post_id" class="flex rounded-xl overflow-hidden border border-slate-200 text-xs font-semibold">
                    <button
                      type="button"
                      class="flex-1 flex items-center justify-center gap-1.5 py-2 transition"
                      :class="mediaTab === 'photo' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                      @click="mediaTab = 'photo'"
                    >
                      <span class="material-symbols-outlined text-sm" style="font-size:16px">image</span>
                      Foto Produk
                    </button>
                    <button
                      type="button"
                      class="flex-1 flex items-center justify-center gap-1.5 py-2 transition"
                      :class="mediaTab === 'tiktok' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
                      @click="mediaTab = 'tiktok'"
                    >
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
                      </svg>
                      TikTok
                    </button>
                  </div>

                  <!-- Photo Panel -->
                  <div
                    v-show="mediaTab === 'photo'"
                    class="relative bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center min-h-[260px] sm:min-h-[320px]"
                  >
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="w-full h-auto max-h-[360px] object-contain p-4"
                      loading="lazy"
                    />
                    <div class="absolute bottom-3 left-3">
                      <span
                        class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-orange-700 bg-orange-100/90 rounded-md backdrop-blur-xs"
                      >
                        <span class="material-symbols-outlined text-sm"
                          >verified</span
                        >
                        Produk Resmi
                      </span>
                    </div>
                  </div>

                  <!-- TikTok Panel (lazy iframe - hanya di-mount saat tab aktif) -->
                  <div
                    v-if="product.tiktok_post_id"
                    v-show="mediaTab === 'tiktok'"
                    class="relative bg-slate-900 rounded-xl overflow-hidden border border-slate-800"
                    style="padding-bottom: 177.78%;"
                  >
                    <div
                      v-if="!tiktokLoaded && mediaTab === 'tiktok'"
                      class="absolute inset-0 flex flex-col items-center justify-center text-white/60 text-xs gap-2"
                    >
                      <div class="w-6 h-6 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
                      <span>Memuat TikTok...</span>
                    </div>
                    <iframe
                      v-if="mediaTab === 'tiktok'"
                      :src="`https://www.tiktok.com/player/v1/${product.tiktok_post_id}?rel=1&autoplay=0`"
                      class="absolute inset-0 w-full h-full border-0"
                      allowfullscreen
                      allow="encrypted-media *; autoplay"
                      scrolling="no"
                      @load="tiktokLoaded = true"
                    />
                  </div>
                </div>

                <!-- Product Details -->
                <div class="flex flex-col space-y-4">
                  <!-- Category & Brand -->
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="px-2.5 py-1 text-xs font-bold rounded-md bg-orange-50 text-primary border border-orange-200"
                    >
                      {{ product.category }}
                    </span>
                    <span
                      v-if="product.brand"
                      class="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 text-slate-700"
                    >
                      Merk: {{ product.brand }}
                    </span>
                  </div>

                  <!-- Product Name -->
                  <h2
                    class="text-xl sm:text-2xl font-black text-slate-900 leading-tight"
                  >
                    {{ product.name }}
                  </h2>

                  <!-- Pricing Notice for B2B -->
                  <div
                    class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-900"
                  >
                    <div
                      class="font-bold flex items-center gap-1.5 text-emerald-800 mb-0.5"
                    >
                      <span class="material-symbols-outlined text-base"
                        >price_check</span
                      >
                      Harga Grosir & Kemitraan
                    </div>
                    <p class="text-emerald-700 text-xs leading-relaxed">
                      Hubungi tim sales kami untuk penawaran harga per
                      karton/dus, minimal pemesanan, dan promo distributor
                      aktif.
                    </p>
                  </div>

                  <!-- Full Description -->
                  <div>
                    <h3
                      class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5"
                    >
                      Deskripsi Produk
                    </h3>
                    <p
                      class="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-xl border border-slate-100"
                    >
                      {{ product.description }}
                    </p>
                  </div>

                  <!-- Key Info Tags -->
                  <div
                    class="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1"
                  >
                    <div
                      class="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <span
                        class="material-symbols-outlined text-primary text-base"
                        >local_shipping</span
                      >
                      <span>Area Kalsel-Teng</span>
                    </div>
                    <div
                      class="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <span
                        class="material-symbols-outlined text-primary text-base"
                        >inventory_2</span
                      >
                      <span>Stok Distributor</span>
                    </div>
                  </div>

                  <!-- Quantity & Add to Cart Section -->
                  <div class="pt-2 p-3 bg-orange-50/60 rounded-xl border border-orange-100 space-y-3">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-slate-800">Jumlah Permintaan:</span>
                      <AtomsQuantityControl
                        v-model="orderQuantity"
                        v-model:unit="orderUnit"
                      />
                    </div>

                    <button
                      type="button"
                      class="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
                      :class="[
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-primary hover:bg-orange-600 text-white'
                      ]"
                      @click="handleAddToCart"
                    >
                      <span class="material-symbols-outlined text-lg">{{ isAdded ? 'check_circle' : 'add_shopping_cart' }}</span>
                      <span>{{ isAdded ? 'Berhasil Ditambahkan!' : '+ Tambah ke Daftar Pesanan' }}</span>
                    </button>
                  </div>

                  <!-- Action CTA Buttons -->
                  <div class="pt-1 space-y-2">
                    <a
                      :href="whatsappUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs"
                    >
                      <span class="material-symbols-outlined text-base">chat</span>
                      <span>Tanya Harga Langsung (1 Produk)</span>
                    </a>

                    <NuxtLink
                      to="/kontak"
                      class="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition"
                      @click="handleClose"
                    >
                      <span class="material-symbols-outlined text-base">mail</span>
                      <span>Formulir Kemitraan Toko</span>
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { Product } from "~/types/product";
import type { OrderUnit } from "~/types/cart";

interface Props {
  isOpen: boolean;
  product: Product | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
}>();

const { addToCart } = useOrderCart();

const orderQuantity = ref(1);
const orderUnit = ref<OrderUnit>("Karton");
const isAdded = ref(false);
const mediaTab = ref<'photo' | 'tiktok'>('photo');
const tiktokLoaded = ref(false);

// Reset tab & tiktokLoaded saat produk berganti
watch(() => props.product, () => {
  mediaTab.value = 'photo';
  tiktokLoaded.value = false;
});

const handleAddToCart = () => {
  if (!props.product) return;
  addToCart(props.product, orderQuantity.value, orderUnit.value);
  isAdded.value = true;
  setTimeout(() => {
    isAdded.value = false;
  }, 1800);
};

const handleClose = () => {
  emit("close");
};

// WhatsApp order message with product name
const whatsappUrl = computed(() => {
  if (!props.product) return "https://wa.me/6285124502615";
  const text = `Halo CV Banjar Indah, saya tertarik untuk order grosir / menanyakan pricelist produk: *${props.product.name}* (${props.product.category}).`;
  return `https://wa.me/6285124502615?text=${encodeURIComponent(text)}`;
});

// Close modal on Escape key
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.isOpen) {
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>
