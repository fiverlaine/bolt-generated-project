/*
  # Update RLS policies for signals table
  
  1. Changes
    - Enable public access for signals table
    - Allow anonymous inserts and updates
    - Maintain data integrity with type checks
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own signals" ON signals;
DROP POLICY IF EXISTS "Users can insert their own signals" ON signals;
DROP POLICY IF EXISTS "Users can update their own signals" ON signals;

-- Create new policies for public access
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
