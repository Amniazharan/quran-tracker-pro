"use client"

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Pelajar",
    href: "/students",
  },
  {
    title: "Kehadiran",
    href: "/attendance",
  },
  {
    title: "Prestasi",
    href: "/performance",
  },
  {
    title: "Bayaran",
    href: "/payments",
  },
  {
    title: "Laporan",
    href: "/reports",
  },
]

export function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetTitle className="text-xl font-bold mb-6">QuranTracker Pro</SheetTitle>
        <div className="my-4 pb-10">
          <div className="flex flex-col space-y-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-base font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-emerald-600"
                    : "text-gray-600"
                )}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}