-- ============================================================================
-- Add missing columns to tts_settings (if table was created without them)
-- ============================================================================
-- Run this if SELECT * FROM tts_settings does not show model_name, speaking_rate, updated_at.
-- If a column already exists, you will get "duplicate column" error for that line; skip that line or run one ALTER at a time.

ALTER TABLE public.tts_settings ADD COLUMN IF NOT EXISTS model_name TEXT DEFAULT 'gemini-2.5-pro-tts';
ALTER TABLE public.tts_settings ADD COLUMN IF NOT EXISTS speaking_rate DECIMAL(3,2) DEFAULT 1.0;
ALTER TABLE public.tts_settings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.tts_settings SET model_name = 'gemini-2.5-pro-tts' WHERE model_name IS NULL;
UPDATE public.tts_settings SET speaking_rate = 1.0 WHERE speaking_rate IS NULL;
UPDATE public.tts_settings SET updated_at = NOW() WHERE updated_at IS NULL;

ALTER TABLE public.tts_settings ALTER COLUMN model_name SET NOT NULL;
ALTER TABLE public.tts_settings ALTER COLUMN speaking_rate SET NOT NULL;
ALTER TABLE public.tts_settings ALTER COLUMN updated_at SET NOT NULL;

-- Optional: limit speed range (uncomment if you want)
-- ALTER TABLE public.tts_settings ADD CONSTRAINT tts_settings_speaking_rate_check CHECK (speaking_rate >= 0.25 AND speaking_rate <= 4.0);
