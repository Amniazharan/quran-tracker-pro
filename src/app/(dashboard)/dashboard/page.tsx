"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, Trash2, Calendar, Banknote } from 'lucide-react';
import { StudentForm } from '@/components/forms/studentForm';
import { useStudentOperations, Student } from '@/hooks/useStudentOperations';
import { toast } from "sonner";

interface StudentWithPayment extends Student {
  payment_status: 'Paid' | 'Pending' | 'Overdue';
  last_payment_date?: string;
  last_payment_amount?: number;
  payments?: Array<{
    status: 'Paid' | 'Pending' | 'Overdue';
    payment_date: string;
    amount: number;
  }>;
}

export default function DashboardPage() {
  // State untuk form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedStudent, setSelectedStudent] = useState<StudentWithPayment | null>(null);
  
  const [students, setStudents] = useState<StudentWithPayment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { getStudentsWithPayments, deleteStudent } = useStudentOperations();

  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudentsWithPayments();
      setStudents(data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal mendapatkan senarai pelajar: ${error.message}`);
      }
    }
  }, [getStudentsWithPayments]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handler untuk buka form edit
  const handleEdit = (student: StudentWithPayment) => {
    setSelectedStudent(student);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  // Handler untuk buka form tambah
  const handleAdd = () => {
    setSelectedStudent(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Adakah anda pasti untuk memadam pelajar ini?')) {
      try {
        await deleteStudent(id);
        toast.success('Pelajar berjaya dipadam');
        fetchStudents();
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal memadam pelajar: ${error.message}`);
        }
      }
    }
  };

  // Handler untuk tutup form
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedStudent(null);
    setFormMode('add');
  };

  // Calculate stats
  const stats = {
    paidCount: students.filter(s => s.payment_status === 'Paid').length,
    pendingCount: students.filter(s => s.payment_status === 'Pending').length,
    overdueCount: students.filter(s => s.payment_status === 'Overdue').length,
    performanceCount: students.filter(s => s.performance === 'Lancar').length
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.current_surah.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-emerald-800">Dashboard Guru</h1>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={handleAdd}
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Pelajar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700">Jumlah Pelajar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{filteredStudents.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700">Sudah Bayar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.paidCount}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700">Belum/Tertunggak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">
              {stats.pendingCount + stats.overdueCount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700">Prestasi Cemerlang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-500">{stats.performanceCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Cari pelajar..."
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Student Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-4">
                {/* Header with actions */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-sm text-gray-500">{student.age} tahun</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="text-emerald-600 hover:text-emerald-800 transition-colors"
                      onClick={() => handleEdit(student)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800 transition-colors"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Bacaan:</span>
                    <span className="text-sm font-medium">
                      {student.current_surah} ({student.current_ayat})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Kelas:</span>
                    <span className="text-sm font-medium">{student.class_time}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Lokasi:</span>
                    <span className="text-sm font-medium">{student.location}</span>
                  </div>

                  {student.last_payment_date && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Bayaran Terakhir:
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(student.last_payment_date)}
                      </span>
                    </div>
                  )}

                  {student.last_payment_amount && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        <Banknote className="h-3 w-3 inline mr-1" />
                        Jumlah:
                      </span>
                      <span className="text-sm font-medium">
                        RM {student.last_payment_amount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(student.payment_status)}`}
                  >
                    {student.payment_status === 'Paid' ? 'Sudah Bayar' : 
                     student.payment_status === 'Pending' ? 'Belum Bayar' : 'Tertunggak'}
                  </span>
                  
                  <span 
                    className={`px-2 py-1 rounded-full text-xs
                      ${student.performance === "Lancar"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-yellow-100 text-yellow-800"}`}
                  >
                    {student.performance}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredStudents.length === 0 && (
          <div className="col-span-full text-center py-8 text-gray-500">
            Tiada pelajar ditemui
          </div>
        )}
      </div>

      {/* Student Form Modal */}
      <StudentForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        mode={formMode}
        initialData={selectedStudent || undefined}
        onSuccess={fetchStudents}
      />
    </div>
  );
}