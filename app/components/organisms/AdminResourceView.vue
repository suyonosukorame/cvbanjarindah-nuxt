<template>
  <section class="space-y-5">
    <MoleculesAlert
      v-if="!resource"
      type="warning"
      variant="left-accent"
      title="Resource Tidak Dikenal"
      description="Resource admin tidak ditemukan atau belum terdaftar dalam sistem."
    />
    <template v-else>
      <!-- Page Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div class="flex items-center gap-2">
            <p class="text-sm text-slate-500">Konten website</p>
            <span
              v-if="props.resourceKey === 'inquiries' && isSuperAdmin"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 border border-purple-200"
            >
              <span class="material-symbols-outlined text-xs">shield_person</span>
              Super Admin (CRUD Penuh)
            </span>
          </div>
          <h2 class="mt-1 text-2xl font-bold text-slate-900">
            {{ 
              isCreate 
                ? `Tambah ${resource.label.toLowerCase()}` 
                : isEditing 
                  ? `Edit ${resource.label.toLowerCase()}` 
                  : resource.label 
            }}
          </h2>
          <p v-if="!isFormView" class="mt-1 text-sm text-slate-500">
            {{ filteredRows.length }} data
          </p>
        </div>

        <!-- Search & Add Button (List View) -->
        <div v-if="!isFormView && canCreate" class="flex gap-2">
          <input 
            v-model="search" 
            type="search" 
            :placeholder="`Cari ${resource.label.toLowerCase()}...`" 
            class="h-10 min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
          >
          <NuxtLink 
            :to="`${basePath}/create`" 
            class="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white hover:bg-orange-600"
          >
            <span class="material-symbols-outlined text-lg">add</span>
            <span class="hidden sm:inline">Tambah</span>
          </NuxtLink>
        </div>

        <!-- Search Only (List View when cannot create) -->
        <input 
          v-else-if="!isFormView" 
          v-model="search" 
          type="search" 
          :placeholder="`Cari ${resource.label.toLowerCase()}...`" 
          class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-64"
        >
      </div>

      <!-- Error Message -->
      <MoleculesAlert 
        v-if="errorMessage" 
        type="error"
        variant="left-accent"
        :description="errorMessage"
        closeable
        @close="errorMessage = ''"
      />

      <div v-if="isFormView" class="rounded-lg border border-slate-200 bg-white p-4 sm:p-6">
        <form class="space-y-6" @submit.prevent="save">
          <div class="grid gap-5 md:grid-cols-2">
            <template v-for="field in resource.fields" :key="field.key">
              <!-- Skip auto-generated fields (slug, dll) — ditampilkan sebagai preview readonly -->
              <label 
                v-if="field.autoFrom"
                :class="['block space-y-2']"
              >
                <span class="text-sm font-semibold text-slate-700">
                  {{ field.label }}
                  <span class="ml-1.5 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                    <span class="material-symbols-outlined text-xs" style="font-size:12px">auto_fix_high</span>
                    Otomatis
                  </span>
                </span>
                <div class="flex h-10 w-full items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                  <span v-if="form[field.key]">{{ form[field.key] }}</span>
                  <span v-else class="italic text-slate-400">Akan otomatis dibuat dari nama…</span>
                </div>
              </label>

              <!-- Render field normal (semua kecuali autoFrom) -->
              <label 
                v-else
                :class="['block space-y-2', field.type === 'textarea' || field.type === 'list' ? 'md:col-span-2' : '']"
              >
                <span class="text-sm font-semibold text-slate-700">
                  {{ field.label }}
                  <span v-if="field.required" class="ml-1 text-red-500">*</span>
                </span>

                <!-- Image Upload -->
                <AtomsFileUpload 
                  v-if="field.type === 'image'" 
                  v-model="form[field.key]" 
                  :disabled="saving" 
                  @upload="uploadImage(field, $event)" 
                  @error="errorMessage = $event" 
                />

                <!-- Textarea / List -->
                <textarea 
                  v-else-if="field.type === 'textarea' || field.type === 'list'" 
                  v-model="form[field.key]" 
                  :rows="field.type === 'list' ? 5 : 4" 
                  :required="field.required" 
                  :readonly="isInquiryReadOnly(field.key)" 
                  :placeholder="field.type === 'list' ? 'Satu item per baris' : ''" 
                  class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 read-only:bg-slate-50"
                />

                <!-- Relation Dropdown dengan Quick Add -->
                <AtomsRelationSelect
                  v-else-if="field.type === 'relation'"
                  v-model="form[field.key]"
                  :options="relationOptions[field.key] ?? []"
                  :label="field.label"
                  :loading="relationLoading[field.key]"
                  :disabled="saving"
                  :relation-table="field.relationTable!"
                  :relation-label="field.relationLabel"
                  @refresh="refreshRelation(field)"
                />

                <!-- Boolean / Select Dropdown -->
                <select 
                  v-else-if="field.type === 'boolean' || field.type === 'select'" 
                  :value="field.type === 'boolean' ? (form[field.key] ? 'true' : 'false') : form[field.key]"
                  :disabled="isInquiryReadOnly(field.key)" 
                  class="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50"
                  @change="field.type === 'boolean' ? (form[field.key] = ($event.target as HTMLSelectElement).value === 'true') : (form[field.key] = ($event.target as HTMLSelectElement).value)"
                >
                  <option v-if="field.type === 'boolean'" value="true">Ya</option>
                  <option v-if="field.type === 'boolean'" value="false">Tidak</option>
                  <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
                </select>

                <!-- Currency Input -->
                <AtomsCurrencyInput 
                  v-else-if="field.type === 'number' && (field.key.includes('price') || field.key.includes('harga') || field.key.includes('biaya'))" 
                  v-model="form[field.key]" 
                  :required="field.required" 
                  :disabled="saving || isInquiryReadOnly(field.key)" 
                  :placeholder="`0`" 
                  show-preview 
                />

                <!-- Social Link Input (YouTube, Instagram, TikTok, dsb) -->
                <div v-else-if="field.type === 'social-link'" class="space-y-1.5">
                  <div class="relative flex items-center">
                    <div class="absolute left-3 flex items-center pointer-events-none">
                      <!-- YouTube Icon -->
                      <svg v-if="parsedSocial(form[field.key])?.platform === 'youtube'" class="w-4 h-4 fill-red-600" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <!-- Instagram Icon -->
                      <svg v-else-if="parsedSocial(form[field.key])?.platform === 'instagram' || field.socialPlatform === 'instagram'" class="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      <!-- TikTok Icon -->
                      <svg v-else-if="parsedSocial(form[field.key])?.platform === 'tiktok' || field.socialPlatform === 'tiktok'" class="w-4 h-4 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.69a8.19 8.19 0 004.78 1.52V6.76a4.85 4.85 0 01-1.02-.07z"/>
                      </svg>
                      <!-- Generic Link Icon -->
                      <span v-else class="material-symbols-outlined text-slate-400" style="font-size:16px">link</span>
                    </div>
                    <input
                      v-model="form[field.key]"
                      type="text"
                      :required="field.required"
                      :placeholder="field.placeholder || 'https://...'"
                      class="h-10 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <!-- Live detected badge & preview link -->
                  <div v-if="parsedSocial(form[field.key])" class="flex items-center gap-2 text-xs">
                    <span
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-white shadow-2xs"
                      :class="parsedSocial(form[field.key])!.badgeBg"
                    >
                      <span class="material-symbols-outlined text-xs leading-none">{{ parsedSocial(form[field.key])!.icon }}</span>
                      {{ parsedSocial(form[field.key])!.label }} Terdeteksi
                    </span>
                    <a
                      :href="parsedSocial(form[field.key])!.directUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 text-slate-600 hover:text-primary transition font-medium"
                    >
                      <span class="material-symbols-outlined text-xs">open_in_new</span>
                      Buka & Uji Link
                    </a>
                  </div>
                  <div v-else-if="form[field.key] && form[field.key].startsWith('http')" class="text-xs">
                    <a
                      :href="form[field.key]"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <span class="material-symbols-outlined" style="font-size:12px">open_in_new</span>
                      Buka link
                    </a>
                  </div>
                </div>

                <!-- Text / Number Input -->
                <input 
                  v-else-if="field.type !== 'image'" 
                  v-model="form[field.key]" 
                  :type="field.type === 'number' ? 'number' : field.type || 'text'" 
                  :min="field.key === 'rating' ? 1 : undefined" 
                  :max="field.key === 'rating' ? 5 : undefined" 
                  :required="field.required" 
                  :readonly="isInquiryReadOnly(field.key)" 
                  :step="field.type === 'number' ? 'any' : undefined" 
                  :placeholder="(field as any).placeholder || ''"
                  class="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 read-only:bg-slate-50"
                />
              </label>
            </template>
          </div>

          <!-- Form Actions -->
          <div class="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <NuxtLink 
              :to="basePath" 
              class="inline-flex h-10 items-center justify-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Kembali
            </NuxtLink>
            <button 
              type="submit" 
              :disabled="saving" 
              class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60"
            >
              <span v-if="saving" class="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>

      <div v-else class="space-y-4">
        <!-- Status Tabs Filter (Khusus Pesan Masuk / Inquiries) -->
        <div v-if="props.resourceKey === 'inquiries'" class="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
          <MoleculesStatusFilterTabs
            v-model="statusFilter"
            :tabs="inquiryStatusTabs"
          />
        </div>

        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <!-- Loading State -->
        <div v-if="loading" class="flex h-48 items-center justify-center gap-3 text-sm text-slate-500">
          <span class="material-symbols-outlined animate-spin">progress_activity</span>
          Memuat data...
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredRows.length" class="px-6 py-16 text-center">
          <span class="material-symbols-outlined text-4xl text-slate-300">inventory_2</span>
          <h3 class="mt-3 font-bold text-slate-800">Belum ada data</h3>
          <p class="mt-1 text-sm text-slate-500">
            Data {{ resource.label.toLowerCase() }} akan tampil di sini.
          </p>
        </div>

        <!-- Data Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[700px] text-left text-sm">
            <!-- Table Header -->
            <thead class="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th 
                  v-for="field in visibleFields" 
                  :key="field.key" 
                  class="px-4 py-3 font-semibold"
                >
                  {{ field.label }}
                </th>
                <th class="px-4 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="row in pageRows" 
                :key="String(row.id)" 
                class="hover:bg-slate-50/70"
              >
                <!-- Data Cells -->
                <td 
                  v-for="field in visibleFields" 
                  :key="field.key" 
                  class="px-4 py-3"
                >
                  <!-- Image Field -->
                  <MoleculesTableImageCell
                    v-if="field.type === 'image'"
                    :image-url="row[field.key]"
                    :item-name="row.name || row.customer_name || row.customer_company || 'Item'"
                  />
                  
                  <!-- Status Badge Field -->
                  <AtomsStatusBadge 
                    v-else-if="field.key === 'status'"
                    :status="String(row[field.key])"
                  />

                  <!-- Boolean Field -->
                  <span 
                    v-else-if="field.type === 'boolean'"
                    :class="row[field.key] ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700' : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500'"
                  >
                    {{ row[field.key] ? 'Aktif' : 'Nonaktif' }}
                  </span>
                  
                  <!-- Other Fields -->
                  <span v-else class="block truncate max-w-64 text-slate-700">
                    {{ displayValue(row[field.key], field) }}
                  </span>
                </td>

                <!-- Action Cells -->
                <td class="whitespace-nowrap px-4 py-3 text-right">
                  <NuxtLink 
                    :to="`${basePath}/${row.id}`" 
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary" 
                    :aria-label="`Edit ${resource.label}`"
                  >
                    <span class="material-symbols-outlined text-lg">
                      {{ (resource.allowCreate === false && !canCreate) ? 'visibility' : 'edit' }}
                    </span>
                  </NuxtLink>
                  <button 
                    v-if="canDelete" 
                    class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer" 
                    :aria-label="`Hapus ${resource.label}`" 
                    @click="confirmDelete(row)"
                  >
                    <span class="material-symbols-outlined text-lg">delete</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <footer v-if="filteredRows.length" class="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm text-slate-500">
          <span>
            {{ (currentPage - 1) * perPage + 1 }}–{{ Math.min(currentPage * perPage, filteredRows.length) }} dari {{ filteredRows.length }}
          </span>
          <div class="flex gap-2">
            <button 
              class="grid h-8 w-8 place-items-center rounded border border-slate-200 disabled:opacity-40" 
              aria-label="Halaman sebelumnya" 
              :disabled="currentPage <= 1" 
              @click="currentPage--"
            >
              <span class="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button 
              class="grid h-8 w-8 place-items-center rounded border border-slate-200 disabled:opacity-40" 
              aria-label="Halaman berikutnya" 
              :disabled="currentPage >= totalPages" 
              @click="currentPage++"
            >
              <span class="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </footer>
      </div>
      </div>
    </template>

    <!-- Confirm Delete Dialog -->
    <MoleculesConfirmDialog
      :visible="showDeleteDialog"
      type="danger"
      :title="`Hapus ${resource?.label || 'Data'}?`"
      :message="`Data '${deleteTarget?.name || deleteTarget?.company || deleteTarget?.customer_name || 'ini'}' akan dihapus secara permanen.`"
      confirm-label="Ya, Hapus"
      cancel-label="Batal"
      :loading="deleting"
      @confirm="executeDelete"
      @cancel="showDeleteDialog = false"
    />
  </section>
