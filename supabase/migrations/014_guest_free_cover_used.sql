-- ============================================================================
-- guest_free_cover_used
-- ============================================================================
-- Üyesiz kullanıcıların 1 ücretsiz kapak hakkı kullanımı (email bazlı).
-- Step 6: PAY Gizleme + Üyesiz Ücretsiz Kapak (Email + IP) spec.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.guest_free_cover_used (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  used_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT guest_free_cover_used_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_guest_free_cover_used_email ON public.guest_free_cover_used(email);

COMMENT ON TABLE public.guest_free_cover_used IS 'Üyesiz kullanıcıların 1 ücretsiz kapak hakkı kullanımı (email bazlı).';

-- drafts: guest (user_id null) insert için RLS
CREATE POLICY "Allow guest draft insert"
  ON public.drafts
  FOR INSERT
  WITH CHECK (user_id IS NULL AND auth.uid() IS NULL);
