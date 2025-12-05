# Verify Supabase Connection

## Steps to Debug "Failed to Fetch" Error

### Step 1: Check Environment Variables in Browser

1. **Open your browser console** (F12)
2. **Check the console logs** - you should see:
   ```
   🔧 Supabase Configuration: { url: "...", keyPrefix: "...", keyLength: ... }
   ```
3. **Verify the URL matches** your Supabase project URL
4. **Verify the key length** - should be around 200+ characters

### Step 2: Verify API Key in Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. **Copy the "anon public" key** (NOT the service_role key)
4. **Compare with your .env file**:
   - Open `.env` file
   - Make sure `VITE_SUPABASE_PUBLISHABLE_KEY` matches the anon key exactly
   - No extra spaces or quotes

### Step 3: Check Supabase Project Settings

1. In Supabase Dashboard, go to **Settings** → **API**
2. **Verify:**
   - Project URL is correct
   - API is enabled
   - No restrictions on API access

### Step 4: Check Database Trigger Function

The trigger function `handle_new_user` must exist for signup to work:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this to check if the trigger exists:
   ```sql
   SELECT 
     trigger_name, 
     event_manipulation, 
     event_object_table,
     action_statement
   FROM information_schema.triggers
   WHERE trigger_name = 'on_auth_user_created';
   ```

3. **If it doesn't exist**, run this from `database_schema.sql`:
   ```sql
   -- Function to handle new user signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER
   LANGUAGE plpgsql
   SECURITY DEFINER SET search_path = public
   AS $$
   BEGIN
     INSERT INTO public.profiles (user_id, phone_number, name, balance)
     VALUES (
       new.id,
       new.raw_user_meta_data ->> 'phone_number',
       new.raw_user_meta_data ->> 'name',
       100.00
     );
     
     -- Create welcome bonus transaction
     INSERT INTO public.transactions (
       user_id,
       type,
       amount,
       balance_before,
       balance_after,
       status,
       description,
       reference
     ) VALUES (
       new.id,
       'bonus',
       100.00,
       0.00,
       100.00,
       'completed',
       'Welcome Bonus',
       'WELCOME-' || new.id::text
     );
     
     RETURN new;
   END;
   $$;

   -- Trigger for new user creation
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

### Step 5: Test API Connection Directly

Open this URL in your browser (replace with your actual project URL):
```
https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/
```

- **If you see JSON** → API is accessible ✅
- **If you see "can't find site"** → Project URL is wrong ❌
- **If you see 401/403** → Normal, means API is working but needs auth ✅

### Step 6: Check Browser Network Tab

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Try to sign up or login**
4. **Look for the request to Supabase:**
   - Should be: `POST https://qbyfrwaxoijhwinvpdqk.supabase.co/auth/v1/token?grant_type=password`
   - **Check the status code:**
     - **200** → Success ✅
     - **400** → Bad request (wrong credentials or data) ⚠️
     - **401** → Unauthorized (wrong API key) ❌
     - **500** → Server error (trigger function issue) ❌
     - **Failed/CORS** → Network/API key issue ❌

### Step 7: Common Issues and Fixes

#### Issue: "Failed to fetch" with no status code
**Cause:** Network issue or wrong API key
**Fix:**
- Verify API key in `.env` matches Supabase Dashboard
- Restart dev server after changing `.env`
- Check internet connection

#### Issue: 401 Unauthorized
**Cause:** Wrong API key
**Fix:**
- Get the correct "anon public" key from Settings → API
- Update `.env` file
- Restart dev server

#### Issue: 500 Server Error
**Cause:** Trigger function error
**Fix:**
- Check if `handle_new_user` function exists
- Check if `profiles` table exists
- Check Supabase logs in Dashboard → Logs

#### Issue: CORS Error
**Cause:** Supabase project settings
**Fix:**
- Usually not an issue with Supabase
- Check if project is active
- Verify API is enabled

### Step 8: Restart Dev Server

**CRITICAL:** After any `.env` changes:

```bash
# Stop server (Ctrl+C)
npm run dev
```

Environment variables only load when the server starts!

## Quick Test

After fixing issues, try this in browser console:

```javascript
// Test Supabase connection
const testUrl = 'https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/';
fetch(testUrl)
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

If this works, Supabase is accessible. If not, there's a network/URL issue.


