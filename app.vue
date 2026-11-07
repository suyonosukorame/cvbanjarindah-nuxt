<template>
  <div id="app" class="font-poppins transition-colors duration-200 bg-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    
    <!-- Toast Notifications -->
    <OrganismsToastContainer />
  </div>
</template>

<script setup lang="ts">
// Global setup - auto track page visits
const { startTracking } = usePageTracking()

// Start tracking when app mounts (client-side only)
onMounted(() => {
  startTracking()
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  background-color: white;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: white;
  color: #0f172a;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 89, 16, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 89, 16, 0.5);
}
</style>
