import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GameSettings {
  id: string;
  next_crash_point: number | null;
  is_active: boolean;
  set_by: string | null;
  created_at: string;
}

export const useGameSettings = (isAdmin: boolean) => {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchActiveSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('game_settings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSettings(data);
      return data?.next_crash_point ?? null;
    } catch (error) {
      console.error('Error fetching game settings:', error);
      return null;
    }
  }, []);

  const setCrashPoint = useCallback(async (crashPoint: number) => {
    if (!isAdmin) return false;
    
    setLoading(true);
    try {
      // Deactivate any existing active settings
      await supabase
        .from('game_settings')
        .update({ is_active: false })
        .eq('is_active', true);

      // Create new active setting
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('game_settings')
        .insert({
          next_crash_point: crashPoint,
          is_active: true,
          set_by: userData.user?.id,
        });

      if (error) throw error;
      
      await fetchActiveSettings();
      return true;
    } catch (error) {
      console.error('Error setting crash point:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAdmin, fetchActiveSettings]);

  const clearCrashPoint = useCallback(async () => {
    if (!isAdmin) return false;
    
    try {
      await supabase
        .from('game_settings')
        .update({ is_active: false })
        .eq('is_active', true);
      
      setSettings(null);
      return true;
    } catch (error) {
      console.error('Error clearing crash point:', error);
      return false;
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchActiveSettings();
  }, [fetchActiveSettings]);

  return {
    settings,
    loading,
    setCrashPoint,
    clearCrashPoint,
    fetchActiveSettings,
  };
};