</template>

<script setup lang="ts">
import { adminResources, type AdminField } from '~/utils/adminResources';
import { parseSocialMedia } from '~/utils/socialEmbed';
import { useAuth } from '~/composables/useAuth';

const parsedSocial = (val: any) => parseSocialMedia(val);

const props = defineProps<{ resourceKey: string }>();
const route = useRoute();
const router = useRouter();
const { $supabase } = useNuxtApp();
const toast = useToast();
const { user, userRole, checkAuth } = useAuth();
const isSuperAdmin = computed(() => userRole.value === 'super_admin');

onMounted(async () => {
  await checkAuth();
});

const resource = computed(() => adminResources[props.resourceKey]);
const basePath = computed(() => `/admin/${props.resourceKey}`);
const recordId = computed(() => typeof route.params.id === 'string' ? route.params.id : '');
const isFormView = computed(() => Boolean(recordId.value));
const isCreate = computed(() => recordId.value === 'create');
const isEditing = computed(() => isFormView.value && !isCreate.value);
const rows = ref<Array<Record<string, any>>>([]);
const form = ref<Record<string, any>>({});
const loading = ref(true);
const saving = ref(false);
const search = ref('');
const errorMessage = ref('');
const currentPage = ref(1);
const perPage = 10;

// Dynamic permissions for Super Admin vs Regular Admin
const canCreate = computed(() => {
  if (!resource.value) return false;
  if (props.resourceKey === 'inquiries') {
    return isSuperAdmin.value;
  }
  return resource.value.allowCreate !== false;
});

