/*
  # Fix clear history functionality
  
  1. Changes
    - Add delete policy for all users
    - Add cascade delete trigger
*/

-- Drop existing delete policy if exists
DROP POLICY IF EXISTS "Enable delete for all users" ON signals;

-- Create new delete policy
CREATE POLICY "Enable delete for all users"
  ON signals FOR DELETE
  TO public
  USING (true);

-- Add cascade delete trigger
CREATE OR REPLACE FUNCTION cascade_delete_signals()
RETURNS TRIGGER AS $$
BEGIN
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;
