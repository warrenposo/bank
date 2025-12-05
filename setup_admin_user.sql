-- =====================================================
-- ADMIN USER SETUP SCRIPT
-- =====================================================
-- This script sets up the admin user: warrenokumu98@gmail.com
-- Password: Twenty37
-- =====================================================
-- IMPORTANT: Run this script AFTER creating the user in Supabase Auth dashboard
-- OR use the Supabase Management API to create the user first
-- =====================================================

-- Step 1: Create or update the admin user profile
-- This assumes the user already exists in auth.users
-- You may need to create the user first via Supabase Auth or API

-- Update profile to set admin status
-- Replace 'USER_ID_HERE' with the actual user_id from auth.users table
-- Or use email to find the user_id first:

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find user_id by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'warrenokumu98@gmail.com'
  LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Update existing profile or create if doesn't exist
    INSERT INTO public.profiles (user_id, phone_number, name, balance, is_admin)
    VALUES (v_user_id, '+254712345678', 'Admin User', 1000000.00, true)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      is_admin = true,
      updated_at = now();
    
    RAISE NOTICE 'Admin user profile created/updated for: %', v_user_id;
  ELSE
    RAISE NOTICE 'User with email warrenokumu98@gmail.com not found. Please create the user in Supabase Auth first.';
  END IF;
END $$;

-- =====================================================
-- MANUAL SETUP INSTRUCTIONS:
-- =====================================================
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Authentication > Users
-- 3. Click "Add User" or "Invite User"
-- 4. Enter email: warrenokumu98@gmail.com
-- 5. Set password: Twenty37
-- 6. Auto confirm the user
-- 7. After user is created, run the UPDATE query above
-- =====================================================

-- Alternative: Direct update if you know the user_id
-- UPDATE public.profiles
-- SET is_admin = true,
--     balance = 1000000.00,
--     updated_at = now()
-- WHERE user_id = 'USER_ID_HERE';

-- =====================================================
-- VERIFY ADMIN USER
-- =====================================================
SELECT 
  u.id,
  u.email,
  p.name,
  p.phone_number,
  p.balance,
  p.is_admin,
  p.created_at
FROM auth.users u
JOIN public.profiles p ON p.user_id = u.id
WHERE u.email = 'warrenokumu98@gmail.com';


