-- Add PDF MIME type support to book-images bucket
-- Created: 2026-01-11
-- Purpose: Allow PDF files to be uploaded to book-images bucket

-- Update book-images bucket to allow PDF files
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
WHERE id = 'book-images';

-- If bucket doesn't exist, create it with PDF support
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'book-images',
  'book-images',
  true,
  10485760, -- 10MB limit per file
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE
SET allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'application/pdf'];

