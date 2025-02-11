/*
  # Fix Martingale Columns

  1. Changes
    - Drop and recreate martingale columns with proper snake_case naming
    - Add proper constraints and defaults
    - Create optimized index
    - Remove complex triggers that may cause issues
*/

-- Drop existing columns and triggers
DROP TRIGGER IF EXISTS validate_martingale_update ON signals;
DROP FUNCTION IF EXISTS validate_martingale_update();
ALTER TABLE signals 
  DROP COLUMN IF EXISTS martingale_step,
  DROP COLUMN IF EXISTS martingale_multiplier;

-- Add columns with proper naming and constraints
ALTER TABLE signals 
  ADD COLUMN martingale_step INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN martingale_multiplier NUMERIC NOT NULL DEFAULT 1;

-- Create optimized index
DROP INDEX IF EXISTS idx_signals_martingale;
CREATE INDEX idx_signals_martingale ON signals(martingale_step, martingale_multiplier);
