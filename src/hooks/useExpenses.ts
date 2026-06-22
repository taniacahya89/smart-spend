import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Expense, ExpenseFormData } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/context/ToastContext';

export const useExpenses = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const mappedExpenses: Expense[] = (data || []).map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        amount: Number(item.amount),
        category: item.category,
        description: item.description,
        date: item.date,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));

      setExpenses(mappedExpenses);
    } catch (err: any) {
      console.error('Error fetching expenses:', err);
      setError(err.message || 'Gagal mengambil data pengeluaran');
      showToast('Gagal memuat data pengeluaran', 'danger');
    } finally {
      setLoading(false);
    }
  }, [user, showToast]);

  const addExpense = async (formData: ExpenseFormData) => {
    if (!user) return null;
    setSaving(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            user_id: user.id,
            amount: formData.amount,
            category: formData.category,
            description: formData.description || null,
            date: formData.date,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const newExpense: Expense = {
        id: data.id,
        userId: data.user_id,
        amount: Number(data.amount),
        category: data.category,
        description: data.description,
        date: data.date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setExpenses((prev) => [newExpense, ...prev]);
      showToast('Pengeluaran berhasil ditambahkan!', 'success');
      return newExpense;
    } catch (err: any) {
      console.error('Error adding expense:', err);
      showToast('Gagal menambahkan pengeluaran', 'danger');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateExpense = async (id: string, formData: ExpenseFormData) => {
    if (!user) return false;
    setSaving(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: formData.amount,
          category: formData.category,
          description: formData.description || null,
          date: formData.date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updated: Expense = {
        id: data.id,
        userId: data.user_id,
        amount: Number(data.amount),
        category: data.category,
        description: data.description,
        date: data.date,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setExpenses((prev) => prev.map((exp) => (exp.id === id ? updated : exp)));
      showToast('Pengeluaran berhasil diperbarui!', 'success');
      return true;
    } catch (err: any) {
      console.error('Error updating expense:', err);
      showToast('Gagal memperbarui pengeluaran', 'danger');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return false;
    setDeletingId(id);
    setError(null);
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);

      if (error) throw error;

      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      showToast('Pengeluaran berhasil dihapus!', 'success');
      return true;
    } catch (err: any) {
      console.error('Error deleting expense:', err);
      showToast('Gagal menghapus pengeluaran', 'danger');
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      setExpenses([]);
    }
  }, [user, fetchExpenses]);

  return {
    expenses,
    loading,
    saving,
    deletingId,
    error,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  };
};
