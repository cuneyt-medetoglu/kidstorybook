-- ============================================================================
-- Add character_type Column to Characters Table
-- ============================================================================
-- This migration adds character type information (group, value, displayName)
-- to support multiple character types: Child, Pets, Family Members, Other
-- Created: 2026-01-16
-- Version: 1.1.0
-- ============================================================================

-- Add character_type column (JSONB)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'characters' 
      AND column_name = 'character_type'
  ) THEN
    ALTER TABLE public.characters 
    ADD COLUMN character_type JSONB 
    DEFAULT '{"group": "Child", "value": "Child", "displayName": "Child"}'::jsonb
    NOT NULL;
    
    RAISE NOTICE 'Column character_type added to characters table';
  ELSE
    RAISE NOTICE 'Column character_type already exists';
  END IF;
END $$;

-- ============================================================================
-- Index for character_type queries
-- ============================================================================

-- Index for filtering by character group (Child, Pets, Family Members, Other)
CREATE INDEX IF NOT EXISTS idx_characters_type_group 
ON characters ((character_type->>'group'));

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON COLUMN characters.character_type IS 'Character type info: {group: "Child"|"Pets"|"Family Members"|"Other", value: string, displayName: string}';

-- ============================================================================
-- Example character_type values:
-- ============================================================================
-- Child: {"group": "Child", "value": "Child", "displayName": "Arya"}
-- Pet: {"group": "Pets", "value": "Dog", "displayName": "Buddy"}
-- Family: {"group": "Family Members", "value": "Mom", "displayName": "Zeynep"}
-- Other: {"group": "Other", "value": "Robot", "displayName": "R2D2"}
-- ============================================================================
