# Verify Supabase Project Setup

## Critical Issue: Domain Cannot Be Resolved

The error `ERR_NAME_NOT_RESOLVED` means the Supabase project URL cannot be found. This usually means:

1. **The project URL is incorrect**
2. **The Supabase project doesn't exist**
3. **The project has been paused or deleted**
4. **Network/DNS issues** (less likely)

## Step-by-Step Verification

### Step 1: Verify Supabase Project URL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Log in to your account
3. Check if you have a project with the reference: `qbyfrwaxoijhwinvpdqk`
4. If you don't see this project, you need to either:
   - Create a new Supabase project
   - Use an existing project's URL

### Step 2: Get the Correct Project URL

1. In Supabase Dashboard, select your project
2. Go to **Settings** → **API**
3. Copy the **Project URL** - it should look like:
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```
4. Copy the **anon/public** key from the same page

### Step 3: Update .env File

Update your `.env` file with the correct URL and key:

```env
VITE_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT_URL.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ACTUAL_ANON_KEY
```

### Step 4: Create a New Supabase Project (If Needed)

If the project doesn't exist:

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: Aviator Game (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait for the project to be created (takes a few minutes)
6. Once ready, go to **Settings** → **API**
7. Copy the **Project URL** and **anon/public key**
8. Update your `.env` file with these new values

### Step 5: Verify Domain is Accessible

Test if the domain resolves:

**Windows (Command Prompt):**
```cmd
ping YOUR_PROJECT_REF.supabase.co
```

**Or test in browser:**
Open: `https://YOUR_PROJECT_REF.supabase.co/rest/v1/`

You should see a JSON response, not a "can't find this site" error.

## Quick Fix: Test with a Simple Request

After updating `.env` and restarting the server, open this URL in your browser:

```
https://YOUR_PROJECT_REF.supabase.co/rest/v1/
```

If you see JSON data, the project is accessible. If you get "can't find site", the URL is wrong.

## Next Steps After Fixing URL

Once you have the correct Supabase project:

1. **Run the database schema:**
   - Go to SQL Editor in Supabase Dashboard
   - Run `database_schema.sql`

2. **Create admin user:**
   - Go to Authentication → Users
   - Create user: `warrenokumu98@gmail.com` / `Twenty37`
   - Run `setup_admin_user.sql` to grant admin privileges

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Common Issues

### "Project not found"
- The project reference in the URL is incorrect
- The project was deleted
- You're using the wrong Supabase account

### "Project paused"
- Free tier projects pause after inactivity
- Go to Dashboard and resume the project

### "Network error"
- Check your internet connection
- Try a different network
- Check firewall settings


