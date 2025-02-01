"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Book, Users, BadgeCheck, Calendar, BarChart3, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Book className="h-6 w-6 text-emerald-600" />
          <span className="ml-2 text-2xl font-bold text-emerald-900">QuranTracker Pro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Ciri-Ciri
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimoni
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pakej
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-emerald-900">
                Sistem Pengurusan Kelas Al-Quran Yang Efisien
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                Mudahkan pengurusan kelas Al-Quran anda dengan sistem digital yang lengkap. 
                Fokus pada pengajaran, biar kami urus yang lain.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Daftar Sekarang</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Log Masuk</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Users className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Pengurusan Pelajar</h3>
              <p className="text-gray-500">
                Urus maklumat pelajar, prestasi dan kemajuan pembelajaran dengan mudah
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <Calendar className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Jadual Kelas</h3>
              <p className="text-gray-500">
                Susun jadual kelas dan pantau kehadiran pelajar secara sistematik
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <BarChart3 className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Laporan Prestasi</h3>
              <p className="text-gray-500">
                Jana laporan prestasi pelajar dan analisis kemajuan pembelajaran
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <BadgeCheck className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Rekod Pencapaian</h3>
              <p className="text-gray-500">
                Rekod dan pantau pencapaian hafazan dan bacaan setiap pelajar
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <Shield className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Keselamatan Data</h3>
              <p className="text-gray-500">
                Data disimpan dengan selamat menggunakan teknologi terkini
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <Book className="h-12 w-12 text-emerald-600" />
              <h3 className="text-xl font-bold">Modul Pembelajaran</h3>
              <p className="text-gray-500">
                Akses kepada modul pembelajaran dan bahan rujukan digital
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-emerald-900">
                Sedia Untuk Memulakan?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl">
                Daftar sekarang dan nikmati sistem pengurusan yang efisien untuk kelas Al-Quran anda
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Cuba Percuma</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 QuranTracker Pro. Hak cipta terpelihara.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privasi
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terma
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Hubungi Kami
          </Link>
        </nav>
      </footer>
    </div>
  )
}