const canDelete = computed(() => {
  if (!resource.value) return false;
  if (props.resourceKey === 'inquiries') {
    return isSuperAdmin.value;
  }
  return resource.value.allowDelete !== false;
});

// Status tabs filter state
const statusFilter = ref('all');

const inquiryStatusTabs = computed(() => {
  if (props.resourceKey !== 'inquiries') return [];
  const counts: Record<string, number> = {
    all: rows.value.length,
    new: 0,
    contacted: 0,
    converted: 0,
    archived: 0,
  };
  for (const r of rows.value) {
    if (r.status && counts[r.status] !== undefined) {
      counts[r.status]++;
    }
  }
  return [
    { value: 'all', label: 'Semua', count: counts.all, icon: 'inbox' },
    { value: 'new', label: 'Baru', count: counts.new, icon: 'mark_email_unread' },
    { value: 'contacted', label: 'Dihubungi', count: counts.contacted, icon: 'call' },
    { value: 'converted', label: 'Dikonversi', count: counts.converted, icon: 'verified' },
    { value: 'archived', label: 'Diarsipkan', count: counts.archived, icon: 'archive' },
  ];
});

// Relation dropdown state
const relationOptions = ref<Record<string, Array<{ label: string; value: string }>>>({});
const relationLoading = ref<Record<string, boolean>>({});

