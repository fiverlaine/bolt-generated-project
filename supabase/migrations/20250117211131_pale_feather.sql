/*
  # Add time column to signals table

  1. Changes
    - Add time column to store signal time
    - Update indexes for better performance
*/

-- Add time column
ALTER TABLE signals ADD COLUMN IF NOT EXISTS time TEXT;

-- Create index for time column
CREATE INDEX IF NOT EXISTS idx_signals_time ON signals(time);

-- Update existing signals with a default time if needed
UPDATE signals 
SET time = to_char(created_at::timestamp, 'HH24:MI:SS')
WHERE time IS NULL;

-- Make time column required for future inserts
ALTER TABLE signals ALTER COLUMN time SET NOT NULL;
