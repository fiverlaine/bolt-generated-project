/*
  # Fix Martingale Columns

  1. Changes
    - Drop and recreate martingale columns with proper constraints
    - Add indexes for performance
    - Update RLS policies
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper user access control
*/

-- First drop existing columns if they exist
ALTER TABLE signals 
DROP COLUMN IF EXISTS martingale_step CASCADE,
DROP COLUMN IF EXISTS martingale_multiplier CASCADE;

-- Add columns with proper constraints
ALTER TABLE signals 
ADD COLUMN martingale_step INTEGER DEFAULT 0 NOT NULL CHECK (martingale_step >= 0 AND martingale_step <= 2),
ADD COLUMN martingale_multiplier NUMERIC(10,2) DEFAULT 1.0 NOT NULL CHECK (martingale_multiplier >= 1.0);

-- Create optimized indexes
DROP INDEX IF EXISTS idx_signals_martingale;
CREATE INDEX idx_signals_martingale ON signals(user_id, martingale_step, martingale_multiplier);

-- Refresh RLS policies to ensure they're properly applied
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
