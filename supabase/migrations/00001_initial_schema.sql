-- KidStoryBook Initial Database Schema
-- Created: 2026-01-04

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- nullable for OAuth users
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    free_cover_used BOOLEAN DEFAULT FALSE, -- Ücretsiz kapak hakkı
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- OAUTH ACCOUNTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.oauth_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'google', 'facebook', 'instagram'
    provider_account_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_account_id)
);

-- ============================================
-- CHARACTERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 18),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('boy', 'girl')),
    hair_color VARCHAR(100) NOT NULL,
    eye_color VARCHAR(100) NOT NULL,
    features TEXT[], -- Array of features like 'gözlüklü', 'çilli', etc.
    reference_photo_url TEXT, -- URL from Supabase Storage
    ai_analysis JSONB, -- AI analysis results
    -- AI analysis structure:
    -- {
    --   "hair_length": "short" | "medium" | "long",
    --   "hair_style": "straight" | "wavy" | "curly" | "braided" | "ponytail",
    --   "hair_texture": "...",
    --   "face_shape": "...",
    --   "eye_shape": "...",
    --   "skin_tone": "...",
    --   "body_proportions": "...",
    --   "clothing": "..." (nullable)
    -- }
    full_description TEXT, -- Combined character description for AI prompts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BOOKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    theme VARCHAR(100) NOT NULL, -- 'adventure', 'fairy-tale', 'space', etc.
    age_group VARCHAR(20) NOT NULL, -- '0-2', '3-5', '6-9', '10+'
    illustration_style VARCHAR(100) NOT NULL,
    page_count INTEGER NOT NULL DEFAULT 10 CHECK (page_count IN (10, 15, 20)),
    language VARCHAR(10) DEFAULT 'tr', -- 'tr', 'en'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'processing', 'completed', 'failed'
    story_content JSONB, -- Story pages: [{page: 1, text: "...", image_url: "..."}, ...]
    cover_url TEXT, -- Cover image URL
    pdf_url TEXT, -- Generated PDF URL
    custom_requests TEXT, -- User's custom requests
    ai_metadata JSONB, -- AI generation metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    order_type VARCHAR(20) NOT NULL, -- 'ebook', 'printed'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled'
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY', -- 'TRY', 'USD', 'EUR'
    payment_provider VARCHAR(20), -- 'stripe', 'iyzico'
    payment_intent_id VARCHAR(255),
    shipping_address JSONB, -- For printed books
    tracking_number VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed', 'refunded'
    payment_method VARCHAR(50),
    provider VARCHAR(20) NOT NULL, -- 'stripe', 'iyzico'
    provider_transaction_id VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_oauth_accounts_user_id ON public.oauth_accounts(user_id);
CREATE INDEX idx_oauth_accounts_provider ON public.oauth_accounts(provider, provider_account_id);
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_books_user_id ON public.books(user_id);
CREATE INDEX idx_books_status ON public.books(status);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users: Users can only see and update their own data
CREATE POLICY users_select_own ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- OAuth Accounts: Users can only see their own OAuth accounts
CREATE POLICY oauth_accounts_select_own ON public.oauth_accounts
    FOR SELECT USING (auth.uid() = user_id);

-- Characters: Users can manage their own characters
CREATE POLICY characters_select_own ON public.characters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY characters_insert_own ON public.characters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY characters_update_own ON public.characters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY characters_delete_own ON public.characters
    FOR DELETE USING (auth.uid() = user_id);

-- Books: Users can manage their own books
CREATE POLICY books_select_own ON public.books
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY books_insert_own ON public.books
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY books_update_own ON public.books
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY books_delete_own ON public.books
    FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can only see their own orders
CREATE POLICY orders_select_own ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY orders_insert_own ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Payments: Users can only see their own payments
CREATE POLICY payments_select_own ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE public.users IS 'Registered users of the platform';
COMMENT ON TABLE public.oauth_accounts IS 'OAuth account linkages (Google, Facebook, Instagram)';
COMMENT ON TABLE public.characters IS 'Child characters created by users';
COMMENT ON TABLE public.books IS 'Story books generated for characters';
COMMENT ON TABLE public.orders IS 'Book orders (e-book or printed)';
COMMENT ON TABLE public.payments IS 'Payment transactions';

-- ============================================
-- STORAGE BUCKETS (to be created via Supabase UI or API)
-- ============================================
-- photos: Reference photos of children
-- books: Generated book images
-- pdfs: Generated PDF files
-- covers: Book cover images