const visibleFields = computed(() => (resource.value?.fields ?? []).slice(0, 4));
const filteredRows = computed(() => {
  let list = rows.value;
  if (props.resourceKey === 'inquiries' && statusFilter.value !== 'all') {
    list = list.filter(row => row.status === statusFilter.value);
  }
  const query = search.value.trim().toLocaleLowerCase();
  if (!query || !resource.value) return list;
  return list.filter(row => resource.value!.searchable.some(key => String(row[key] ?? '').toLocaleLowerCase().includes(query)));
});
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / perPage)));
const pageRows = computed(() => filteredRows.value.slice((currentPage.value - 1) * perPage, currentPage.value * perPage));

const isInquiryReadOnly = (key: string) => {
  if (props.resourceKey !== 'inquiries') return false;
  if (isSuperAdmin.value) return false;
  return key !== 'status';
};
const displayValue = (value: unknown, field: AdminField) => {
  if (field.type === 'boolean') return value ? 'Aktif' : 'Nonaktif';
  if (value === null || value === undefined || value === '') return '-';
  if (field.type === 'select') return field.options?.find(option => option.value === String(value))?.label ?? String(value);
  // Untuk relation field, tampilkan label dari cached options
  if (field.type === 'relation') {
    return relationOptions.value[field.key]?.find(opt => opt.value === String(value))?.label ?? String(value);
  }
  return String(value);
};

