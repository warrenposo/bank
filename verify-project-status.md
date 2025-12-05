# Verify Your Supabase Project Status

The URL you provided is: `https://qbyfrwaxoijhwinvpdqk.supabase.co`

If you're getting `ERR_NAME_NOT_RESOLVED`, check the following:

## Step 1: Check if Project is Paused

Free tier Supabase projects can pause after inactivity:

1. Go to https://supabase.com/dashboard
2. Look for your project with reference: `qbyfrwaxoijhwinvpdqk`
3. If you see a "Resume" button, click it
4. Wait for the project to resume (takes 1-2 minutes)

## Step 2: Verify Project Exists

1. In Supabase Dashboard, check if the project exists
2. If you don't see it, the project might have been:
   - Deleted
   - Under a different account
   - The URL reference might be wrong

## Step 3: Test the URL Directly

Try opening this in your browser:
```
https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/
```

- **If you see JSON** → Project exists and is accessible ✅
- **If you see "can't find site"** → Project doesn't exist or is paused ❌
- **If you see a Supabase error page** → Project exists but might need configuration ✅

## Step 4: Check Project Settings

1. Go to your project in Supabase Dashboard
2. Go to **Settings** → **API**
3. Verify the Project URL matches: `https://qbyfrwaxoijhwinvpdqk.supabase.co`
4. Copy the **anon public** key from the same page

## Step 5: Verify .env File

Make sure your `.env` file has:
```env
VITE_SUPABASE_URL=https://qbyfrwaxoijhwinvpdqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
```

**Important:** The anon key should match what's shown in your Supabase Dashboard → Settings → API

## Common Issues

### Project is Paused
- Free tier projects pause after 7 days of inactivity
- Resume the project in the dashboard
- Wait 1-2 minutes for it to wake up

### Wrong API Key
- Make sure you're using the **anon/public** key, not the service_role key
- Get it from Settings → API → anon public

### DNS Cache
- Clear your DNS cache:
  - Windows: Open Command Prompt as Admin → `ipconfig /flushdns`
  - Or restart your computer

## Next Steps

Once the project is accessible:

1. **Verify .env file is correct**
2. **Restart your dev server** (environment variables only load on startup)
3. **Test login again**


