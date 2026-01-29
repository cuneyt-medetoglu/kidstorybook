-- ============================================================================
-- Add role column to public.users (Debug / Feature Flags - admin support)
-- ============================================================================
-- Purpose: Support admin role for skip-payment create book and future admin dashboard
-- Created: 2026-01-29
-- Reference: docs/strategies/DEBUG_AND_FEATURE_FLAGS_ANALYSIS.md

-- Add role column: 'user' | 'admin', default 'user'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users
    ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
      CHECK (role IN ('user', 'admin'));

    COMMENT ON COLUMN public.users.role IS 'User role: user (default) or admin. Admins can use skip-payment create book and future admin dashboard when flags are enabled.';
  END IF;
END $$;

-- Note: To set first admin, run manually, e.g.:
-- UPDATE public.users SET role = 'admin' WHERE email = 'admin@example.com';
