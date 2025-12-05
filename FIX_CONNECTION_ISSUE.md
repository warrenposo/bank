# Fix Supabase Connection Issue

## Confirmed Information
✅ Project URL: `https://qbyfrwaxoijhwinvpdqk.supabase.co` (correct)
✅ API Key: Matches your dashboard
✅ Project exists in Supabase Dashboard

## The Problem
The domain cannot be resolved (`ERR_NAME_NOT_RESOLVED`) even though the project exists. This usually means:

1. **Project is paused** (most common on free tier)
2. **DNS cache issue** on your computer
3. **Network/DNS blocking**

## Solutions (Try in Order)

### Solution 1: Check if Project is Paused ⭐ MOST LIKELY

1. In your Supabase Dashboard, go to **Settings** → **General**
2. Look for **"Pause project"** section
3. If you see **"Resume project"** button instead of "Pause project":
   - Click **"Resume project"**
   - Wait 2-3 minutes for it to wake up
   - Try again

### Solution 2: Flush DNS Cache

**Windows Command Prompt (Run as Administrator):**

1. Press `Win + X`
2. Select **"Command Prompt (Admin)"** or **"Terminal (Admin)"**
3. Run these commands one by one:
   ```cmd
   ipconfig /flushdns
   ipconfig /registerdns
   ipconfig /release
   ipconfig /renew
   ```
4. Close Command Prompt
5. **Close and reopen your browser completely**
6. Restart your dev server
7. Try again

### Solution 3: Restart Your Project

1. In Supabase Dashboard → **Settings** → **General**
2. Click **"Restart project"** button
3. Wait 3-5 minutes
4. Try again

### Solution 4: Use Google DNS

Sometimes your ISP's DNS has issues:

1. Open **Network Settings**:
   - Press `Win + I`
   - Go to **Network & Internet** → **Advanced network settings**
   - Click **"More network adapter options"**
2. Right-click your active connection → **Properties**
3. Select **"Internet Protocol Version 4 (TCP/IPv4)"** → **Properties**
4. Select **"Use the following DNS server addresses"**
5. Enter:
   - Preferred: `8.8.8.8`
   - Alternate: `8.8.4.4`
6. Click **OK**
7. Flush DNS again (Solution 2)
8. Try again

### Solution 5: Test from Browser Directly

Open this URL directly in your browser:
```
https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/
```

- ✅ **If it loads** (even with JSON error) → Project is accessible!
- ❌ **If it doesn't load** → Project is paused or DNS issue

### Solution 6: Try Different Network

1. Use your phone's hotspot
2. Or try a different Wi-Fi network
3. This will tell us if it's your network blocking it

## Most Likely Fix

**90% of the time, it's Solution 1 (Project Paused) or Solution 2 (DNS Cache)**

Try these two first:
1. Check if project needs to be resumed
2. Flush DNS cache
3. Restart dev server
4. Try again

## After Fixing

Once the domain resolves:

1. **Restart your dev server:**
   ```bash
   # Stop (Ctrl+C)
   npm run dev
   ```

2. **Try signup/login again**

3. **Check browser console** - should see successful connection

## Verify Your .env File

Make sure your `.env` file has (no extra spaces):
```env
VITE_SUPABASE_URL=https://qbyfrwaxoijhwinvpdqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs
```


