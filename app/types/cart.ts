import type { Product } from './product';

export type OrderUnit = 'Karton' | 'Dus' | 'Lusin' | 'Bal' | 'Pcs';

export interface CartItem {
  product: Product;
  quantity: number;
  unit: OrderUnit;
  notes?: string;
}

export interface OrderCustomerInfo {
  storeName: string;
  customerName: string;
  phone?: string;
  city: string;
  address?: string;
  paymentPreference: 'Transfer Bank' | 'COD Toko' | 'Tempo B2B / DP' | 'Belum Tahu';
  notes?: string;
}

