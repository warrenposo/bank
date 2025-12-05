# Quick Fix for Signup/Login

## Immediate Actions (Do These First)

### 1. RESTART YOUR DEV SERVER ⚠️ CRITICAL

Environment variables only load when the server starts!

```bash
# Stop server (Ctrl+C)
npm run dev
```

### 2. Check Browser Console

After restarting, open browser console (F12) and look for:
```
🔧 Supabase Configuration: { url: "...", keyPrefix: "...", keyLength: ... }
```

If you DON'T see this message, env vars aren't loading.

### 3. Configure Supabase Auth Settings

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**

2. **Site URL:**
   - Set to: `http://localhost:5173` (or whatever port your dev server uses)

3. **Redirect URLs:**
   - Click "Add URL"
   - Add: `http://localhost:5173/**`
   - Add: `http://localhost:8080/**` (if that's your port)
   - Save

4. **Email Auth:**
   - Enable email signup: **ON**
   - Confirm email: **OFF** (for now, to test quickly)

### 4. Test in Browser Console

Open browser console and paste this (replace with your actual key):

```javascript
const SUPABASE_URL = 'https://qbyfrwaxoijhwinvpdqk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs';

fetch(`${SUPABASE_URL}/rest/v1/`, {
  headers: { 'apikey': SUPABASE_KEY }
})
.then(r => r.text())
.then(d => console.log('✅ Connection works!', d))
.catch(e => console.error('❌ Connection failed:', e));
```

- ✅ **If you see "Connection works!"** → Supabase is accessible
- ❌ **If you see "Connection failed"** → Still a network/DNS issue

### 5. Check Network Tab

1. Open DevTools → **Network** tab
2. Try to sign up or login
3. Look for the request to Supabase
4. **Check:**
   - Status code (200, 400, 401, 500, etc.)
   - Response body (click on the request)
   - Error message in response

## Common Errors & Fixes

### Error: "Failed to fetch"
- **Cause:** Network/DNS issue or project paused
- **Fix:** Restart dev server, check project is active

### Error: 401 Unauthorized
- **Cause:** Wrong API key
- **Fix:** Verify API key in `.env` matches dashboard

### Error: 400 Bad Request
- **Cause:** Invalid request data or auth settings
- **Fix:** Check email/password format, check auth settings

### Error: Email not confirmed
- **Cause:** Email confirmation required
- **Fix:** Disable email confirmation in Auth Settings

## Checklist

Before trying signup/login:
- [ ] Dev server restarted after creating/updating `.env`
- [ ] Console shows `🔧 Supabase Configuration`
- [ ] Site URL set in Auth Settings
- [ ] Redirect URLs added
- [ ] Email confirmation disabled (for testing)
- [ ] Test fetch in console works
- [ ] Check Network tab for actual error


