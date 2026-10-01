-- Tighten the initial policies for deployments that already ran migrations 001/002.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS consent_accepted_at TIMESTAMPTZ;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'verified_at'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE products RENAME COLUMN verified_at TO published_at;
  END IF;
END $$;

ALTER TABLE products
  ALTER COLUMN expires_at TYPE DATE
  USING expires_at::date;

DROP POLICY IF EXISTS "Public can view approved and expired products" ON products;
DROP POLICY IF EXISTS "Public can view current approved products" ON products;
CREATE POLICY "Public can view current approved products"
  ON products FOR SELECT TO anon, authenticated
  USING (status = 'approved' AND (expires_at IS NULL OR expires_at >= CURRENT_DATE));

DROP POLICY IF EXISTS "public_insert" ON submissions;
DROP POLICY IF EXISTS "public_select_deny" ON submissions;
DROP POLICY IF EXISTS "public_update_deny" ON submissions;
DROP POLICY IF EXISTS "public_delete_deny" ON submissions;
DROP POLICY IF EXISTS "Anyone can insert clicks" ON clicks;
DROP POLICY IF EXISTS "Anyone can view clicks" ON clicks;

CREATE INDEX IF NOT EXISTS idx_products_product_url ON products(product_url);
