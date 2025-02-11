/*
  # Final Martingale Schema Fix

  1. Changes
    - Drop all existing martingale columns and start fresh
    - Add columns with proper constraints and defaults
    - Create composite index for performance
    - Keep schema simple without complex triggers
*/

-- Drop existing columns completely
ALTER TABLE signals 
  DROP COLUMN IF EXISTS martingale_step CASCADE,
  DROP COLUMN IF EXISTS martingale_multiplier CASCADE;

-- Add columns with proper constraints
ALTER TABLE signals 
  ADD COLUMN martingale_step INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN martingale_multiplier NUMERIC(10,2) DEFAULT 1.0 NOT NULL;

-- Create composite index for performance
DROP INDEX IF EXISTS idx_signals_martingale;
CREATE INDEX idx_signals_martingale ON signals(user_id, martingale_step, martingale_multiplier);

-- Ensure RLS policies are updated
DROP POLICY IF EXISTS "Users can read own signals" ON signals;
DROP POLICY IF EXISTS "Users can insert own signals" ON signals;
DROP POLICY IF EXISTS "Users can update own signals" ON signals;
DROP POLICY IF EXISTS "Users can delete own signals" ON signals;

CREATE POLICY "Users can read own signals"
  ON signals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own signals"
  ON signals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own signals"
  ON signals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own signals"
  ON signals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
