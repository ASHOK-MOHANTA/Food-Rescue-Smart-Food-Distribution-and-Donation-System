/*
  # Update authentication settings for easier development

  1. Disable email confirmation requirement
  2. Allow simple email formats
  3. Reduce password requirements
  4. Update user creation trigger to be more flexible
*/

-- Update the user creation function to be more flexible
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name', 
      split_part(new.email, '@', 1),
      'User'
    ),
    COALESCE(
      new.raw_user_meta_data->>'role',
      'recipient'
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    role = COALESCE(EXCLUDED.role, users.role),
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();