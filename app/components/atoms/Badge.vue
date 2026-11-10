<template>
  <span
    class="inline-flex items-center rounded-full font-bold"
    :class="[colorClasses, sizeClasses]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  color?: 'primary' | 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'emerald' | 'pink' | 'indigo' | 'amber' | 'orange';
  size?: 'xs' | 'sm' | 'md';
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  size: 'md',
});

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };
  return sizes[props.size] || sizes.md;
});

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    emerald: 'bg-emerald-100 text-emerald-700',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    orange: 'bg-orange-100 text-orange-700',
  };
  return colors[props.color] || colors.primary;
});
</script>
