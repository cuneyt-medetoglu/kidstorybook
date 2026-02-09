-- ============================================================================
-- Global TTS settings (admin-configurable defaults for voice, prompt, language)
-- ============================================================================
-- Purpose: Store global TTS defaults; admin can set via UI, all users hear these settings.
-- Reference: docs/analysis/TTS_GOOGLE_GEMINI_ANALYSIS.md §1.5

CREATE TABLE IF NOT EXISTS public.tts_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  voice_name TEXT NOT NULL DEFAULT 'Achernar',
  prompt TEXT NOT NULL DEFAULT 'Çocuk hikayesi anlatır gibi enerjik, heyecanlı ve sıcak bir tonda konuş.',
  language_code TEXT NOT NULL DEFAULT 'tr',
  model_name TEXT NOT NULL DEFAULT 'gemini-2.5-pro-tts',
  speaking_rate DECIMAL(3,2) NOT NULL DEFAULT 1.0 CHECK (speaking_rate >= 0.25 AND speaking_rate <= 4.0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.tts_settings IS 'Single-row global TTS defaults; admin edits, all users hear.';

-- Ensure single row (IDE kırmızı çizgi: tablo henüz yoksa gösterir; scripti baştan sona çalıştırınca önce CREATE çalışır, sonra INSERT geçerli olur)
INSERT INTO public.tts_settings (id, voice_name, prompt, language_code, model_name, speaking_rate)
VALUES (1, 'Achernar', 'Çocuk hikayesi anlatır gibi enerjik, heyecanlı ve sıcak bir tonda konuş.', 'tr', 'gemini-2.5-pro-tts', 1.0)
ON CONFLICT (id) DO NOTHING;
