-- ============================================================================
-- Allow gender = 'other' for Pets, Toys, Other character types
-- ============================================================================
-- Context: Pet/Toys/Other characters use gender 'other' (not boy/girl).
--          Previous constraint only allowed ('boy', 'girl'); INSERT failed with
--          characters_gender_check. Ref: docs/analysis/PET_CHARACTER_GENDER_CHECK_ANALYSIS.md
-- ============================================================================
-- Idempotent: If constraint already allows 'other', does nothing. Otherwise drops and re-adds.

DO $$
BEGIN
  -- Drop existing constraint if present (so ADD can run)
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.characters'::regclass
      AND conname = 'characters_gender_check'
  ) THEN
    ALTER TABLE public.characters DROP CONSTRAINT characters_gender_check;
  END IF;
END $$;

ALTER TABLE public.characters ADD CONSTRAINT characters_gender_check
  CHECK (gender IN ('boy', 'girl', 'other'));
