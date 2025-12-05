import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  user_id: string;
  name: string | null;
  phone_number: string | null;
  balance: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  email?: string;
}

export const useAdminUsers = (isAdmin: boolean) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Note: We can't fetch emails from client-side, so we'll just use the profile data
      // Emails can be added to profiles table or fetched via a serverless function
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const updateUser = useCallback(async (userId: string, updates: Partial<UserProfile>) => {
    if (!isAdmin) return false;

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (updateError) throw updateError;

      await fetchUsers();
      return true;
    } catch (err: any) {
      console.error('Error updating user:', err);
      return false;
    }
  }, [isAdmin, fetchUsers]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, fetchUsers]);

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    updateUser,
  };
};

