/*
  # Fix Signal Analysis and Processing

  1. Changes
    - Add check_interval column to control analysis timing
    - Add last_analysis_time to track last analysis
    - Add validation constraints
    - Add cleanup trigger

  2. Indexes
    - Add index for analysis timing
    - Add composite index for signal status
*/

-- Add columns for analysis timing
ALTER TABLE signals 
ADD COLUMN IF NOT EXISTS check_interval INTEGER NOT NULL DEFAULT 60,
ADD COLUMN IF NOT EXISTS last_analysis_time TIMESTAMPTZ;

-- Create index for analysis timing
CREATE INDEX IF NOT EXISTS idx_signals_analysis_time 
ON signals(user_id, last_analysis_time) 
WHERE result IS NULL;

-- Create composite index for signal status
CREATE INDEX IF NOT EXISTS idx_signals_status 
ON signals(user_id, processing_status, last_analysis_time) 
WHERE result IS NULL;

-- Create function to validate and update signal status
CREATE OR REPLACE FUNCTION validate_signal_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Set initial status for new signals
  IF TG_OP = 'INSERT' THEN
    NEW.processing_status := 'pending';
    NEW.last_analysis_time := NOW();
  END IF;

  -- Update last analysis time on status change
  IF NEW.processing_status != OLD.processing_status THEN
    NEW.last_analysis_time := NOW();
  END IF;

  -- Validate check interval
  IF NEW.check_interval < 1 OR NEW.check_interval > 3600 THEN
    RAISE EXCEPTION 'Invalid check interval: must be between 1 and 3600 seconds';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for signal status validation
DROP TRIGGER IF EXISTS validate_signal_status_trigger ON signals;
CREATE TRIGGER validate_signal_status_trigger
  BEFORE INSERT OR UPDATE ON signals
  FOR EACH ROW
  EXECUTE FUNCTION validate_signal_status();

-- Create function to cleanup stale signals
CREATE OR REPLACE FUNCTION cleanup_stale_signals()
RETURNS void AS $$
BEGIN
  -- Mark stale signals as error
  UPDATE signals
  SET 
    processing_status = 'error',
    result = 'loss'
  WHERE 
    processing_status IN ('pending', 'processing')
    AND result IS NULL
    AND created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
