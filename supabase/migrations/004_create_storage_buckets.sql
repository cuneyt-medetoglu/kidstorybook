-- ============================================================================
-- Supabase Storage Buckets
-- ============================================================================
-- Creates storage buckets for book images and reference photos
-- Created: 2026-01-10
-- Version: 1.0.0

-- ============================================================================
-- Create Buckets
-- ============================================================================
-- Note: Some buckets may already exist from initial setup
-- This migration ensures required buckets exist with correct settings

-- ============================================================================
-- Note: Storage buckets may already exist from initial setup
-- This migration ensures required buckets exist and have correct policies
-- Doğrulama (10 Ocak 2026): book-images ve reference-photos bucket'ları zaten var
-- ============================================================================

-- Book images bucket (generated DALL-E images)
-- Bucket already exists (verified: public, 10MB), just ensure it exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'book-images') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'book-images',
      'book-images',
      true, -- Public bucket (images are viewable)
      10485760, -- 10MB limit per file
      ARRAY['image/png', 'image/jpeg', 'image/webp']
    );
  END IF;
  -- Note: Bucket already exists with correct settings (public, 10MB), no need to update
END $$;

-- Reference photos bucket (user-uploaded character photos)
-- Bucket already exists (verified: private, 50MB), just ensure it exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'reference-photos') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'reference-photos',
      'reference-photos',
      false, -- Private bucket (only owner can view)
      52428800, -- 50MB limit per file (matching existing bucket)
      ARRAY['image/png', 'image/jpeg', 'image/webp']
    );
  END IF;
  -- Note: Bucket already exists with correct settings (private, 50MB), no need to update
END $$;

-- ============================================================================
-- ============================================================================
-- Storage Policies - book-images
-- ============================================================================
-- Note: Drop existing policies if they exist to avoid conflicts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public book images are viewable by anyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload book images to their own books" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own book images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own book images" ON storage.objects;

-- Anyone can view book images (public bucket)
CREATE POLICY "Public book images are viewable by anyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'book-images');

-- Users can only upload to their own book folders
CREATE POLICY "Users can upload book images to their own books"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'book-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can only update their own book images
CREATE POLICY "Users can update their own book images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'book-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can only delete their own book images
CREATE POLICY "Users can delete their own book images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'book-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- Storage Policies - reference-photos
-- ============================================================================
-- Note: Drop existing policies if they exist to avoid conflicts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own reference photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own reference photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own reference photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own reference photos" ON storage.objects;

-- Users can only view their own reference photos
CREATE POLICY "Users can view their own reference photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'reference-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can only upload their own reference photos
CREATE POLICY "Users can upload their own reference photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'reference-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can only update their own reference photos
CREATE POLICY "Users can update their own reference photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'reference-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can only delete their own reference photos
CREATE POLICY "Users can delete their own reference photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'reference-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- Helper Function - Clean up orphaned images
-- ============================================================================

-- Clean up images for deleted books
CREATE OR REPLACE FUNCTION cleanup_orphaned_book_images()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete images from storage that don't have corresponding books
  DELETE FROM storage.objects
  WHERE bucket_id = 'book-images'
    AND name NOT IN (
      SELECT DISTINCT (images_data->>'storagePath')
      FROM books, jsonb_array_elements(books.images_data) AS images_data
    );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION cleanup_orphaned_book_images IS 'Removes orphaned images from storage (images without corresponding books)';

