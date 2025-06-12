/*
  # Create feedback table

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `donation_id` (uuid, foreign key to donations)
      - `reviewer_id` (uuid, foreign key to users) - who is giving feedback
      - `reviewee_id` (uuid, foreign key to users) - who is being reviewed
      - `rating` (integer) - 1-5 stars
      - `comment` (text, optional)
      - `feedback_type` (text) - donor_to_volunteer, volunteer_to_donor, recipient_to_volunteer, etc.
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `feedback` table
    - Add policies for users to manage their feedback
*/

CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL REFERENCES donations(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  feedback_type text NOT NULL CHECK (feedback_type IN ('donor_to_volunteer', 'volunteer_to_donor', 'recipient_to_volunteer', 'volunteer_to_recipient')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(donation_id, reviewer_id, reviewee_id, feedback_type)
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Users can create feedback they are giving
CREATE POLICY "Users can create own feedback"
  ON feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id = auth.uid());

-- Users can view feedback they gave or received
CREATE POLICY "Users can view relevant feedback"
  ON feedback
  FOR SELECT
  TO authenticated
  USING (reviewer_id = auth.uid() OR reviewee_id = auth.uid());

-- Users can update feedback they created
CREATE POLICY "Users can update own feedback"
  ON feedback
  FOR UPDATE
  TO authenticated
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

-- Trigger to automatically update updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();