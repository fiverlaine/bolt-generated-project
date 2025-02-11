/*
  # Add check_result_at column to signals table

  1. Changes
    - Add check_result_at column to signals table to track when to verify signal results
    - Add index for better performance when querying pending signals
*/

-- Add check_result_at column
ALTER TABLE signals 
ADD COLUMN check_result_at TIMESTAMPTZ;

-- Create index for better performance
CREATE INDEX idx_signals_check_result ON signals(check_result_at) 
WHERE result IS NULL;
