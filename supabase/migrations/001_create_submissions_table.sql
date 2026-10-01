-- Seller deal submissions. All database access is performed server-side with
-- the Supabase service-role key after server-side validation and authorization.
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_shop_url TEXT NOT NULL,
  product_url TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  original_price NUMERIC NOT NULL CHECK (original_price > 0),
  discounted_price NUMERIC NOT NULL CHECK (discounted_price > 0 AND discounted_price <= original_price),
  coupon_code TEXT,
  expires_at DATE,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  consent_accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_category ON submissions(category);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Deliberately create no anon/authenticated policies. Public submissions go
-- through the validated server action; admin reads/writes use service role.
DROP POLICY IF EXISTS "public_insert" ON submissions;
DROP POLICY IF EXISTS "public_select_deny" ON submissions;
DROP POLICY IF EXISTS "public_update_deny" ON submissions;
DROP POLICY IF EXISTS "public_delete_deny" ON submissions;
