"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from "sonner"

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })

      if (signUpError) throw signUpError

      await supabase.auth.signOut()
      
      toast.success("Pendaftaran berjaya! Sila log masuk dengan akaun anda.")
      router.push('/login')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
        toast.error(error.message)
      } else {
        setError(String(error))
        toast.error("Ralat berlaku")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder="Nama"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          disabled={isLoading}
        />
      </div>
      <div>
        <Input
          name="password"
          placeholder="Kata Laluan"
          type="password"
          required
          disabled={isLoading}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        disabled={isLoading}
      >
        {isLoading ? 'Mendaftar...' : 'Daftar'}
      </Button>
    </form>
  )
}