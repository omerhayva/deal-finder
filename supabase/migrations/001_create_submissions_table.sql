-- ============================================================
-- Migration: 001_create_submissions_table
-- Created: 2026-09-24
-- Description: Tablo submissions oluşturur. Satıcı submission'ları için.
-- Run with: psql -h <host> -d <db> -U <user> -f this_file.sql
-- Dikkat: Bu SQL'i UPGRADE etmek üzere tasarlanmadı, sadece ilk kurulum.
-- ============================================================

-- UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tablo
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  seller_shop_url   TEXT    NOT NULL,
  product_url       TEXT    NOT NULL,
  title             TEXT    NOT NULL,
  image_url         TEXT,

  original_price    NUMERIC NOT NULL,
  discounted_price  NUMERIC NOT NULL,

  coupon_code       TEXT,
  expires_at        DATE,

  category          TEXT    NOT NULL,
  description       TEXT,

  status            TEXT    NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_submissions_status        ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at    ON submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_category      ON submissions(category);

-- Row Level Security (RLS)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 1. Public kullanıcılar sadece INSERT yapabilir (submission oluşturabilir)
--    Auth henüz yok, ama ileride "_do_only_from_form_" mantığıyla sınırlanabilir.
CREATE POLICY "public_insert" ON submissions
  FOR INSERT TO public
  WITH CHECK (true);

-- 2. Public kullanıcılar SELECT yapamaz (admin/endpoint tarafından service key ile donebilir)
CREATE POLICY "public_select_deny" ON submissions
  FOR SELECT TO public
  USING (false);

-- 3. Public kullanıcılar UPDATE yapamaz (sadece admin/service key)
CREATE POLICY "public_update_deny" ON submissions
  FOR UPDATE TO public
  USING (false)
  WITH CHECK (false);

-- 4. Public kullanıcılar DELETE yapamaz
CREATE POLICY "public_delete_deny" ON submissions
  FOR DELETE TO public
  USING (false);

-- NOTLAR:
-- - Bu migration'da admin auth yok. Admin işlemleri (list, approve, reject)
--   SERVER SIDE service role key ile yapılır, bu nedenle RLS bypass olur.
-- - İleride admin auth eklendiğinde, admin role'a SELECT/UPDATE izni verebilir,
--   ve public policy'leri daha sıkı hale getirebilirsiniz.
-- - İleride seller auth eklendiğinde, INSERT policy'sini "sadece auth'ed seller" olarak
--   kısıtlayabilirsiniz. Şu an development için herkes submit yapabilir.
