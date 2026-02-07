-- Migration: Add NextAuth support to users table
-- Date: 2026-02-04
-- Description: Add password_hash column for credential authentication

-- Add password_hash column (nullable for OAuth users)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Note: NextAuth session/account tables are optional if using JWT strategy
-- If needed, create them with @auth/pg-adapter schema