/** Konversi string ke slug URL-safe */
const toSlug = (text: string) =>
  text.trim().toLocaleLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const resetForm = () => {
  const initial: Record<string, any> = {};
  for (const field of resource.value?.fields ?? []) {
    initial[field.key] = field.type === 'boolean'
      ? field.key === 'is_active'
      : field.type === 'number' ? null
        : field.type === 'list' ? ''
          : field.type === 'select' ? field.options?.[0]?.value ?? '' 
            : field.type === 'relation' ? ''
              : '';
  }
  form.value = initial;
};

/** Fetch opsi dropdown untuk semua field bertipe 'relation' */
const loadRelationOptions = async () => {
  if (!$supabase || !resource.value) return;

  const relationFields = resource.value.fields.filter(f => f.type === 'relation' && f.relationTable);

  for (const field of relationFields) {
    if (!field.relationTable) continue;
    relationLoading.value[field.key] = true;

    try {
      const labelCol = field.relationLabel ?? 'name';
      const { data, error } = await $supabase
        .from(field.relationTable)
        .select(`id, ${labelCol}`)
        .order(labelCol, { ascending: true });

      if (error) throw error;

      relationOptions.value[field.key] = (data ?? []).map((row: Record<string, any>) => ({
        label: String(row[labelCol] ?? row.id),
        value: String(row.id),
      }));
    } catch {
      relationOptions.value[field.key] = [];
    } finally {
      relationLoading.value[field.key] = false;
    }
  }
};

