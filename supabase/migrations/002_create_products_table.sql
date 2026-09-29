-- Products and clicks tables for DealFinder catalog
-- Run with: psql -d deal-finder -f this_file.sql
-- Or use the Supabase SQL editor.

-- ============================================================
-- PRODUCTS TABLE
-- ============================================================

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
  original_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  discount_percent NUMERIC NOT NULL,
  coupon_code TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  verified_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_source ON products(source);

-- ============================================================
-- CLICKS TABLE (click tracking)
-- ============================================================

CREATE TABLE IF NOT EXISTS clicks (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clicks_product_id ON clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_clicks_created_at ON clicks(created_at);

ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read: approved + expired products visible to everyone
CREATE POLICY "Public can view approved and expired products"
  ON products FOR SELECT
  USING (status = 'approved' OR status = 'expired');

-- Service role bypasses RLS — no additional policies needed for admin operations.

-- Public cannot insert/update/delete products directly.
-- Admin operations go through server-side code with service role key.

-- Clicks: anyone can insert (tracking), anyone can read their own (not implemented — simplified)
CREATE POLICY "Anyone can insert clicks"
  ON clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view clicks"
  ON clicks FOR SELECT
  USING (true);
