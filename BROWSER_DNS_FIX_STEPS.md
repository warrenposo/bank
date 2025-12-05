# Fix Browser DNS - Step by Step

## Discovery: Supabase IS Working!

The curl command worked (returned HTTP 401), which proves:
- ✅ Supabase server is running
- ✅ The domain exists and is accessible
- ✅ Your credentials are correct

The problem: **Your browser has a stale DNS cache**

## Quick Fix (Do This Now)

### Step 1: Clear Browser DNS Cache

**Chrome or Edge:**
1. In the address bar, type: `chrome://net-internals/#dns`
2. Click the **"Clear host cache"** button
3. In the address bar, type: `chrome://net-internals/#sockets`
4. Click the **"Flush socket pools"** button

**Firefox:**
1. In the address bar, type: `about:networking#dns`
2. Click **"Clear DNS Cache"**

### Step 2: Close Browser COMPLETELY

- Close ALL browser windows (not just the tab)
- Make sure browser is completely closed

### Step 3: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 4: Open Browser and Try Again

- Open fresh browser window
- Go to: `http://localhost:5173` (or your port)
- Try to signup or login

## Alternative: Use Incognito Mode

If you want to test immediately without clearing cache:

1. Open **Incognito/Private window** (Ctrl+Shift+N)
2. Go to: `http://localhost:5173`
3. Try signup/login

If it works in incognito → Confirms it's browser cache

## Verify Signup Trigger Exists

While you're fixing browser DNS, also verify the trigger exists:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run this:
   ```sql
   SELECT trigger_name 
   FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';
   ```
3. If empty → Run the trigger creation SQL from `CHECK_SIGNUP_TRIGGER.sql`

## Expected Result

After clearing browser cache:
- ✅ Signup should work and create users
- ✅ Login should work
- ✅ Profile should be fetched correctly
- ✅ Admin user can access admin panel

The signup code is correct - it just needs the browser to be able to reach Supabase!

