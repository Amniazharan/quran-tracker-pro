import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Student {
  id: string;
  user_id: string;
  name: string;
  age: number;
  current_surah: string;
  current_ayat: number;
  class_time: string;
  location: string;
  payment_status: boolean;
  performance: 'Lancar' | 'Perlu Latihan';
  created_at?: string;
  updated_at?: string;
}

export const useStudentOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function untuk dapatkan current user
  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('Sila log masuk semula');
    return user;
  };

  const addStudent = async (studentData: Omit<Student, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    setError(null);
    try {
      // Dapatkan current user
      const user = await getCurrentUser();

      // Insert student dengan user_id
      const { data, error } = await supabase
        .from('students')
        .insert([{
          ...studentData,
          user_id: user.id
        }])
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
      // Dapatkan current user
      const user = await getCurrentUser();

      // Update student yang dimiliki oleh user sahaja
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id) // Pastikan student ni kepunyaan user ni
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
      // Dapatkan current user
      const user = await getCurrentUser();

      // Delete student yang dimiliki oleh user sahaja
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Pastikan student ni kepunyaan user ni

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
      // Dapatkan current user
      const user = await getCurrentUser();

      // Get students yang dimiliki oleh user sahaja
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id) // Filter by user_id
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

  return {
    isLoading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudents
  };
};