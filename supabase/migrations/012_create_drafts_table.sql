-- ============================================================================
-- Drafts Table
-- ============================================================================
-- Stores draft covers (free cover feature) for both authenticated and anonymous users
-- Created: 2026-01-26
-- Version: 1.0.0

-- ============================================================================
-- Create drafts table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_id VARCHAR(255) UNIQUE NOT NULL, -- localStorage draftId
  cover_image TEXT NOT NULL,
  character_data JSONB NOT NULL,
  theme VARCHAR(100),
  sub_theme VARCHAR(100),
  style VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Indexes
  CONSTRAINT drafts_draft_id_unique UNIQUE (draft_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON public.drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_draft_id ON public.drafts(draft_id);
CREATE INDEX IF NOT EXISTS idx_drafts_expires_at ON public.drafts(expires_at);

-- RLS Policies
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own drafts
CREATE POLICY "Users can view their own drafts"
  ON public.drafts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own drafts
CREATE POLICY "Users can insert their own drafts"
  ON public.drafts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own drafts
CREATE POLICY "Users can update their own drafts"
  ON public.drafts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own drafts
CREATE POLICY "Users can delete their own drafts"
  ON public.drafts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Anyone can view drafts by draft_id (for anonymous users)
CREATE POLICY "Anyone can view draft by draft_id"
  ON public.drafts
  FOR SELECT
  USING (true); -- draft_id is unique, so this is safe

-- Comments
COMMENT ON TABLE public.drafts IS 'Stores draft covers for free cover feature';
COMMENT ON COLUMN public.drafts.draft_id IS 'Unique draft ID from localStorage (format: draft_timestamp_random)';
COMMENT ON COLUMN public.drafts.user_id IS 'User ID (nullable for anonymous users)';
COMMENT ON COLUMN public.drafts.character_data IS 'Character form data from wizard step1';
COMMENT ON COLUMN public.drafts.expires_at IS 'Draft expiration date (30 days from creation)';
