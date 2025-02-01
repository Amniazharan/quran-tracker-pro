import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StudentData {
  name: string;
  age: number;
  current_surah: string;
  current_ayat: number;
  class_time: string;
  location: string;
  payment_status: boolean;
  performance: 'Lancar' | 'Perlu Latihan';
}

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentData) => void;
  initialData?: StudentData;
  mode: 'add' | 'edit';
}

export function StudentForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}: StudentFormProps) {
  const [formData, setFormData] = useState<StudentData>({
    name: initialData?.name || '',
    age: initialData?.age || 0,
    current_surah: initialData?.current_surah || '',
    current_ayat: initialData?.current_ayat || 0,
    class_time: initialData?.class_time || '',
    location: initialData?.location || '',
    payment_status: initialData?.payment_status || false,
    performance: initialData?.performance || 'Perlu Latihan'
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Tambah Pelajar' : 'Kemaskini Pelajar'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Pelajar</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nama penuh pelajar"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Umur</label>
          <Input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
            placeholder="Umur pelajar"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Surah</label>
            <Input
              value={formData.current_surah}
              onChange={(e) => setFormData({ ...formData, current_surah: e.target.value })}
              placeholder="Contoh: Al-Fatihah"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ayat</label>
            <Input
              type="number"
              value={formData.current_ayat}
              onChange={(e) => setFormData({ ...formData, current_ayat: Number(e.target.value) })}
              placeholder="No. ayat"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Masa Kelas</label>
          <Input
            type="time"
            value={formData.class_time}
            onChange={(e) => setFormData({ ...formData, class_time: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lokasi</label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Contoh: Surau Al-Hidayah"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status Bayaran</label>
          <select
            value={formData.payment_status ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value === 'true' })}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="true">Sudah Bayar</option>
            <option value="false">Belum Bayar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prestasi</label>
          <select
            value={formData.performance}
            onChange={(e) => setFormData({ ...formData, performance: e.target.value as 'Lancar' | 'Perlu Latihan' })}
            className="w-full border rounded-md p-2"
            required
          >
            <option value="Lancar">Lancar</option>
            <option value="Perlu Latihan">Perlu Latihan</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Memproses...' : mode === 'add' ? 'Tambah' : 'Simpan'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}