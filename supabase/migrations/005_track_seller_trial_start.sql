-- The seller's 30-day free trial starts when their first listing is approved.
-- Etsy shop URLs are the seller identity until seller accounts are introduced.
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Preserve a reasonable trial start date for already-approved legacy submissions.
UPDATE submissions
SET approved_at = created_at
WHERE status = 'approved'
  AND approved_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_shop_approved_at
  ON submissions (seller_shop_url, approved_at)
  WHERE status = 'approved' AND approved_at IS NOT NULL;
