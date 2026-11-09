export default defineNuxtConfig({
  // Enable SSR for dynamic features
  ssr: true,
  compatibilityDate: '2024-11-06',

  // Route rules for optimization
  routeRules: {
    // Dynamic pages (server-side rendered on demand)
    '/produk': { swr: 3600 }, // Cache for 1 hour
    '/area': { swr: 3600 },
    '/admin/**': { ssr: true }, // Admin always SSR
    '/api/**': { cors: true }, // API routes
  },

  // Deploy target: Cloudflare Pages (supports SSR)
  nitro: {
    preset: 'cloudflare-pages',
  },
  
  srcDir: 'app/',
  
  // Component auto-import configuration
  components: [
    {
      path: '~/components/atoms',
      pathPrefix: false,
      prefix: 'Atoms',
    },
    {
      path: '~/components/molecules',
      pathPrefix: false,
      prefix: 'Molecules',
    },
    {
      path: '~/components/organisms',
      pathPrefix: false,
      prefix: 'Organisms',
    },
    {
      path: '~/components/sections',
      pathPrefix: false,
      prefix: 'Sections',
    },
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  
  modules: [
    // '@nuxt/devtools',
    '@nuxtjs/tailwindcss',
  ],

  app: {
    head: {
      title: 'CV. Banjar Indah - Suplier & Mitra Usaha di Kalsel-Teng',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'CV. Banjar Indah - Suplier & Mitra Usaha di Kalsel-Teng. Distributor resmi produk Kesehatan, Kosmetik/Kecantikan, Baby, Garment, Elektronik, dan Kelontongan berbasis di Banjarmasin.' },
        { name: 'keywords', content: 'CV Banjar Indah, distributor banjarmasin, suplier kalsel teng, distributor kosmetik banjarmasin, distributor baby kalsel, grosir kelontong banjarmasin, distributor kesehatan' },
        { name: 'theme-color', content: '#ff5910' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/logo-cv-banjarindah.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/logo-cv-banjarindah.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo-cv-banjarindah.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined' },
      ],
      // SEO: LocalBusiness structured data (JSON-LD) for Google Search
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'CV. Banjar Indah',
            description: 'Suplier & Mitra Usaha Terpercaya di Kalimantan Selatan & Tengah. Distributor resmi produk Kesehatan, Kosmetik, Baby, Garment, Elektronik, dan Kelontongan.',
            url: 'https://cvbanjarindah.pages.dev',
            telephone: '+6285124502615',
            priceRange: 'Grosir',
            image: 'https://cvbanjarindah.pages.dev/logo-cv-banjarindah.png',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'Jl. Mahoni No. 98 RT.12 Komplek Banjar Indah Permai, Pemurus Dalam',
              addressLocality: 'Banjarmasin Selatan',
              addressRegion: 'Kalimantan Selatan',
              postalCode: '70248',
              addressCountry: 'ID',
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: -3.3497972,
              longitude: 114.6164557,
            },
            openingHoursSpecification: [
              {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '08:30',
                closes: '17:00',
              },
            ],
            sameAs: [
              'https://www.instagram.com/cvbanjarindah/',
              'https://www.tiktok.com/@cvbanjarindah',
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+6285124502615',
              contactType: 'sales',
              availableLanguage: 'Indonesian',
            },
          }),
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  devServer: {
    port: 3000,
  },

  build: {
    transpile: ['@google/genai'],
  },

  runtimeConfig: {
    public: {
      supabaseEndpoint: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
      geminiApiKey: process.env.NUXT_PUBLIC_GEMINI_API_KEY,
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      appName: 'CV Banjar Indah',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  },
});
