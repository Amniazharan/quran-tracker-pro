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

export const useStudentOperations = () => {
  const addStudent = async (studentData: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error('Sila log masuk semula');

      const { data, error } = await supabase
        .from('students')
        .insert([{ ...studentData, user_id: session.session.user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error('Sila log masuk semula');

      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .eq('user_id', session.session.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error('Sila log masuk semula');

      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)
        .eq('user_id', session.session.user.id);

      if (error) throw error;
    } catch (err) {
      throw err;
    }
  };

  const getStudents = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) throw new Error('Sila log masuk semula');

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    addStudent,
    updateStudent,
    deleteStudent,
    getStudents
  };
};