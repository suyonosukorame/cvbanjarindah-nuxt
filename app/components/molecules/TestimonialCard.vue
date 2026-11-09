<template>
  <MoleculesCard class="h-full">
    <div class="flex flex-col h-full">
      <!-- Rating -->
      <div class="mb-4">
        <AtomsRating :rating="testimonial.rating" />
      </div>
      
      <!-- Quote -->
      <p class="text-slate-600 mb-6 flex-1 italic leading-relaxed">
        "{{ testimonial.text }}"
      </p>
      
      <!-- Author -->
      <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
        <img 
          :src="imageSrc" 
          :alt="testimonial.name"
          class="w-12 h-12 rounded-full object-cover bg-slate-100 border border-slate-200"
          loading="lazy"
          @error="handleImageError"
        />
        <div>
          <div class="font-bold text-slate-900">{{ testimonial.name }}</div>
          <div v-if="displayLocation" class="text-sm text-slate-500 flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">location_on</span>
            {{ displayLocation }}
          </div>
        </div>
      </div>
    </div>
  </MoleculesCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Testimonial {
  id: string;
  name: string;
  location?: string;
  company?: string;
  photo?: string;
  avatar?: string;
  rating: number;
  text: string;
}

interface Props {
  testimonial: Testimonial;
}

const props = defineProps<Props>();

const defaultAvatar = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(props.testimonial.name || 'User')}&background=ff5910&color=fff&size=100`;
});

const imageSrc = ref(props.testimonial.photo || props.testimonial.avatar || defaultAvatar.value);

watch(
  () => props.testimonial,
  (newVal) => {
    imageSrc.value = newVal.photo || newVal.avatar || defaultAvatar.value;
  },
  { deep: true }
);

const handleImageError = () => {
  imageSrc.value = defaultAvatar.value;
};

const displayLocation = computed(() => {
  return props.testimonial.location || props.testimonial.company || '';
});
</script>
