-- =====================================================
-- CHECK IF SIGNUP TRIGGER EXISTS
-- =====================================================
-- Run these in Supabase SQL Editor to verify signup setup
-- =====================================================

-- 1. Check if trigger function exists
SELECT 
  routine_name,
  routine_type,
  routine_schema
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- Expected: Should show one row with routine_name = 'handle_new_user'
-- If empty → Trigger function doesn't exist (run the CREATE below)

-- =====================================================

-- 2. Check if trigger is attached to auth.users
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Expected: Should show trigger on auth.users table
-- If empty → Trigger is not attached (run the CREATE below)

-- =====================================================

-- 3. Test if profiles table exists and has correct structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Expected: Should show columns: id, user_id, phone_number, name, balance, is_admin, created_at, updated_at

-- =====================================================

-- 4. Check if transactions table exists (for welcome bonus)
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'transactions'
) as transactions_table_exists;

-- =====================================================
-- IF TRIGGER DOESN'T EXIST, CREATE IT:
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile for new user
  INSERT INTO public.profiles (user_id, phone_number, name, balance, is_admin)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'name',
    100.00,
    false
  );
  
  -- Create welcome bonus transaction (only if transactions table exists)
  BEGIN
    INSERT INTO public.transactions (
      user_id,
      type,
      amount,
      balance_before,
      balance_after,
      status,
      description,
      reference
    ) VALUES (
      NEW.id,
      'bonus',
      100.00,
      0.00,
      100.00,
      'completed',
      'Welcome Bonus - Thank you for joining!',
      'WELCOME-' || NEW.id::text
    );
  EXCEPTION
    WHEN undefined_table THEN
      -- If transactions table doesn't exist, just skip it
      NULL;
  END;
  
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- VERIFY TRIGGER WAS CREATED
-- =====================================================

SELECT 
  t.trigger_name,
  t.event_manipulation,
  t.event_object_table,
  p.proname as function_name
FROM information_schema.triggers t
JOIN pg_trigger pt ON pt.tgname = t.trigger_name
JOIN pg_proc p ON p.oid = pt.tgfoid
WHERE t.trigger_name = 'on_auth_user_created';

-- =====================================================
-- TEST SIGNUP (After running trigger creation)
-- =====================================================
-- Now try to signup via the web app
-- Check if profile is created with this query:

SELECT 
  u.email,
  p.name,
  p.phone_number,
  p.balance,
  p.is_admin,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 5;

-- This shows the last 5 users and their profiles

