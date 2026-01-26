-- ============================================================================
-- Add Free Cover Column to Users Table
-- ============================================================================
-- Adds free_cover_used column to track if user has used their free cover credit
-- Created: 2026-01-26
-- Version: 1.0.0

-- ============================================================================
-- Add free_cover_used column to users table
-- ============================================================================

-- Check if column already exists before adding
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'free_cover_used'
  ) THEN
    ALTER TABLE public.users 
    ADD COLUMN free_cover_used BOOLEAN DEFAULT FALSE NOT NULL;
    
    -- Add comment
    COMMENT ON COLUMN public.users.free_cover_used IS 'Whether the user has used their free cover credit (1 per new user)';
  END IF;
END $$;
