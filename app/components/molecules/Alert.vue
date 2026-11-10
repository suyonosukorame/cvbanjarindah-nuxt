<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-1"
  >
    <div
      v-if="visible"
      role="alert"
      class="rounded-xl border transition-all duration-200"
      :class="[containerClasses, variantClasses]"
    >
      <div class="flex items-start gap-3 p-3.5 sm:p-4">
        <!-- Icon Badge -->
        <slot name="icon">
          <div
            class="flex items-center justify-center shrink-0 rounded-lg transition-colors"
            :class="iconContainerClasses"
          >
            <span class="material-symbols-outlined select-none" :class="iconSizeClass">
              {{ computedIcon }}
            </span>
          </div>
        </slot>

        <!-- Main Content -->
        <div class="flex-1 min-w-0 pt-0.5">
          <!-- Title -->
          <div v-if="title || $slots.title" class="flex items-center gap-2">
            <h4 class="text-sm font-bold leading-snug" :class="titleColorClass">
              <slot name="title">{{ title }}</slot>
            </h4>
          </div>

          <!-- Description / Message -->
          <div
            v-if="messageText || $slots.default"
            class="text-xs sm:text-sm leading-relaxed"
            :class="[
              messageColorClass,
              title || $slots.title ? 'mt-1' : ''
            ]"
          >
            <slot>{{ messageText }}</slot>
          </div>

          <!-- Action Buttons / Slot -->
          <div v-if="$slots.actions" class="mt-3 flex flex-wrap items-center gap-2">
            <slot name="actions" />
          </div>

          <!-- Collapsible Technical / Debug Details -->
          <div v-if="detailsText" class="mt-2.5 pt-2 border-t border-black/5">
            <button
              type="button"
              class="inline-flex items-center gap-1 text-[11px] font-semibold opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
              :class="titleColorClass"
              @click="isDetailsExpanded = !isDetailsExpanded"
            >
              <span
                class="material-symbols-outlined text-xs transition-transform duration-200"
                :class="{ 'rotate-90': isDetailsExpanded }"
              >
                chevron_right
              </span>
              <span>{{ detailsTitle }}</span>
            </button>

            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="isDetailsExpanded" class="mt-1.5">
                <pre
                  class="p-2.5 rounded-lg bg-black/5 text-[11px] font-mono leading-relaxed whitespace-pre-wrap break-all border border-black/5 max-h-48 overflow-y-auto"
                  :class="titleColorClass"
                >{{ detailsText }}</pre>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Close / Dismiss Button -->
        <button
          v-if="closeable"
          type="button"
          class="shrink-0 -mr-1 -mt-1 p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 transition-all text-slate-600 cursor-pointer"
          aria-label="Tutup pemberitahuan"
          @click="handleClose"
        >
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

type AlertType = 'success' | 'error' | 'warning' | 'info';
type AlertVariant = 'subtle' | 'left-accent' | 'card';

interface Props {
  type?: AlertType;
  variant?: AlertVariant;
  title?: string;
  message?: string;
  description?: string;
  icon?: string;
  closeable?: boolean;
  details?: string | Record<string, any> | Error | null;
  detailsTitle?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  variant: 'subtle',
  title: '',
  message: '',
  description: '',
  icon: '',
  closeable: false,
  details: null,
  detailsTitle: 'Lihat detail teknis',
});

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const visible = ref(true);
const isDetailsExpanded = ref(false);

const messageText = computed(() => props.description || props.message || '');

const detailsText = computed(() => {
  if (!props.details) return '';
  if (typeof props.details === 'string') return props.details;
  if (props.details instanceof Error) return `${props.details.name}: ${props.details.message}\n${props.details.stack || ''}`.trim();
  try {
    return JSON.stringify(props.details, null, 2);
  } catch {
    return String(props.details);
  }
});

const handleClose = () => {
  visible.value = false;
  emit('close');
};

// Theme configurations per type
const typeStyles = {
  info: {
    container: 'bg-sky-50/90 border-sky-200/90 text-sky-950',
    leftAccent: 'border-l-4 border-l-sky-500',
    card: 'shadow-xs border-sky-200/90 bg-gradient-to-r from-sky-50/90 to-white',
    iconBadge: 'bg-sky-100 text-sky-600',
    title: 'text-sky-900',
    message: 'text-sky-800/90',
    defaultIcon: 'info',
  },
  success: {
    container: 'bg-emerald-50/90 border-emerald-200/90 text-emerald-950',
    leftAccent: 'border-l-4 border-l-emerald-500',
    card: 'shadow-xs border-emerald-200/90 bg-gradient-to-r from-emerald-50/90 to-white',
    iconBadge: 'bg-emerald-100 text-emerald-600',
    title: 'text-emerald-900',
    message: 'text-emerald-800/90',
    defaultIcon: 'check_circle',
  },
  warning: {
    container: 'bg-amber-50/90 border-amber-200/90 text-amber-950',
    leftAccent: 'border-l-4 border-l-amber-500',
    card: 'shadow-xs border-amber-200/90 bg-gradient-to-r from-amber-50/90 to-white',
    iconBadge: 'bg-amber-100 text-amber-700',
    title: 'text-amber-900',
    message: 'text-amber-800/90',
    defaultIcon: 'warning',
  },
  error: {
    container: 'bg-rose-50/90 border-rose-200/90 text-rose-950',
    leftAccent: 'border-l-4 border-l-rose-500',
    card: 'shadow-xs border-rose-200/90 bg-gradient-to-r from-rose-50/90 to-white',
    iconBadge: 'bg-rose-100 text-rose-600',
    title: 'text-rose-900',
    message: 'text-rose-800/90',
    defaultIcon: 'error',
  },
};

const currentStyle = computed(() => typeStyles[props.type] || typeStyles.info);

const containerClasses = computed(() => currentStyle.value.container);

const variantClasses = computed(() => {
  if (props.variant === 'left-accent') return currentStyle.value.leftAccent;
  if (props.variant === 'card') return currentStyle.value.card;
  return '';
});

const iconContainerClasses = computed(() => {
  return `w-7 h-7 sm:w-8 sm:h-8 ${currentStyle.value.iconBadge}`;
});

const iconSizeClass = computed(() => 'text-lg sm:text-xl');

const titleColorClass = computed(() => currentStyle.value.title);
const messageColorClass = computed(() => currentStyle.value.message);

const computedIcon = computed(() => {
  if (props.icon) return props.icon;
  return currentStyle.value.defaultIcon;
});
</script>