/** Refresh opsi untuk satu field relasi saja (dipanggil setelah Quick Add) */
const refreshRelation = async (field: AdminField) => {
  if (!$supabase || !field.relationTable) return;
  relationLoading.value[field.key] = true;

  try {
    const labelCol = field.relationLabel ?? 'name';
    const { data, error } = await $supabase
      .from(field.relationTable)
      .select(`id, ${labelCol}`)
      .order(labelCol, { ascending: true });

    if (error) throw error;

    relationOptions.value[field.key] = (data ?? []).map((row: Record<string, any>) => ({
      label: String(row[labelCol] ?? row.id),
      value: String(row.id),
    }));
  } catch {
    // Gagal refresh, biarkan opsi lama tetap ada
  } finally {
    relationLoading.value[field.key] = false;
  }
};

const load = async () => {
  loading.value = true;
  errorMessage.value = '';
  if (!resource.value) {
    errorMessage.value = 'Resource admin tidak dikenal.';
    loading.value = false;
    return;
  }
  if (!$supabase) {
    errorMessage.value = 'Konfigurasi Supabase belum terbaca. Periksa file .env lalu restart server Nuxt.';
    loading.value = false;
    return;
  }
  try {
    if (isFormView.value) {
      // Selalu load relation options saat form view
      await loadRelationOptions();

      if (isCreate.value) {
        resetForm();
      } else {
        const { data, error } = await $supabase.from(resource.value.table).select('*').eq('id', recordId.value).single();
        if (error) throw error;
        form.value = { ...data };
        for (const field of resource.value.fields) {
          if (field.type === 'list' && Array.isArray(form.value[field.key])) form.value[field.key] = form.value[field.key].join('\n');
          // Konversi relation value ke string untuk kompatibilitas dengan v-model select
          if (field.type === 'relation' && form.value[field.key] != null) {
            form.value[field.key] = String(form.value[field.key]);
          }
        }
      }
    } else {
      // List view: load relation options untuk tampil di tabel jika ada kolom relation
      const hasRelationInVisible = visibleFields.value.some(f => f.type === 'relation');
      if (hasRelationInVisible) await loadRelationOptions();

      const { data, error } = await $supabase.from(resource.value.table).select('*').order('created_at', { ascending: false });
      if (error) throw error;
      rows.value = data ?? [];
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal memuat data.';
  } finally {
    loading.value = false;
  }
};

const save = async () => {
  if (!$supabase || !resource.value) return;
  saving.value = true;
  errorMessage.value = '';
  try {
    // Pastikan slug sudah terisi (auto-generate jika belum)
    for (const field of resource.value.fields) {
      if (field.autoFrom && (!form.value[field.key] || form.value[field.key] === '')) {
        const sourceValue = form.value[field.autoFrom];
        if (typeof sourceValue === 'string' && sourceValue.trim()) {
          form.value[field.key] = toSlug(sourceValue);
        }
      }
    }

    const missingField = resource.value.fields.find(field => field.required && !form.value[field.key]);
    if (missingField) throw new Error(`${missingField.label} wajib diisi.`);

    const payload: Record<string, unknown> = {};
    for (const field of resource.value.fields) {
      let value = form.value[field.key];
      if (field.type === 'list') value = String(value ?? '').split('\n').map((item: string) => item.trim()).filter(Boolean);
      if (field.type === 'number') {
        if (value === '' || value === undefined || value === null) {
          value = null;
        } else {
          value = parseFloat(String(value));
          if (isNaN(value)) value = null;
        }
      }
      if (field.type === 'boolean') value = value === true || value === 'true';
      // Relation: simpan sebagai string UUID (atau null jika kosong)
      if (field.type === 'relation') value = value === '' ? null : value;
      payload[field.key] = value;
    }

    if (isCreate.value) {
      if (props.resourceKey === 'inquiries') {
        payload.source = 'admin_manual';
        if (!payload.status) payload.status = 'new';
      }
      const { error } = await $supabase.from(resource.value.table).insert(payload);
      if (error) throw error;
      toast.success(`${resource.value.label} berhasil ditambahkan`);
    } else {
      // For update, only include fields that are defined in the resource config
      const updatePayload: Record<string, unknown> = {};
      for (const field of resource.value.fields) {
        if (props.resourceKey === 'inquiries' && !isSuperAdmin.value && field.key !== 'status') {
          // Skip non-status fields for inquiries (read-only for non-superadmin)
          continue;
        }
        updatePayload[field.key] = payload[field.key];
      }
      
      const { error } = await $supabase.from(resource.value.table).update(updatePayload).eq('id', recordId.value);
      if (error) throw error;
      toast.success(`${resource.value.label} berhasil diperbarui`);
    }
    await navigateTo(basePath.value);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal menyimpan data.';
    toast.error(errorMessage.value);
  } finally {
    saving.value = false;
  }
};

const uploadImage = async (field: AdminField, file: File) => {
  const { upload, validateFile } = useCloudinary();
  saving.value = true;
  errorMessage.value = '';
  
  try {
    // Validate file
    const validation = validateFile(file, {
      maxSize: 5,
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    });
    
    if (!validation.valid) {
      throw new Error(validation.error || 'File validation failed');
    }
    
    // Upload to Cloudinary with folder from field.bucket
    const result = await upload(file, {
      folder: field.bucket || 'uploads',
    });
    
    if (!result) {
      throw new Error('Upload to Cloudinary failed');
    }
    
    // Set the image URL in form
    form.value[field.key] = result.url;
    toast.success(`Gambar berhasil diunggah ke Cloudinary`);
    
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Gagal mengunggah gambar.';
    toast.error(errorMessage.value);
  } finally {
    saving.value = false;
  }
};

// Modal Delete state & actions
const showDeleteDialog = ref(false);
const deleteTarget = ref<Record<string, any> | null>(null);
const deleting = ref(false);

const confirmDelete = (row: Record<string, any>) => {
  deleteTarget.value = row;
  showDeleteDialog.value = true;
};

const executeDelete = async () => {
  if (!$supabase || !resource.value || !deleteTarget.value) return;
  deleting.value = true;
  errorMessage.value = '';
  try {
    const { error } = await $supabase.from(resource.value.table).delete().eq('id', deleteTarget.value.id);
    if (error) throw error;
    rows.value = rows.value.filter(item => item.id !== deleteTarget.value!.id);
    toast.success(`${resource.value.label} berhasil dihapus`);
    showDeleteDialog.value = false;
    deleteTarget.value = null;
  } catch (err: any) {
    errorMessage.value = err.message || 'Gagal menghapus data';
    toast.error(`Gagal menghapus ${resource.value.label.toLowerCase()}: ${err.message}`);
  } finally {
    deleting.value = false;
  }
};

const removeRow = async (row: Record<string, any>) => {
  confirmDelete(row);
};

// Auto-generate slug secara real-time saat field sumber (autoFrom) berubah
watch(
  () => form.value,
  (newForm) => {
    if (!resource.value || !isFormView.value) return;
    for (const field of resource.value.fields) {
      if (!field.autoFrom) continue;
      const sourceValue = newForm[field.autoFrom];
      if (typeof sourceValue === 'string') {
        form.value[field.key] = toSlug(sourceValue);
      }
    }
  },
  { deep: true }
);

watch(() => [props.resourceKey, recordId.value], () => {
  currentPage.value = 1;
  search.value = '';
  statusFilter.value = 'all';
  resetForm();
  void load();
}, { immediate: true });
watch(statusFilter, () => { currentPage.value = 1; });
watch(search, () => { currentPage.value = 1; });
</script>