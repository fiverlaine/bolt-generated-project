-- Add check_result_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'signals' 
    AND column_name = 'check_result_at'
  ) THEN
    ALTER TABLE signals ADD COLUMN check_result_at TIMESTAMPTZ;
  END IF;
END $$;

-- Drop index if exists and recreate
DROP INDEX IF EXISTS idx_signals_check_result;
CREATE INDEX idx_signals_check_result ON signals(check_result_at) 
WHERE result IS NULL;
