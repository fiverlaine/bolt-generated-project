/*
  # Fix Martingale Structure

  1. Changes
    - Recreate signals table with proper structure
    - Add proper constraints and indexes
    - Update RLS policies
    - Add validation triggers
*/

-- Drop existing table and functions
DROP TABLE IF EXISTS signals CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Create signals table with all required columns
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  price NUMERIC NOT NULL CHECK (price > 0),
  pair TEXT NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  result TEXT CHECK (result IN ('win', 'loss')),
  profit_loss NUMERIC,
  timeframe INTEGER NOT NULL CHECK (timeframe > 0),
  martingale_step INTEGER NOT NULL DEFAULT 0 CHECK (martingale_step >= 0 AND martingale_step <= 2),
  martingale_multiplier NUMERIC(10,2) NOT NULL DEFAULT 1.0 CHECK (martingale_multiplier >= 1.0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_signals_user_id ON signals(user_id);
CREATE INDEX idx_signals_created_at ON signals(created_at);
CREATE INDEX idx_signals_martingale ON signals(user_id, martingale_step, martingale_multiplier);
CREATE INDEX idx_signals_pair_time ON signals(pair, created_at DESC);

-- Enable RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_signals_updated_at
    BEFORE UPDATE ON signals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create validation trigger function
CREATE OR REPLACE FUNCTION validate_signal_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate martingale step and multiplier
    IF NEW.martingale_step < 0 OR NEW.martingale_step > 2 THEN
        RAISE EXCEPTION 'Invalid martingale step: must be between 0 and 2';
    END IF;

    IF NEW.martingale_multiplier < 1.0 THEN
        RAISE EXCEPTION 'Invalid martingale multiplier: must be >= 1.0';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for validation
CREATE TRIGGER validate_signal_insert
    BEFORE INSERT ON signals
    FOR EACH ROW
    EXECUTE FUNCTION validate_signal_insert();
