import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Student {
  id: string;
  name: string;
  age: number;
  current_surah: string;
  current_ayat: number;
  class_time: string;
  location: string;
  performance: 'Lancar' | 'Perlu Latihan';
  created_at?: string;
  updated_at?: string;
}

export interface StudentWithPayment extends Student {
  payment_status: 'Paid' | 'Pending' | 'Overdue';
  last_payment_date?: string;
  last_payment_amount?: number;
  payments?: Array<{
    status: 'Paid' | 'Pending' | 'Overdue';
    payment_date: string;
    amount: number;
  }>;
}

export const useStudentOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('Sila log masuk semula');
    return user;
  }, []);

  const addStudent = async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from('students')
        .insert([{ ...studentData, user_id: user.id }])
        .select()
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
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
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
  };

  const deleteStudent = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getStudentsWithPayments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();

      // Get students with their payments
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select(`
          *,
          payments (
            status,
            payment_date,
            amount
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (studentsError) throw studentsError;

      // Process and transform the data
      const processedData: StudentWithPayment[] = studentsData.map(student => {
        const latestPayment = student.payments?.[0];
        return {
          ...student,
          payment_status: latestPayment?.status || 'Pending',
          last_payment_date: latestPayment?.payment_date || undefined,
          last_payment_amount: latestPayment?.amount || undefined
        };
      });

      return processedData;
    } catch (err) {
      const error = err as Error;
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudents,
    getStudentsWithPayments
  };
};