-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR AVIATOR GAME
-- =====================================================
-- This file contains all database tables, policies, and functions
-- required for the Aviator game application
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
-- Stores user profile information including balance and admin status
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  phone_number TEXT,
  name TEXT,
  balance DECIMAL(12,2) DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile (except is_admin)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Admins can update all profiles
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON public.profiles(is_admin);

-- =====================================================
-- 2. GAME SETTINGS TABLE
-- =====================================================
-- Allows admin to set the crash point for upcoming rounds
CREATE TABLE IF NOT EXISTS public.game_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  next_crash_point DECIMAL(6,2) DEFAULT NULL,
  is_active BOOLEAN DEFAULT false,
  set_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can manage game settings
DROP POLICY IF EXISTS "Admins can manage game settings" ON public.game_settings;
CREATE POLICY "Admins can manage game settings" ON public.game_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Anyone can read active settings (for game logic)
DROP POLICY IF EXISTS "Anyone can read active settings" ON public.game_settings;
CREATE POLICY "Anyone can read active settings" ON public.game_settings
  FOR SELECT USING (is_active = true);

-- Create index
CREATE INDEX IF NOT EXISTS game_settings_is_active_idx ON public.game_settings(is_active);

-- =====================================================
-- 3. ROUNDS TABLE
-- =====================================================
-- Stores game round history
CREATE TABLE IF NOT EXISTS public.rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  round_number TEXT UNIQUE NOT NULL,
  crash_point DECIMAL(6,2) NOT NULL,
  total_bets DECIMAL(12,2) DEFAULT 0,
  total_payout DECIMAL(12,2) DEFAULT 0,
  total_players INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rounds ENABLE ROW LEVEL SECURITY;

-- Anyone can read rounds (for public history)
DROP POLICY IF EXISTS "Anyone can read rounds" ON public.rounds;
CREATE POLICY "Anyone can read rounds" ON public.rounds
  FOR SELECT USING (true);

-- Only admins can insert/update rounds
DROP POLICY IF EXISTS "Admins can manage rounds" ON public.rounds;
CREATE POLICY "Admins can manage rounds" ON public.rounds
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS rounds_round_number_idx ON public.rounds(round_number);
CREATE INDEX IF NOT EXISTS rounds_created_at_idx ON public.rounds(created_at DESC);

-- =====================================================
-- 4. BETS TABLE
-- =====================================================
-- Stores all user bets
CREATE TABLE IF NOT EXISTS public.bets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  round_id TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  cashout_multiplier DECIMAL(6,2),
  profit DECIMAL(12,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'cashed_out')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- Users can view their own bets
DROP POLICY IF EXISTS "Users can view own bets" ON public.bets;
CREATE POLICY "Users can view own bets" ON public.bets
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own bets
DROP POLICY IF EXISTS "Users can create bets" ON public.bets;
CREATE POLICY "Users can create bets" ON public.bets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own bets
DROP POLICY IF EXISTS "Users can update own bets" ON public.bets;
CREATE POLICY "Users can update own bets" ON public.bets
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all bets
DROP POLICY IF EXISTS "Admins can view all bets" ON public.bets;
CREATE POLICY "Admins can view all bets" ON public.bets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS bets_user_id_idx ON public.bets(user_id);
CREATE INDEX IF NOT EXISTS bets_round_id_idx ON public.bets(round_id);
CREATE INDEX IF NOT EXISTS bets_created_at_idx ON public.bets(created_at DESC);
CREATE INDEX IF NOT EXISTS bets_status_idx ON public.bets(status);

-- =====================================================
-- 5. TRANSACTIONS TABLE
-- =====================================================
-- Stores all deposits and withdrawals
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bonus', 'bet', 'win')),
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  balance_before DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  reference TEXT UNIQUE,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- System can create transactions (handled via functions)
DROP POLICY IF EXISTS "System can create transactions" ON public.transactions;
CREATE POLICY "System can create transactions" ON public.transactions
  FOR INSERT WITH CHECK (true);

-- Admins can view all transactions
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Admins can update transactions
DROP POLICY IF EXISTS "Admins can update transactions" ON public.transactions;
CREATE POLICY "Admins can update transactions" ON public.transactions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON public.transactions(type);
CREATE INDEX IF NOT EXISTS transactions_status_idx ON public.transactions(status);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS transactions_reference_idx ON public.transactions(reference);

-- =====================================================
-- 6. MPESA TRANSACTIONS TABLE
-- =====================================================
-- Stores M-Pesa STK push transactions for deposits/withdrawals
CREATE TABLE IF NOT EXISTS public.mpesa_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  phone_number TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal')),
  merchant_request_id TEXT,
  checkout_request_id TEXT UNIQUE,
  mpesa_receipt_number TEXT,
  result_code TEXT,
  result_desc TEXT,
  callback_metadata JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mpesa_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own M-Pesa transactions
