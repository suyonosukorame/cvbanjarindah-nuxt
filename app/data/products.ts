import type { Product, ProductCategory } from '~/types/product';

export const productCategories: ProductCategory[] = [
  {
    id: 'kesehatan',
    name: 'Kesehatan',
    slug: 'kesehatan',
    description: 'Produk kesehatan, masker medis, tissue higienis, dan sanitasi berkualitas',
    color: 'emerald',
    icon: 'health_and_safety',
  },
  {
    id: 'kosmetik',
    name: 'Kosmetik & Kecantikan',
    slug: 'kosmetik',
    description: 'Kosmetik, skincare, dan produk perawatan kecantikan terpercaya',
    color: 'pink',
    icon: 'face',
  },
  {
    id: 'bayi',
    name: 'Perlengkapan Bayi',
    slug: 'bayi',
    description: 'Popok, tisu basah, minyak telon, dan perlengkapan bayi terlengkap',
    color: 'blue',
    icon: 'child_care',
  },
  {
    id: 'garment',
    name: 'Garment & Pakaian',
    slug: 'garment',
    description: 'Pakaian, tekstil, dan perlengkapan garment untuk kebutuhan retail',
    color: 'indigo',
    icon: 'checkroom',
  },
  {
    id: 'elektronik',
    name: 'Elektronik',
    slug: 'elektronik',
    description: 'Peralatan elektronik harian, aksesoris, dan perlengkapan rumah tangga',
    color: 'amber',
    icon: 'devices',
  },
  {
    id: 'kelontongan',
    name: 'Kelontongan',
    slug: 'kelontongan',
    description: 'Kebutuhan pokok dan produk kelontong grosir untuk warung & toko',
    color: 'orange',
    icon: 'storefront',
  },
];

export const products: Product[] = [
  // === KESEHATAN ===
  {
    id: '1',
    name: 'Paseo Tissue Premium',
    description: 'Tissue premium 2 ply lembut dan tebal untuk keluarga',
    category: 'Kesehatan',
    image: 'https://images.unsplash.com/photo-1584556326561-c8746083993b?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '2',
    name: 'Pokana Masker 3 Ply',
    description: 'Masker medis 3 ply dengan filter berkualitas tinggi',
    category: 'Kesehatan',
    image: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '3',
    name: 'Sensi Masker Surgical',
    description: 'Masker bedah dengan earloop elastis nyaman dipakai seharian',
    category: 'Kesehatan',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=300&fit=crop',
  },

  // === KOSMETIK & KECANTIKAN ===
  {
    id: '4',
    name: 'Wardah Lightening Serum',
    description: 'Serum pencerah wajah dengan vitamin C dan niacinamide',
    category: 'Kosmetik & Kecantikan',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '5',
    name: 'Emina Cushion Foundation',
    description: 'Foundation cushion ringan dengan SPF 30 PA+++',
    category: 'Kosmetik & Kecantikan',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    name: 'Scarlett Whitening Body Lotion',
    description: 'Body lotion pemutih dan pelembab kulit dengan bahan premium',
    category: 'Kosmetik & Kecantikan',
    image: 'https://images.unsplash.com/photo-1556228578-567ba127c37e?w=400&h=300&fit=crop',
  },

  // === PERLENGKAPAN BAYI ===
  {
    id: '7',
    name: 'MamyPoko Pants Extra Soft',
    description: 'Popok celana bayi extra soft dan breathable, anti bocor 12 jam',
    category: 'Perlengkapan Bayi',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '8',
    name: 'Sweety Silver Pants',
    description: 'Popok premium dengan technology terbaru, lembut di kulit bayi',
    category: 'Perlengkapan Bayi',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=300&fit=crop',
  },
  {
    id: '9',
    name: 'Cussons Baby Starter Pack',
    description: 'Rangkaian perawatan bayi lengkap: sabun, shampoo, lotion, minyak telon',
    category: 'Perlengkapan Bayi',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop',
  },

  // === GARMENT & PAKAIAN ===
  {
    id: '10',
    name: 'Kaos Polos Cotton Combed 30s',
    description: 'Kaos polos bahan cotton combed 30s premium, adem dan nyaman',
    category: 'Garment & Pakaian',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '11',
    name: 'Celana Training Panjang',
    description: 'Celana olahraga training panjang bahan stretch berkualitas',
    category: 'Garment & Pakaian',
    image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=300&fit=crop',
  },
  {
    id: '12',
    name: 'Handuk Terry Soft',
    description: 'Handuk terry 100% cotton, lembut, cepat menyerap air',
    category: 'Garment & Pakaian',
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
  },

  // === ELEKTRONIK ===
  {
    id: '13',
    name: 'Baterai AA Alkaline',
    description: 'Baterai alkaline AA daya tahan lama untuk berbagai perangkat',
    category: 'Elektronik',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '14',
    name: 'Lampu LED 10W Hemat Energi',
    description: 'Lampu LED 10W setara 80W, hemat listrik hingga 85%, cahaya terang',
    category: 'Elektronik',
    image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400&h=300&fit=crop',
  },
  {
    id: '15',
    name: 'Kabel USB Multi Fungsi',
    description: 'Kabel USB 3-in-1 (Type-C, Micro, Lightning) braided tahan lama',
    category: 'Elektronik',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  },

  // === KELONTONGAN ===
  {
    id: '16',
    name: 'Rinso Anti Noda 1kg',
    description: 'Detergen bubuk anti noda membandel, harum seharian',
    category: 'Kelontongan',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&h=300&fit=crop',
    featured: true,
  },
  {
    id: '17',
    name: 'Sunlight Pencuci Piring Jeruk',
    description: 'Sabun cuci piring konsentrat wangi jeruk, ampuh membersihkan lemak',
    category: 'Kelontongan',
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop',
  },
  {
    id: '18',
    name: 'Lifebuoy Sabun Mandi Cair',
    description: 'Sabun mandi cair antibakteri perlindungan 10x lebih baik',
    category: 'Kelontongan',
    image: 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=400&h=300&fit=crop',
  },
];
