# Deploy ke Cloudflare Pages

Panduan ini mengikuti konfigurasi proyek saat ini: Nuxt 3, Nitro preset `cloudflare-pages`, output build `dist`, dan deploy script `pnpm run deploy`.

## Prasyarat

- Akun Cloudflare dengan akses ke Pages.
- Repository proyek sudah di-push ke GitHub atau GitLab jika memakai deploy otomatis.
- Node.js 20 LTS dan pnpm.
- Proyek Supabase aktif, database sudah disiapkan, dan akun super admin tersedia.
- Domain produksi opsional; Cloudflare Pages menyediakan domain `*.pages.dev`.

## 1. Siapkan Supabase

Jalankan SQL di **Supabase Dashboard → SQL Editor** dalam urutan berikut:

1. `supabase/admin_schema.sql` untuk membuat tabel, fungsi, policy RLS, dan bucket Storage.
2. `supabase/bootstrap_super_admin.sql` jika perlu mendaftarkan akun Auth yang sudah ada sebagai super admin.
3. `supabase/seed_admin_demo_data.sql` untuk mengisi konten demo yang dapat diedit dari dashboard.

Pastikan akun admin sudah tercantum di `public.admin_users` dan `is_active = true`. Jangan membuat `SUPABASE_SERVICE_ROLE_KEY` tersedia untuk aplikasi browser.

## 2. Atur URL Auth Supabase

Di **Supabase Dashboard → Authentication → URL Configuration**:

- Set **Site URL** ke alamat produksi utama, misalnya `https://www.example.com`.
- Tambahkan alamat produksi ke **Redirect URLs**, misalnya `https://www.example.com/**`.
- Tambahkan domain Pages, misalnya `https://cvbanjarindah.pages.dev/**`.
- Jika memakai preview deployment, tambahkan pola/domain preview Pages yang digunakan tim.

Setelah custom domain aktif, pastikan Site URL dan Redirect URLs memuat domain final. Ini diperlukan untuk konfirmasi email dan alur autentikasi Supabase.

## 3. Deploy Otomatis dari Git

1. Push perubahan repository ke GitHub/GitLab.
2. Buka Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pilih repository proyek ini.
4. Gunakan pengaturan build berikut:

   - Framework preset: **None** atau **Nuxt** jika preset meminta pilihan.
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Package manager: `pnpm`
   - Node version: `20`

   `dist` adalah output yang ditetapkan `wrangler.toml` (`pages_build_output_dir = "dist"`). Jangan menggunakan `.output/public` untuk konfigurasi proyek ini.

5. Tambahkan environment variables pada **Settings → Variables and Secrets** untuk environment **Production** dan **Preview** sesuai kebutuhan:

   | Variable | Nilai |
   | --- | --- |
   | `SUPABASE_URL` | URL project Supabase, misalnya `https://project-ref.supabase.co` |
   | `SUPABASE_KEY` | Supabase publishable key atau anon key |
   | `NUXT_PUBLIC_APP_URL` | URL publik environment tersebut |
   | `NUXT_PUBLIC_GEMINI_API_KEY` | Opsional, jika fitur AI digunakan |

   URL Supabase harus berupa root project, tanpa suffix `/rest/v1/`. `SUPABASE_KEY` adalah publishable key yang dipakai browser; key ini bukan password admin. Jangan menambahkan service-role/secret key ke variabel `NUXT_PUBLIC_*` atau ke konfigurasi frontend.

6. Simpan konfigurasi dan jalankan deployment pertama. Cloudflare akan build dan memberi URL `https://<nama-project>.pages.dev`.
7. Masukkan URL Pages tersebut ke Supabase Redirect URLs, lalu uji login dan dashboard.

Setiap push ke production branch akan memicu production deployment; branch lain biasanya mendapat Preview deployment.

## 4. Deploy Manual dengan Wrangler

Dari root repository:

```bash
pnpm install --frozen-lockfile
pnpm exec wrangler login
pnpm exec wrangler whoami
pnpm build
pnpm run deploy
```

`pnpm run deploy` menjalankan `nuxi build` lalu `wrangler pages deploy dist`. Untuk pertama kali, buat project Pages bernama `cvbanjarindah` di Cloudflare Dashboard terlebih dahulu. Jika nama project berbeda, sesuaikan nama di `wrangler.toml` atau gunakan perintah Wrangler dengan nama project yang benar.

Buat `.env` lokal dari contoh untuk proses build/deploy lokal:

```bash
cp .env.example .env
```

Isi nilainya secara lokal. `.env` sudah diabaikan Git; jangan commit file tersebut. Untuk deploy berulang dan tim, lebih aman gunakan Git integration dan Variables and Secrets di dashboard Cloudflare.

## 5. Hubungkan Custom Domain

1. Buka project Pages → **Custom domains → Set up a custom domain**.
2. Masukkan domain yang sudah dikelola Cloudflare, misalnya `www.example.com`.
3. Ikuti instruksi DNS dan tunggu status domain menjadi aktif.
4. Perbarui `NUXT_PUBLIC_APP_URL` ke domain final, lalu jalankan deployment baru.
5. Tambahkan domain final ke Supabase Authentication **Site URL** dan **Redirect URLs**.
6. Uji halaman utama, `/admin/login/`, login admin, serta satu operasi baca/tulis dashboard.

## 6. Checklist Setelah Deploy

- Halaman utama terbuka melalui HTTPS.
- `/admin/login/` tampil dan mengirim request ke host Supabase yang benar.
- Login hanya berhasil untuk user Auth yang aktif di `public.admin_users`.
- `/admin/` mengarah ke login ketika belum ada sesi; setelah login, ringkasan dashboard tampil.
- Produk, kategori, brand, area, testimoni, dan paket harga dapat dibaca/diedit sesuai policy RLS.
- Upload gambar bekerja pada bucket Supabase Storage yang sesuai.
- Konfirmasi email Supabase kembali ke domain yang diizinkan.
- Environment Preview dan Production memiliki URL/key yang sesuai.
- Tidak ada secret service-role di browser, Git, atau log deployment.

## Troubleshooting

### Build gagal

Periksa log build, pastikan versi Node 20, dependency install memakai lockfile pnpm, dan output directory tetap `dist`. Jalankan `pnpm build` lokal untuk memperoleh error yang sama.

### Login menampilkan `Failed to fetch`

Periksa `SUPABASE_URL`: gunakan `https://<project-ref>.supabase.co`, bukan URL REST lengkap `/rest/v1/`. Pastikan `SUPABASE_KEY` adalah publishable/anon key yang cocok dengan project tersebut. Setelah mengganti variable, jalankan deployment baru.

### Login berhasil tetapi akses admin ditolak

Pastikan user ada di Supabase Authentication, terdapat baris dengan `id` yang sama pada `public.admin_users`, `role = 'super_admin'` (atau role admin yang diizinkan), dan `is_active = true`. Pastikan schema dan RLS policy sudah diterapkan.

### Redirect konfirmasi email gagal

Tambahkan host/domain persis ke Supabase Authentication **Redirect URLs** dan periksa **Site URL**. Lakukan deployment ulang hanya jika URL aplikasi yang dibangun berubah.

### Halaman dashboard kosong

Periksa apakah SQL schema dan seed data sudah dijalankan, tabel tersedia pada schema `public`, serta policy RLS mengizinkan operasi untuk akun admin aktif.
