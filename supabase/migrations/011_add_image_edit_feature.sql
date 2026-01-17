-- ============================================================================
-- Image Edit Feature
-- ============================================================================
-- Created: 2026-01-17
-- Version: 1.0.0
-- Description: Add image editing capabilities with quota and history tracking

-- ============================================================================
-- Add edit quota columns to books table
-- ============================================================================

ALTER TABLE public.books 
ADD COLUMN IF NOT EXISTS edit_quota_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS edit_quota_limit INTEGER DEFAULT 3;

COMMENT ON COLUMN public.books.edit_quota_used IS 'Number of edits used for this book';
COMMENT ON COLUMN public.books.edit_quota_limit IS 'Maximum number of edits allowed for this book';

-- ============================================================================
-- Create image edit history table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.image_edit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  version INTEGER NOT NULL,
  
  -- Images
  original_image_url TEXT NOT NULL,
  edited_image_url TEXT NOT NULL,
  mask_image_url TEXT, -- Mask image (optional, for debugging)
  
  -- Edit Details
  edit_prompt TEXT NOT NULL, -- User's edit prompt
  ai_model VARCHAR(50) DEFAULT 'gpt-image-1.5',
  
  -- Metadata
  edit_metadata JSONB DEFAULT '{}', -- {brushSize, maskArea, processingTime, cost}
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_book_page_version UNIQUE (book_id, page_number, version)
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_edit_history_book ON public.image_edit_history(book_id);
CREATE INDEX IF NOT EXISTS idx_edit_history_page ON public.image_edit_history(book_id, page_number);
CREATE INDEX IF NOT EXISTS idx_edit_history_created_at ON public.image_edit_history(created_at DESC);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.image_edit_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own edit history
CREATE POLICY "Users can view their own edit history"
  ON public.image_edit_history FOR SELECT
  USING (
    book_id IN (
      SELECT id FROM public.books WHERE user_id = auth.uid()
    )
  );

-- Users can create edit history for their books
CREATE POLICY "Users can create edit history for their books"
  ON public.image_edit_history FOR INSERT
  WITH CHECK (
    book_id IN (
      SELECT id FROM public.books WHERE user_id = auth.uid()
    )
  );

-- Users cannot update or delete edit history (audit trail)
-- No UPDATE or DELETE policies - history is immutable

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Get edit history for a book
CREATE OR REPLACE FUNCTION get_book_edit_history(p_book_id UUID)
RETURNS TABLE (
  page_number INTEGER,
  version INTEGER,
  original_image_url TEXT,
  edited_image_url TEXT,
  edit_prompt TEXT,
  created_at TIMESTAMP
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ieh.page_number,
    ieh.version,
    ieh.original_image_url,
    ieh.edited_image_url,
    ieh.edit_prompt,
    ieh.created_at
  FROM public.image_edit_history ieh
  WHERE ieh.book_id = p_book_id
  ORDER BY ieh.page_number ASC, ieh.version ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get latest version for a specific page
CREATE OR REPLACE FUNCTION get_latest_page_version(p_book_id UUID, p_page_number INTEGER)
RETURNS INTEGER AS $$
DECLARE
  latest_version INTEGER;
BEGIN
  SELECT COALESCE(MAX(version), 0)
  INTO latest_version
  FROM public.image_edit_history
  WHERE book_id = p_book_id AND page_number = p_page_number;
  
  RETURN latest_version;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if book has available edit quota
CREATE OR REPLACE FUNCTION check_edit_quota(p_book_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  quota_used INTEGER;
  quota_limit INTEGER;
BEGIN
  SELECT edit_quota_used, edit_quota_limit
  INTO quota_used, quota_limit
  FROM public.books
  WHERE id = p_book_id;
  
  RETURN quota_used < quota_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE public.image_edit_history IS 'Track all image edits with full version history';
COMMENT ON COLUMN public.image_edit_history.version IS 'Version number: 0 = original, 1+ = edits';
COMMENT ON COLUMN public.image_edit_history.edit_prompt IS 'User prompt describing what to fix';
COMMENT ON COLUMN public.image_edit_history.mask_image_url IS 'Mask image used for edit (optional, debugging)';
COMMENT ON COLUMN public.image_edit_history.edit_metadata IS 'Additional metadata (brush size, processing time, cost)';

COMMENT ON FUNCTION get_book_edit_history IS 'Get all edit history for a book, ordered by page and version';
COMMENT ON FUNCTION get_latest_page_version IS 'Get the latest version number for a specific page';
COMMENT ON FUNCTION check_edit_quota IS 'Check if a book has available edit quota';

-- ============================================================================
-- Grant permissions
-- ============================================================================

-- Grant execute permissions on helper functions to authenticated users
GRANT EXECUTE ON FUNCTION get_book_edit_history TO authenticated;
GRANT EXECUTE ON FUNCTION get_latest_page_version TO authenticated;
GRANT EXECUTE ON FUNCTION check_edit_quota TO authenticated;
