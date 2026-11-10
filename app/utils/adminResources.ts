export interface AdminField {
  key: string;
  label: string;
  type?: 'text' | 'url' | 'email' | 'number' | 'textarea' | 'boolean' | 'select' | 'list' | 'image' | 'relation' | 'social-link';
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  bucket?: string;
  /** Auto-generate value dari field lain. Contoh: autoFrom: 'name' untuk slug */
  autoFrom?: string;
  /** Untuk type 'relation': nama tabel di Supabase */
  relationTable?: string;
  /** Untuk type 'relation': kolom yang ditampilkan sebagai label di dropdown */
  relationLabel?: string;
  /** Untuk type 'social-link': platform identitas (tiktok | instagram | website | generic) */
  socialPlatform?: 'tiktok' | 'instagram' | 'website' | 'generic';
  /** Placeholder khusus */
  placeholder?: string;
}

export interface AdminResource {
  label: string;
  table: string;
  fields: AdminField[];
  searchable: string[];
  allowCreate?: boolean;
  allowDelete?: boolean;
}

const activeOptions = [
  { label: 'Aktif', value: 'true' },
  { label: 'Nonaktif', value: 'false' },
];

export const adminResources: Record<string, AdminResource> = {
  products: {
    label: 'Produk', table: 'products', searchable: ['name', 'slug'],
    fields: [
      // Table visible columns (first 4)
      { key: 'image_url', label: 'Gambar', type: 'image', bucket: 'products' },
      { key: 'name', label: 'Nama produk', required: true },
      { key: 'price', label: 'Harga', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { label: 'Aktif', value: 'active' }, { label: 'Nonaktif', value: 'inactive' }, { label: 'Draft', value: 'draft' },
      ] },
      // Other fields (form/edit view)
      { key: 'slug', label: 'Slug', required: true, autoFrom: 'name' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'category_id', label: 'Kategori', type: 'relation', relationTable: 'categories', relationLabel: 'name' },
      { key: 'brand_id', label: 'Brand', type: 'relation', relationTable: 'brands', relationLabel: 'name' },
      { key: 'stock', label: 'Stok', type: 'number' },
      { key: 'is_featured', label: 'Produk unggulan', type: 'boolean' },
      // Social media
      { key: 'tiktok_post_id', label: 'TikTok Post ID', type: 'social-link', socialPlatform: 'tiktok', placeholder: 'Contoh: 7591783410276781332' },
    ],
  },
  categories: {
    label: 'Kategori', table: 'categories', searchable: ['name', 'slug'],
    fields: [
      // Table visible columns (first 4)
      { key: 'image_url', label: 'Gambar', type: 'image', bucket: 'categories' },
      { key: 'name', label: 'Nama kategori', required: true },
      { key: 'sort_order', label: 'Urutan', type: 'number' },
      { key: 'is_active', label: 'Aktif', type: 'boolean' },
      // Other fields (form/edit view)
      { key: 'slug', label: 'Slug', required: true, autoFrom: 'name' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'icon', label: 'Ikon Material' },
    ],
  },
  brands: {
    label: 'Brand', table: 'brands', searchable: ['name', 'slug'],
    fields: [
      // Table visible columns (first 4)
      { key: 'logo_url', label: 'Logo', type: 'image', bucket: 'brands', required: true },
      { key: 'name', label: 'Nama brand', required: true },
      { key: 'sort_order', label: 'Urutan', type: 'number' },
      { key: 'is_active', label: 'Aktif', type: 'boolean' },
      // Other fields (form/edit view)
      { key: 'slug', label: 'Slug', required: true, autoFrom: 'name' },
      { key: 'website_url', label: 'Website', type: 'url', placeholder: 'https://www.example.com' },
      { key: 'tiktok_url', label: 'TikTok Brand', type: 'social-link', socialPlatform: 'tiktok', placeholder: 'https://www.tiktok.com/@namabrand atau @namabrand' },
      { key: 'instagram_url', label: 'Instagram Brand', type: 'social-link', socialPlatform: 'instagram', placeholder: 'https://www.instagram.com/namabrand atau @namabrand' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'is_featured', label: 'Brand unggulan', type: 'boolean' },
    ],
  },
  areas: {
    label: 'Area distribusi', table: 'distribution_areas', searchable: ['name', 'province', 'city'],
    fields: [
      { key: 'name', label: 'Nama area', required: true },
      { key: 'province', label: 'Provinsi', required: true },
      { key: 'coverage_type', label: 'Tipe cakupan', type: 'select', options: [
        { label: 'Kota', value: 'city' }, { label: 'Provinsi', value: 'province' }, { label: 'Wilayah', value: 'region' },
      ] },
      { key: 'is_active', label: 'Aktif', type: 'boolean' },
      { key: 'city', label: 'Kota' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
    ],
  },
  inquiries: {
    label: 'Pesan masuk', table: 'inquiries', searchable: ['name', 'email', 'company'],
    allowCreate: false, allowDelete: false,
    fields: [
      { key: 'name', label: 'Nama', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'company', label: 'Perusahaan' },
      { key: 'status', label: 'Status', type: 'select', options: [
        { label: 'Baru', value: 'new' }, { label: 'Dihubungi', value: 'contacted' },
        { label: 'Dikonversi', value: 'converted' }, { label: 'Diarsipkan', value: 'archived' },
      ] },
      { key: 'phone', label: 'Telepon' },
      { key: 'message', label: 'Pesan', type: 'textarea', required: true },
    ],
  },
  testimonials: {
    label: 'Testimoni', table: 'testimonials', searchable: ['customer_name', 'customer_company'],
    fields: [
      // Table visible columns (first 4)
      { key: 'customer_avatar', label: 'Foto', type: 'image', bucket: 'testimonials' },
      { key: 'customer_name', label: 'Nama pelanggan', required: true },
      { key: 'rating', label: 'Rating', type: 'number', required: true },
      { key: 'is_featured', label: 'Unggulan', type: 'boolean' },
      // Other fields (form/edit view)
      { key: 'customer_company', label: 'Perusahaan' },
      { key: 'testimonial', label: 'Testimoni', type: 'textarea', required: true },
      { key: 'is_active', label: 'Aktif', type: 'boolean' },
    ],
  },
  pricing: {
    label: 'Paket harga', table: 'pricing_plans', searchable: ['name', 'slug'],
    fields: [
      { key: 'name', label: 'Nama paket', required: true },
      { key: 'price', label: 'Harga', type: 'number' },
      { key: 'is_popular', label: 'Populer', type: 'boolean' },
      { key: 'is_active', label: 'Aktif', type: 'boolean' },
      { key: 'slug', label: 'Slug', required: true, autoFrom: 'name' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'features', label: 'Fitur (satu per baris)', type: 'list' },
      { key: 'min_order', label: 'Minimum order', type: 'number' },
      { key: 'discount_percentage', label: 'Diskon (%)', type: 'number' },
      { key: 'sort_order', label: 'Urutan', type: 'number' },
    ],
  },
};

export const adminNavigation = [
  { label: 'Ringkasan', to: '/admin', icon: 'space_dashboard' },
  { label: 'Produk', to: '/admin/products', icon: 'inventory_2' },
  { label: 'Kategori', to: '/admin/categories', icon: 'category' },
  { label: 'Brand', to: '/admin/brands', icon: 'business' },
  { label: 'Area distribusi', to: '/admin/areas', icon: 'location_on' },
  { label: 'Pesan masuk', to: '/admin/inquiries', icon: 'mail' },
  { label: 'Testimoni', to: '/admin/testimonials', icon: 'reviews' },
  { label: 'Paket harga', to: '/admin/pricing', icon: 'payments' },
  { label: 'Pengguna', to: '/admin/users', icon: 'group' },
];

export { activeOptions };