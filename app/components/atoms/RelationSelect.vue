<template>
  <div class="relative flex gap-2">
    <!-- Relation Select Dropdown -->
    <div class="relative flex-1">
      <select
        :value="modelValue"
        :disabled="disabled || loading"
        class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 pr-8 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 disabled:text-slate-400"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">
          {{ loading ? 'Memuat data...' : `— Pilih ${label} —` }}
        </option>
        <option v-for="opt in options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <!-- Loading spinner inside select -->
      <span
        v-if="loading"
        class="material-symbols-outlined animate-spin pointer-events-none absolute right-2 top-2.5 text-base text-slate-400"
      >
        progress_activity
      </span>
    </div>

    <!-- Quick Add Button -->
    <div class="relative">
      <button
        type="button"
        :disabled="disabled || loading"
        :title="`Tambah ${label} baru`"
        class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        @click.stop="togglePopover"
      >
        <span class="material-symbols-outlined text-lg">add</span>
      </button>

      <!-- Quick Add Popover -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-1"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-1"
      >
        <div
          v-if="showPopover"
          class="absolute right-0 top-12 z-50 w-72 origin-top-right rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
        >
          <!-- Popover Header -->
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-800">
              <span class="material-symbols-outlined align-middle text-base text-primary">add_circle</span>
              Tambah {{ label }} Baru
            </p>
            <button
              type="button"
              class="grid h-6 w-6 place-items-center rounded text-slate-400 hover:text-slate-600"
              @click="closePopover"
            >
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <!-- Input Nama -->
          <div class="space-y-3">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-slate-600">
                Nama {{ label }} <span class="text-red-500">*</span>
              </label>
              <input
                ref="nameInput"
                v-model="newName"
                type="text"
                :placeholder="`Contoh: ${label === 'Kategori' ? 'Elektronik' : 'Samsung'}`"
                class="h-9 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                @keydown.enter.prevent="quickAdd"
                @keydown.esc="closePopover"
              >
            </div>

            <!-- Slug Preview -->
            <div v-if="newName.trim()" class="rounded-lg bg-slate-50 px-3 py-2">
              <p class="text-xs text-slate-500">
                Slug: <span class="font-mono font-medium text-slate-700">{{ previewSlug }}</span>
              </p>
            </div>

            <!-- Error -->
            <p v-if="addError" class="text-xs text-red-600">{{ addError }}</p>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                type="button"
                class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                @click="closePopover"
              >
                Batal
              </button>
              <button
                type="button"
                :disabled="adding || !newName.trim()"
                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                @click="quickAdd"
              >
                <span v-if="adding" class="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                <span v-else class="material-symbols-outlined text-sm">save</span>
                {{ adding ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Click-outside overlay -->
    <div
      v-if="showPopover"
      class="fixed inset-0 z-40"
      @click="closePopover"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  options: Array<{ label: string; value: string }>;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  relationTable: string;
  relationLabel?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'refresh': [];
}>();

const { $supabase } = useNuxtApp();

const showPopover = ref(false);
const newName = ref('');
const adding = ref(false);
const addError = ref('');
const nameInput = ref<HTMLInputElement | null>(null);

const toSlug = (text: string) =>
  text.trim().toLocaleLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const previewSlug = computed(() => toSlug(newName.value));

const togglePopover = () => {
  showPopover.value = !showPopover.value;
  if (showPopover.value) {
    newName.value = '';
    addError.value = '';
    nextTick(() => nameInput.value?.focus());
  }
};

const closePopover = () => {
  showPopover.value = false;
  newName.value = '';
  addError.value = '';
};

const quickAdd = async () => {
  if (!newName.value.trim() || !$supabase) return;
  adding.value = true;
  addError.value = '';

  try {
    const labelCol = props.relationLabel ?? 'name';
    const slug = toSlug(newName.value);

    const payload: Record<string, unknown> = {
      [labelCol]: newName.value.trim(),
      slug,
      is_active: true,
    };

    const { data, error } = await $supabase
      .from(props.relationTable)
      .insert(payload)
      .select('id')
      .single();

    if (error) throw error;

    // Emit refresh agar parent reload options
    emit('refresh');

    // Setelah refresh selesai, pilih item baru
    await nextTick();
    if (data?.id) {
      emit('update:modelValue', String(data.id));
    }

    closePopover();
  } catch (err) {
    addError.value = err instanceof Error ? err.message : 'Gagal menyimpan.';
  } finally {
    adding.value = false;
  }
};
</script>
