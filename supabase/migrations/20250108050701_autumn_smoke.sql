-- Drop existing martingale columns if they exist
ALTER TABLE signals DROP COLUMN IF EXISTS martingale_step;
ALTER TABLE signals DROP COLUMN IF EXISTS martingale_multiplier;

-- Add martingale columns with proper constraints
ALTER TABLE signals 
ADD COLUMN martingale_step INTEGER NOT NULL DEFAULT 0 CHECK (martingale_step >= 0 AND martingale_step <= 2),
ADD COLUMN martingale_multiplier NUMERIC NOT NULL DEFAULT 1 CHECK (martingale_multiplier >= 1);

-- Create index for better performance
DROP INDEX IF EXISTS idx_signals_martingale;
CREATE INDEX idx_signals_martingale ON signals(martingale_step, martingale_multiplier);

-- Add trigger to validate martingale updates
CREATE OR REPLACE FUNCTION validate_martingale_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure martingale step can only increment
  IF NEW.martingale_step < OLD.martingale_step THEN
    RAISE EXCEPTION 'Martingale step can only increment';
  END IF;
  
  -- Ensure we can't change step/multiplier after result is set
  IF OLD.result IS NOT NULL AND 
    (NEW.martingale_step != OLD.martingale_step OR NEW.martingale_multiplier != OLD.martingale_multiplier) THEN
    RAISE EXCEPTION 'Cannot modify martingale after result is set';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_martingale_update ON signals;
CREATE TRIGGER validate_martingale_update
  BEFORE UPDATE ON signals
  FOR EACH ROW
  EXECUTE FUNCTION validate_martingale_update();
