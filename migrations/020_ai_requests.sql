-- ============================================================================
-- AI Request Logging Table
-- ============================================================================
-- Context: Stores every AI API call made during book/character creation.
--          Used for cost tracking, error analysis, and admin dashboard.
-- Operation types: story_generation | image_cover | image_page | image_master |
--                  image_entity | image_edit | character_analysis | tts
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL,
  book_id           UUID REFERENCES books(id) ON DELETE SET NULL,
  character_id      UUID REFERENCES characters(id) ON DELETE SET NULL,

  -- Request type and provider
  operation_type    VARCHAR(50) NOT NULL,
  provider          VARCHAR(20) NOT NULL DEFAULT 'openai',
  model             VARCHAR(60) NOT NULL,
  prompt_version    VARCHAR(20),
  page_index        SMALLINT,

  -- Status
  status            VARCHAR(10) NOT NULL DEFAULT 'success'
                    CHECK (status IN ('success', 'error', 'partial')),
  error_message     TEXT,

  -- Usage metrics
  input_tokens      INTEGER,
  output_tokens     INTEGER,
  image_count       SMALLINT DEFAULT 1,
  char_count        INTEGER,
  cost_usd          NUMERIC(10, 6),

  -- Timing
  duration_ms       INTEGER,

  -- Flexible metadata
  request_meta      JSONB,
  response_meta     JSONB,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_ai_requests_book_id     ON ai_requests(book_id)        WHERE book_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_requests_user_id     ON ai_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_requests_created_at  ON ai_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_requests_op_type     ON ai_requests(operation_type);
CREATE INDEX IF NOT EXISTS idx_ai_requests_status      ON ai_requests(status)          WHERE status != 'success';

-- Disable RLS (auth handled at application level, consistent with other tables)
ALTER TABLE ai_requests DISABLE ROW LEVEL SECURITY;
