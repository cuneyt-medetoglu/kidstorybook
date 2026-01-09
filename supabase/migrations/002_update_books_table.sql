-- ============================================================================
-- Update Books Table
-- ============================================================================
-- Add character_id foreign key to link books with characters
-- Created: 2026-01-10
-- Version: 1.0.0

-- Add character_id column to books table (if not exists)
-- Note: character_id already exists in initial schema, this is idempotent
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'books' 
                 AND column_name = 'character_id') THEN
    ALTER TABLE public.books 
    ADD COLUMN character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add index for quick character lookup (already exists in migration 003, but idempotent)
CREATE INDEX IF NOT EXISTS idx_books_character_id ON public.books(character_id) 
WHERE character_id IS NOT NULL;

-- Add index for user's books with character (already exists in migration 003, but idempotent)
CREATE INDEX IF NOT EXISTS idx_books_user_character ON public.books(user_id, character_id) 
WHERE character_id IS NOT NULL;

-- ============================================================================
-- Trigger to update character's used_in_books array
-- ============================================================================

CREATE OR REPLACE FUNCTION update_character_books_array()
RETURNS TRIGGER AS $$
BEGIN
  -- When a book is created or its character_id is updated
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.character_id IS NOT NULL THEN
    -- Add book ID to character's used_in_books array
    UPDATE characters
    SET 
      used_in_books = array_append(
        COALESCE(used_in_books, '{}'),
        NEW.id::TEXT
      ),
      last_used_at = NOW()
    WHERE id = NEW.character_id
      AND NOT (NEW.id::TEXT = ANY(COALESCE(used_in_books, '{}')));
  END IF;
  
  -- When a book's character_id is changed, remove from old character
  IF (TG_OP = 'UPDATE') AND OLD.character_id IS NOT NULL AND OLD.character_id != NEW.character_id THEN
    UPDATE characters
    SET used_in_books = array_remove(used_in_books, OLD.id::TEXT)
    WHERE id = OLD.character_id;
  END IF;
  
  -- When a book is deleted, remove from character's array
  IF (TG_OP = 'DELETE') AND OLD.character_id IS NOT NULL THEN
    UPDATE characters
    SET used_in_books = array_remove(used_in_books, OLD.id::TEXT)
    WHERE id = OLD.character_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_update_character_books ON books;

-- Create trigger
CREATE TRIGGER trigger_update_character_books
  AFTER INSERT OR UPDATE OR DELETE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_character_books_array();

-- ============================================================================
-- Helper Function: Get books by character
-- ============================================================================

CREATE OR REPLACE FUNCTION get_books_by_character(p_character_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    COALESCE(b.cover_image_url, b.cover_url) as cover_image_url, -- Support both column names
    b.created_at,
    b.status::TEXT
  FROM public.books b
  WHERE b.character_id = p_character_id
  ORDER BY b.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON COLUMN books.character_id IS 'Reference to master character used in this book';

