# Aviator Game - Setup Instructions

## Overview
This document provides complete setup instructions for the Aviator game application with Supabase integration, admin panel, and role-based authentication.

## Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- Supabase account
- Supabase project URL and API key

## Step 1: Supabase Configuration

### Database URL and API Key
- **Supabase URL**: `https://qbyfrwaxoijhwinvpdqk.supabase.co`
- **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs`

### Environment Variables
Create a `.env` file in the root directory with the following:

```env
VITE_SUPABASE_URL=https://qbyfrwaxoijhwinvpdqk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieWZyd2F4b2lqaHdpbnZwZHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjQ4MTUsImV4cCI6MjA4MDUwMDgxNX0.8U5OjAAuiW8Jr75J6athXdHO38iAUKtzHsW2IjWyoGs
```

## Step 2: Database Schema Setup

### Option A: Using Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open and run the `database_schema.sql` file
   - This will create all required tables, policies, functions, and triggers

### Option B: Using Migrations
1. Copy the contents of `database_schema.sql`
2. Create a new migration in `supabase/migrations/`
3. Run the migration using Supabase CLI

### Database Tables Created:
- **profiles** - User profiles with balance and admin status
- **game_settings** - Admin-controlled crash point settings
- **rounds** - Game round history
- **bets** - All user bets
- **transactions** - Deposits, withdrawals, and other transactions
- **mpesa_transactions** - M-Pesa STK push transaction records

## Step 3: Create Admin User

### Method 1: Via Supabase Dashboard
1. Go to **Authentication > Users** in Supabase Dashboard
2. Click **Add User** or **Invite User**
3. Enter the following:
   - **Email**: `warrenokumu98@gmail.com`
   - **Password**: `Twenty37`
   - **Auto Confirm User**: ✓ (Enable this)
4. After creating the user, go to **SQL Editor**
5. Run the `setup_admin_user.sql` script to set admin privileges

### Method 2: Direct SQL
After creating the user in Auth, run this SQL:

```sql
-- Find and update the admin user
UPDATE public.profiles
SET is_admin = true,
    balance = 1000000.00,
    updated_at = now()
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'warrenokumu98@gmail.com'
);
```

## Step 4: Install Dependencies

```bash
npm install
# or
bun install
```

## Step 5: Run the Application

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:5173` (or the port shown in terminal).

## Step 6: Login

### Admin Login
- **Email**: `warrenokumu98@gmail.com`
- **Password**: `Twenty37`
- Access: Full admin panel with user management, transactions, and game control

### Regular User
- Create a new account via the Sign Up page
- New users receive a KES 100 welcome bonus

## Features

### Admin Panel (`/admin`)
- **Game Control Tab**
  - Set crash point for upcoming rounds
  - View recent game rounds
  - View statistics (total users, bets, payouts, profit)
  
- **User Management Tab**
  - View all users
  - Edit user balances
  - Grant/revoke admin privileges
  - View user details

- **Transactions Tab**
  - View all transactions (deposits, withdrawals, bets, wins, bonuses)
  - Filter by type and status
  - View transaction details and references

### Automatic Sign-In
- Session persistence is enabled
- Users remain logged in across browser sessions
- Automatic token refresh

### Role-Based Access
- Admin users can access `/admin` route
- Regular users are redirected if they try to access admin panel
- Admin status is checked via `profiles.is_admin` field

## Future Features (Planned)

### M-Pesa Integration
- STK Push for deposits
- Withdrawal requests
- Transaction callbacks
- The database schema is already prepared with `mpesa_transactions` table

## Troubleshooting

### Issue: Cannot access admin panel
**Solution**: Ensure the user profile has `is_admin = true` in the `profiles` table

### Issue: Authentication not working
**Solution**: 
1. Verify environment variables are set correctly
2. Check Supabase project is active
3. Verify RLS policies are correct

### Issue: Database tables not found
**Solution**: Run the `database_schema.sql` script in Supabase SQL Editor

### Issue: Admin user not created
**Solution**: 
1. Create user in Supabase Auth dashboard first
2. Then run the `setup_admin_user.sql` script

## Security Notes

1. **Never commit `.env` file** - It contains sensitive keys
2. **Row Level Security (RLS)** is enabled on all tables
3. **Admin functions** use `SECURITY DEFINER` for proper access control
4. **Transaction creation** should be handled via database functions for security

## Database Functions

### `create_transaction`
Creates a transaction and updates user balance atomically.

### `handle_new_user`
Automatically creates a profile when a new user signs up and grants welcome bonus.

### `update_updated_at_column`
Automatically updates the `updated_at` timestamp on record updates.

## Support

For issues or questions:
1. Check the database schema in `database_schema.sql`
2. Verify Supabase configuration
3. Check browser console for errors
4. Review Supabase logs in dashboard


