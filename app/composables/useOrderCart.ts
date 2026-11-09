import { ref, computed, watch, onMounted } from 'vue';
import type { Product } from '~/types/product';
import type { CartItem, OrderCustomerInfo, OrderUnit } from '~/types/cart';

const STORAGE_KEY = 'cvbi_order_cart_items';
const CUSTOMER_KEY = 'cvbi_order_customer_info';

export const useOrderCart = () => {
  // Shared reactive state
  const items = useState<CartItem[]>('order_cart_items', () => []);
  const isCartOpen = useState<boolean>('order_cart_is_open', () => false);
  const isHydrated = useState<boolean>('order_cart_hydrated', () => false);

  // Default customer info
  const customerInfo = useState<OrderCustomerInfo>('order_cart_customer', () => ({
    storeName: '',
    customerName: '',
    phone: '',
    city: 'Banjarmasin',
    address: '',
    paymentPreference: 'Transfer Bank',
    notes: '',
  }));

  // Hydrate from localStorage once on client
  onMounted(() => {
    if (!isHydrated.value && import.meta.client) {
      try {
        const savedItems = localStorage.getItem(STORAGE_KEY);
        if (savedItems) {
          items.value = JSON.parse(savedItems);
        }
        const savedCustomer = localStorage.getItem(CUSTOMER_KEY);
        if (savedCustomer) {
          customerInfo.value = { ...customerInfo.value, ...JSON.parse(savedCustomer) };
        }
      } catch (err) {
        console.warn('Failed to load order cart from storage:', err);
      } finally {
        isHydrated.value = true;
      }
    }
  });

  // Watch & persist to localStorage on client
  if (import.meta.client) {
    watch(
      items,
      (newItems) => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
        } catch (e) {
          console.warn('Failed to persist cart items:', e);
        }
      },
      { deep: true }
    );

    watch(
      customerInfo,
      (newInfo) => {
        try {
          localStorage.setItem(CUSTOMER_KEY, JSON.stringify(newInfo));
        } catch (e) {
          console.warn('Failed to persist customer info:', e);
        }
      },
      { deep: true }
    );
  }

  // Computed totals
  const totalItemsCount = computed(() => items.value.length);
  const totalUnitsCount = computed(() => {
    return items.value.reduce((acc, item) => acc + (item.quantity || 1), 0);
  });
  const isCartEmpty = computed(() => items.value.length === 0);

  // Add product to cart
  const addToCart = (product: Product, quantity = 1, unit: OrderUnit = 'Karton', notes = '') => {
    const existingIndex = items.value.findIndex((item) => item.product.id === product.id && item.unit === unit);

    if (existingIndex > -1) {
      items.value[existingIndex].quantity += quantity;
      if (notes) {
        items.value[existingIndex].notes = notes;
      }
    } else {
      items.value.push({
        product,
        quantity: Math.max(1, quantity),
        unit,
        notes,
      });
    }
  };

  // Remove item
  const removeFromCart = (productId: string, unit?: OrderUnit) => {
    if (unit) {
      items.value = items.value.filter((item) => !(item.product.id === productId && item.unit === unit));
    } else {
      items.value = items.value.filter((item) => item.product.id !== productId);
    }
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number, unit: OrderUnit) => {
    const item = items.value.find((i) => i.product.id === productId && i.unit === unit);
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId, unit);
      } else {
        item.quantity = quantity;
      }
    }
  };

  // Update item unit
  const updateUnit = (productId: string, oldUnit: OrderUnit, newUnit: OrderUnit) => {
    const item = items.value.find((i) => i.product.id === productId && i.unit === oldUnit);
    if (item) {
      item.unit = newUnit;
    }
  };

  // Clear all items
  const clearCart = () => {
    items.value = [];
  };

  // Toggle drawer
  const openCart = () => {
    isCartOpen.value = true;
  };

  const closeCart = () => {
    isCartOpen.value = false;
  };

  const toggleCart = () => {
    isCartOpen.value = !isCartOpen.value;
  };

  // Format WhatsApp Message for B2B Order Inquiry
  const generateWhatsAppOrderUrl = () => {
    const waNumber = '6285124502615';

    if (items.value.length === 0) {
      return `https://wa.me/${waNumber}?text=${encodeURIComponent('Halo CV Banjar Indah, saya ingin menanyakan informasi pemesanan produk grosir.')}`;
    }

    let message = `*PERMINTAAN ORDER GROSIR - CV BANJAR INDAH*\n`;
    message += `-------------------------------------------\n\n`;

    message += `*📦 DAFTAR BARANG YANG DIPESAN:*\n`;
    items.value.forEach((item, index) => {
      message += `${index + 1}. *${item.product.name}*\n`;
      message += `   • Kategori : ${item.product.category}\n`;
      message += `   • Jumlah   : *${item.quantity} ${item.unit}*\n`;
      if (item.notes) {
        message += `   • Catatan  : ${item.notes}\n`;
      }
      message += `\n`;
    });

    message += `-------------------------------------------\n`;
    message += `*🏪 DATA TOKO / PEMESAN:*\n`;
    if (customerInfo.value.storeName) {
      message += `• Nama Toko : ${customerInfo.value.storeName}\n`;
    }
    if (customerInfo.value.customerName) {
      message += `• Nama PIC  : ${customerInfo.value.customerName}\n`;
    }
    if (customerInfo.value.phone) {
      message += `• No. Telepon : ${customerInfo.value.phone}\n`;
    }
    if (customerInfo.value.city) {
      message += `• Kota/Kabupaten : ${customerInfo.value.city}\n`;
    }
    if (customerInfo.value.address) {
      message += `• Alamat Kirim : ${customerInfo.value.address}\n`;
    }
    if (customerInfo.value.paymentPreference) {
      message += `• Preferensi Bayar : ${customerInfo.value.paymentPreference}\n`;
    }
    if (customerInfo.value.notes) {
      message += `• Catatan Tambahan : ${customerInfo.value.notes}\n`;
    }

    message += `\nMohon informasi total harga grosir, ketersediaan stok, dan jadwal pengiriman ke lokasi kami. Terima kasih!`;

    return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  };

  return {
    items,
    customerInfo,
    isCartOpen,
    totalItemsCount,
    totalUnitsCount,
    isCartEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateUnit,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    generateWhatsAppOrderUrl,
  };
};

