import Link from "next/link"
import { RegisterForm } from "@/components/forms/register-form"
import { Book } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Login Link */}
      <div className="w-full py-4 px-4 border-b bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-emerald-600" />
            <span className="font-semibold text-lg text-emerald-900">QuranTracker Pro</span>
          </div>
          <Link 
            href="/login"
            className="text-sm text-emerald-600 hover:text-emerald-700"
          >
            Log Masuk
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          {/* Form Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Daftar Akaun Baru
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Isi maklumat di bawah untuk mula menggunakan sistem
            </p>
          </div>

          {/* Register Form */}
          <RegisterForm />

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Sudah ada akaun?{" "}
            <Link
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              Log masuk di sini
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}