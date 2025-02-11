-- Drop existing table and policies
DROP TABLE IF EXISTS signals CASCADE;

-- Recreate signals table with proper constraints
CREATE TABLE signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  price numeric NOT NULL,
  pair text NOT NULL,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  result text CHECK (result IN ('win', 'loss')),
  profit_loss numeric,
  created_at timestamptz DEFAULT now(),
  timeframe integer NOT NULL CHECK (timeframe > 0),
  updated_at timestamptz DEFAULT now()
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

-- Create indexes for better performance
CREATE INDEX idx_signals_created_at ON signals(created_at);
CREATE INDEX idx_signals_pair ON signals(pair);
CREATE INDEX idx_signals_type ON signals(type);

-- Enable RLS
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
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
