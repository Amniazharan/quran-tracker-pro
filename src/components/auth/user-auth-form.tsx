"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  isRegister?: boolean
}

export default function UserAuthForm({
  isRegister,
  ...props // Remove unused className
}: UserAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (isRegister) {
        // Handle Registration
        const { error: signUpError } = await supabase.auth.signUp({ // Remove unused data
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        })

        if (signUpError) throw signUpError

        // Sign out immediately after registration
        await supabase.auth.signOut()
        
        toast.success("Pendaftaran berjaya! Sila log masuk dengan akaun anda.")
        router.push("/login")
        return
        
      } else {
        // Handle Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (signInError) throw signInError

        toast.success("Log masuk berjaya!")
        router.push("/dashboard")
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err instanceof Error ? err.message : "Ralat berlaku")
      toast.error(err instanceof Error ? err.message : "Ralat berlaku")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6" {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          {isRegister && (
            <div className="grid gap-2">
              <Input
                id="name"
                placeholder="Nama penuh"
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="grid gap-2">
            <Input
              id="email"
              placeholder="nama@contoh.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Input
              id="password"
              placeholder="Kata laluan"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              disabled={isLoading}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isRegister ? "Daftar Akaun" : "Log Masuk"}
          </Button>
        </div>
      </form>
    </div>
  )
}