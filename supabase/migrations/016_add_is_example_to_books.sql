-- ============================================================================
-- Add is_example to Books Table
-- ============================================================================
-- Purpose: Mark books as public examples viewable by everyone (logged in or not)
-- Created: 2026-01-30
-- Related: ROADMAP 5.6.1, docs/strategies/EXAMPLES_REAL_BOOKS_AND_CREATE_YOUR_OWN.md
-- ============================================================================

-- ============================================================================
-- 1. Add is_example Column
-- ============================================================================

DO $$
BEGIN
  -- Add is_example column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'books' 
    AND column_name = 'is_example'
  ) THEN
    ALTER TABLE public.books 
    ADD COLUMN is_example BOOLEAN DEFAULT FALSE NOT NULL;
    
    -- Add index for example books lookup
    CREATE INDEX idx_books_is_example ON public.books(is_example) 
    WHERE is_example = TRUE;
    
    RAISE NOTICE 'Added is_example column to books table';
  END IF;
END $$;

-- ============================================================================
-- 2. Update RLS Policies
-- ============================================================================

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own books" ON books;

-- Create new SELECT policy: users can see their own books OR example books
CREATE POLICY "Users can view their own books or examples"
  ON books
  FOR SELECT
  USING (
    auth.uid() = user_id  -- Own books
    OR is_example = TRUE  -- Public example books (authenticated or anonymous)
  );

-- ============================================================================
-- 3. Admin-only is_example Update Trigger
-- ============================================================================

-- Function to prevent non-admins from setting is_example = TRUE
CREATE OR REPLACE FUNCTION check_is_example_admin_only()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- If is_example is being set to TRUE, check if user is admin
  IF NEW.is_example = TRUE AND (OLD.is_example IS NULL OR OLD.is_example = FALSE) THEN
    -- Get user role from users table
    SELECT role INTO user_role
    FROM users
    WHERE id = auth.uid();
    
    -- Allow if user is admin, otherwise raise error
    IF user_role IS NULL OR user_role != 'admin' THEN
      RAISE EXCEPTION 'Only admin users can set is_example to TRUE';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_check_is_example_admin ON books;

-- Create trigger (BEFORE UPDATE or INSERT)
CREATE TRIGGER trigger_check_is_example_admin
  BEFORE INSERT OR UPDATE OF is_example ON books
  FOR EACH ROW
  EXECUTE FUNCTION check_is_example_admin_only();

-- ============================================================================
-- 4. Helper Function: Get Example Books
-- ============================================================================

CREATE OR REPLACE FUNCTION get_example_books(
  p_age_group TEXT DEFAULT NULL,
  p_theme TEXT DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  cover_image_url TEXT,
  theme VARCHAR(50),
  age_group VARCHAR(30),
  illustration_style VARCHAR(50),
  total_pages INTEGER,
  story_data JSONB,
  images_data JSONB,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.title,
    b.cover_image_url,
    b.theme,
    b.age_group,
    b.illustration_style,
    b.total_pages,
    b.story_data,
    b.images_data,
    b.created_at
  FROM public.books b
  WHERE b.is_example = TRUE
    AND b.status = 'completed'  -- Only show completed example books
    AND (p_age_group IS NULL OR b.age_group = p_age_group)
    AND (p_theme IS NULL OR b.theme = p_theme)
  ORDER BY b.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON COLUMN books.is_example IS 'TRUE if book is a public example viewable by everyone (including anonymous). Only admin can set this.';
COMMENT ON FUNCTION get_example_books IS 'Get public example books (filtered by age group/theme, paginated). Accessible by everyone.';
COMMENT ON FUNCTION check_is_example_admin_only IS 'Ensures only admin users can set is_example = TRUE on books';

