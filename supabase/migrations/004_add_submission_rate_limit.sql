-- Per-source spam throttle for public submissions. A keyed HMAC fingerprint,
-- never a raw IP address, is provided by the server and records expire from
-- the active window after 24 hours (pruned on subsequent submission attempts).
CREATE TABLE IF NOT EXISTS submission_rate_limits (
  client_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT submission_rate_limits_fingerprint_format
    CHECK (client_fingerprint ~ '^[a-f0-9]{64}$')
);

CREATE INDEX IF NOT EXISTS idx_submission_rate_limits_fingerprint_created
  ON submission_rate_limits(client_fingerprint, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submission_rate_limits_created
  ON submission_rate_limits(created_at);

ALTER TABLE submission_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE submission_rate_limits FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE submission_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.allow_deal_submission(p_client_fingerprint TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  recent_attempts INTEGER;
BEGIN
  IF p_client_fingerprint !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid submission fingerprint';
  END IF;

  -- Serialize attempts with the same fingerprint so concurrent submissions
  -- cannot bypass the limit.
  PERFORM pg_advisory_xact_lock(hashtextextended(p_client_fingerprint, 0));

  DELETE FROM public.submission_rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';

  SELECT COUNT(*)::INTEGER INTO recent_attempts
  FROM public.submission_rate_limits
  WHERE client_fingerprint = p_client_fingerprint
    AND created_at > NOW() - INTERVAL '1 hour';

  IF recent_attempts >= 5 THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.submission_rate_limits (client_fingerprint) VALUES (p_client_fingerprint);
  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.allow_deal_submission(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.allow_deal_submission(TEXT) TO service_role;
