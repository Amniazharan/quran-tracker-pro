import { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import UserAuthForm from "@/components/auth/user-auth-form"

export const metadata: Metadata = {
  title: "Login | QuranTracker Pro",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex relative bg-gradient-to-br from-emerald-800 to-emerald-950 p-12">
        <div className="relative z-20 flex h-full flex-col justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center text-lg font-medium text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            QuranTracker Pro
          </div>
          
          {/* Tagline */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 p-4 rounded-lg backdrop-blur-sm border border-white/10">
              <blockquote className="space-y-2">
                <p className="text-lg text-white/90">
                  &ldquo;Sistem pengurusan kelas Al-Quran yang memudahkan urusan guru dan pelajar.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Decorative background */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/50 to-emerald-800/50" />
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} 
        />
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto w-full max-w-sm space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-emerald-900">
              Log Masuk ke Akaun
            </h1>
            <p className="text-sm text-muted-foreground">
              Masukkan email dan kata laluan anda untuk log masuk
            </p>
          </div>

          <UserAuthForm />

          <p className="text-center text-sm text-muted-foreground">
            Belum ada akaun?{" "}
            <Link
              href="/register"
              className="text-emerald-600 hover:text-emerald-700 hover:underline underline-offset-4"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>

      {/* Register button for mobile */}
      <Link
        href="/register"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8 lg:hidden"
        )}
      >
        Daftar Akaun
      </Link>
    </div>
  )
}