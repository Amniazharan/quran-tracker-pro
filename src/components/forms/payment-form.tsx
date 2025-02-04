import React, { useState, useCallback, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { usePaymentOperations, Payment } from '@/hooks/usePaymentOperations';
import { useStudentOperations } from '@/hooks/useStudentOperations';

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: Payment;
  onSuccess?: () => void;
  studentId?: string;
}

const defaultPayment = {
  student_id: '',
  amount: 0,
  payment_date: new Date().toISOString().split('T')[0],
  payment_method: 'Cash' as 'Cash' | 'Online Banking' | 'Touch n Go' | 'Other',
  status: 'Pending' as 'Pending' | 'Paid' | 'Overdue',
  notes: ''
};

export const PaymentForm = React.memo(function PaymentForm({
  isOpen,
  onClose,
  mode,
  initialData,
  onSuccess,
  studentId
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    ...defaultPayment,
    student_id: studentId || ''
  });
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  
  const { addPayment, updatePayment, isLoading } = usePaymentOperations();
  const { getStudents } = useStudentOperations();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data || []);
      } catch (error) {
        console.error('Error loading students:', error);
        toast.error('Gagal memuat senarai pelajar');
      }
    };
    loadStudents();
  }, [getStudents]);

  useEffect(() => {
    if (initialData) {
      // Ensure all required fields are present
      setFormData({
        student_id: initialData.student_id,
        amount: initialData.amount,
        payment_date: initialData.payment_date.split('T')[0],
        payment_method: initialData.payment_method,
        status: initialData.status,
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        ...defaultPayment,
        student_id: studentId || ''
      });
    }
  }, [initialData, studentId, isOpen]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.student_id || !formData.amount || !formData.payment_date) {
        throw new Error('Sila isi semua maklumat yang diperlukan');
      }

      const paymentData = {
        ...formData,
        amount: Number(formData.amount)
      };

      if (mode === 'add') {
        await addPayment(paymentData);
        toast.success("Bayaran berjaya ditambah!");
      } else if (initialData?.id) {
        await updatePayment(initialData.id, paymentData);
        toast.success("Bayaran berjaya dikemaskini!");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : "Ralat berlaku semasa menyimpan data");
    }
  }, [formData, mode, initialData, addPayment, updatePayment, onSuccess, onClose]);

  const handleInputChange = useCallback((field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      title={mode === 'add' ? 'Tambah Bayaran Baru' : 'Kemaskini Bayaran'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Pelajar</Label>
          <select
            value={formData.student_id}
            onChange={(e) => handleInputChange('student_id', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            required
          >
            <option value="">Pilih Pelajar</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Jumlah (RM)</Label>
          <Input
            type="number"
            value={formData.amount || ''}
            onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Tarikh Bayaran</Label>
          <Input
            type="date"
            value={formData.payment_date}
            onChange={(e) => handleInputChange('payment_date', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Kaedah Bayaran</Label>
          <select
            value={formData.payment_method}
            onChange={(e) => handleInputChange('payment_method', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            required
          >
            <option value="Cash">Tunai</option>
            <option value="Online Banking">Online Banking</option>
            <option value="Touch n Go">Touch n Go</option>
            <option value="Other">Lain-lain</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            required
          >
            <option value="Paid">Sudah Bayar</option>
            <option value="Pending">Belum Bayar</option>
            <option value="Overdue">Tertunggak</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Nota</Label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Nota tambahan (optional)"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background min-h-[80px]"
          />
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
});