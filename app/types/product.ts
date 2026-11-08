export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  featured?: boolean;
  price?: number | null;
  stock?: number;
  brandId?: string | null;
  brand?: string;
  createdAt?: string;
}

export interface ProductFilterOption {
  id: string;
  name: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
}
