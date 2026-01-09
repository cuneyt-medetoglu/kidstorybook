-- ============================================================================
-- Characters Table
-- ============================================================================
-- Stores master character descriptions for consistent multi-book usage
-- Created: 2026-01-10
-- Version: 1.0.0

-- ============================================================================
-- Note: Characters table already exists from 00001_initial_schema.sql
-- This migration enhances the existing characters table with new columns
-- ============================================================================

-- Add new columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'reference_photo_path') THEN
    ALTER TABLE public.characters ADD COLUMN reference_photo_path TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'description') THEN
    ALTER TABLE public.characters ADD COLUMN description JSONB DEFAULT '{}'::jsonb;
    ALTER TABLE public.characters ALTER COLUMN description SET NOT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'analysis_raw') THEN
    ALTER TABLE public.characters ADD COLUMN analysis_raw JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'analysis_confidence') THEN
    ALTER TABLE public.characters ADD COLUMN analysis_confidence DECIMAL(3,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'is_default') THEN
    ALTER TABLE public.characters ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'used_in_books') THEN
    ALTER TABLE public.characters ADD COLUMN used_in_books TEXT[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'total_books') THEN
    ALTER TABLE public.characters ADD COLUMN total_books INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'last_used_at') THEN
    ALTER TABLE public.characters ADD COLUMN last_used_at TIMESTAMP;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'version') THEN
    ALTER TABLE public.characters ADD COLUMN version INTEGER DEFAULT 1;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'characters' AND column_name = 'previous_versions') THEN
    ALTER TABLE public.characters ADD COLUMN previous_versions JSONB DEFAULT '[]';
  END IF;
END $$;
-- Note: Table structure already exists from initial schema
-- This migration only adds new columns (see DO block above)

-- ============================================================================
-- Indexes
-- ============================================================================

-- Quick lookup by user
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);

-- Find default character
CREATE INDEX IF NOT EXISTS idx_characters_default ON characters(user_id, is_default) 
WHERE is_default = TRUE;

-- Recent characters
CREATE INDEX IF NOT EXISTS idx_characters_created_at ON characters(created_at DESC);

-- Most used characters
CREATE INDEX IF NOT EXISTS idx_characters_total_books ON characters(total_books DESC);

-- Search by name
CREATE INDEX IF NOT EXISTS idx_characters_name ON characters(name);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS (idempotent)
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to recreate with new names)
DROP POLICY IF EXISTS "Users can view their own characters" ON public.characters;
DROP POLICY IF EXISTS "Users can create their own characters" ON public.characters;
DROP POLICY IF EXISTS "Users can update their own characters" ON public.characters;
DROP POLICY IF EXISTS "Users can delete their own characters" ON public.characters;

-- Also drop old policies from initial schema if they exist
DROP POLICY IF EXISTS characters_select_own ON public.characters;
DROP POLICY IF EXISTS characters_insert_own ON public.characters;
DROP POLICY IF EXISTS characters_update_own ON public.characters;
DROP POLICY IF EXISTS characters_delete_own ON public.characters;

-- Users can only see their own characters
CREATE POLICY "Users can view their own characters"
  ON public.characters
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own characters
CREATE POLICY "Users can create their own characters"
  ON public.characters
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own characters
CREATE POLICY "Users can update their own characters"
  ON public.characters
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own characters
CREATE POLICY "Users can delete their own characters"
  ON public.characters
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_characters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trigger_update_characters_timestamp ON public.characters;
DROP TRIGGER IF EXISTS update_characters_updated_at ON public.characters;

CREATE TRIGGER trigger_update_characters_timestamp
  BEFORE UPDATE ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION update_characters_updated_at();

-- Ensure only one default character per user
CREATE OR REPLACE FUNCTION ensure_single_default_character()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    -- Set all other characters for this user to non-default
    UPDATE characters
    SET is_default = FALSE
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_default = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ensure_single_default
  BEFORE INSERT OR UPDATE ON characters
  FOR EACH ROW
  WHEN (NEW.is_default = TRUE)
  EXECUTE FUNCTION ensure_single_default_character();

-- Update total_books count when used_in_books changes
CREATE OR REPLACE FUNCTION update_total_books_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_books = array_length(NEW.used_in_books, 1);
  IF NEW.total_books IS NULL THEN
    NEW.total_books = 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_total_books
  BEFORE INSERT OR UPDATE OF used_in_books ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_total_books_count();

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Get user's default character
CREATE OR REPLACE FUNCTION get_default_character(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name VARCHAR(100),
  age INTEGER,
  gender VARCHAR(20),
  description JSONB,
  total_books INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.age,
    c.gender,
    c.description,
    c.total_books
  FROM characters c
  WHERE c.user_id = p_user_id
    AND c.is_default = TRUE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get character usage statistics
CREATE OR REPLACE FUNCTION get_character_stats(p_character_id UUID)
RETURNS TABLE (
  total_books INTEGER,
  last_used_at TIMESTAMP,
  books_this_month INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.total_books,
    c.last_used_at,
    (
      SELECT COUNT(*)::INTEGER
      FROM books b
      WHERE b.character_id = p_character_id
        AND b.created_at >= DATE_TRUNC('month', NOW())
    ) as books_this_month
  FROM characters c
  WHERE c.id = p_character_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE characters IS 'Master character descriptions for multi-book consistency';
COMMENT ON COLUMN characters.description IS 'Detailed JSONB character description for AI image generation';
COMMENT ON COLUMN characters.is_default IS 'User''s primary/default character';
COMMENT ON COLUMN characters.used_in_books IS 'Array of book IDs using this character';
COMMENT ON COLUMN characters.version IS 'Character version for tracking updates';

