<template>
  <div class="space-y-4">
    <!-- Header with search & actions -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex-1">
        <label class="relative block">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pengguna (nama, email)..."
            class="h-10 w-full rounded-lg border border-slate-300 bg-white pl-4 pr-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            search
          </span>
        </label>
      </div>
      <div class="flex gap-2">
        <!-- Filter by role -->
        <div v-if="roles.length" class="relative">
          <select
            v-model="selectedRole"
            class="h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Semua Role</option>
            <option v-for="role in roles" :key="role" :value="role">
              {{ formatRole(role) }}
            </option>
          </select>
        </div>

        <!-- Filter by status -->
        <div class="relative">
          <select
            v-model="selectedStatus"
            class="h-10 px-3 text-sm rounded-lg border border-slate-300 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
            <option value="pending">Tertunda</option>
          </select>
        </div>

        <!-- Action slot -->
        <slot name="actions" />
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto rounded-lg border border-slate-200">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700 w-10">
              <input
                type="checkbox"
                :checked="allSelected"
                @change="toggleSelectAll"
                class="w-4 h-4 rounded border-slate-300 cursor-pointer"
              />
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700">Pengguna</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700">Email</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700">Role</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700">Status</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-slate-700">Bergabung</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-slate-700 w-20">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in paginatedUsers"
            :key="user.id"
            class="border-b border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <!-- Checkbox -->
            <td class="px-4 py-3">
              <input
                type="checkbox"
                :checked="selectedUsers.has(user.id)"
                @change="toggleUserSelection(user.id)"
                class="w-4 h-4 rounded border-slate-300 cursor-pointer"
              />
            </td>

            <!-- User info with avatar -->
            <td class="px-4 py-3 text-sm">
              <div class="flex items-center gap-3">
                <UserAvatar :name="user.name" :url="user.avatar_url" size="sm" />
                <span class="font-medium text-slate-900">{{ user.name }}</span>
              </div>
            </td>

            <!-- Email -->
            <td class="px-4 py-3 text-sm text-slate-600">
              {{ user.email }}
            </td>

            <!-- Role -->
            <td class="px-4 py-3 text-sm">
              <RoleBadge :role="user.role" />
            </td>

            <!-- Status -->
            <td class="px-4 py-3 text-sm">
              <StatusBadge :status="user.status" />
            </td>

            <!-- Joined date -->
            <td class="px-4 py-3 text-sm text-slate-600">
              {{ formatDate(user.created_at) }}
            </td>

            <!-- Actions -->
            <td class="px-4 py-3 text-center">
              <slot name="rowActions" :user="user" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div
        v-if="filteredUsers.length === 0"
        class="flex items-center justify-center p-8"
      >
        <EmptyState
          icon="person_off"
          title="Tidak ada pengguna"
          description="Belum ada pengguna dengan kriteria pencarian ini"
          variant="info"
        />
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && filteredUsers.length > 0" class="flex items-center justify-between text-sm text-slate-600">
      <span>
        Menampilkan {{ startIndex + 1 }} hingga {{ endIndex }} dari {{ filteredUsers.length }} pengguna
      </span>
      <div class="flex gap-2">
        <button
          :disabled="currentPage === 0"
          class="px-3 py-1 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
          @click="currentPage--"
        >
          Sebelumnya
        </button>
        <span class="px-3 py-1 text-xs">Halaman {{ currentPage + 1 }} dari {{ totalPages }}</span>
        <button
          :disabled="currentPage >= totalPages - 1"
          class="px-3 py-1 rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-medium"
          @click="currentPage++"
        >
          Berikutnya
        </button>
      </div>
    </div>

    <!-- Bulk actions bar -->
    <transition name="slide-up">
      <div
        v-if="selectedUsers.size > 0"
        class="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 flex items-center justify-between shadow-lg z-40"
      >
        <span class="text-sm font-medium">
          {{ selectedUsers.size }} pengguna dipilih
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-slate-700 bg-white rounded-lg hover:bg-slate-100 transition-colors"
            @click="clearSelection"
          >
            Batal
          </button>
          <slot name="bulkActions" :selected-users="Array.from(selectedUsers)" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'director' | 'manager' | 'editor' | 'employee' | 'supervisor' | 'staff' | 'guest'
  status: 'active' | 'inactive' | 'pending'
  avatar_url?: string
  created_at: string
}

interface Props {
  users: User[]
  roles?: string[]
  pagination?: boolean
  pageSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  pagination: true,
  pageSize: 10,
  roles: () => []
})

const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(0)
const selectedUsers = ref(new Set<string>())

const filteredUsers = computed(() => {
  let filtered = props.users

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  // Role filter
  if (selectedRole.value) {
    filtered = filtered.filter(user => user.role === selectedRole.value)
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(user => user.status === selectedStatus.value)
  }

  return filtered
})

const paginatedUsers = computed(() => {
  if (!props.pagination) return filteredUsers.value

  const start = currentPage.value * props.pageSize
  return filteredUsers.value.slice(start, start + props.pageSize)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredUsers.value.length / props.pageSize))
})

const startIndex = computed(() => currentPage.value * props.pageSize)
const endIndex = computed(() => Math.min(startIndex.value + props.pageSize, filteredUsers.value.length))

const allSelected = computed(() => {
  return filteredUsers.value.length > 0 && filteredUsers.value.every(user => selectedUsers.value.has(user.id))
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatRole = (role: string) => {
  const roles: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    supervisor: 'Supervisor',
    staff: 'Staff',
    guest: 'Guest'
  }
  return roles[role] || role
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    filteredUsers.value.forEach(user => selectedUsers.value.delete(user.id))
  } else {
    filteredUsers.value.forEach(user => selectedUsers.value.add(user.id))
  }
}

const toggleUserSelection = (userId: string) => {
  if (selectedUsers.value.has(userId)) {
    selectedUsers.value.delete(userId)
  } else {
    selectedUsers.value.add(userId)
  }
}

const clearSelection = () => {
  selectedUsers.value.clear()
}

defineExpose({
  selectedUsers: selectedUsers.value,
  clearSelection
})

const emit = defineEmits<{
  'selection-change': [selected: Set<string>]
}>()

watch(selectedUsers, (newSelected) => {
  emit('selection-change', newSelected)
}, { deep: true })

watch([searchQuery, selectedRole, selectedStatus], () => {
  currentPage.value = 0
})

watch(() => props.users.length, () => {
  currentPage.value = 0
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
