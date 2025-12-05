# 🔴 URGENT: Fix Supabase URL Issue

## The Problem

Your console shows: `ERR_NAME_NOT_RESOLVED` for `qbyfrwaxoijhwinvpdqk.supabase.co`

This means **the Supabase project doesn't exist or the URL is wrong**.

## ✅ Solution: Get the Correct Supabase URL

### Option 1: Use Your Existing Supabase Project

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Log in with your Supabase account

2. **Find Your Project:**
   - Look for any existing projects
   - If you see a project, click on it
   - If you don't have any projects, go to **Option 2**

3. **Get the Project URL:**
   - In your project, go to **Settings** (gear icon) → **API**
   - Copy the **Project URL** - it looks like:
     ```
     https://abcdefghijklmnop.supabase.co
     ```
   - Copy the **anon public** key (also called "publishable key")

4. **Update Your .env File:**
   - Open `.env` in your project root
   - Replace the values:
     ```env
     VITE_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT_URL.supabase.co
     VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ACTUAL_ANON_KEY
     ```

5. **Restart Your Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Option 2: Create a New Supabase Project

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Log in (or sign up if you don't have an account)

2. **Create New Project:**
   - Click **"New Project"** button
   - Fill in:
     - **Name**: Aviator Game
     - **Database Password**: Create a strong password (SAVE THIS!)
     - **Region**: Choose closest to you
   - Click **"Create new project"**
   - Wait 2-3 minutes for setup to complete

3. **Get Credentials:**
   - Once project is ready, go to **Settings** → **API**
   - Copy the **Project URL**
   - Copy the **anon public** key

4. **Update .env File:**
   ```env
   VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT_URL.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_NEW_ANON_KEY
   ```

5. **Set Up Database:**
   - Go to **SQL Editor** in Supabase Dashboard
   - Copy and paste the entire contents of `database_schema.sql`
   - Click **"Run"**

6. **Create Admin User:**
   - Go to **Authentication** → **Users**
   - Click **"Add User"**
   - Email: `warrenokumu98@gmail.com`
   - Password: `Twenty37`
   - Enable **"Auto Confirm User"**
   - Click **"Create User"**

7. **Grant Admin Privileges:**
   - Go to **SQL Editor**
   - Run this SQL:
     ```sql
     UPDATE public.profiles
     SET is_admin = true,
         balance = 1000000.00,
         updated_at = now()
     WHERE user_id = (
       SELECT id FROM auth.users WHERE email = 'warrenokumu98@gmail.com'
     );
     ```

8. **Restart Dev Server:**
   ```bash
   npm run dev
   ```

## 🔍 Verify It's Working

After updating the URL and restarting:

1. **Check Browser Console:**
   - Open DevTools (F12)
   - The URL in errors should match your new project URL
   - No more `ERR_NAME_NOT_RESOLVED` errors

2. **Test Connection:**
   - Open this in your browser: `https://YOUR_PROJECT_URL.supabase.co/rest/v1/`
   - You should see JSON (even if it's an error, that's fine - it means the server is reachable)
   - If you get "can't find site", the URL is still wrong

## 🚨 Important Notes

- **The URL you provided (`qbyfrwaxoijhwinvpdqk`) doesn't exist** - you need to use your actual Supabase project URL
- **Each Supabase project has a unique reference** in the URL
- **You must restart the dev server** after changing `.env` file
- **Free tier projects can pause** after inactivity - resume them in the dashboard

## Quick Test

Once you have the correct URL, test it works:

1. Open: `https://YOUR_PROJECT_URL.supabase.co/rest/v1/`
2. If you see JSON response → ✅ Project exists and is accessible
3. If you see "can't find site" → ❌ URL is wrong or project doesn't exist

## Still Having Issues?

1. Double-check the URL in Supabase Dashboard → Settings → API
2. Make sure you copied the entire URL including `https://`
3. Make sure there are no extra spaces in `.env` file
4. Restart your dev server after changes
5. Clear browser cache and hard refresh (Ctrl+Shift+R)


