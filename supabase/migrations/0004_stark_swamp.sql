/*
  # Fix UUID handling for signals table

  1. Changes
    - Drop and recreate signals table with proper UUID handling
    - Add proper constraints and indexes
    - Update RLS policies
  
  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Drop existing table
DROP TABLE IF EXISTS signals CASCADE;

-- Recreate signals table with proper UUID handling
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  price NUMERIC NOT NULL,
  pair TEXT NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  result TEXT CHECK (result IN ('win', 'loss')),
  profit_loss NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  timeframe INTEGER NOT NULL CHECK (timeframe > 0),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_signals_updated_at
    BEFORE UPDATE ON signals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_signals_created_at ON signals(created_at);
CREATE INDEX idx_signals_pair ON signals(pair);
CREATE INDEX idx_signals_type ON signals(type);

-- Enable RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON signals FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON signals FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON signals FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Enable delete for all users"
  ON signals FOR DELETE
  TO public
  USING (true);
