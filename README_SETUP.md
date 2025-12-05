# Aviator Game - Complete Setup Guide

## Quick Start

### 1. Environment Setup
Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://qbyfrwaxoijhwinvpdqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs
```

### 2. Database Setup
1. Open Supabase Dashboard → SQL Editor
2. Copy and run `database_schema.sql` - This creates all tables, policies, and functions

### 3. Create Admin User
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Email: `warrenokumu98@gmail.com`
4. Password: `Twenty37`
5. Enable "Auto Confirm User"
6. After creation, run `setup_admin_user.sql` in SQL Editor to grant admin privileges

### 4. Install & Run
```bash
npm install
npm run dev
```

## Admin Login Credentials
- **Email**: warrenokumu98@gmail.com
- **Password**: Twenty37

## Features Implemented

### ✅ Automatic Sign-In
- Sessions are persisted in localStorage
- Automatic token refresh enabled
- Users remain logged in across browser sessions

### ✅ Role-Based Authentication
- Admin users: Full access to admin panel
- Regular users: Game access only
- Admin status checked via `profiles.is_admin` field

### ✅ Admin Panel Features

#### Game Control Tab
- Set crash point for upcoming rounds
- View recent game rounds
- Real-time statistics dashboard

#### User Management Tab
- View all users
- Edit user balances
- Grant/revoke admin privileges
- View user details and activity

#### Transactions Tab
- View all transactions (deposits, withdrawals, bets, wins, bonuses)
- Filter by type and status
- View transaction details and references

### ✅ Database Schema
Complete schema includes:
- `profiles` - User profiles with admin status
- `game_settings` - Admin-controlled crash points
- `rounds` - Game round history
- `bets` - All user bets
- `transactions` - Financial transactions
- `mpesa_transactions` - M-Pesa STK push records (ready for future implementation)

### ✅ Security
- Row Level Security (RLS) on all tables
- Admin-only access policies
- Secure transaction functions
- Session management

## Files Created/Modified

### New Files
1. `database_schema.sql` - Complete database schema
2. `setup_admin_user.sql` - Admin user setup script
3. `SETUP_INSTRUCTIONS.md` - Detailed setup guide
4. `src/hooks/useAdminUsers.ts` - Hook for user management
5. `src/hooks/useAdminTransactions.ts` - Hook for transaction management

### Modified Files
1. `src/pages/Admin.tsx` - Enhanced with tabs for users, transactions, and game control
2. `src/hooks/useAuth.ts` - Updated Profile interface to include name field

## Database Tables

### profiles
- Stores user information, balance, and admin status
- Auto-created on user signup via trigger

### game_settings
- Admin-controlled crash point settings
- Only one active setting at a time

### rounds
- Game round history
- Publicly readable, admin-writable

### bets
- All user bets
- Users can only see their own bets

### transactions
- All financial transactions
- Types: deposit, withdrawal, bet, win, bonus
- Status tracking: pending, completed, failed, cancelled

### mpesa_transactions
- M-Pesa STK push transaction records
- Ready for future M-Pesa integration

## Next Steps (Future Implementation)

### M-Pesa Integration
The database schema is ready for:
- STK Push deposits
- Withdrawal requests
- Callback handling
- Transaction status updates

To implement:
1. Set up M-Pesa API credentials
2. Create serverless functions for STK push
3. Implement callback endpoints
4. Update deposit/withdrawal flows

## Troubleshooting

**Cannot access admin panel?**
- Verify user has `is_admin = true` in profiles table
- Check browser console for errors
- Verify RLS policies are correct

**Database errors?**
- Run `database_schema.sql` again to ensure all tables exist
- Check Supabase logs for detailed errors

**Authentication not working?**
- Verify `.env` file exists and has correct values
- Check Supabase project is active
- Verify auth is enabled in Supabase dashboard

## Support
For issues, check:
1. Browser console for errors
2. Supabase dashboard logs
3. Network tab for API errors
4. Database policies in Supabase dashboard


