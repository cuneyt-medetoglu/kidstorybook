-- Add PDF columns to books table
-- ============================================================================
-- Adds pdf_url and pdf_path columns for PDF generation feature
-- Created: 2026-01-10
-- Version: 1.0.0

-- Add pdf_url column (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'books' 
                 AND column_name = 'pdf_url') THEN
    ALTER TABLE public.books ADD COLUMN pdf_url TEXT;
    COMMENT ON COLUMN public.books.pdf_url IS 'Public URL to generated PDF file in Supabase Storage';
  END IF;
END $$;

-- Add pdf_path column (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'books' 
                 AND column_name = 'pdf_path') THEN
    ALTER TABLE public.books ADD COLUMN pdf_path TEXT;
    COMMENT ON COLUMN public.books.pdf_path IS 'Storage path to PDF file (e.g., user_id/books/book_id/title.pdf)';
  END IF;
END $$;

-- Add index for quick PDF lookup (optional, but useful for filtering books with PDFs)
CREATE INDEX IF NOT EXISTS idx_books_pdf_url ON public.books(pdf_url) 
WHERE pdf_url IS NOT NULL;

-- Note: pdf_url might already exist from initial schema (00001_initial_schema.sql)
-- This migration is idempotent and will only add columns if they don't exist

