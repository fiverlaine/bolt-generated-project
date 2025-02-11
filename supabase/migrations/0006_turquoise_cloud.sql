-- Create users table for email-only authentication
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users"
  ON users FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for all users"
  ON users FOR INSERT
  TO public
  WITH CHECK (true);

-- Create index
CREATE INDEX idx_users_email ON users(email);
