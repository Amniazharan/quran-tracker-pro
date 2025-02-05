import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useStudentOperations } from '@/hooks/useStudentOperations';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: {
    id?: string;
    name: string;
    age: number;
    current_surah: string;
    current_ayat: number;
    class_time: string;
    location: string;
    performance: "Perlu Latihan" | "Lancar";
  };
  onSuccess?: () => void;
}

const defaultStudent = {
  name: '',
  age: 0,
  current_surah: '',
  current_ayat: 0,
  class_time: '',
  location: '',
  performance: 'Perlu Latihan' as "Perlu Latihan" | "Lancar"
};

export function StudentForm({
  isOpen,
  onClose,
  mode,
  initialData,
  onSuccess
}: StudentFormProps) {
  const [formData, setFormData] = useState(defaultStudent);
  const { addStudent, updateStudent } = useStudentOperations();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultStudent);
    }
  }, [initialData, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const studentData = {
        ...formData,
        age: Number(formData.age),
        current_ayat: Number(formData.current_ayat)
      };

      if (mode === 'add') {
        await addStudent(studentData);
        toast.success("Pelajar berjaya ditambah!");
      } else if (initialData?.id) {
        await updateStudent(initialData.id, studentData);
        toast.success("Pelajar berjaya dikemaskini!");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Form error:', error);
      toast.error(error instanceof Error ? error.message : "Ralat berlaku");
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(field: keyof typeof formData, value: string | number) {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      title={mode === 'add' ? 'Tambah Pelajar Baru' : 'Kemaskini Pelajar'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Nama Pelajar</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nama penuh pelajar"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Umur</Label>
          <Input
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleChange('age', e.target.value)}
            placeholder="Umur pelajar"
            required
            min="1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Surah</Label>
            <Input
              value={formData.current_surah}
              onChange={(e) => handleChange('current_surah', e.target.value)}
              placeholder="Contoh: Al-Fatihah"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Ayat</Label>
            <Input
              type="number"
              value={formData.current_ayat || ''}
              onChange={(e) => handleChange('current_ayat', e.target.value)}
              placeholder="No. ayat"
              required
              min="1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Masa Kelas</Label>
          <Input
            type="time"
            value={formData.class_time}
            onChange={(e) => handleChange('class_time', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Lokasi</Label>
          <Input
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Contoh: Surau Al-Hidayah"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Prestasi</Label>
          <select
            value={formData.performance}
            onChange={(e) => handleChange('performance', e.target.value as "Lancar" | "Perlu Latihan")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            required
          >
            <option value="Lancar">Lancar</option>
            <option value="Perlu Latihan">Perlu Latihan</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button 
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading 
              ? mode === 'add' ? 'Sedang ditambah...' : 'Sedang dikemaskini...'
              : mode === 'add' ? 'Tambah' : 'Simpan'
            }
          </Button>
        </div>
      </form>
    </Dialog>
  );
}