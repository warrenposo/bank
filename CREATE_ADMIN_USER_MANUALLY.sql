-- =====================================================
-- CREATE ADMIN USER MANUALLY IN SUPABASE
-- =====================================================
-- Email: warrenokumu98@gmail.com
-- Password: Twenty37
-- =====================================================
-- Run these SQL commands in Supabase Dashboard → SQL Editor
-- =====================================================

-- STEP 1: First, you need to create the user in Supabase Auth
-- Go to: Authentication → Users → Add User
-- Email: warrenokumu98@gmail.com
-- Password: Twenty37
-- Auto Confirm User: ✓ (Enable this)
-- Then come back and run the SQL below

-- =====================================================
-- STEP 2: Create/Update Profile for Admin User
-- =====================================================

-- This will create the profile and set admin privileges
INSERT INTO public.profiles (user_id, phone_number, name, balance, is_admin)
SELECT 
  id,
  '+254712345678',
  'Warren Okumu',
  1000000.00,
  true
FROM auth.users
WHERE email = 'warrenokumu98@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  is_admin = true,
  balance = 1000000.00,
  name = 'Warren Okumu',
  updated_at = now();

-- =====================================================
-- STEP 3: Verify Admin User Was Created
-- =====================================================

-- Run this to check if the admin user exists and has admin privileges
SELECT 
  u.id as user_id,
  u.email,
  u.created_at as user_created,
  p.id as profile_id,
  p.name,
  p.phone_number,
  p.balance,
  p.is_admin,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE u.email = 'warrenokumu98@gmail.com';

-- If you see:
-- - user_id and email: User exists in auth ✓
-- - profile_id and is_admin=true: Profile exists with admin ✓
-- - NULL profile_id: Profile doesn't exist (run STEP 2 again)

-- =====================================================
-- ALTERNATIVE: Create Test Regular User
-- =====================================================

-- If you want to create a test regular user too:
-- First create in Auth Dashboard, then run:

INSERT INTO public.profiles (user_id, phone_number, name, balance, is_admin)
SELECT 
  id,
  '+254700000000',
  'Test User',
  500.00,
  false
FROM auth.users
WHERE email = 'test@example.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  balance = 500.00,
  updated_at = now();

-- =====================================================
-- STEP 4: After Creating User - Test Login
-- =====================================================

-- Now go to your web app and try to login with:
-- Email: warrenokumu98@gmail.com
-- Password: Twenty37

-- If login works → Problem is with SIGNUP, not authentication
-- If login fails → Problem is with fetching profile or session management

