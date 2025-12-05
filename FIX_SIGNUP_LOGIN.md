# Fix Signup/Login Issues - Step by Step

## Your Project is Active, So Let's Fix the Code

### Step 1: Verify Environment Variables Are Loaded

**CRITICAL:** Environment variables only load when the dev server starts!

1. **Stop your dev server** (Ctrl+C)
2. **Start it again:**
   ```bash
   npm run dev
   ```
3. **Open browser console** (F12)
4. **Look for:** `🔧 Supabase Configuration:`
   - Should show your URL and key length
   - If you don't see this, env vars aren't loaded

### Step 2: Check Supabase Auth Settings

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**

2. **Email Auth Settings:**
   - ✅ **Enable email signup:** ON
   - For development: **Confirm email:** OFF
   - For production: **Confirm email:** ON

3. **Site URL:**
   - Set to: `http://localhost:5173` (or your dev port)

4. **Redirect URLs:**
   - Add: `http://localhost:5173/**`
   - Add: `http://localhost:8080/**` (if that's your port)
   - Add: `http://localhost:3000/**` (if using that port)

### Step 3: Check if Trigger Function Exists

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this query:
   ```sql
   SELECT trigger_name 
   FROM information_schema.triggers 
   WHERE trigger_name = 'on_auth_user_created';
   ```
3. **If no results**, run the trigger creation SQL from `database_schema.sql`

### Step 4: Test Connection Directly

Open browser console and run:

```javascript
// Test if Supabase is accessible
fetch('https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs'
  }
}).then(r => r.text()).then(console.log).catch(console.error);
```

- ✅ **If you see JSON** → Connection works!
- ❌ **If you see error** → Still a connection issue

### Step 5: Check Browser Console Errors

After restarting server, try signup/login and check console:

**Look for:**
- The actual Supabase error message (not just "Failed to fetch")
- CORS errors
- 401/403/500 status codes
- Network tab showing the actual request/response

### Step 6: Verify .env File Format

Make sure `.env` file has NO quotes, NO spaces around `=`:

```env
VITE_SUPABASE_URL=https://qbyfrwaxoijhwinvpdqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs
```

## Most Common Issues

### Issue 1: Dev Server Not Restarted
**Fix:** Always restart after changing `.env`

### Issue 2: Email Confirmation Required
**Fix:** Disable email confirmation in Auth Settings for development

### Issue 3: Wrong Redirect URL
**Fix:** Add your localhost URL to Redirect URLs in Auth Settings

### Issue 4: Trigger Function Missing
**Fix:** Run the trigger creation SQL from `database_schema.sql`

## Quick Test Checklist

After making changes:
- [ ] Dev server restarted
- [ ] Console shows `🔧 Supabase Configuration`
- [ ] Auth Settings configured (email enabled, redirect URLs added)
- [ ] Trigger function exists
- [ ] Test fetch in console works
- [ ] Try signup/login again


