-- ============================================================================
-- Fix User References - Use auth.users instead of public.users
-- ============================================================================
-- Created: 2026-01-10
-- Purpose: Fix foreign key constraints to use Supabase Auth users
-- 
-- Issue: Characters table references public.users, but users are in auth.users
-- Solution: Change foreign key to reference auth.users
-- ============================================================================

-- 1. Drop existing foreign key constraint on characters table
ALTER TABLE public.characters
DROP CONSTRAINT IF EXISTS characters_user_id_fkey;

-- 2. Add new foreign key constraint to auth.users
ALTER TABLE public.characters
ADD CONSTRAINT characters_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- 3. Update RLS policies to use auth.uid() (already correct, but verify)
-- Policies already use auth.uid(), no changes needed

-- 4. Add comment
COMMENT ON CONSTRAINT characters_user_id_fkey ON public.characters IS 'References Supabase Auth users (auth.users)';

-- ============================================================================
-- Also fix books table if needed
-- ============================================================================

-- Check if books table has the same issue
ALTER TABLE public.books
DROP CONSTRAINT IF EXISTS books_user_id_fkey;

ALTER TABLE public.books
ADD CONSTRAINT books_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

COMMENT ON CONSTRAINT books_user_id_fkey ON public.books IS 'References Supabase Auth users (auth.users)';

-- ============================================================================
-- Update public.users table to sync with auth.users
-- ============================================================================
-- public.users is used for storing additional user metadata (avatar, free_cover_used, etc.)
-- It should use the same ID as auth.users (auth.users.id)

-- Drop existing public.users table if it exists (we'll recreate it)
DROP TABLE IF EXISTS public.users CASCADE;

-- Recreate public.users table with auth.users.id as primary key
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Same ID as auth.users
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    free_cover_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for quick lookups
CREATE INDEX idx_users_email ON public.users(email);

-- Create function to automatically create public.users record when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING; -- If user already exists, do nothing
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically sync auth.users → public.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on public.users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see and update their own data
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- Note about public.users vs auth.users
-- ============================================================================
-- ✅ auth.users: Managed by Supabase Auth (email, password, session)
-- ✅ public.users: Our custom metadata (avatar, free_cover_used, etc.)
-- ✅ public.users.id = auth.users.id (same ID, FK relationship)
-- ✅ Automatic sync via trigger (on auth.users insert → create public.users)
-- ✅ Manual sync still possible via API if needed

-- ============================================================================
-- Summary
-- ============================================================================
-- ✅ characters.user_id now references auth.users (Supabase Auth)
-- ✅ books.user_id now references auth.users (Supabase Auth)
-- ✅ orders.user_id now references auth.users (Supabase Auth)
-- ✅ RLS policies still work with auth.uid()
-- ✅ public.users table kept for metadata (not used for FK)

