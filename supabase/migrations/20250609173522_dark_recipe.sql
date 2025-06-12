/*
  # Create notifications table

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `message` (text)
      - `type` (text) - donation_created, volunteer_assigned, status_update, etc.
      - `related_id` (uuid, optional) - related donation/assignment id
      - `read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Add policy for users to manage their own notifications
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('donation_created', 'volunteer_assigned', 'status_update', 'feedback_received', 'general')),
  related_id uuid,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can manage their own notifications
CREATE POLICY "Users can manage own notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_volunteer_id ON donations(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_volunteer_id ON volunteer_assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_assignments_donation_id ON volunteer_assignments(donation_id);