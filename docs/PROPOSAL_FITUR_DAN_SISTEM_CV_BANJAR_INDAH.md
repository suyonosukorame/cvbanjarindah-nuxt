# PROPOSAL & DOKUMENTASI SISTEM DIGITAL CV BANJAR INDAH

**Platform:** Web App B2B Distributor & Multi-Tenant Management  
**URL:** [https://cvbanjarindah.pages.dev](https://cvbanjarindah.pages.dev)  
**Target Pasar:** Toko Kelontong, Minimarket, Apotek, Agen Sembako, dan Reseller di Kalimantan Selatan & Kalimantan Tengah  
**Penyusun:** Tim Pengembang & Digitalisasi Bisnis  
**Tanggal:** November 2026  

---

## 1. Executive Summary (Ringkasan Eksekutif)

CV Banjar Indah adalah distributor dan mitra usaha terpercaya di wilayah Kalimantan Selatan dan Kalimantan Tengah (Kalsel-Teng), yang menyuplai produk-produk kebutuhan harian (*Fast-Moving Consumer Goods / FMCG*) seperti produk kesehatan, perawatan pribadi, tisu, dan perlengkapan bayi.

Platform digital ini dikembangkan khusus sebagai **Mesin Penghasil Leads B2B (Hot Leads Engine)** dan **Katalog Digital Interaktif** yang mempercepat proses konversi penjualan dari browsing online hingga terjadi negosiasi pemesanan melalui WhatsApp dan kunjungan armada sales lapangan.

Sistem dirancang dengan pendekatan *Mobile-First*, ringan, hemat kuota internet, serta dilengkapi sistem dashboard internal berstandar korporat yang memungkinkan tim internal mengelola seluruh operasional secara mandiri.

---

## 2. Arsitektur Teknologi & Infrastruktur

| Komponen | Teknologi | Nilai Tambah bagi Bisnis |
| :--- | :--- | :--- |
| **Frontend Framework** | **Nuxt 3 / Vue 3** (SSR & SSG Ready) | Kecepatan rendering maksimal, SEO-friendly, dan transisi halaman instan. |
| **Styling & UI Engine** | **Tailwind CSS + Shadcn-style Atoms** | Tampilan modern, responsif di seluruh resolusi layar (desktop, tablet, hingga smartphone beresolusi compact). |
| **Database & Auth** | **Supabase (PostgreSQL Enterprise)** | Penyimpanan data relasional yang aman, Row Level Security (RLS), real-time sync, dan sistem otentikasi terenkripsi. |
| **File & Media Storage** | **Cloudflare Pages & Supabase Cloud Storage** | Gambar dan video dimuat tanpa membebani server fisik, dengan proteksi CDN global. |
| **Komunikasi Bisnis** | **Smart WhatsApp Deep-Linking** | Integrasi langsung ke WhatsApp sales tanpa perlu integrasi pihak ketiga berbayar. |

---

## 3. Rincian Fitur Utama

### A. Fitur Etalase & Pengalaman Pelanggan (Frontend)

1. **Katalog Produk Grosir Interaktif**
   - Pencarian instan berdasarkan nama dan deskripsi barang.
   - Filter dinamis berdasarkan kategori produk dan brand prinsipal.
   - Modal *Quick View* untuk melihat spesifikasi detail, foto beresolusi tinggi, serta pilihan satuan pemesanan (**Karton / Pack**).

2. **Universal Smart Social Media Player (YouTube, Instagram, TikTok)**
   - Mendukung integrasi video promosi resmi dari YouTube (Video reguler / Shorts), Instagram (Reels / Post), dan TikTok.
   - Menghilangkan kendala pemblokiran ISP lokal berkat tombol direct action *Deep-Link* menuju aplikasi resmi.
   - Kartu produk dilengkapi badge visual otomatis sesuai platform (Merah untuk YouTube, Pink-Ungu untuk Instagram, Hitam untuk TikTok).

3. **Keranjang Pemesanan Grosir Multi-Barang (`Order Cart Drawer`)**
   - Mitra toko dapat memilih banyak produk sekaligus (*bulk order*).
   - Pengaturan jumlah kuantiti pesanan secara fleksibel.
   - Sistem secara otomatis menyusun ringkasan pesanan berformat faktur terstruktur dan mengirimkannya langsung ke WhatsApp tim sales.

4. **Asisten AI Interaktif & Smart WhatsApp Handoff (24/7)**
   - Chatbot virtual yang siap menjawab pertanyaan seputar produk, paket kemitraan toko, jam operasional, dan area jangkauan rute truk.
   - Tombol *WhatsApp Handoff* untuk mengalihkan percakapan langsung ke sales manusia bila membutuhkan negosiasi harga partai besar.

5. **Pengalaman Pengguna Seluler (*Mobile App Experience*)**
   - Dilengkapi *Bottom Navigation Bar* di layar smartphone, menyerupai aplikasi Android/iOS native (Beranda, Produk, Keranjang, Kontak).
   - Tata letak tombol aksi (*+ Order* dan *Tanya WA*) yang tidak terpotong pada smartphone beresolusi compact.

6. **Spesifikasi Jangkauan Distribusi Terfokus (Kalsel-Teng)**
   - Informasi rute armada pengiriman truk sendiri untuk wilayah Kalimantan Selatan (Banjarmasin, Banjarbaru, Martapura, Kandangan, Barabai, Amuntai, Tanjung, Kotabaru, Pelaihari, Marabahan).
   - Fasilitas drop ke ekspedisi untuk wilayah Kalimantan Tengah (Palangka Raya, Sampit, Pangkalan Bun, Muara Teweh, Kuala Kapuas, Pulang Pisau).

7. **Transparansi Paket Kemitraan Toko**
   - Penjelasan paket *Starter*, *Business*, dan *Enterprise* dengan detail minimum order, tier harga grosir, dan dukungan materi promosi.

8. **Carousel Brand Berjalan Dinamis**
   - Etalase logo brand prinsipal mitra yang berputar otomatis secara halus (*infinite marquee*) langsung dari database aktif.

---

### B. Fitur Manajemen & Pengendalian Internal (Backend / Admin Dashboard)

1. **Manajemen Pengguna & Sales Berjenjang (RBAC - Role-Based Access Control)**
   - Pembagian hak akses terstruktur:
     - **Super Admin**: Akses penuh ke seluruh konfigurasi sistem dan database.
     - **Direktur / Manajer**: Akses laporan data, analisis kemitraan, dan pergerakan produk.
     - **Editor / Admin**: Manajemen entri katalog produk, kategori, dan brand.
     - **Karyawan / Sales**: Manajemen status pesan masuk dan kebutuhan stok pelanggan.
   - Fitur persetujuan pengguna baru (*Approve User Modal*) dan proteksi akun.

2. **Pengelolaan Data Terpadu (CRUD)**
   - **Produk**: Tambah, edit, hapus data produk, kelola harga, stok, gambar, dan status unggulan.
   - **Media Sosial / Video**: Input URL cerdas yang otomatis mendeteksi platform dan menampilkan preview live.
   - **Kategori & Brand**: Pengelolaan taksonomi barang dan logo prinsipal.
   - **Area Distribusi & Testimoni**: Pembaruan cakupan kota dan ulasan mitra toko.
   - **Paket Harga**: Pengaturan tier paket kemitraan grosir.

3. **Pusat Kotak Masuk Kemitraan (Inquiries)**
   - Setiap formulir pendaftaran mitra toko baru atau pesan pertanyaan dari website tersimpan otomatis ke database dan terintegrasi notifikasi tindak lanjut tim sales.

4. **Sistem Notifikasi Modern (Enterprise Alert & Toast)**
   - Indikator visual real-time saat data berhasil disimpan, diubah, atau dihapus.

---

## 4. Rencana Pengembangan Strategis (Next-Level Marketing B2B)

Fitur-fitur lanjutan yang siap diimplementasikan untuk mendongkrak omset dan penetrasi pasar:

1. **Download Katalog & Pricelist PDF Otomatis (Lead Magnet)**
   - Pengunjung web wajib memasukkan nama toko, kota, dan nomor WhatsApp sebelum mengunduh lembar pricelist PDF grosir terbaru. Tim sales langsung memperoleh database calon pembeli potensial setiap harinya.
2. **Kalkulator Estimasi Margin Toko (Profit Margin Calculator)**
   - Menampilkan proyeksi keuntungan bersih yang bisa didapatkan pemilik toko jika membeli per karton dibandingkan dengan harga eceran tertinggi (HET).
3. **Multi-Admin WhatsApp Routing Berdasarkan Wilayah**
   - Tombol WhatsApp pintar yang mengarahkan pesan langsung ke sales wilayah terkait (misal: CS 1 khusus Banjarmasin-Banjarbaru, CS 2 khusus Kalteng & Luar Kota) untuk mempercepat respon transaksi.

---

## 5. Analisa Pasaran Harga & Estimasi Valuasi Web (Area Banjarmasin, Kalimantan Selatan)

Berdasarkan lanskap industri pengembangan web dan *software house* di wilayah Kalimantan Selatan (khususnya koridor Banjarmasin – Banjarbaru) hingga pasar regional Kalimantan, berikut adalah perbandingan pasaran serta estimasi nilai wajar (*fair valuation*) untuk platform digital seperti yang telah dibangun pada **CV Banjar Indah**:

### A. Perbandingan Kategori & Standar Harga di Kalimantan Selatan

| Tier / Kategori Layanan | Kisaran Harga Pasar (Kalsel) | Karakteristik & Teknologi | Posisi Website CV Banjar Indah |
| :--- | :--- | :--- | :--- |
| **Tier 1: Website Profil Instan (Freelance / Agensi Pemula)** | **Rp 2.500.000 – Rp 5.000.000** | Berbasis CMS template instan (WordPress / Elementor / Wix). Fitur terbatas, rentan lambat jika diakses di pelosok, tidak ada relasi database custom atau kontrol hak akses bertingkat. | ❌ Jauh melampaui tier ini. |
| **Tier 2: Company Profile Interaktif Custom (Agensi / Studio Lokal)** | **Rp 7.500.000 – Rp 15.000.000** | Desain kustom, responsive mobile, form kontak sederhana, dashboard admin standar untuk input artikel/katalog statis tanpa logika bisnis khusus. | ❌ Melebihi tier ini karena memiliki arsitektur B2B dan sistem auth enterprise. |
| **Tier 3: Fullstack Custom Web App & B2B System (Software House Profesional)** | **Rp 18.000.000 – Rp 35.000.000** | **Arsitektur kustom (Nuxt/Vue + PostgreSQL), arsitektur database relasional ACID, Role-Based Access Control (RBAC), logika pemesanan grosir, integrasi WhatsApp otomatis, dan arsitektur serverless high-speed.** | ✅ **Tepat berada di tier ini (Valuasi ideal: Rp 22.000.000 – Rp 28.000.000)** |
| **Tier 4: Enterprise Solution (Vendor Nasional / Jakarta/Surabaya)** | **Rp 40.000.000 – Rp 80.000.000+** | Proyek skala korporasi besar dengan tim terpisah (PM, UI/UX Designer, Frontend, Backend, QA). | Nilai fitur yang dibangun sudah menyentuh kapabilitas enterprise, namun dengan efisiensi biaya lokal Kalsel. |

---

### B. Faktor Penentu Valuasi Tinggi Sistem CV Banjar Indah

1. **Fullstack Modern Engineering (Nuxt 3 + Supabase + Cloudflare)**
   - Bukan sekadar landing page statis, melainkan *Single Page Application* (SPA) dengan performa *Server-Side Rendering* (SSR) yang instan, ringan, dan ramah sinyal minim di pelosok Kalsel-Teng.
2. **Sistem Keamanan & Multi-Role Governance (RBAC Enterprise)**
   - Proteksi data menggunakan *Row Level Security* (RLS) di PostgreSQL.
   - Pembedaan peran ketat: Super Admin, Manajer, Editor, hingga Staf Lapangan, lengkap dengan flow persetujuan akun pendaftar (*approval queue*).
3. **Konversi Penjualan B2B Otomatis (Hot Leads Engine)**
   - Keranjang pesanan partai besar (*Bulk Cart Drawer*) yang otomatis merangkum PO berformat faktur langsung ke WhatsApp sales lapangan.
   - Asisten AI interaktif 24/7 yang dilengkapi mekanisme peralihan (*handoff*) cerdas ke manusia.
4. **Universal Social Player Cerdas**
   - Mendukung integrasi multi-platform (YouTube, Instagram Reels, TikTok) dengan *smart fallback* dan *deep-linking* aplikasi resmi tanpa terhalang pemblokiran browser/ISP.
5. **Zero/Low Operational Cost (TCO Hemat Hingga Jutaan Rupiah)**
   - Berkat pemanfaatan infrastruktur modern *edge computing* (Cloudflare Pages) dan *serverless database* (Supabase), sistem ini memiliki biaya hosting rutin bulanan sebesar **Rp 0 s/d sangat minim**, dibandingkan sewa VPS/Cloud konvensional yang memakan **Rp 300.000 – Rp 1.000.000 per bulan**.

---

### C. Rekomendasi Penawaran / Skema Nilai Proyek

Jika sistem ini diajukan sebagai proposal proyek digitalisasi baru kepada pihak prinsipal, pimpinan, atau klien bisnis sejenis di Kalsel:

| Skema Penawaran | Rekomendasi Nilai Investasi | Cakupan / Deliverables |
| :--- | :--- | :--- |
| **Paket Development Lepas (Sistem Selesai)** | **Rp 20.000.000 – Rp 25.000.000** | Hak kepemilikan penuh source code, deployment production, konfigurasi database, panduan operasional admin, dan garansi bug fixing 3 bulan. |
| **Paket Solusi Bisnis Lengkap (Development + Support 1 Tahun)** | **Rp 28.000.000 – Rp 35.000.000** | Seluruh sistem siap pakai, pelatihan tim internal/sales, pemeliharaan teknis 1 tahun, backup rutin, dan minor update katalog. |
| **Jasa Maintenance & Retainer Bulanan (Opsional)** | **Rp 750.000 – Rp 1.500.000 / bulan** | Monitoring performa web, input berkala promo/produk baru, optimasi SEO lokal, dan konsultasi strategi konversi online. |

---

## 6. Ringkasan Naskah Komunikasi ke Pimpinan / Stakeholder

```text
*UPDATE & KESIAPAN GO-LIVE WEBSITE RESMI CV BANJAR INDAH*
🌐 https://cvbanjarindah.pages.dev/

Yth. Bapak/Ibu Pimpinan CV Banjar Indah,

Bersama pesan ini kami sampaikan bahwa platform digital resmi CV Banjar Indah telah selesai dikembangkan secara menyeluruh dan berada dalam status SIAP GO-LIVE.

*Sorotan Kapabilitas Sistem:*
1. Katalog Grosir Interaktif dengan fitur Quick View dan Order Cart (daftar pesanan otomatis terangkum rapi ke WhatsApp sales).
2. Integrasi video display produk langsung dari YouTube, Instagram, dan TikTok.
3. Asisten Chat BI 24 jam dengan fitur handoff otomatis ke tim sales.
4. Tampilan mobile modern dengan navigasi bawah (ramah jempol pemilik toko).
5. Akurasi area distribusi yang terfokus pada wilayah Kalsel & Kalteng (armada sendiri & ekspedisi).
6. Dashboard admin komprehensif dengan manajemen peran karyawan (Super Admin, Manajer, Sales).

Sistem sudah teruji aman, cepat, dan hemat kuota untuk calon mitra toko di seluruh Kalimantan Selatan dan Tengah.

Mohon kesediaan Bapak/Ibu untuk memberikan evaluasi akhir sebelum dipublikasikan secara luas. Terima kasih.
```

---

*Dokumen ini disimpan sebagai arsip resmi arsitektur sistem dan bahan proposal pengembangan bisnis digital CV Banjar Indah.*

