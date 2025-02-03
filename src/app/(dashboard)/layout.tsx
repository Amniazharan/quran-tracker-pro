import React from 'react'
import Link from 'next/link'
import { UserButton } from '../../components/auth/user-button'
import { MainNav } from '../../components/main-nav'
import { MobileSidebar } from '../../components/mobile-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MobileSidebar />
          <Link href="/dashboard" className="flex items-center space-x-2 md:hidden">
            <span className="font-bold">QuranTracker Pro</span>
          </Link>
          <MainNav className="mx-6 hidden md:flex" />
          <div className="ml-auto flex items-center space-x-4">
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container flex h-14 items-center">
          <p className="text-sm text-muted-foreground">
            Built with ♥ by Amni Azharan
          </p>
        </div>
      </footer>
    </div>
  )
}