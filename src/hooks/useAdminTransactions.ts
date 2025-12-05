import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'bonus' | 'bet' | 'win';
  amount: number;
  balance_before: number;
  balance_after: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string | null;
  description: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

export const useAdminTransactions = (isAdmin: boolean) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{
    type?: string;
    status?: string;
    limit?: number;
  }>({ limit: 100 });

  const fetchTransactions = useCallback(async () => {
    if (!isAdmin) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(filter.limit || 100);

      if (filter.type) {
        query = query.eq('type', filter.type);
      }

      if (filter.status) {
        query = query.eq('status', filter.status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Fetch user info for each transaction
      const transactionsWithUsers = await Promise.all(
        (data || []).map(async (transaction) => {
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('name')
              .eq('user_id', transaction.user_id)
              .single();

            // Try to get email (this might not work with RLS, so we'll use a workaround)
            return {
              ...transaction,
              user_name: profileData?.name || 'Unknown',
              user_email: 'N/A', // Will be populated if we have access
            };
          } catch {
            return {
              ...transaction,
              user_name: 'Unknown',
              user_email: 'N/A',
            };
          }
        })
      );

      setTransactions(transactionsWithUsers);
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, filter]);

  const updateTransactionStatus = useCallback(
    async (transactionId: string, status: Transaction['status']) => {
      if (!isAdmin) return false;

      try {
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', transactionId);

        if (updateError) throw updateError;

        await fetchTransactions();
        return true;
      } catch (err: any) {
        console.error('Error updating transaction:', err);
        return false;
      }
    },
    [isAdmin, fetchTransactions]
  );

  useEffect(() => {
    if (isAdmin) {
      fetchTransactions();
    }
  }, [isAdmin, fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    filter,
    setFilter,
    refreshTransactions: fetchTransactions,
    updateTransactionStatus,
  };
};


