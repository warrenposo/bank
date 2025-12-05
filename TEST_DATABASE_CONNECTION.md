# Test Database Connection - Manual User Creation

## Purpose
Create the admin user directly in Supabase to isolate the problem:
- If login works → Problem is with the signup process
- If login fails → Problem is with authentication or fetching data

## Step-by-Step Instructions

### Step 1: Create User in Supabase Auth

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Users**
3. Click **"Add User"** button
4. Fill in:
   - **Email:** `warrenokumu98@gmail.com`
   - **Password:** `Twenty37`
   - ✅ **Auto Confirm User:** Enable this checkbox
5. Click **"Create User"**

### Step 2: Create Profile via SQL

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste this SQL:

```sql
-- Create profile for admin user
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
```

3. Click **"Run"**

### Step 3: Verify User Was Created

Run this SQL to verify:

```sql
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
```

**Expected Result:**
- You should see one row with:
  - `email`: warrenokumu98@gmail.com
  - `name`: Warren Okumu
  - `balance`: 1000000.00
  - `is_admin`: true

### Step 4: Test Login in Your Web App

1. **Make sure your dev server is running**
2. **Go to the login page**
3. **Enter:**
   - Email: `warrenokumu98@gmail.com`
   - Password: `Twenty37`
4. **Click LOGIN**

### Step 5: Check What Happens

**Scenario A: Login Works →** Problem is with SIGNUP code
- You'll be redirected to the home page
- This means fetching data works fine
- The issue is only with creating new users

**Scenario B: Login Fails →** Problem is with AUTH or FETCHING
- Check browser console for errors
- Check Network tab for the actual error
- This means there's an authentication/session issue

## Important Note

**Before testing login, you MUST restart your dev server:**
```bash
# Stop server (Ctrl+C)
npm run dev
```

Environment variables only load when the server starts!

## What This Test Tells Us

- **If login works:** We'll fix the signup code
- **If login fails with same error:** The problem is DNS/network, not the code
- **If login works but shows different error:** We'll fix that specific issue

Try this and let me know what happens when you try to login with the manually created user!