DROP POLICY IF EXISTS "Users can view own mpesa transactions" ON public.mpesa_transactions;
CREATE POLICY "Users can view own mpesa transactions" ON public.mpesa_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- System can create M-Pesa transactions
DROP POLICY IF EXISTS "System can create mpesa transactions" ON public.mpesa_transactions;
CREATE POLICY "System can create mpesa transactions" ON public.mpesa_transactions
  FOR INSERT WITH CHECK (true);

-- Admins can view all M-Pesa transactions
DROP POLICY IF EXISTS "Admins can view all mpesa transactions" ON public.mpesa_transactions;
CREATE POLICY "Admins can view all mpesa transactions" ON public.mpesa_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS mpesa_transactions_user_id_idx ON public.mpesa_transactions(user_id);
CREATE INDEX IF NOT EXISTS mpesa_transactions_checkout_request_id_idx ON public.mpesa_transactions(checkout_request_id);
CREATE INDEX IF NOT EXISTS mpesa_transactions_status_idx ON public.mpesa_transactions(status);
CREATE INDEX IF NOT EXISTS mpesa_transactions_created_at_idx ON public.mpesa_transactions(created_at DESC);

-- =====================================================
-- 7. FUNCTIONS AND TRIGGERS
-- =====================================================

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

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_settings_updated_at ON public.game_settings;
CREATE TRIGGER update_game_settings_updated_at
  BEFORE UPDATE ON public.game_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bets_updated_at ON public.bets;
CREATE TRIGGER update_bets_updated_at
  BEFORE UPDATE ON public.bets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_transactions_updated_at ON public.transactions;
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_mpesa_transactions_updated_at ON public.mpesa_transactions;
CREATE TRIGGER update_mpesa_transactions_updated_at
  BEFORE UPDATE ON public.mpesa_transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create transaction record
CREATE OR REPLACE FUNCTION public.create_transaction(
  p_user_id UUID,
  p_type TEXT,
  p_amount DECIMAL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_balance_before DECIMAL;
  v_balance_after DECIMAL;
  v_transaction_id UUID;
  v_reference TEXT;
BEGIN
  -- Get current balance
  SELECT balance INTO v_balance_before
  FROM public.profiles
  WHERE user_id = p_user_id;
  
  -- Calculate new balance
  IF p_type IN ('deposit', 'bonus', 'win') THEN
    v_balance_after := v_balance_before + p_amount;
  ELSIF p_type IN ('withdrawal', 'bet') THEN
    v_balance_after := v_balance_before - p_amount;
  ELSE
    RAISE EXCEPTION 'Invalid transaction type: %', p_type;
  END IF;
  
  -- Generate reference
  v_reference := UPPER(p_type) || '-' || p_user_id::text || '-' || extract(epoch from now())::bigint::text;
  
  -- Create transaction record
  INSERT INTO public.transactions (
    user_id,
    type,
    amount,
    balance_before,
    balance_after,
    status,
    description,
    reference,
    metadata
  ) VALUES (
    p_user_id,
    p_type,
    p_amount,
    v_balance_before,
    v_balance_after,
    'pending',
    p_description,
    v_reference,
    p_metadata
  ) RETURNING id INTO v_transaction_id;
  
  -- Update user balance
  UPDATE public.profiles
  SET balance = v_balance_after,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Update transaction status to completed
  UPDATE public.transactions
  SET status = 'completed',
      updated_at = now()
  WHERE id = v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$;

-- =====================================================
-- 8. VIEWS FOR ADMIN DASHBOARD
-- =====================================================

-- View for transaction summary
CREATE OR REPLACE VIEW public.transaction_summary AS
SELECT 
  DATE(created_at) as date,
  type,
  COUNT(*) as count,
  SUM(amount) as total_amount,
  SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_amount
FROM public.transactions
GROUP BY DATE(created_at), type;

-- View for user statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
  p.id,
  p.user_id,
  p.name,
  p.phone_number,
  p.balance,
  p.is_admin,
  p.created_at,
  COUNT(DISTINCT b.id) as total_bets,
  SUM(CASE WHEN b.status = 'won' THEN b.profit ELSE 0 END) as total_winnings,
  SUM(CASE WHEN b.status IN ('lost', 'pending') THEN b.amount ELSE 0 END) as total_losses,
  COUNT(DISTINCT t.id) FILTER (WHERE t.type = 'deposit') as total_deposits,
  SUM(t.amount) FILTER (WHERE t.type = 'deposit' AND t.status = 'completed') as total_deposited
FROM public.profiles p
LEFT JOIN public.bets b ON b.user_id = p.user_id
LEFT JOIN public.transactions t ON t.user_id = p.user_id
GROUP BY p.id, p.user_id, p.name, p.phone_number, p.balance, p.is_admin, p.created_at;

-- =====================================================
-- 9. ENABLE REALTIME
-- =====================================================

-- Enable realtime for bets and transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.bets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rounds;

-- =====================================================
-- END OF SCHEMA
-- =====================================================

