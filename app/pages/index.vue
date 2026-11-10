<template>
  <div>
    <!-- 1. Hero Section -->
    <SectionsHeroSection
      title="CV. Banjar Indah"
      subtitle="Suplier & Mitra Usaha Terpercaya di Kalsel-Teng (Banjarmasin)"
      cta-text="Hubungi Kami"
      cta-link="/kontak"
    />

    <!-- 2. Stats Section (NEW) -->
    <section class="py-16 bg-slate-50 border-y border-slate-200">
      <div class="max-w-7xl mx-auto px-4">
        <OrganismsStatsCounter :stats="companyStats" size="lg" />
      </div>
    </section>

    <!-- 3. Products Section (OPSI 4 - Smart Header) -->
    <section class="py-0">
      <OrganismsFeaturedProductsSection
        title="Produk Kami"
        subtitle="Berbagai kategori produk berkualitas untuk kebutuhan toko Anda"
        :products="products"
        :categories="categoriesList"
      />
    </section>

    <!-- 4. Pricing Packages Section (OPSI 4A - Tabs Pager Mobile) -->
    <section class="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
      <div class="max-w-7xl mx-auto px-4">
        <SectionsSectionHeading
          title="Paket Kemitraan"
          subtitle="Pilih paket yang sesuai dengan skala bisnis Anda"
          align="center"
        />

        <!-- Desktop: Grid, Mobile: Tabs Pager -->
        <div class="hidden md:block">
          <OrganismsPricingGrid :packages="pricingPackages" />
        </div>
        <div class="md:hidden">
          <OrganismsPricingTabsPager :packages="pricingPackages" />
        </div>
      </div>
    </section>

    <!-- 5. Features Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <SectionsSectionHeading
          title="Keunggulan Kami"
          subtitle="Mengapa memilih CV Banjar Indah sebagai partner distributor Anda"
          align="center"
        />
        <OrganismsFeatureGrid :features="features" />
      </div>
    </section>

    <!-- 6. Client Logos Section (NEW) -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4">
        <SectionsSectionHeading
          title="Brand yang Kami Distribusikan"
          subtitle="Bermitra dengan brand-brand ternama dan terpercaya"
          align="center"
        />

        <OrganismsLogoMarquee :clients="clientBrands" :speed="30" />
      </div>
    </section>

    <!-- 7. Why Choose Us Section -->
    <section class="py-16 bg-white max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-black mb-6 text-slate-900">
            Mengapa Memilih Kami?
          </h2>
          <div class="space-y-4">
            <div
              v-for="reason in whyChooseUs"
              :key="reason.id"
              class="flex gap-4"
            >
              <div
                class="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"
              >
                <span class="text-primary text-2xl">{{ reason.icon }}</span>
              </div>
              <div>
                <h4 class="font-bold mb-1 text-slate-900">
                  {{ reason.title }}
                </h4>
                <p class="text-slate-600">
                  {{ reason.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
          <AtomsImage
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=800&fit=crop"
            alt="Warehouse"
            :hover="false"
            class="h-full"
          />
        </div>
      </div>
    </section>

    <!-- 8. Coverage Map Section (OPSI 8A - Accordion) -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4">
        <SectionsSectionHeading
          title="Jangkauan Distribusi"
          subtitle="Melayani wilayah Kalimantan Selatan & Kalimantan Tengah dengan pengiriman armada sendiri maupun ekspedisi"
          align="center"
        />

        <OrganismsCoverageAccordion :areas="coverageAreas" />
      </div>
    </section>

    <!-- 9. Testimonials Section (NEW) -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <SectionsSectionHeading
          title="Kata Mereka"
          subtitle="Testimoni dari mitra-mitra yang telah bergabung bersama kami"
          align="center"
        />

        <OrganismsTestimonialsGrid :testimonials="testimonials" />
      </div>
    </section>

    <!-- 10. Final CTA Section (NEW) -->
    <SectionsFinalCTA />
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/product";
import { products as staticProducts } from "~/data/products";

// Static data that doesn't need to be in DB
import {
  features,
  whyChooseUs,
  companyStats as staticCompanyStats,
  testimonials as staticTestimonials,
  pricingPackages as staticPricingPackages,
  coverageAreas,
} from "~/data/content";

definePageMeta({
  layout: "default",
});

// Fetch dynamic data from Supabase
const { supabase } = useSupabase();
const products = ref<Product[]>(staticProducts.slice(0, 6));
const categoriesList = ref<string[]>([
  "Semua",
  "Kesehatan",
  "Kosmetik & Kecantikan",
  "Bayi",
  "Garment",
  "Elektronik",
  "Kelontongan",
]);
const clientBrands = ref<Array<{ id: string; name: string; logo: string }>>([]);
const companyStats = ref(staticCompanyStats);
const testimonials = ref(staticTestimonials);
const pricingPackages = ref(staticPricingPackages);
const loading = ref(true);

onMounted(async () => {
  try {
    loading.value = true;

    // Fetch products, categories, and brands in parallel
    const [productsResult, categoriesResult, brandsResult] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("brands")
        .select("id, name, logo_url")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const catMap = new Map((categoriesResult.data || []).map((c: any) => [c.id, c.name]));
    const brandMap = new Map((brandsResult.data || []).map((b: any) => [b.id, b.name]));

    if (categoriesResult.data && categoriesResult.data.length > 0) {
      categoriesList.value = ["Semua", ...categoriesResult.data.map((c: any) => c.name)];
    }

    if (brandsResult.error) {
      console.error("Error fetching homepage brands:", brandsResult.error);
    } else {
      clientBrands.value = (brandsResult.data ?? [])
        .filter((brand: any) => brand.logo_url?.trim())
        .map((brand: any) => ({
          id: String(brand.id),
          name: brand.name,
          logo: brand.logo_url,
        }));
    }

    if (productsResult.data && productsResult.data.length > 0) {
      products.value = productsResult.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        category: catMap.get(item.category_id) || "Produk",
        brand: brandMap.get(item.brand_id) || undefined,
        brandId: item.brand_id,
        image:
          item.image_url ||
          "https://images.unsplash.com/photo-1584556326561-c8746083993b?w=400&h=300&fit=crop",
        featured: item.is_featured || false,
        price: item.price,
        stock: item.stock,
        tiktok_post_id: item.tiktok_post_id || null,
      }));
    }

    // Fetch testimonials (active only)
    const { data: testimonialsData } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(6);

    if (testimonialsData && testimonialsData.length > 0) {
      testimonials.value = testimonialsData.map((item: any) => ({
        id: item.id,
        name: item.customer_name,
        location: item.customer_company || "Banjarmasin",
        company: item.customer_company || "",
        photo:
          item.customer_avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(item.customer_name)}&background=ff5910&color=fff&size=100`,
        avatar:
          item.customer_avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(item.customer_name)}&background=ff5910&color=fff&size=100`,
        rating: item.rating || 5,
        text: item.testimonial,
      }));
    }

    // Fetch pricing plans (active only)
    const { data: pricingData } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (pricingData) {
      pricingPackages.value = pricingData.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || "",
        price: item.price
          ? `Rp ${item.price.toLocaleString("id-ID")}`
          : "Hubungi Kami",
        minOrder: item.min_order || null,
        features: item.features || [],
        highlighted: item.is_popular || false,
        discount: item.discount_percentage || null,
      }));
    }

    // Calculate company stats from real data
    const { count: productCount } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const { count: inquiryCount } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true });

    const { count: areaCount } = await supabase
      .from("distribution_areas")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    companyStats.value = [
      {
        id: "1",
        label: "Produk Tersedia",
        value: productCount || 50,
        suffix: "+",
        icon: "inventory_2",
      },
      {
        id: "2",
        label: "Mitra Aktif",
        value: inquiryCount || 200,
        suffix: "+",
        icon: "handshake",
      },
      {
        id: "3",
        label: "Kota Terjangkau",
        value: areaCount || 15,
        suffix: "+",
        icon: "location_city",
      },
      {
        id: "4",
        label: "Tahun Pengalaman",
        value: new Date().getFullYear() - 2010,
        suffix: "",
        icon: "military_tech",
      },
    ];

    // Fallback to static data if database is empty
    if (products.value.length === 0) {
      products.value = staticProducts.slice(0, 6);
    }

    if (testimonials.value.length === 0) {
      testimonials.value = staticTestimonials;
    }

    if (pricingPackages.value.length === 0) {
      pricingPackages.value = staticPricingPackages;
    }
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    // Fallback to all static data
    products.value = staticProducts.slice(0, 6);
    companyStats.value = staticCompanyStats;
    testimonials.value = staticTestimonials;
    pricingPackages.value = staticPricingPackages;
  } finally {
    loading.value = false;
  }
});
</script>
