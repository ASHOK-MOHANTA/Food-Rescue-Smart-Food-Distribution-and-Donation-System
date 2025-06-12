/*
  # Create donations table

  1. New Tables
    - `donations`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `food_type` (text)
      - `food_quantity` (integer)
      - `food_weight` (text)
      - `expiration_date` (date)
      - `pickup_date_time` (timestamp)
      - `donor_id` (uuid, foreign key to users)
      - `donor_name` (text)
      - `volunteer_id` (uuid, foreign key to users, optional)
      - `volunteer_name` (text, optional)
      - `recipient_id` (uuid, foreign key to users, optional)
      - `recipient_name` (text, optional)
      - `status` (text) - pending, accepted, in-progress, delivered, completed
      - `location_lat` (numeric)
      - `location_lng` (numeric)
      - `location_address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `donations` table
    - Add policies for different user roles
*/

CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  food_type text NOT NULL,
  food_quantity integer NOT NULL DEFAULT 1,
  food_weight text NOT NULL,
  expiration_date date NOT NULL,
  pickup_date_time timestamptz NOT NULL,
  donor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  donor_name text NOT NULL,
  volunteer_id uuid REFERENCES users(id) ON DELETE SET NULL,
  volunteer_name text,
  recipient_id uuid REFERENCES users(id) ON DELETE SET NULL,
  recipient_name text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in-progress', 'delivered', 'completed')),
  location_lat numeric NOT NULL,
  location_lng numeric NOT NULL,
  location_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Donors can manage their own donations
CREATE POLICY "Donors can manage own donations"
  ON donations
  FOR ALL
  TO authenticated
  USING (donor_id = auth.uid())
  WITH CHECK (donor_id = auth.uid());

-- Volunteers can view all donations and update assigned ones
CREATE POLICY "Volunteers can view all donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'volunteer'
    )
  );

CREATE POLICY "Volunteers can update assigned donations"
  ON donations
  FOR UPDATE
  TO authenticated
  USING (
    volunteer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'volunteer'
    )
  )
  WITH CHECK (
    volunteer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'volunteer'
    )
  );

-- Recipients can view non-pending donations
CREATE POLICY "Recipients can view available donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (
    status != 'pending' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'recipient'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();