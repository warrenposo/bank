# 🧪 Test Your Aviator Game

## Quick Start

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   - Go to: `http://localhost:5173`
   - Login with your account

3. **Test the game:**

### ✅ Waiting State (4 seconds)
- [ ] See "PLACE YOUR BETS" message in cyan
- [ ] See runway with yellow lights at bottom
- [ ] Plane sitting on ground (low position)
- [ ] Three animated dots bouncing
- [ ] Background has stars and grid

### ✅ Flying State (Dynamic)
- [ ] Plane takes off smoothly
- [ ] Red trail line appears behind plane
- [ ] Large cyan multiplier shows (e.g., "1.24x")
- [ ] Plane rotates upward as it climbs
- [ ] Multiplier increases quickly
- [ ] Smooth 60fps animation
- [ ] Plane has subtle bobbing motion

### ✅ Crashed State (2.5 seconds)
- [ ] Plane spins and disappears
- [ ] Final multiplier shows in RED
- [ ] "FLEW AWAY!" message appears
- [ ] Crash animation is fast (0.8s)
- [ ] Transition back to waiting is quick

## 🎯 Admin Dashboard Test

1. **Set yourself as admin in Supabase SQL Editor:**
   ```sql
   UPDATE public.profiles
   SET is_admin = true, updated_at = now()
   WHERE user_id = (
     SELECT id FROM auth.users 
     WHERE email = 'warrenokumu98@gmail.com'
   );
   ```

2. **Verify admin status:**
   ```sql
   SELECT u.email, p.is_admin 
   FROM auth.users u
   JOIN public.profiles p ON p.user_id = u.id
   WHERE u.email = 'warrenokumu98@gmail.com';
   ```
   Expected: `is_admin = true`

3. **Logout and Login again**

4. **You should be redirected to `/admin` automatically**

### ✅ Admin Panel Features
- [ ] See "Game Control" tab
- [ ] Set next crash point (e.g., 2.50x)
- [ ] View user list
- [ ] View transactions
- [ ] See statistics dashboard

## 🐛 Common Issues

### Issue: "Access Denied" when logging in as admin
**Fix:** 
1. Check database: `SELECT is_admin FROM profiles WHERE user_id = '...'`
2. If `false` or `NULL`, run the UPDATE query above
3. Logout and login again

### Issue: Plane animation looks jumpy
**Fix:**
1. Check browser performance (F12 → Performance tab)
2. Close other tabs/apps
3. Try Chrome/Edge (best performance)

### Issue: Trail line not showing
**Fix:**
1. Check if `status === 'running'`
2. Look in console for errors
3. Refresh page (Ctrl+Shift+R)

### Issue: Game too fast or too slow
**Adjust in `src/hooks/useGame.ts`:**
```javascript
const speed = 30; // Lower = faster (try 20-50)
multiplier += increment * (1 + multiplier * 0.15); // Increase 0.15 for faster
```

## 📱 Mobile Test (Optional)

1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from phone: `http://YOUR_IP:5173`
3. Test touch controls and responsiveness

## 🎉 Success Criteria

✅ **Speed**: Round completes in reasonable time (10-30 seconds)  
✅ **Smoothness**: No lag, 60fps animation  
✅ **Visual**: Red trail follows plane, glowing effects work  
✅ **Admin**: Dashboard accessible for admin users  
✅ **Mobile**: Works on phone (if tested)  

Your Aviator game should now be **fast, smooth, and professional!** 🚀

