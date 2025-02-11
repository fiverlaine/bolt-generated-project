/*
  # Fix Signal Processing and Add Indexes

  1. Changes
    - Add processing_status column to track signal state
    - Add composite indexes for better query performance
    - Add check constraints for data validation
    - Add trigger to handle signal processing status

  2. Indexes
    - Add composite index for signal processing
    - Add index for user signals by date
    - Add index for active signals

  3. Constraints
    - Add check constraint for processing_status
    - Add check constraint for signal validation
*/

-- Add processing_status column
ALTER TABLE signals 
ADD COLUMN IF NOT EXISTS processing_status TEXT 
DEFAULT 'pending' 
CHECK (processing_status IN ('pending', 'processing', 'completed', 'error'));

-- Create composite index for signal processing
CREATE INDEX IF NOT EXISTS idx_signals_processing 
ON signals(user_id, processing_status, created_at DESC) 
WHERE processing_status = 'pending';

-- Create index for user signals by date
CREATE INDEX IF NOT EXISTS idx_signals_user_date 
ON signals(user_id, created_at DESC);

-- Create index for active signals
CREATE INDEX IF NOT EXISTS idx_signals_active 
ON signals(user_id, created_at DESC) 
WHERE result IS NULL AND processing_status = 'pending';

-- Create function to handle signal processing
CREATE OR REPLACE FUNCTION handle_signal_processing()
RETURNS TRIGGER AS $$
BEGIN
  -- Set initial processing status
  IF TG_OP = 'INSERT' THEN
    NEW.processing_status := 'pending';
  END IF;

  -- Validate signal data
  IF NEW.price <= 0 THEN
    RAISE EXCEPTION 'Invalid price value';
  END IF;

  IF NEW.confidence < 0 OR NEW.confidence > 100 THEN
    RAISE EXCEPTION 'Invalid confidence value';
  END IF;

  IF NEW.timeframe <= 0 THEN
    RAISE EXCEPTION 'Invalid timeframe value';
  END IF;

  -- Update processing status when result is set
  IF NEW.result IS NOT NULL AND OLD.result IS NULL THEN
    NEW.processing_status := 'completed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for signal processing
DROP TRIGGER IF EXISTS handle_signal_processing_trigger ON signals;
CREATE TRIGGER handle_signal_processing_trigger
  BEFORE INSERT OR UPDATE ON signals
  FOR EACH ROW
  EXECUTE FUNCTION handle_signal_processing();

-- Add function to cleanup old signals
CREATE OR REPLACE FUNCTION cleanup_old_signals()
RETURNS void AS $$
BEGIN
  -- Mark old pending signals as error
  UPDATE signals
  SET processing_status = 'error'
  WHERE processing_status = 'pending'
  AND created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
