import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

export const useProfile = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // Handle case where profile does not exist yet (PGRST116)
        if (error.code === 'PGRST116') {
          const defaultName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
          const { data: inserted, error: insertError } = await supabase
            .from('user_profiles')
            .insert({
              id: user.id,
              name: defaultName,
              monthly_income: 0,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          setProfile({
            id: inserted.id,
            monthlyIncome: Number(inserted.monthly_income),
            name: inserted.name,
            createdAt: inserted.created_at,
            updatedAt: inserted.updated_at,
          });
        } else {
          throw error;
        }
      } else {
        setProfile({
          id: data.id,
          monthlyIncome: Number(data.monthly_income),
          name: data.name,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Gagal mengambil data profil');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const updateProfile = async (data: { monthlyIncome: number; name: string }) => {
    if (!user) return false;
    setIsSaving(true);
    setError(null);
    try {
      const { data: updated, error } = await supabase
        .from('user_profiles')
        .update({
          name: data.name,
          monthly_income: data.monthlyIncome,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile({
        id: updated.id,
        monthlyIncome: Number(updated.monthly_income),
        name: updated.name,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      });

      showToast('Profil berhasil diperbarui!', 'success');
      return true;
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      setError(err.message || 'Gagal memperbarui profil');
      showToast('Gagal memperbarui profil', 'danger');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user, fetchProfile]);

  return {
    profile,
    isLoading,
    isSaving,
    error,
    fetchProfile,
    updateProfile,
  };
};
