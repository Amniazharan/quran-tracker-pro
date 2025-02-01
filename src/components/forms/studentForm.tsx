import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useStudentOperations, Student } from '@/hooks/useStudentOperations';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: Student;
  onSuccess?: () => void;
}

const defaultStudent = {
  name: '',
  age: 0,
  current_surah: '',
  current_ayat: 0,
  class_time: '',
  location: '',
  payment_status: false,
  performance: 'Perlu Latihan' as "Perlu Latihan" | "Lancar"
};

export function StudentForm({
  isOpen,
  onClose,
  mode,
  initialData,
  onSuccess
}: StudentFormProps) {
  const [formData, setFormData] = useState(initialData || defaultStudent);
  const { addStudent, updateStudent, isLoading } = useStudentOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'add') {
        await addStudent(formData);
        toast.success("Pelajar berjaya ditambah!");
      } else {
        if (initialData?.id) {
          await updateStudent(initialData.id, formData);
          toast.success("Pelajar berjaya dikemaskini!");
        }
      }

      onSuccess?.();
      onClose();
      setFormData(defaultStudent);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ralat berlaku semasa menyimpan data";
      toast.error(errorMessage);
    }
  };

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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nama penuh pelajar"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Umur</Label>
          <Input
            type="number"
            value={formData.age || ''}
            onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
            placeholder="Umur pelajar"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Surah</Label>
            <Input
              value={formData.current_surah}
              onChange={(e) => setFormData({ ...formData, current_surah: e.target.value })}
              placeholder="Contoh: Al-Fatihah"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Ayat</Label>
            <Input
              type="number"
              value={formData.current_ayat || ''}
              onChange={(e) => setFormData({ ...formData, current_ayat: parseInt(e.target.value) })}
              placeholder="No. ayat"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Masa Kelas</Label>
          <Input
            type="time"
            value={formData.class_time}
            onChange={(e) => setFormData({ ...formData, class_time: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Lokasi</Label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Contoh: Surau Al-Hidayah"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Status Bayaran</Label>
          <select
            value={formData.payment_status ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value === 'true' })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            required
          >
            <option value="true">Sudah Bayar</option>
            <option value="false">Belum Bayar</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Prestasi</Label>
          <select
            value={formData.performance}
            onChange={(e) => setFormData({ ...formData, performance: e.target.value as "Lancar" | "Perlu Latihan" })}
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