-- Public deal catalogue and private outbound-click counters.

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  shop_name TEXT NOT NULL,
  product_url TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  source_id TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  original_price NUMERIC NOT NULL CHECK (original_price > 0),
  discounted_price NUMERIC NOT NULL CHECK (discounted_price > 0 AND discounted_price <= original_price),
  currency TEXT NOT NULL DEFAULT 'USD',
  discount_percent NUMERIC NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
  coupon_code TEXT,
  expires_at DATE,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);
CREATE INDEX IF NOT EXISTS idx_products_product_url ON products(product_url);

CREATE TABLE IF NOT EXISTS clicks (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  referrer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clicks_product_id ON clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at DESC);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved and expired products" ON products;
DROP POLICY IF EXISTS "Public can view current approved products" ON products;
CREATE POLICY "Public can view current approved products"
  ON products FOR SELECT TO anon, authenticated
  USING (status = 'approved' AND (expires_at IS NULL OR expires_at >= CURRENT_DATE));

-- Click records are private. The server-role client records them and no
-- anon/authenticated policy is granted for inserts or reads.
DROP POLICY IF EXISTS "Anyone can insert clicks" ON clicks;
DROP POLICY IF EXISTS "Anyone can view clicks" ON clicks;
