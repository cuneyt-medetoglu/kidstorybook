-- ============================================================================
-- Books Table (Enhanced)
-- ============================================================================
-- Stores user's generated books with full story and image data
-- Created: 2026-01-10
-- Version: 1.0.0

-- ============================================================================
-- Note: Books table already exists from 00001_initial_schema.sql
-- This migration enhances the existing books table with new columns
-- ============================================================================

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Enhance existing columns or add new ones
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'story_data') THEN
    ALTER TABLE public.books ADD COLUMN story_data JSONB;
    -- Migrate existing story_content to story_data if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'story_content') THEN
      UPDATE public.books SET story_data = story_content WHERE story_content IS NOT NULL;
    END IF;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'total_pages') THEN
    ALTER TABLE public.books ADD COLUMN total_pages INTEGER DEFAULT 0;
    -- Migrate existing page_count to total_pages if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'page_count') THEN
      UPDATE public.books SET total_pages = page_count WHERE page_count IS NOT NULL;
    END IF;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'images_data') THEN
    ALTER TABLE public.books ADD COLUMN images_data JSONB DEFAULT '[]';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'cover_image_path') THEN
    ALTER TABLE public.books ADD COLUMN cover_image_path TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'generation_metadata') THEN
    ALTER TABLE public.books ADD COLUMN generation_metadata JSONB DEFAULT '{}';
    -- Migrate existing ai_metadata to generation_metadata if exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'ai_metadata') THEN
      UPDATE public.books SET generation_metadata = ai_metadata WHERE ai_metadata IS NOT NULL;
    END IF;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'view_count') THEN
    ALTER TABLE public.books ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'last_viewed_at') THEN
    ALTER TABLE public.books ADD COLUMN last_viewed_at TIMESTAMP;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'is_favorite') THEN
    ALTER TABLE public.books ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'completed_at') THEN
    ALTER TABLE public.books ADD COLUMN completed_at TIMESTAMP;
  END IF;
  
  -- Rename cover_url to cover_image_url for consistency (if exists)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'cover_url') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'cover_image_url') THEN
    ALTER TABLE public.books RENAME COLUMN cover_url TO cover_image_url;
  END IF;
END $$;

-- Note: Table structure already exists from initial schema
-- This migration only adds new columns (see DO block above)

-- Create books table structure (reference only, won't execute if table exists)
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  
  -- Book Information
  title TEXT NOT NULL,
  theme VARCHAR(50) NOT NULL,
  illustration_style VARCHAR(50) NOT NULL,
  language VARCHAR(5) DEFAULT 'en',
  age_group VARCHAR(30),
  
  -- Story Data
  story_data JSONB NOT NULL, -- Full story JSON (title, pages, metadata)
  total_pages INTEGER NOT NULL DEFAULT 0,
  custom_requests TEXT,
  
  -- Image Data
  images_data JSONB DEFAULT '[]', -- Array of generated images
  cover_image_url TEXT,
  cover_image_path TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
    'draft',        -- Story generated, no images yet
    'generating',   -- Images being generated
    'completed',    -- All images generated
    'failed',       -- Generation failed
    'archived'      -- User archived
  )),
  
  -- Generation Metadata
  generation_metadata JSONB DEFAULT '{}',
  -- Structure: {
  --   model: 'gpt-4o',
  --   promptVersion: '1.0.0',
  --   tokensUsed: 1234,
  --   generationTime: 5000,
  --   imageModel: 'dall-e-3',
  --   totalCost: 0.50
  -- }
  
  -- User Engagement
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP,
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- ============================================================================
-- Indexes
-- ============================================================================

-- Quick user lookup
CREATE INDEX IF NOT EXISTS idx_books_user_id ON public.books(user_id);

-- Character lookup (only if character_id column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'character_id') THEN
    CREATE INDEX IF NOT EXISTS idx_books_character_id ON public.books(character_id);
    CREATE INDEX IF NOT EXISTS idx_books_user_character ON public.books(user_id, character_id);
  END IF;
END $$;

-- Status filtering
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);

-- Recent books
CREATE INDEX IF NOT EXISTS idx_books_created_at ON public.books(created_at DESC);

-- Favorites index (only if is_favorite column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'books' AND column_name = 'is_favorite') THEN
    CREATE INDEX IF NOT EXISTS idx_books_favorites ON public.books(user_id, is_favorite) 
    WHERE is_favorite = TRUE;
  END IF;
END $$;

-- Theme search
CREATE INDEX IF NOT EXISTS idx_books_theme ON public.books(theme);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Users can only see their own books
CREATE POLICY "Users can view their own books"
  ON books
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own books
CREATE POLICY "Users can create their own books"
  ON books
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own books
CREATE POLICY "Users can update their own books"
  ON books
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own books
CREATE POLICY "Users can delete their own books"
  ON books
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_books_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_books_timestamp ON books;

CREATE TRIGGER trigger_update_books_timestamp
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_books_updated_at();

-- Set completed_at when status changes to completed
CREATE OR REPLACE FUNCTION set_books_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_completed_at ON books;

CREATE TRIGGER trigger_set_completed_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION set_books_completed_at();

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Get user's book statistics
CREATE OR REPLACE FUNCTION get_user_book_stats(p_user_id UUID)
RETURNS TABLE (
  total_books INTEGER,
  completed_books INTEGER,
  draft_books INTEGER,
  favorite_books INTEGER,
  total_pages INTEGER,
  characters_used INTEGER
) AS $$
BEGIN
  -- Note: is_favorite and total_pages columns are added in DO block above
  -- So they will exist when this function is created
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_books,
    COUNT(*) FILTER (WHERE status = 'completed')::INTEGER as completed_books,
    COUNT(*) FILTER (WHERE status = 'draft')::INTEGER as draft_books,
    COALESCE(
      COUNT(*) FILTER (WHERE is_favorite = TRUE),
      0
    )::INTEGER as favorite_books,
    COALESCE(SUM(COALESCE(total_pages, 0)), 0)::INTEGER as total_pages,
    COUNT(DISTINCT character_id)::INTEGER as characters_used
  FROM public.books
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get book details with character
CREATE OR REPLACE FUNCTION get_book_with_character(p_book_id UUID)
RETURNS TABLE (
  book_id UUID,
  title TEXT,
  theme VARCHAR(50),
  status VARCHAR(20),
  character_name VARCHAR(100),
  character_age INTEGER,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as book_id,
    b.title,
    b.theme,
    b.status,
    c.name as character_name,
    c.age as character_age,
    b.created_at
  FROM books b
  LEFT JOIN characters c ON b.character_id = c.id
  WHERE b.id = p_book_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment view count
CREATE OR REPLACE FUNCTION increment_book_views(p_book_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE books
  SET 
    view_count = view_count + 1,
    last_viewed_at = NOW()
  WHERE id = p_book_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE books IS 'User-generated story books with images';
COMMENT ON COLUMN books.story_data IS 'Full story JSON (pages, metadata)';
COMMENT ON COLUMN books.images_data IS 'Array of generated image URLs and prompts';
COMMENT ON COLUMN books.status IS 'Book generation status (draft, generating, completed, failed, archived)';
COMMENT ON COLUMN books.generation_metadata IS 'AI generation metadata (model, tokens, cost)';

