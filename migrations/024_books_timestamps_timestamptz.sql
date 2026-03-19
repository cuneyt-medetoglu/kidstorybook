-- books.created_at / updated_at / completed_at: TIMESTAMP (naive) → TIMESTAMPTZ
-- Supabase/AWS PG genelde UTC oturumu kullanır; naive değerler UTC duvar saati olarak saklanır.
-- AT TIME ZONE 'UTC' ile gerçek anlık (instant) olarak okunur; node-pg + UI tutarlılığı sağlanır.

DO $$
DECLARE
  dt text;
BEGIN
  SELECT c.data_type INTO dt
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'books'
    AND c.column_name = 'created_at';

  IF dt = 'timestamp without time zone' THEN
    EXECUTE $sql$
      ALTER TABLE books
        ALTER COLUMN created_at TYPE TIMESTAMPTZ
        USING (created_at AT TIME ZONE 'UTC')
    $sql$;
  END IF;

  SELECT c.data_type INTO dt
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'books'
    AND c.column_name = 'updated_at';

  IF dt = 'timestamp without time zone' THEN
    EXECUTE $sql$
      ALTER TABLE books
        ALTER COLUMN updated_at TYPE TIMESTAMPTZ
        USING (updated_at AT TIME ZONE 'UTC')
    $sql$;
  END IF;

  SELECT c.data_type INTO dt
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'books'
    AND c.column_name = 'completed_at';

  IF dt = 'timestamp without time zone' THEN
    EXECUTE $sql$
      ALTER TABLE books
        ALTER COLUMN completed_at TYPE TIMESTAMPTZ
        USING (
          CASE
            WHEN completed_at IS NULL THEN NULL
            ELSE completed_at AT TIME ZONE 'UTC'
          END
        )
    $sql$;
  END IF;
END $$;
