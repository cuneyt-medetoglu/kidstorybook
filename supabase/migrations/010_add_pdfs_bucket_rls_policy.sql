-- Storage RLS Policy for pdfs bucket
-- Created: 2026-01-17
-- Purpose: Allow authenticated users to upload PDF files to pdfs bucket
-- Note: pdfs bucket should already exist in Supabase Storage (50 MB limit)
--
-- ⚠️ IMPORTANT: If you get "must be owner of relation objects" error:
-- Use Supabase Dashboard → Storage → Policies UI instead
-- See: docs/guides/SUPABASE_PDFS_BUCKET_SETUP.md

-- Ensure pdfs bucket exists (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Users can upload PDFs to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for PDFs" ON storage.objects;

-- Allow authenticated users to upload PDFs to their own folders
-- Path format: {user_id}/books/{book_id}/{filename}.pdf
CREATE POLICY "Users can upload PDFs to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pdfs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own PDFs
CREATE POLICY "Users can update their own PDFs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pdfs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own PDFs
CREATE POLICY "Users can delete their own PDFs"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pdfs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Public read access for all PDFs in pdfs bucket
CREATE POLICY "Public read access for PDFs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pdfs');

-- Comments
COMMENT ON POLICY "Users can upload PDFs to their own folder" ON storage.objects IS 
  'Allows authenticated users to upload PDFs to their own user folder in pdfs bucket';

COMMENT ON POLICY "Public read access for PDFs" ON storage.objects IS 
  'Allows public read access to all PDFs in pdfs bucket';
