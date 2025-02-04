"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { PaymentForm } from '@/components/forms/payment-form';
import { usePaymentOperations, Payment } from '@/hooks/usePaymentOperations';
import { toast } from "sonner";

export default function PaymentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { getPayments, deletePayment } = usePaymentOperations();

  const fetchPayments = useCallback(async () => {
    try {
      const data = await getPayments();
      setPayments(data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal mendapatkan senarai bayaran: ${error.message}`);
      }
    }
  }, [getPayments]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleAdd = () => {
    setSelectedPayment(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Adakah anda pasti untuk memadam rekod bayaran ini?')) {
      try {
        await deletePayment(id);
        toast.success('Rekod bayaran berjaya dipadam');
        fetchPayments();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal memadam rekod bayaran: ${error.message}`);
        }
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedPayment(null);
    setFormMode('add');
  };

  // Calculate total payments for different statuses
  const totalPaid = payments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalPending = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const totalOverdue = payments
    .filter(p => p.status === 'Overdue')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const filteredPayments = payments.filter(payment => 
    payment.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.payment_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-emerald-800">Rekod Bayaran</h1>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Bayaran
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700">Jumlah Sudah Bayar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              RM {totalPaid.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700">Belum Bayar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              RM {totalPending.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700">Tertunggak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">
              RM {totalOverdue.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Cari bayaran..."
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{payment.student?.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(payment.payment_date)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">
                    RM {payment.amount.toFixed(2)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                    {payment.status === 'Paid' ? 'Sudah Bayar' : 
                     payment.status === 'Pending' ? 'Belum Bayar' : 'Tertunggak'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(payment)}
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(payment.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p>Kaedah Bayaran: {payment.payment_method}</p>
                {payment.notes && <p className="mt-1">Nota: {payment.notes}</p>}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tiada rekod bayaran ditemui
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      <PaymentForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        mode={formMode}
        initialData={selectedPayment || undefined}
        onSuccess={fetchPayments}
      />
    </div>
  );
}