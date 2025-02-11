/*
  # Add Martingale Support

  1. Changes
    - Add martingale_step column to track gale progression (0 = initial, 1 = first gale, 2 = second gale)
    - Add martingale_multiplier column to track entry size multiplier
*/

-- Add martingale columns
ALTER TABLE signals 
ADD COLUMN martingale_step INTEGER DEFAULT 0,
ADD COLUMN martingale_multiplier NUMERIC DEFAULT 1;

-- Create index for better performance
CREATE INDEX idx_signals_martingale ON signals(martingale_step);
