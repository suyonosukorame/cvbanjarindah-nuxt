<template>
  <nav class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-2 md:py-3 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center">
        <img 
          :src="logoUrl" 
          alt="CV Banjar Indah Logo" 
          class="h-10 md:h-12 w-auto max-w-[160px] object-contain"
        />
      </NuxtLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink 
          to="/" 
          class="font-semibold text-slate-700 hover:text-primary transition"
          :class="{ 'text-primary': $route.path === '/' }"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/produk" 
          class="font-semibold text-slate-700 hover:text-primary transition"
          :class="{ 'text-primary': $route.path === '/produk' }"
        >
          Produk
        </NuxtLink>
        <NuxtLink 
          to="/area" 
          class="font-semibold text-slate-700 hover:text-primary transition"
          :class="{ 'text-primary': $route.path === '/area' }"
        >
          Area
        </NuxtLink>
        <NuxtLink 
          to="/tentang" 
          class="font-semibold text-slate-700 hover:text-primary transition"
          :class="{ 'text-primary': $route.path === '/tentang' }"
        >
          Tentang
        </NuxtLink>

        <!-- Order Cart Button (Desktop) -->
        <MoleculesOrderCartButton />
        
        <NuxtLink 
          to="/kontak" 
          class="px-5 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition text-sm"
        >
          Kontak
        </NuxtLink>
      </div>

      <!-- Mobile Actions -->
      <div class="md:hidden flex items-center gap-2">
        <MoleculesOrderCartButton />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Use computed property for logo URL to avoid Vite import issues
const logoUrl = '/logo-cv-banjarindah.png'
</script>
