-- Migration 033: Normalize user preferences to kidMode only (strip legacy keys).
-- Safe to run after 032; rewrites any JSONB that had ebook / wizardDefaults / ui.

UPDATE users
SET preferences = jsonb_build_object(
  'kidMode',
  COALESCE((preferences->>'kidMode')::boolean, false)
)
WHERE preferences IS NOT NULL
  AND preferences != '{}'::jsonb;

COMMENT ON COLUMN users.preferences IS
  'User preferences: currently { "kidMode": boolean } only.';
