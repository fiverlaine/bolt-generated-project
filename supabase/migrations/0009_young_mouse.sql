/*
  # Add user authentication to signals table

  1. Changes
    - Add user_id column to signals table linked to auth.users
    - Update RLS policies to be user-specific
    - Add index for better query performance

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own signals
*/

-- Add user_id column that references auth.users
ALTER TABLE signals 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for better performance
CREATE INDEX idx_signals_user_id ON signals(user_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON signals;
DROP POLICY IF EXISTS "Enable insert for all users" ON signals;
DROP POLICY IF EXISTS "Enable update for all users" ON signals;
DROP POLICY IF EXISTS "Enable delete for all users" ON signals;

-- Create new user-specific policies
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
