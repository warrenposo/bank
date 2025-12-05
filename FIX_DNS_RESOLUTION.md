# Fix DNS Resolution Issue

## Problem
The error `ERR_NAME_NOT_RESOLVED` means your computer cannot find the Supabase server at `qbyfrwaxoijhwinvpdqk.supabase.co`.

Since you can see the tables in Supabase Dashboard, the project exists - this is a DNS/network issue on your end.

## Solutions to Try

### Solution 1: Flush DNS Cache (Most Common Fix)

**Windows:**
1. Open **Command Prompt as Administrator**
   - Press `Win + X`
   - Select "Command Prompt (Admin)" or "Terminal (Admin)"
2. Run these commands:
   ```cmd
   ipconfig /flushdns
   ipconfig /registerdns
   ipconfig /release
   ipconfig /renew
   ```
3. Close and reopen your browser
4. Try again

### Solution 2: Check if Project is Paused

1. Go to https://supabase.com/dashboard
2. Look for your project
3. Check if it shows "Paused" or has a "Resume" button
4. If paused, click "Resume" and wait 2-3 minutes
5. Try again

### Solution 3: Change DNS Server

Sometimes your ISP's DNS has issues. Try using Google's DNS:

1. Open **Network Settings**:
   - Press `Win + I`
   - Go to **Network & Internet** → **Advanced network settings** → **More network adapter options**
2. Right-click your active network connection → **Properties**
3. Select **Internet Protocol Version 4 (TCP/IPv4)** → **Properties**
4. Select **"Use the following DNS server addresses"**
5. Enter:
   - Preferred: `8.8.8.8`
   - Alternate: `8.8.4.4`
6. Click **OK**
7. Flush DNS again (Solution 1)
8. Try again

### Solution 4: Test Domain Resolution

Open Command Prompt and test:

```cmd
nslookup qbyfrwaxoijhwinvpdqk.supabase.co
```

- **If it resolves** → Shows IP addresses ✅
- **If it fails** → DNS issue ❌

### Solution 5: Try Different Network

1. Try using your phone's hotspot
2. Or try a different Wi-Fi network
3. This will tell us if it's your network blocking it

### Solution 6: Check Firewall/Antivirus

Your firewall or antivirus might be blocking the domain:

1. Temporarily disable firewall/antivirus
2. Try again
3. If it works, add an exception for your browser

### Solution 7: Use IP Address Directly (Temporary Test)

This is just to test if DNS is the issue:

1. Find the IP address of your Supabase project (we'll need to get this)
2. Temporarily add to hosts file
3. **This is just for testing** - not a permanent solution

## Quick Test

Try opening this URL directly in your browser:
```
https://qbyfrwaxoijhwinvpdqk.supabase.co/rest/v1/
```

- **If it loads** → Domain resolves, issue is elsewhere ✅
- **If it doesn't load** → DNS issue ❌

## Most Likely Fix

**Try Solution 1 first** (flush DNS cache) - this fixes the issue 90% of the time.

After flushing DNS:
1. Close your browser completely
2. Restart your dev server
3. Try again


