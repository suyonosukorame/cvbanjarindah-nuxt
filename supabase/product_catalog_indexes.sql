CREATE INDEX IF NOT EXISTS idx_products_active_created_at
  ON public.products(created_at DESC)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_products_active_category_created_at
  ON public.products(category_id, created_at DESC)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_products_active_brand_created_at
  ON public.products(brand_id, created_at DESC)
  WHERE status = 'active';
