<template>
  <div class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-black mb-8">Hubungi Kami</h1>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <!-- Contact Form -->
      <div class="bg-white rounded-2xl p-8 shadow-lg">
        <h2 class="text-2xl font-black mb-6 text-slate-900">Kirim Pesan</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block font-bold mb-2 text-slate-900">Nama</label>
            <input 
              v-model="form.name"
              type="text" 
              placeholder="Nama Anda"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label class="block font-bold mb-2 text-slate-900">Email</label>
            <input 
              v-model="form.email"
              type="email" 
              placeholder="Email Anda"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label class="block font-bold mb-2 text-slate-900">Nomor Telepon</label>
            <input 
              v-model="form.phone"
              type="tel" 
              placeholder="+62..."
              class="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <div>
            <label class="block font-bold mb-2 text-slate-900">Pesan</label>
            <textarea 
              v-model="form.message"
              placeholder="Tulis pesan Anda di sini..."
              rows="5"
              class="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary/30 focus:border-primary"
            ></textarea>
          </div>
          <button 
            type="submit"
            class="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition"
          >
            Kirim Pesan
          </button>
        </form>
      </div>

      <!-- Contact Information -->
      <div class="space-y-8">
        <!-- Direct Contact -->
        <div class="bg-white rounded-2xl p-8 shadow-lg">
          <h3 class="text-xl font-black mb-6 text-slate-900">Informasi Kontak</h3>
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
                <h4 class="font-bold mb-1 text-slate-900">Tanya / Order (WhatsApp)</h4>
                <a href="https://wa.me/6285124502615?text=Halo%20CV%20Banjar%20Indah,%20saya%20tertarik%20untuk%20order/kemitraan." target="_blank" rel="noopener noreferrer" class="text-emerald-600 font-bold hover:underline">
                  0851-2450-2615
                </a>
              </div>
            </div>
            <div class="flex gap-4">
              <span class="material-symbols-outlined text-primary text-2xl shrink-0">mail</span>
              <div>
                <h4 class="font-bold mb-1 text-slate-900">Email</h4>
                <p class="text-slate-600">info@cvbanjarindah.com</p>
              </div>
            </div>
          </div>
        </div>

        <!-- WhatsApp CTA -->
        <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-8 shadow-lg">
          <h3 class="text-xl font-black mb-4">Chat Langsung via WhatsApp</h3>
          <p class="mb-6 opacity-90 text-sm leading-relaxed">
            Hubungi kami untuk tanya stok, pricelist grosir, kerja sama suplier toko kelontong, kosmetik, atau kemitraan usaha di Kalimantan Selatan & Tengah.
          </p>
          <a 
            href="https://wa.me/6285124502615?text=Halo%20CV%20Banjar%20Indah,%20saya%20tertarik%20untuk%20order/kemitraan." 
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-700 font-bold rounded-lg hover:scale-105 transition shadow-sm"
          >
            <span class="material-symbols-outlined">chat</span>
            Hubungi 0851-2450-2615
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
        <div class="bg-white rounded-2xl p-8 shadow-lg space-y-6">
          <div>
            <h3 class="text-xl font-black mb-4 text-slate-900">Jam Operasional</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="font-bold text-slate-900">Senin - Sabtu</span>
                <span class="text-slate-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md text-emerald-700">08.30 - 17.00 WITA</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="font-bold text-slate-900">Minggu</span>
                <span class="text-red-600 font-semibold bg-red-50 px-2.5 py-1 rounded-md">Tutup</span>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-slate-100">
            <h4 class="font-bold text-slate-900 mb-3 text-sm">Media Sosial Resmi</h4>
            <div class="flex items-center gap-3">
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
</template>

<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'default'
});

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const form = ref<ContactForm>({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const handleSubmit = () => {
  // TODO: Integrate with Supabase to save inquiry
  console.log('Form submitted:', form.value);
  // Show success message
  alert('Terima kasih! Pesan Anda telah dikirim.');
  // Reset form
  form.value = { name: '', email: '', phone: '', message: '' };
};
</script>
