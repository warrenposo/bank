# Check Supabase Project Status

## Quick Status Check

Since the URL and API key are correct from your dashboard, the issue is likely that **the project is paused** or needs to be restarted.

## Immediate Actions

### 1. Check if Project is Paused

In your Supabase Dashboard:

1. Go to **Settings** → **General**
2. Look for the **"Pause project"** section
3. **If you see "Resume project" button:**
   - Click it
   - Wait 2-3 minutes
   - This is the most common cause!

### 2. Restart the Project

1. Go to **Settings** → **General**
2. Click **"Restart project"** button
3. Wait 3-5 minutes for restart
4. Try again

### 3. Verify .env File Format

Make sure your `.env` file looks exactly like this (no extra spaces, no quotes):

```env
VITE_SUPABASE_URL=https://qbyfrwaxoijhwinvpdqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs
```

**Important:**
- No spaces around the `=`
- No quotes around values
- Each on its own line

### 4. Test Project Accessibility

After checking/resuming project, test in your browser:

Open this URL:
```
https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/
```

- ✅ **If you see JSON** (even an error) → Project is active!
- ❌ **If you see "can't find site"** → Project is paused

### 5. Restart Everything

After making changes:

1. **Close browser completely**
2. **Restart dev server:**
   ```bash
   # Stop (Ctrl+C)
   npm run dev
   ```
3. **Open browser again**
4. **Try signup/login**

## What to Check in Dashboard

Look for these indicators in your Supabase Dashboard:

- ✅ Project shows **"Active"** or **"PRODUCTION"** status
- ✅ No **"Paused"** or **"Resume"** button visible
- ✅ **Settings → General** shows project is running

If you see any pause/resume options, click resume and wait.


