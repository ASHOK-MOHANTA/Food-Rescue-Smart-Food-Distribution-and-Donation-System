/*
  # Fix volunteer permissions for accepting donations

  1. Update RLS policies to allow volunteers to accept pending donations
  2. Ensure volunteers can update donations they accept
  3. Fix permission issues with donation status updates
*/

-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Volunteers can update assigned donations" ON donations;
DROP POLICY IF EXISTS "Donors can manage own donations" ON donations;

-- Create more permissive policies for volunteers
CREATE POLICY "Volunteers can accept pending donations"
  ON donations
  FOR UPDATE
  TO authenticated
  USING (
    status = 'pending' AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'volunteer'
    )
  )
  WITH CHECK (
    status = 'accepted' AND
    volunteer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'volunteer'
    )
  );

-- Allow volunteers to update their assigned donations
CREATE POLICY "Volunteers can update their assigned donations"
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

-- Donors can manage their own donations
CREATE POLICY "Donors can manage own donations"
  ON donations
  FOR ALL
  TO authenticated
  USING (donor_id = auth.uid())
  WITH CHECK (donor_id = auth.uid());

-- Allow volunteers to insert volunteer assignments
CREATE POLICY "Volunteers can create assignments"
  ON volunteer_assignments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    volunteer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'volunteer'
    )
  );