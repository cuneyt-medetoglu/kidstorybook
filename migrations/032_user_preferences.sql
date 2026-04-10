-- Migration 032: Add preferences JSONB column to users table
-- User application preferences stored server-side so they persist across devices.
-- Default is NULL (resolved to defaults in application layer).

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS preferences JSONB;

COMMENT ON COLUMN users.preferences IS
  'User application preferences (kid mode, ebook reading, wizard defaults, ui theme/locale). Null = use app defaults.';
