/*
  # Create signals table for trading history

  1. New Tables
    - `signals`
      - `id` (uuid, primary key)
      - `type` (text, buy/sell)
      - `price` (numeric)
      - `pair` (text)
      - `confidence` (numeric)
      - `result` (text, win/loss)
      - `profit_loss` (numeric)
      - `created_at` (timestamp)
      - `timeframe` (integer)
      
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  price numeric NOT NULL,
  pair text NOT NULL,
  confidence numeric NOT NULL,
  result text CHECK (result IN ('win', 'loss')),
  profit_loss numeric,
  created_at timestamptz DEFAULT now(),
  timeframe integer NOT NULL
);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own signals"
  ON signals
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own signals"
  ON signals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own signals"
  ON signals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
