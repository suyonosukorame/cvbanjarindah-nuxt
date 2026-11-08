<template>
  <MoleculesCollapsibleCard
    icon="chat"
    collapsed-title="Butuh bantuan langsung?"
    collapsed-subtitle="Chat via WhatsApp • ~5 menit"
    expanded-title="Butuh bantuan langsung?"
    expanded-subtitle="Tim kami siap membantu via WhatsApp"
    variant="green"
    :default-expanded="false"
  >
    <!-- WhatsApp CTA Button -->
    <a
      :href="whatsappUrl"
      target="_blank"
      class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors active:scale-95 shadow-sm"
    >
      <span class="material-symbols-outlined text-xl">send</span>
      <span>Chat via WhatsApp</span>
    </a>
    
    <p class="text-center text-xs text-slate-500 mt-2">
      Response time: ~5 menit
    </p>
  </MoleculesCollapsibleCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  phoneNumber?: string;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  phoneNumber: '62',
  message: 'Halo, saya ingin bertanya tentang produk CV Banjar Indah',
});

const whatsappUrl = computed(() => {
  const encodedMessage = encodeURIComponent(props.message);
  return `https://wa.me/${props.phoneNumber}?text=${encodedMessage}`;
});
</script>
