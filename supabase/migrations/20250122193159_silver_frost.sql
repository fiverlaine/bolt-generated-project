-- Drop existing table and recreate with all required columns
DROP TABLE IF EXISTS signals CASCADE;

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
  martingaleStep INTEGER NOT NULL DEFAULT 0 CHECK (martingaleStep >= 0 AND martingaleStep <= 2),
  martingaleMultiplier NUMERIC(10,2) NOT NULL DEFAULT 1.0 CHECK (martingaleMultiplier >= 1.0),
  time TEXT NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'error')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create all necessary indexes
CREATE INDEX idx_signals_user_id ON signals(user_id);
CREATE INDEX idx_signals_created_at ON signals(created_at);
CREATE INDEX idx_signals_martingale ON signals(user_id, martingaleStep, martingaleMultiplier);
CREATE INDEX idx_signals_processing ON signals(user_id, processing_status, created_at DESC) WHERE processing_status = 'pending';
CREATE INDEX idx_signals_active ON signals(user_id, created_at DESC) WHERE result IS NULL AND processing_status = 'pending';

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
