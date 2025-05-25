"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Tag, Truck, ShoppingCart, Menu, X, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Productos",
      href: "/dashboard/productos",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Categorías",
      href: "/dashboard/categorias",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Proveedores",
      href: "/dashboard/proveedores",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Órdenes",
      href: "/dashboard/ordenes",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar para móvil */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-slate-900/50" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex h-16 items-center justify-between px-4 border-b">
            <h2 className="text-xl font-bold">Sistema de Gestión</h2>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-4 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-md ${
                  pathname === item.href
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-slate-200 bg-white">
          <div className="flex h-16 items-center justify-center border-b border-slate-200">
            <h2 className="text-xl font-bold">Sistema de Gestión</h2>
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-md ${
                  pathname === item.href
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-5 w-5" />
                    <span>Admin</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href="/login">
                    <DropdownMenuItem className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
