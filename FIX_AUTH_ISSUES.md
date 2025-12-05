# Fix Authentication Issues

## Since Your Project is Active, Let's Fix the Auth Code

### Step 1: Check Supabase Auth Settings

1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Check these settings:

   **Email Auth:**
   - ✅ Enable email signup: **ON**
   - ✅ Confirm email: **OFF** (for development) or **ON** (requires email verification)
   
   **Site URL:**
   - Should be: `http://localhost:5173` (or your dev port)
   
   **Redirect URLs:**
   - Add: `http://localhost:5173/**`
   - Add: `http://localhost:8080/**` (if that's your port)

### Step 2: Restart Dev Server

**CRITICAL:** Restart your dev server to load environment variables:

```bash
# Stop server (Ctrl+C)
npm run dev
```

### Step 3: Test Direct Connection

Open browser console and test:

```javascript
// Test Supabase connection
fetch('https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/', {
  headers: {
    'apikey': 'YOUR_ANON_KEY',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  }
}).then(r => r.json()).then(console.log).catch(console.error);
```

### Step 4: Check Browser Console

After restarting, check console for:
- `🔧 Supabase Configuration:` - Shows if env vars loaded
- Any CORS errors
- Actual error messages from Supabase


