-- ============================================================================
-- Books: progress_percent + progress_step (Book Generation Progress - Faz 1)
-- ============================================================================
-- Kitap oluşturma ilerlemesini (%) ve mevcut adımı takip eder.
-- BullMQ worker her adımda bu alanları günceller; frontend polling yapar.
-- Tek blok olarak çalıştırın.
-- ============================================================================

BEGIN;

ALTER TABLE books
  ADD COLUMN IF NOT EXISTS progress_percent INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS progress_step    VARCHAR(100) DEFAULT '';

COMMENT ON COLUMN books.progress_percent IS 'Kitap oluşturma ilerlemesi (0-100). Worker her adımda günceller.';
COMMENT ON COLUMN books.progress_step    IS 'Mevcut adım etiketi: story_generating, master_generating, cover_generating, pages_generating, tts_generating, completed, failed';

COMMIT;
