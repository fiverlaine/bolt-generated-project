-- Fix column names to match code
ALTER TABLE signals 
DROP COLUMN IF EXISTS martingale_step,
DROP COLUMN IF EXISTS martingale_multiplier;

ALTER TABLE signals
ADD COLUMN martingaleStep INTEGER DEFAULT 0 NOT NULL CHECK (martingaleStep >= 0 AND martingaleStep <= 2),
ADD COLUMN martingaleMultiplier NUMERIC(10,2) DEFAULT 1.0 NOT NULL CHECK (martingaleMultiplier >= 1.0);

-- Create index for martingale fields
CREATE INDEX IF NOT EXISTS idx_signals_martingale 
ON signals(user_id, martingaleStep, martingaleMultiplier);

-- Update trigger function to handle martingale validation
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

  -- Validate martingale values
  IF NEW.martingaleStep < 0 OR NEW.martingaleStep > 2 THEN
    RAISE EXCEPTION 'Invalid martingale step: must be between 0 and 2';
  END IF;

  IF NEW.martingaleMultiplier < 1.0 THEN
    RAISE EXCEPTION 'Invalid martingale multiplier: must be >= 1.0';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
