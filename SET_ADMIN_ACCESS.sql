-- =====================================================
-- SET ADMIN ACCESS FOR warrenokumu98@gmail.com
-- =====================================================
-- Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Check current admin status
SELECT 
  u.email,
  p.name,
  p.is_admin,
  p.balance,
  p.user_id
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE u.email = 'warrenokumu98@gmail.com';

-- Expected: Should show is_admin = false or NULL

-- =====================================================

-- Step 2: Set user as admin
UPDATE public.profiles
SET 
  is_admin = true,
  updated_at = now()
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'warrenokumu98@gmail.com'
);

-- =====================================================

-- Step 3: Verify admin was set
SELECT 
  u.email,
  p.name,
  p.is_admin,
  p.balance,
  p.phone_number,
  p.created_at
FROM auth.users u
JOIN public.profiles p ON p.user_id = u.id
WHERE u.email = 'warrenokumu98@gmail.com';

-- Expected: Should show is_admin = true

-- =====================================================

-- Optional: Give admin extra balance for testing
UPDATE public.profiles
SET 
  balance = 100000.00,
  updated_at = now()
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'warrenokumu98@gmail.com'
);

-- =====================================================
-- DONE! Now logout and login again to see admin dashboard
-- =====================================================

