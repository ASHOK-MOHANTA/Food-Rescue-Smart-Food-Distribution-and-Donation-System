/*
  # Add demo data for testing

  1. Temporarily disable foreign key constraints
  2. Insert demo users
  3. Insert demo donations
  4. Insert demo assignments and notifications
  5. Re-enable foreign key constraints
*/

-- Temporarily disable foreign key constraints to allow demo data insertion
ALTER TABLE public.donations DROP CONSTRAINT IF EXISTS donations_donor_id_fkey;
ALTER TABLE public.donations DROP CONSTRAINT IF EXISTS donations_volunteer_id_fkey;
ALTER TABLE public.donations DROP CONSTRAINT IF EXISTS donations_recipient_id_fkey;
ALTER TABLE public.volunteer_assignments DROP CONSTRAINT IF EXISTS volunteer_assignments_donation_id_fkey;
ALTER TABLE public.volunteer_assignments DROP CONSTRAINT IF EXISTS volunteer_assignments_volunteer_id_fkey;
ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_donation_id_fkey;
ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_reviewer_id_fkey;
ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_reviewee_id_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Insert demo users into the public.users table
INSERT INTO public.users (
  id,
  email,
  full_name,
  role,
  phone_number,
  address,
  location_lat,
  location_lng,
  avatar_url,
  created_at,
  updated_at
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'donor@example.com',
  'Demo Donor',
  'donor',
  '+1-555-0101',
  '123 Donor Street, Food City, FC 12345',
  40.7128,
  -74.0060,
  null,
  now(),
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
  'volunteer@example.com', 
  'Demo Volunteer',
  'volunteer',
  '+1-555-0102',
  '456 Helper Avenue, Service Town, ST 67890',
  40.7589,
  -73.9851,
  null,
  now(),
  now()
),
(
  '33333333-3333-3333-3333-333333333333',
  'recipient@example.com',
  'Demo Recipient', 
  'recipient',
  '+1-555-0103',
  '789 Community Lane, Need City, NC 54321',
  40.7505,
  -73.9934,
  null,
  now(),
  now()
)
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  phone_number = EXCLUDED.phone_number,
  address = EXCLUDED.address,
  location_lat = EXCLUDED.location_lat,
  location_lng = EXCLUDED.location_lng,
  updated_at = now();

-- Add some sample donations from the demo donor
INSERT INTO public.donations (
  id,
  title,
  description,
  food_type,
  food_quantity,
  food_weight,
  expiration_date,
  pickup_date_time,
  donor_id,
  donor_name,
  volunteer_id,
  volunteer_name,
  recipient_id,
  recipient_name,
  status,
  location_lat,
  location_lng,
  location_address,
  created_at,
  updated_at
) VALUES 
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Fresh Vegetables from Restaurant',
  'Surplus vegetables from our daily prep - carrots, lettuce, tomatoes, and bell peppers. All fresh and good for 2-3 days.',
  'Fresh Produce',
  5,
  '10 lbs',
  CURRENT_DATE + INTERVAL '2 days',
  CURRENT_TIMESTAMP + INTERVAL '4 hours',
  '11111111-1111-1111-1111-111111111111',
  'Demo Donor',
  null,
  null,
  null,
  null,
  'pending',
  40.7128,
  -74.0060,
  '123 Donor Street, Food City, FC 12345',
  now(),
  now()
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Bakery Items - End of Day',
  'Fresh bread, pastries, and baked goods from our bakery. Perfect for families or food banks.',
  'Baked Goods',
  15,
  '8 lbs',
  CURRENT_DATE + INTERVAL '1 day',
  CURRENT_TIMESTAMP + INTERVAL '2 hours',
  '11111111-1111-1111-1111-111111111111',
  'Demo Donor',
  '22222222-2222-2222-2222-222222222222',
  'Demo Volunteer',
  null,
  null,
  'accepted',
  40.7128,
  -74.0060,
  '123 Donor Street, Food City, FC 12345',
  now(),
  now()
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Canned Goods Donation',
  'Assorted canned vegetables, soups, and fruits. Non-perishable items perfect for food pantries.',
  'Canned Goods',
  25,
  '15 lbs',
  CURRENT_DATE + INTERVAL '30 days',
  CURRENT_TIMESTAMP + INTERVAL '6 hours',
  '11111111-1111-1111-1111-111111111111',
  'Demo Donor',
  null,
  null,
  null,
  null,
  'pending',
  40.7128,
  -74.0060,
  '123 Donor Street, Food City, FC 12345',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = now();

