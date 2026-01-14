-- ============================================================================
-- TTS Cache Storage Bucket
-- ============================================================================
-- Creates storage bucket for caching TTS audio files
-- This reduces costs by serving cached audio instead of re-generating
-- Created: 2026-01-15
-- Version: 1.0.0

-- ============================================================================
-- Create Bucket
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'tts-cache') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'tts-cache',
      'tts-cache',
      true, -- Public bucket (audio files are viewable by anyone)
      10485760, -- 10MB limit per file
      ARRAY['audio/mpeg', 'audio/mp3']
    );
  END IF;
END $$;

-- ============================================================================
-- Storage Policies - tts-cache
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view TTS cache files" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload TTS cache files" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update TTS cache files" ON storage.objects;

-- Anyone can view/download TTS cache files (public bucket)
CREATE POLICY "Anyone can view TTS cache files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tts-cache');

-- Only service role can upload TTS cache files (backend API)
CREATE POLICY "Service role can upload TTS cache files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'tts-cache'
    AND auth.role() = 'service_role'
  );

-- Only service role can update TTS cache files (upsert)
CREATE POLICY "Service role can update TTS cache files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'tts-cache'
    AND auth.role() = 'service_role'
  );

-- ============================================================================
-- Helper Function - Clean up old cache files
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_tts_cache(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete cache files older than X days
  DELETE FROM storage.objects
  WHERE bucket_id = 'tts-cache'
    AND created_at < NOW() - (days_old || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION cleanup_old_tts_cache IS 'Removes TTS cache files older than X days (default: 30 days)';

