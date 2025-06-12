/*
  # Create volunteer assignments table

  1. New Tables
    - `volunteer_assignments`
      - `id` (uuid, primary key)
      - `donation_id` (uuid, foreign key to donations)
      - `volunteer_id` (uuid, foreign key to users)
      - `assigned_at` (timestamp)
      - `accepted_at` (timestamp, optional)
      - `completed_at` (timestamp, optional)
      - `status` (text) - assigned, accepted, completed, cancelled
      - `notes` (text, optional)

  2. Security
    - Enable RLS on `volunteer_assignments` table
    - Add policies for volunteers and donors
*/

CREATE TABLE IF NOT EXISTS volunteer_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  volunteer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'accepted', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(donation_id, volunteer_id)
);

ALTER TABLE volunteer_assignments ENABLE ROW LEVEL SECURITY;

-- Volunteers can view and update their own assignments
CREATE POLICY "Volunteers can manage own assignments"
  ON volunteer_assignments
  FOR ALL
  TO authenticated
  USING (volunteer_id = auth.uid())
  WITH CHECK (volunteer_id = auth.uid());

-- Donors can view assignments for their donations
CREATE POLICY "Donors can view assignments for their donations"
  ON volunteer_assignments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM donations 
      WHERE id = donation_id AND donor_id = auth.uid()
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_volunteer_assignments_updated_at
  BEFORE UPDATE ON volunteer_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();