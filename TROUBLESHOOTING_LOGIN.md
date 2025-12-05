# Troubleshooting Login Issues

## Issue: "Invalid login credentials" Error

If you're seeing "Invalid login credentials" when trying to login as admin, follow these steps:

### Step 1: Verify Environment Variables

The `.env` file has been created. **IMPORTANT: You must restart your development server** for the environment variables to take effect.

1. Stop your current dev server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

### Step 2: Create Admin User in Supabase

The user `warrenokumu98@gmail.com` must exist in Supabase Auth before you can login.

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **"Add User"** or **"Invite User"**
5. Fill in:
   - **Email**: `warrenokumu98@gmail.com`
   - **Password**: `Twenty37`
   - **Auto Confirm User**: ✓ (Enable this checkbox)
6. Click **"Create User"**

### Step 3: Set Admin Privileges

After creating the user, you need to grant admin privileges:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL:

```sql
-- Update profile to set admin status
UPDATE public.profiles
SET is_admin = true,
    balance = 1000000.00,
    updated_at = now()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'warrenokumu98@gmail.com'
);

-- If profile doesn't exist, create it
INSERT INTO public.profiles (user_id, phone_number, name, balance, is_admin)
SELECT 
  id,
  '+254712345678',
  'Admin User',
  1000000.00,
  true
FROM auth.users
WHERE email = 'warrenokumu98@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET 
  is_admin = true,
  balance = 1000000.00,
  updated_at = now();
```

### Step 4: Verify Database Schema

Make sure all database tables exist:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run the `database_schema.sql` file
3. This creates all necessary tables, policies, and functions

### Step 5: Clear Browser Cache

Sometimes cached data can cause issues:

1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Clear **Local Storage** and **Session Storage**
4. Refresh the page

### Step 6: Check Console for Errors

After restarting the server, check the browser console:

1. Open DevTools (F12)
2. Look for any red error messages
3. Verify the Supabase URL in errors matches: `qbyfrwaxoijhwinvpdqk.supabase.co`

## Common Issues

### Issue: "Failed to load resource: 400 Bad Request"
**Solution**: The user doesn't exist in Supabase Auth. Create it first (Step 2).

### Issue: "Error fetching profile"
**Solution**: The profile table might not exist or RLS policies are blocking. Run `database_schema.sql`.

### Issue: Wrong Supabase URL in console
**Solution**: 
1. Verify `.env` file exists and has correct values
2. **Restart the dev server** (environment variables only load on startup)
3. Clear browser cache

### Issue: Can login but can't access admin panel
**Solution**: The user doesn't have `is_admin = true` in the profiles table. Run Step 3 SQL.

## Verification Checklist

- [ ] `.env` file exists with correct values
- [ ] Dev server restarted after creating `.env`
- [ ] User created in Supabase Auth Dashboard
- [ ] Admin privileges set via SQL
- [ ] Database schema run (`database_schema.sql`)
- [ ] Browser cache cleared
- [ ] Console shows correct Supabase URL

## Still Having Issues?

1. Check Supabase Dashboard → **Logs** for server-side errors
2. Verify your Supabase project is active (not paused)
3. Check that Auth is enabled in Supabase Dashboard
4. Verify the API key is the "anon/public" key, not the service role key


