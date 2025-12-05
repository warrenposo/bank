# 🔴 Resolve Supabase Project Access Issue

## Confirmed Problem

The domain `qbyfrwaxoijhwinvpdqk.supabase.co` **cannot be resolved**, which means:

1. **The project is paused** (most likely on free tier)
2. **The project was deleted**
3. **DNS propagation issue**

## ✅ Solution Steps

### Step 1: Check Supabase Dashboard

1. **Go to:** https://supabase.com/dashboard
2. **Log in** to your Supabase account
3. **Look for your project** with reference `qbyfrwaxoijhwinvpdqk`

**What to look for:**
- ✅ **If you see the project** → Check if it shows "Paused" or has a "Resume" button
- ❌ **If you DON'T see the project** → The project might have been deleted or you're logged into the wrong account

### Step 2A: If Project is Paused

1. **Click on your project**
2. **Look for a "Resume" button** or "Project Paused" message
3. **Click "Resume Project"** or "Restore"
4. **Wait 1-3 minutes** for the project to wake up
5. **The domain should become accessible** after resuming

### Step 2B: If Project Doesn't Exist

The project might have been deleted. You have two options:

#### Option 1: Create a New Project
1. Click **"New Project"** in Supabase Dashboard
2. Name it: **Aviator Game**
3. Create a strong database password (SAVE IT!)
4. Choose your region
5. Click **"Create new project"**
6. Wait 2-3 minutes
7. **Copy the NEW Project URL** from Settings → API
8. **Update your .env file** with the new URL

#### Option 2: Check Other Supabase Accounts
- You might be logged into the wrong Supabase account
- Try logging out and logging in with a different email
- Check if the project exists under a different account

### Step 3: Verify Project is Active

After resuming or creating the project:

1. **Test the URL in your browser:**
   ```
   https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/
   ```
   
   - **If you see JSON response** → ✅ Project is active!
   - **If you see "can't find site"** → ⏳ Wait 1-2 more minutes or try again

2. **Check in Dashboard:**
   - Project should show "Active" status
   - No "Paused" or warning messages

### Step 4: Get API Credentials

Once the project is active:

1. Go to **Settings** → **API**
2. Copy the **Project URL** (should match your URL)
3. Copy the **anon public** key (this is important!)
4. Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=https://qbyfrwaxoijhwinvpdqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_actual_anon_key_from_dashboard
```

**⚠️ Important:** The anon key in your `.env` must match what's shown in the dashboard!

### Step 5: Set Up Database (If New Project)

If you created a new project or the database was reset:

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy the entire contents of `database_schema.sql`
3. Paste and click **"Run"**
4. This creates all necessary tables and functions

### Step 6: Create Admin User

1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Enter:
   - **Email:** `warrenokumu98@gmail.com`
   - **Password:** `Twenty37`
   - ✅ Enable **"Auto Confirm User"**
4. Click **"Create User"**

5. Then go to **SQL Editor** and run:
```sql
UPDATE public.profiles
SET is_admin = true,
    balance = 1000000.00,
    updated_at = now()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'warrenokumu98@gmail.com'
);
```

### Step 7: Restart Development Server

**CRITICAL:** After any changes to `.env` file:

1. **Stop your dev server** (Ctrl+C in terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```
3. Environment variables only load when the server starts!

## Quick Checklist

- [ ] Logged into Supabase Dashboard
- [ ] Found project `qbyfrwaxoijhwinvpdqk`
- [ ] Project is Active (not paused)
- [ ] Tested URL in browser (shows JSON, not "can't find site")
- [ ] Copied anon key from Settings → API
- [ ] Updated `.env` file with correct values
- [ ] Restarted dev server
- [ ] Database schema run (if needed)
- [ ] Admin user created

## Still Having Issues?

1. **Try a different browser** - sometimes DNS cache issues
2. **Clear DNS cache:**
   - Windows: Open Command Prompt as Admin
   - Run: `ipconfig /flushdns`
3. **Check your internet connection**
4. **Try accessing Supabase Dashboard from a different network**

## Contact Supabase Support

If the project should exist but you can't access it:
- Go to: https://supabase.com/support
- Explain that your project URL cannot be resolved
- They can help restore or investigate the issue