-- Add a volunteer assignment for the accepted donation
INSERT INTO public.volunteer_assignments (
  id,
  donation_id,
  volunteer_id,
  assigned_at,
  accepted_at,
  completed_at,
  status,
  notes,
  created_at,
  updated_at
) VALUES (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222',
  now() - INTERVAL '1 hour',
  now() - INTERVAL '30 minutes',
  null,
  'accepted',
  'Ready to pick up and deliver to local food bank',
  now(),
  now()
)
ON CONFLICT (donation_id, volunteer_id) DO UPDATE SET
  status = EXCLUDED.status,
  notes = EXCLUDED.notes,
  updated_at = now();

-- Add some sample notifications
INSERT INTO public.notifications (
  id,
  user_id,
  title,
  message,
  type,
  related_id,
  read,
  created_at
) VALUES 
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '11111111-1111-1111-1111-111111111111',
  'Volunteer Assigned',
  'Demo Volunteer has been assigned to pick up your bakery donation.',
  'volunteer_assigned',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  false,
  now() - INTERVAL '30 minutes'
),
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '22222222-2222-2222-2222-222222222222',
  'New Donation Available',
  'A new donation of fresh vegetables is available for pickup.',
  'donation_created',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  false,
  now() - INTERVAL '2 hours'
),
(
  '10101010-1010-1010-1010-101010101010',
  '33333333-3333-3333-3333-333333333333',
  'Welcome to FoodRescue',
  'Thank you for joining our community! You can now browse available food donations.',
  'general',
  null,
  false,
  now() - INTERVAL '1 day'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  read = EXCLUDED.read;

-- Add some sample feedback
INSERT INTO public.feedback (
  id,
  donation_id,
  reviewer_id,
  reviewee_id,
  rating,
  comment,
  feedback_type,
  created_at,
  updated_at
) VALUES (
  '20202020-2020-2020-2020-202020202020',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  5,
  'Excellent volunteer! Very professional and timely pickup.',
  'donor_to_volunteer',
  now() - INTERVAL '1 hour',
  now() - INTERVAL '1 hour'
)
ON CONFLICT (donation_id, reviewer_id, reviewee_id, feedback_type) DO UPDATE SET
  rating = EXCLUDED.rating,
  comment = EXCLUDED.comment,
  updated_at = now();

-- Re-add all foreign key constraints (but make them NOT VALID to allow existing data)
ALTER TABLE public.donations 
ADD CONSTRAINT donations_donor_id_fkey 
FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
NOT VALID;

ALTER TABLE public.donations 
ADD CONSTRAINT donations_volunteer_id_fkey 
FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE SET NULL
NOT VALID;

ALTER TABLE public.donations 
ADD CONSTRAINT donations_recipient_id_fkey 
FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL
NOT VALID;

ALTER TABLE public.volunteer_assignments 
ADD CONSTRAINT volunteer_assignments_donation_id_fkey 
FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
NOT VALID;

ALTER TABLE public.volunteer_assignments 
ADD CONSTRAINT volunteer_assignments_volunteer_id_fkey 
FOREIGN KEY (volunteer_id) REFERENCES users(id) ON DELETE CASCADE
NOT VALID;

ALTER TABLE public.feedback 
ADD CONSTRAINT feedback_donation_id_fkey 
FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
NOT VALID;

ALTER TABLE public.feedback 
ADD CONSTRAINT feedback_reviewer_id_fkey 
FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
NOT VALID;

ALTER TABLE public.feedback 
ADD CONSTRAINT feedback_reviewee_id_fkey 
FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE
NOT VALID;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
NOT VALID;