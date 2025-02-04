import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'Cash' | 'Online Banking' | 'Touch n Go' | 'Other';
  status: 'Paid' | 'Pending' | 'Overdue';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  student?: {
    name: string;
  };
}

export const usePaymentOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('Sila log masuk semula');
    return user;
  }, []);

  const addPayment = useCallback(async (paymentData: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      await getCurrentUser();

      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select('*, student:students(name)')
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  const getPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      await getCurrentUser();

      const { data, error } = await supabase
        .from('payments')
        .select('*, student:students(name)')
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  const updatePayment = useCallback(async (id: string, updates: Partial<Payment>) => {
    try {
      setIsLoading(true);
      await getCurrentUser();

      const { data, error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', id)
        .select('*, student:students(name)')
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  const deletePayment = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      await getCurrentUser();

      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  const getStudentPayments = useCallback(async (studentId: string) => {
    try {
      setIsLoading(true);
      await getCurrentUser();

      const { data, error } = await supabase
        .from('payments')
        .select('*, student:students(name)')
        .eq('student_id', studentId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  return {
    isLoading,
    error,
    addPayment,
    getPayments,
    updatePayment,
    deletePayment,
    getStudentPayments,
  };
};