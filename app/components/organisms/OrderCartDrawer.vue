<template>
  <Teleport to="body">
    <!-- Drawer Backdrop -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isCartOpen"
        class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs"
        @click="closeCart"
      />
    </Transition>

    <!-- Drawer Panel (Slide from Right) -->
    <Transition
      enter-active-class="transform transition duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isCartOpen"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Daftar Pesanan Grosir"
      >
        <!-- Header -->
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-orange-100 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">shopping_cart</span>
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900 leading-tight">Daftar Pesanan Grosir</h2>
              <p class="text-xs text-slate-500">CV. Banjar Indah • Kalsel-Teng</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="!isCartEmpty"
              type="button"
              class="text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors px-2 py-1"
              @click="clearCart"
            >
              Hapus Semua
            </button>
            <button
              type="button"
              class="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              aria-label="Tutup"
              @click="closeCart"
            >
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
          
          <!-- Empty State -->
          <div v-if="isCartEmpty" class="py-16 px-6 text-center space-y-4">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-orange-50 text-primary/70 flex items-center justify-center">
              <span class="material-symbols-outlined text-4xl">remove_shopping_cart</span>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800">Daftar Order Masih Kosong</h3>
              <p class="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                Jelajahi katalog produk kami dan tambahkan barang yang ingin Anda pesan untuk tokomu.
              </p>
            </div>
            <NuxtLink
              to="/produk"
              class="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition shadow-xs"
              @click="closeCart"
            >
              <span class="material-symbols-outlined text-base">storefront</span>
              <span>Buka Katalog Produk</span>
            </NuxtLink>
          </div>

          <!-- Items List -->
          <div v-else class="p-4 sm:p-5 space-y-3">
            <div
              v-for="item in items"
              :key="`${item.product.id}-${item.unit}`"
              class="p-3 bg-white rounded-xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-colors flex gap-3 items-center"
            >
              <!-- Thumbnail -->
              <img
                :src="item.product.image"
                :alt="item.product.name"
                class="w-16 h-16 rounded-lg object-cover bg-slate-50 shrink-0 border border-slate-100"
              />

              <!-- Info & Stepper -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {{ item.product.name }}
                  </h4>
                  <button
                    type="button"
                    class="text-slate-400 hover:text-red-600 transition-colors p-0.5"
                    title="Hapus dari daftar"
                    @click="removeFromCart(item.product.id, item.unit)"
                  >
                    <span class="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>

                <div class="flex items-center gap-2 mt-0.5 mb-2">
                  <span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {{ item.product.category }}
                  </span>
                  <span v-if="item.product.brand" class="text-[10px] text-slate-400">
                    • {{ item.product.brand }}
                  </span>
                </div>

                <!-- Stepper + Unit Selector -->
                <AtomsQuantityControl
                  :model-value="item.quantity"
                  :unit="item.unit"
                  @update:model-value="updateQuantity(item.product.id, $event, item.unit)"
                  @update:unit="updateUnit(item.product.id, item.unit, $event)"
                />
              </div>
            </div>
          </div>

          <!-- Store / Customer Info Form -->
          <div v-if="!isCartEmpty" class="p-5 bg-slate-50/60 space-y-3.5">
            <div class="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <span class="material-symbols-outlined text-primary text-base">store</span>
              <span>Data Toko & Lokasi Pengiriman</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Toko / Usaha *</label>
                <input
                  v-model="customerInfo.storeName"
                  type="text"
                  placeholder="Contoh: Toko Berkah Jaya"
                  class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Nama Pemilik / PIC *</label>
                <input
                  v-model="customerInfo.customerName"
                  type="text"
                  placeholder="Nama Anda"
                  class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Kota / Kabupaten *</label>
                <select
                  v-model="customerInfo.city"
                  class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="Banjarmasin">Banjarmasin</option>
                  <option value="Banjarbaru">Banjarbaru</option>
                  <option value="Martapura / Kab. Banjar">Martapura / Kab. Banjar</option>
                  <option value="Barito Kuala / Marabahan">Barito Kuala / Marabahan</option>
                  <option value="Tanah Laut / Pelaihari">Tanah Laut / Pelaihari</option>
                  <option value="Tanah Bumbu / Batulicin">Tanah Bumbu / Batulicin</option>
                  <option value="Kotabaru">Kotabaru</option>
                  <option value="Tapin / Rantau">Tapin / Rantau</option>
                  <option value="Hulu Sungai Selatan / Kandangan">HSS / Kandangan</option>
                  <option value="Hulu Sungai Tengah / Barabai">HST / Barabai</option>
                  <option value="Hulu Sungai Utara / Amuntai">HSU / Amuntai</option>
                  <option value="Balangan / Paringin">Balangan / Paringin</option>
                  <option value="Tabalong / Tanjung">Tabalong / Tanjung</option>
                  <option value="Palangkaraya (Kalteng)">Palangkaraya (Kalteng)</option>
                  <option value="Kapuas (Kalteng)">Kapuas (Kalteng)</option>
                  <option value="Lainnya di Kalsel-Teng">Lainnya di Kalsel-Teng</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Preferensi Pembayaran</label>
                <select
                  v-model="customerInfo.paymentPreference"
                  class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="COD Toko">COD (Bayar saat kirim)</option>
                  <option value="Tempo B2B / DP">Tempo B2B / DP</option>
                  <option value="Belum Tahu">Belum Tahu (Konsultasi)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Alamat Toko / Catatan (Opsional)</label>
              <textarea
                v-model="customerInfo.notes"
                rows="2"
                placeholder="Jl. Pasar Baru No. 12 / Mohon jadwal kirim hari Kamis..."
                class="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>
          </div>

        </div>

        <!-- Footer / Checkout CTA -->
        <div v-if="!isCartEmpty" class="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-600">
            <span>Ringkasan Pesanan:</span>
            <span class="font-bold text-slate-900">
              {{ totalItemsCount }} Produk • Total {{ totalUnitsCount }} Unit
            </span>
          </div>

          <!-- Send WhatsApp Button -->
          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-md hover:shadow-lg"
          >
            <span class="material-symbols-outlined text-xl">chat</span>
            <span>Kirim Pesanan via WhatsApp</span>
          </a>

          <p class="text-[11px] text-slate-400 text-center leading-tight">
            Pesanan langsung diteruskan ke tim sales CV. Banjar Indah untuk konfirmasi harga & stok.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';

const {
  items,
  customerInfo,
  isCartOpen,
  totalItemsCount,
  totalUnitsCount,
  isCartEmpty,
  removeFromCart,
  updateQuantity,
  updateUnit,
  clearCart,
  closeCart,
  generateWhatsAppOrderUrl,
} = useOrderCart();

const whatsappUrl = computed(() => generateWhatsAppOrderUrl());

// Escape key listener to close drawer
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isCartOpen.value) {
    closeCart();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

