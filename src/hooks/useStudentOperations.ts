import { useState, useCallback } from 'react';
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

  // Cache current user
  const getCurrentUser = useCallback(async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (!user) throw new Error('Sila log masuk semula');
    return user;
  }, []);

  const addStudent = useCallback(async (studentData: Omit<Student, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();

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
  }, [getCurrentUser]);

  const getStudents = useCallback(async () => {
    try {
      setIsLoading(true);
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
  }, [getCurrentUser]);

  const updateStudent = useCallback(async (id: string, updates: Partial<Student>) => {
    try {
      setIsLoading(true);
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
  }, [getCurrentUser]);

  const deleteStudent = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
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
  }, [getCurrentUser]);

  return {
    isLoading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudents
  };
};