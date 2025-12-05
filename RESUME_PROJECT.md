# ⚠️ URGENT: Your Supabase Project is Likely PAUSED

## The Problem

The domain `qbyfrwaxoijhwinvpdqk.supabase.co` cannot be resolved, but you can see it in your dashboard. **This means your project is PAUSED.**

Free-tier Supabase projects automatically pause after inactivity. The dashboard is still accessible, but the API endpoint is not.

## ✅ SOLUTION: Resume Your Project

### Step 1: Check Project Status

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qbyfrwaxoijhwinvpdqk
2. Look at the top of the page or go to **Settings** → **General**
3. **Look for:**
   - "Resume project" button
   - "Paused" status indicator
   - Any warning about the project being paused

### Step 2: Resume the Project

1. If you see **"Resume project"** button:
   - Click it
   - Wait 2-3 minutes for the project to wake up
   
2. Or go to **Settings** → **General**:
   - Look for "Pause project" section
   - If it shows "Resume" instead of "Pause", click it

### Step 3: Wait for Activation

- Free tier projects take 1-3 minutes to resume
- You'll see a loading indicator
- Wait until status shows "Active" or "PRODUCTION"

### Step 4: Verify Project is Active

After resuming, test in your browser:

Open this URL:
```
https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/
```

- ✅ **If you see JSON** (even with an error) → Project is active!
- ❌ **If you still see "can't find site"** → Wait 1-2 more minutes

### Step 5: Restart Dev Server

Once project is active:

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 6: Try Signup/Login Again

The connection should work now!

## Alternative: Restart Project

If resuming doesn't work:

1. Go to **Settings** → **General**
2. Click **"Restart project"**
3. Wait 3-5 minutes
4. Try again

## Why This Happens

Free-tier Supabase projects:
- Automatically pause after 7 days of inactivity
- Take 1-3 minutes to resume
- Dashboard remains accessible, but API endpoints are not

## Still Not Working?

If resuming doesn't work after 5 minutes:

1. Check Supabase status page: https://status.supabase.com
2. Try a different network (phone hotspot)
3. Contact Supabase support

## Quick Checklist

- [ ] Project is resumed in dashboard
- [ ] Waited 2-3 minutes after resuming
- [ ] Tested URL in browser (shows JSON, not "can't find site")
- [ ] Restarted dev server
- [ ] Cleared browser cache
- [ ] Tried signup/login again


