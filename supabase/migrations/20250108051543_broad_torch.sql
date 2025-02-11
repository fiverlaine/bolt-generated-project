-- Drop existing martingale columns and triggers if they exist
DROP TRIGGER IF EXISTS validate_martingale_update ON signals;
DROP FUNCTION IF EXISTS validate_martingale_update();
ALTER TABLE signals 
  DROP COLUMN IF EXISTS martingale_step,
  DROP COLUMN IF EXISTS martingale_multiplier;

-- Add martingale columns with proper constraints
ALTER TABLE signals 
  ADD COLUMN martingale_step INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN martingale_multiplier NUMERIC NOT NULL DEFAULT 1;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_signals_martingale ON signals(martingale_step, martingale_multiplier);

-- Add trigger to validate martingale updates
CREATE OR REPLACE FUNCTION validate_martingale_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.martingale_step < 0 OR NEW.martingale_step > 2 THEN
    RAISE EXCEPTION 'Invalid martingale step';
  END IF;
  
  IF NEW.martingale_multiplier < 1 THEN
    RAISE EXCEPTION 'Invalid martingale multiplier';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_martingale_update
  BEFORE UPDATE OR INSERT ON signals
  FOR EACH ROW
  EXECUTE FUNCTION validate_martingale_update();
