"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { StudentForm } from '@/components/forms/studentForm';
import { useStudentOperations, Student } from '@/hooks/useStudentOperations';
import { toast } from "sonner";

export default function DashboardPage() {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { getStudents, deleteStudent } = useStudentOperations();

  // Convert fetchStudents to useCallback
  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudents();
      setStudents(data || []);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Gagal mendapatkan senarai pelajar: ${error.message}`);
      }
    }
  }, [getStudents]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]); // Now fetchStudents is properly listed as a dependency

  // Add delete handler
  const handleDelete = async (id: string) => {
    if (window.confirm('Adakah anda pasti untuk memadam pelajar ini?')) {
      try {
        await deleteStudent(id);
        toast.success('Pelajar berjaya dipadam');
        fetchStudents(); // Refresh the list
      } catch (error) {
        if (error instanceof Error) {
          toast.error(`Gagal memadam pelajar: ${error.message}`);
        }
      }
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-emerald-800">Dashboard Guru</h1>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setIsAddStudentOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Pelajar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
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
            <CardTitle className="text-lg text-emerald-700">Belum Bayar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">
              {filteredStudents.filter(s => !s.payment_status).length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-emerald-700">Prestasi Cemerlang</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-500">
              {filteredStudents.filter(s => s.performance === 'Lancar').length}
            </p>
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
                      onClick={() => {/* Handle edit */}}
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
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs
                      ${student.payment_status 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"}`}
                  >
                    {student.payment_status ? "Sudah Bayar" : "Belum Bayar"}
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
      </div>

      {/* Student Form Modal */}
      <StudentForm 
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        mode="add"
        onSuccess={fetchStudents}
      />
    </div>
  );
}