-- Drop and recreate signals table with all required columns
DROP TABLE IF EXISTS signals CASCADE;

CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  price NUMERIC NOT NULL,
  pair TEXT NOT NULL,
  confidence NUMERIC NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  result TEXT CHECK (result IN ('win', 'loss')),
  profit_loss NUMERIC,
  timeframe INTEGER NOT NULL CHECK (timeframe > 0),
  martingale_step INTEGER DEFAULT 0 NOT NULL,
  martingale_multiplier NUMERIC(10,2) DEFAULT 1.0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_signals_user_id ON signals(user_id);
CREATE INDEX idx_signals_created_at ON signals(created_at);
CREATE INDEX idx_signals_martingale ON signals(user_id, martingale_step, martingale_multiplier);

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

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_signals_updated_at
    BEFORE UPDATE ON signals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
