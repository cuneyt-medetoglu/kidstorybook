-- ============================================================================
-- Drop Supabase auth.uid() dependencies
-- ============================================================================
-- Context: Project migrated from Supabase to AWS PostgreSQL + NextAuth.
--          The 'auth' schema (Supabase-specific) does not exist in AWS PG.
--          All authentication/authorization is handled at the application
--          level (NextAuth). Database-level RLS policies and triggers that
--          reference auth.uid() must be removed.
-- ============================================================================

-- 1. Drop trigger that calls check_is_example_admin_only() (uses auth.uid())
DROP TRIGGER IF EXISTS trigger_check_is_example_admin ON books;

-- 2. Drop the function that uses auth.uid()
DROP FUNCTION IF EXISTS check_is_example_admin_only();

-- 3. Drop RLS policies that reference auth.uid() on books table
DROP POLICY IF EXISTS "Users can view their own books" ON books;
DROP POLICY IF EXISTS "Users can view their own books or examples" ON books;
DROP POLICY IF EXISTS "Users can insert their own books" ON books;
DROP POLICY IF EXISTS "Users can update their own books" ON books;
DROP POLICY IF EXISTS "Users can delete their own books" ON books;

-- 4. Drop RLS policies on characters table
DROP POLICY IF EXISTS "Users can view their own characters" ON characters;
DROP POLICY IF EXISTS "Users can insert their own characters" ON characters;
DROP POLICY IF EXISTS "Users can update their own characters" ON characters;
DROP POLICY IF EXISTS "Users can delete their own characters" ON characters;

-- 5. Drop RLS policies on drafts table (if exists)
DROP POLICY IF EXISTS "Users can view their own drafts" ON drafts;
DROP POLICY IF EXISTS "Users can insert their own drafts" ON drafts;
DROP POLICY IF EXISTS "Users can update their own drafts" ON drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts" ON drafts;

-- 6. Disable RLS on all application tables (auth is handled at app level)
ALTER TABLE IF EXISTS books DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS characters DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS drafts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tts_settings DISABLE ROW LEVEL SECURITY;

-- 7. Drop any remaining functions that reference auth schema
DROP FUNCTION IF EXISTS check_admin_role();

-- Verify: list remaining triggers on books table
DO $$
DECLARE
  trigger_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO trigger_count
  FROM information_schema.triggers
  WHERE event_object_table = 'books'
    AND trigger_schema = 'public';
  RAISE NOTICE 'Remaining triggers on books table: %', trigger_count;
END $$;
