# Create Admin User Directly in Supabase

## Quick SQL Commands

Since command line can reach Supabase but browser can't, let's create the user directly via SQL to test.

### Step 1: Create User in Auth

Go to Supabase Dashboard → **Authentication** → **Users** → Click **"Add User"**

- Email: `warrenokumu98@gmail.com`
- Password: `Twenty37`
- Auto Confirm User: ✓ Enable
- Click "Create User"

### Step 2: Create Profile via SQL

Go to **SQL Editor** and run:

```sql
-- Create admin profile
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

### Step 3: Verify User Exists

```sql
-- Check if user and profile exist
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.name,
  p.balance,
  p.is_admin
FROM auth.users u
LEFT JOIN public.profiles p ON p.user_id = u.id
WHERE u.email = 'warrenokumu98@gmail.com';
```

### Step 4: Fix Browser DNS and Test Login

1. **Clear browser DNS:**
   - Type: `chrome://net-internals/#dns`
   - Click "Clear host cache"
   - Type: `chrome://net-internals/#sockets`
   - Click "Flush socket pools"

2. **Close browser completely**

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Try to LOGIN** (not signup) with:
   - Email: warrenokumu98@gmail.com
   - Password: Twenty37

### What This Tests

**If login works after clearing browser DNS:**
- ✅ Database fetching works
- ✅ Authentication works
- ✅ Supabase connection works
- ✅ Problem was just browser DNS cache

**If login still fails:**
- Check browser console for NEW error messages
- The error should be different now since curl works

## Quick Test in Browser Console

After clearing DNS, paste this in browser console:

```javascript
fetch('https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs'
  }
}).then(r => r.text()).then(console.log).catch(console.error);
```

This should return JSON (even if it's an error message). If it does, browser can now reach Supabase!

