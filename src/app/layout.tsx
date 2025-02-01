import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | QuranTracker Pro",
    default: "QuranTracker Pro - Sistem Pengurusan Kelas Al-Quran",
  },
  description: "Sistem pengurusan kelas Al-Quran yang memudahkan urusan guru dan pelajar.",
  keywords: [
    "Quran",
    "Management System",
    "Education",
    "Islamic Studies",
    "Student Management",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}