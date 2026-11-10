<template>
  <div class="max-w-7xl mx-auto px-4 py-12 sm:py-16">
    <div class="mb-8 sm:mb-12">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-primary border border-orange-200 mb-3">
        <span class="material-symbols-outlined text-sm">support_agent</span>
        Layanan Kemitraan & Penjualan Grosir
      </span>
      <h1 class="text-3xl sm:text-4xl font-black text-slate-900 mb-2">Hubungi Kami & Kemitraan Toko</h1>
      <p class="text-slate-600 text-sm sm:text-base max-w-2xl">
        Konsultasikan kebutuhan stok toko Anda, permintaan pricelist grosir, atau jadwal pengiriman armada di Kalimantan Selatan & Tengah.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
      <!-- Contact Form Container -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-100">
        <!-- SUCCESS STATE -->
        <div v-if="isSubmitted" class="text-center py-6 space-y-5">
          <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <span class="material-symbols-outlined text-4xl">check_circle</span>
          </div>

          <div>
            <h2 class="text-2xl font-black text-slate-900 mb-2">Pesan Kemitraan Terkirim!</h2>
            <p class="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
              Terima kasih <strong>{{ submittedData.name }}</strong>. Pesan untuk <strong>{{ submittedData.company }}</strong> telah tersimpan di sistem kami.
            </p>
          </div>

          <!-- Summary Box -->
          <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs sm:text-sm space-y-2 text-slate-700">
            <div class="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span class="text-slate-500">Toko / Usaha:</span>
              <span class="font-bold text-slate-900">{{ submittedData.company }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span class="text-slate-500">Wilayah:</span>
              <span class="font-semibold text-slate-900">{{ submittedData.city }}</span>
            </div>
            <div class="flex justify-between border-b border-slate-200/60 pb-1.5">
              <span class="text-slate-500">Kebutuhan:</span>
              <span class="font-semibold text-primary">{{ submittedData.subject }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">WhatsApp:</span>
              <span class="font-semibold text-slate-900">{{ submittedData.phone }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pt-2 space-y-2.5">
            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md hover:shadow-lg"
            >
              <span class="material-symbols-outlined text-lg">chat</span>
              <span>Lanjut Chat Sales WhatsApp (Respon Cepat)</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>

            <button
              type="button"
              class="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              @click="handleReset"
            >
              Kirim Pesan Lainnya
            </button>
          </div>
        </div>

        <!-- FORM STATE -->
        <div v-else>
          <div class="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900">Formulir Kemitraan Toko</h2>
              <p class="text-xs text-slate-500 mt-0.5">Isi data di bawah, tim sales kami akan merespons secepatnya</p>
            </div>
            <span class="material-symbols-outlined text-primary text-3xl">edit_note</span>
          </div>

          <!-- Error Alert Banner -->
          <div v-if="errorMessage" class="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
            <span class="material-symbols-outlined text-base text-red-500 mt-0.5 shrink-0">error</span>
            <span>{{ errorMessage }}</span>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Row 1: Nama & Toko -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1.5">
                  Nama Anda / Pemilik <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.name"
                  type="text" 
                  required
                  placeholder="Contoh: Bpk. H. Rahmat"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1.5">
                  Nama Toko / Usaha <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.company"
                  type="text" 
                  required
                  placeholder="Contoh: Toko Berkah / Apotek Sehat"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>
            </div>

            <!-- Row 2: WhatsApp & Email -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1.5">
                  Nomor WhatsApp / HP <span class="text-red-500">*</span>
                </label>
                <input 
                  v-model="form.phone"
                  type="tel" 
                  required
                  placeholder="Contoh: 0812-3456-7890"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1.5">
                  Email <span class="text-slate-400 font-normal">(opsional)</span>
                </label>
                <input 
                  v-model="form.email"
                  type="email" 
                  placeholder="tokoanda@gmail.com"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                />
              </div>
            </div>

            <!-- Row 3: Kota & Kategori Kebutuhan -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1.5">
                  Kota / Wilayah Toko <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.city"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition cursor-pointer"
                >
                  <option value="" disabled>Pilih Kota / Kabupaten</option>
                  <optgroup label="Kalimantan Selatan">
                    <option value="Banjarmasin">Kota Banjarmasin</option>
                    <option value="Banjarbaru">Kota Banjarbaru</option>
                    <option value="Martapura / Kab. Banjar">Martapura / Kab. Banjar</option>
                    <option value="Kandangan (HSS)">Kandangan (Hulu Sungai Selatan)</option>
                    <option value="Barabai (HST)">Barabai (Hulu Sungai Tengah)</option>
                    <option value="Amuntai (HSU)">Amuntai (Hulu Sungai Utara)</option>
                    <option value="Tanjung (Tabalong)">Tanjung (Kab. Tabalong)</option>
                    <option value="Pelaihari (Tanah Laut)">Pelaihari (Kab. Tanah Laut)</option>
                    <option value="Kotabaru / Batulicin">Kotabaru / Batulicin</option>
                    <option value="Marabahan (Batola)">Marabahan (Barito Kuala)</option>
                  </optgroup>
                  <optgroup label="Kalimantan Tengah">
                    <option value="Palangka Raya">Kota Palangka Raya</option>
                    <option value="Sampit (Kotim)">Sampit (Kotawaringin Timur)</option>
                    <option value="Pangkalan Bun (Kobar)">Pangkalan Bun (Kotawaringin Barat)</option>
                    <option value="Kuala Kapuas">Kuala Kapuas</option>
                    <option value="Muara Teweh (Barut)">Muara Teweh (Barito Utara)</option>
                  </optgroup>
                  <option value="Lainnya">Wilayah Lainnya</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1.5">
                  Kategori Kebutuhan <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="form.subject"
                  required
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition cursor-pointer"
                >
                  <option value="Pricelist & Katalog Grosir">Pricelist & Katalog Grosir Terbaru</option>
                  <option value="Suplier Toko Baru">Buka Toko / Suplier Minimarket Baru</option>
                  <option value="Tanya Stok & Pengiriman">Tanya Stok & Jadwal Truk Pengiriman</option>
                  <option value="Kemitraan Prinsipal Brand">Kerjasama Prinsipal Brand Pabrik</option>
                  <option value="Lainnya">Kebutuhan Lainnya</option>
                </select>
              </div>
            </div>

            <!-- Pesan / Catatan -->
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1.5">
                Rincian Pesan / Kebutuhan Produk <span class="text-red-500">*</span>
              </label>
              <textarea 
                v-model="form.message"
                required
                placeholder="Tuliskan produk yang Anda cari, estimasi kebutuhan per karton, atau rincian lokasi toko Anda..."
                rows="4"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition resize-y"
              ></textarea>
            </div>

            <!-- Submit Button with Loading State -->
            <button 
              type="submit"
              :disabled="loading"
              class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition shadow-md hover:shadow-lg cursor-pointer"
            >
              <span v-if="loading" class="material-symbols-outlined text-lg animate-spin">progress_activity</span>
              <span v-else class="material-symbols-outlined text-lg">send</span>
              <span>{{ loading ? 'Menyimpan ke Sistem...' : 'Kirim Pesan Kemitraan' }}</span>
            </button>

            <p class="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1 pt-1">
              <span class="material-symbols-outlined text-xs text-emerald-600">verified_user</span>
              <span>Pesan Anda tersimpan aman dan langsung terhubung ke dashboard admin sales CV Banjar Indah.</span>
            </p>
          </form>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <!-- Direct Contact -->
        <div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
          <h3 class="text-xl font-black mb-6 text-slate-900">Informasi Kontak Kantor</h3>
          <div class="space-y-6">
            <div class="flex gap-4">
              <span class="material-symbols-outlined text-primary text-2xl shrink-0">location_on</span>
              <div>
                <h4 class="font-bold mb-1 text-slate-900">Alamat Kantor & Gudang</h4>
                <p class="text-slate-600 text-sm leading-relaxed">
                  Jl. Mahoni No. 98 RT.12 Komplek Banjar Indah Permai, Pemurus Dalam, Kec. Banjarmasin Sel., Kota Banjarmasin, Kalimantan Selatan 70248
                </p>
                <div class="mt-2.5">
                  <a
                    href="https://www.google.com/maps/place/CV.+BANJAR+INDAH/@-3.3497959,114.6158106,218m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2de42134376274ed:0x90bd2166e2f785f0!8m2!3d-3.3497972!4d114.6164557!16s%2Fg%2F11jfsbcy6f"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition"
                  >
                    <span class="material-symbols-outlined text-base">directions</span>
                    Petunjuk Arah (Google Maps)
                  </a>
                </div>
              </div>
            </div>
            <div class="flex gap-4">
              <span class="material-symbols-outlined text-primary text-2xl shrink-0">phone_iphone</span>
              <div>
                <h4 class="font-bold mb-1 text-slate-900">Tanya / Order (WhatsApp Sales)</h4>
                <a href="https://wa.me/6285124502615?text=Halo%20CV%20Banjar%20Indah,%20saya%20tertarik%20untuk%20order/kemitraan." target="_blank" rel="noopener noreferrer" class="text-emerald-600 font-bold hover:underline">
                  0851-2450-2615
                </a>
              </div>
            </div>
            <div class="flex gap-4">
              <span class="material-symbols-outlined text-primary text-2xl shrink-0">mail</span>
              <div>
                <h4 class="font-bold mb-1 text-slate-900">Email Resmi</h4>
                <p class="text-slate-600">info@cvbanjarindah.com</p>
              </div>
            </div>
          </div>
        </div>

        <!-- WhatsApp CTA -->
        <div class="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-8 shadow-lg">
          <h3 class="text-xl font-black mb-3">Respon Cepat via WhatsApp</h3>
          <p class="mb-6 opacity-90 text-sm leading-relaxed">
            Butuh pricelist hari ini atau ingin tanya stok mendesak? Hubungi kami langsung melalui WhatsApp untuk respon langsung dari tim sales lapangan.
          </p>
          <a 
            href="https://wa.me/6285124502615?text=Halo%20CV%20Banjar%20Indah,%20saya%20ingin%20tanya%20pricelist%20grosir%20dan%20kemitraan%20toko." 
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 font-bold rounded-xl hover:bg-emerald-50 transition shadow-sm"
          >
            <span class="material-symbols-outlined">chat</span>
            <span>Chat Langsung 0851-2450-2615</span>
          </a>
        </div>

        <!-- Google Maps Embed -->
        <div class="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
          <iframe
            src="https://maps.google.com/maps?q=-3.3497972,114.6164557&z=17&output=embed"
            width="100%"
            height="280"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Lokasi CV. Banjar Indah di Google Maps"
          ></iframe>
          <div class="p-3 bg-white flex items-center justify-between gap-3">
            <span class="text-sm text-slate-600 leading-tight">
              <span class="font-semibold text-slate-800">CV. Banjar Indah</span> — Banjarmasin, Kalsel
            </span>
            <a
              href="https://www.google.com/maps/place/CV.+BANJAR+INDAH/@-3.3497959,114.6158106,218m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2de42134376274ed:0x90bd2166e2f785f0!8m2!3d-3.3497972!4d114.6164557!16s%2Fg%2F11jfsbcy6f"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg border border-orange-200 transition shrink-0"
            >
              <span class="material-symbols-outlined text-base">open_in_new</span>
              Buka Maps
            </a>
          </div>
        </div>

        <!-- Business Hours & Socials -->
        <div class="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 space-y-6">
          <div>
            <h3 class="text-xl font-black mb-4 text-slate-900">Jam Operasional Gudang & Kantor</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="font-bold text-slate-900">Senin - Sabtu</span>
                <span class="font-semibold bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-700">08.30 - 17.00 WITA</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="font-bold text-slate-900">Minggu & Hari Libur</span>
                <span class="text-red-600 font-semibold bg-red-50 px-2.5 py-1 rounded-md">Tutup</span>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100">
            <h4 class="font-bold text-slate-900 mb-3 text-sm">Media Sosial Resmi</h4>
            <div class="flex flex-wrap items-center gap-3">
              <a
                href="https://www.instagram.com/cvbanjarindah/"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-50 text-pink-700 text-xs font-bold hover:bg-pink-100 transition"
              >
                <span>Instagram: @cvbanjarindah</span>
              </a>
              <a
                href="https://www.tiktok.com/@cvbanjarindah"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition"
              >
                <span>TikTok: @cvbanjarindah</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'default'
});

const { supabase } = useSupabase();

interface ContactForm {
  name: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  subject: string;
  message: string;
}

const form = ref<ContactForm>({
  name: '',
  company: '',
  phone: '',
  email: '',
  city: '',
  subject: 'Pricelist & Katalog Grosir',
  message: ''
});

const loading = ref(false);
const isSubmitted = ref(false);
const errorMessage = ref('');
const submittedData = ref<ContactForm>({ ...form.value });

const handleSubmit = async () => {
  if (!form.value.name || !form.value.company || !form.value.phone || !form.value.message) {
    errorMessage.value = 'Mohon lengkapi seluruh kolom yang bertanda bintang (*).';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const formattedMessage = `[Kebutuhan: ${form.value.subject}] [Kota: ${form.value.city || 'Tidak ditentukan'}]\n\n${form.value.message.trim()}`;
    const cleanPhone = form.value.phone.replace(/[^0-9]/g, '');
    const validEmail = form.value.email.trim() || `${cleanPhone || 'mitra'}@toko.cvbanjarindah.com`;

    const payload = {
      name: form.value.name.trim(),
      company: form.value.company.trim(),
      phone: form.value.phone.trim(),
      email: validEmail,
      message: formattedMessage,
      status: 'new',
      source: 'website_contact_form'
    };

    const { error } = await supabase.from('inquiries').insert([payload]);

    if (error) throw error;

    // Save submitted snapshot for summary & WhatsApp message
    submittedData.value = { ...form.value };
    isSubmitted.value = true;
  } catch (err: any) {
    console.error('Error submitting inquiry to Supabase:', err);
    errorMessage.value = 'Gagal menyimpan pesan ke database. Silakan hubungi sales kami langsung via WhatsApp.';
  } finally {
    loading.value = false;
  }
};

const handleReset = () => {
  form.value = {
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    subject: 'Pricelist & Katalog Grosir',
    message: ''
  };
  isSubmitted.value = false;
  errorMessage.value = '';
};

// WhatsApp prefilled message
const whatsappUrl = computed(() => {
  const d = submittedData.value;
  const text = `Halo Tim Sales CV Banjar Indah, saya baru saja mengirimkan formulir kemitraan melalui website:\n\n*Nama:* ${d.name}\n*Toko / Usaha:* ${d.company}\n*Wilayah:* ${d.city || '-'}\n*Kebutuhan:* ${d.subject}\n*No. HP:* ${d.phone}\n\n*Pesan:*\n${d.message}\n\nMohon informasi ketersediaan stok & pricelist grosirnya. Terima kasih!`;
  return `https://wa.me/6285124502615?text=${encodeURIComponent(text)}`;
});
</script>
