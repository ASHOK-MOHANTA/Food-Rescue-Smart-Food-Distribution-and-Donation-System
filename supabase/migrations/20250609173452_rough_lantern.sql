/*
  # Create users table

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches auth.users id
      - `email` (text, unique)
      - `full_name` (text)
      - `role` (text) - donor, volunteer, recipient
      - `phone_number` (text, optional)
      - `address` (text, optional)
      - `location_lat` (numeric, optional)
      - `location_lng` (numeric, optional)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read/update their own data
    - Add policy for authenticated users to read other users' basic info
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'recipient' CHECK (role IN ('donor', 'volunteer', 'recipient')),
  phone_number text,
  address text,
  location_lat numeric,
  location_lng numeric,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own data
CREATE POLICY "Users can manage own data"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Authenticated users can read basic info of other users
CREATE POLICY "Users can read others basic info"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

-- Function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();