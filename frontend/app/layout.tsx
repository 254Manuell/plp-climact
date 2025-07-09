"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import Image from "next/image"
import { Leaf } from "lucide-react"
import { User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

const inter = Inter({ subsets: ["latin"] })

const menuItems = [
  { href: "/", label: "Home", icon: "\uD83C\uDFE0" },
  { href: "/dashboard", label: "Dashboard", icon: "\uD83D\uDCCA" },
  { href: "/analytics", label: "Analytics", icon: "\uD83D\uDCC8" },
  { href: "/blog", label: "Blog", icon: "\uD83D\uDCF0" },
  { href: "/community", label: "Community", icon: "\uD83E\uDD1D" },
  { href: "/chatbot", label: "Chatbot", icon: "🤖" },
  { href: "/login", label: "Login/Signup", icon: "\uD83D\uDD11" },
]

import { AuthProvider, useAuth } from "@/components/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [avatarOpen, setAvatarOpen] = useState(false)
  // For mobile: const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auth dropdown logic
  function UserDropdown() {
    const { user, logout } = useAuth();
    return (
      <div className="flex flex-col items-center py-6 border-b relative">
        <button
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200"
          onClick={() => setAvatarOpen((v) => !v)}
          aria-label="User menu"
        >
          <User className="w-10 h-10 text-green-600" />
        </button>
        <span className="mt-2 text-green-700 font-semibold text-lg">{user ? (user.user_metadata?.full_name || user.email) : "Guest"}</span>
        {/* Dropdown */}
        {avatarOpen && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-white border rounded-xl shadow-lg py-2 w-40 z-30 animate-fade-in">
            {user ? (
              <>
                <Link href="/profile" className="block px-4 py-2 hover:bg-green-50 text-gray-700">Profile</Link>
                <Link href="/settings" className="block px-4 py-2 hover:bg-green-50 text-gray-700">Settings</Link>
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-green-50 text-gray-700">Logout</button>
              </>
            ) : (
              <Link href="/login" className="block px-4 py-2 hover:bg-green-50 text-gray-700">Login/Signup</Link>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>ClimAct - Climate Action System</title>
        <meta name="description" content="Comprehensive climate action and air quality monitoring system" />
        <meta name="generator" content="v0.dev" />
      </head>
      <body className={inter.className + " bg-green-50 min-h-screen flex"}>
        <AuthProvider>
          {/* Sidebar Menu */}
          <aside className="w-64 bg-white border-r min-h-screen flex flex-col shadow-lg z-20 transition-all duration-300">
            {/* Branding */}
            <div className="flex items-center space-x-3 px-6 py-6 border-b">
              <Leaf className="w-10 h-10 text-green-600" />
              <span className="text-2xl font-bold text-green-700 tracking-wide">ClimAct</span>
            </div>
            {/* User Avatar with Dropdown */}
            <UserDropdown />
            {/* Menu */}
            <nav className="flex-1 flex flex-col gap-2 px-4 py-8">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-4 py-3 text-lg font-medium flex items-center gap-3 transition-all duration-200
                      ${isActive ? "bg-green-100 text-green-700 shadow-md scale-105" : "text-gray-700 hover:bg-green-50 hover:text-green-700"}
                    `}
                    prefetch={item.href !== "/"}
                    tabIndex={0}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {item.label}
                    {isActive && <span className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-auto px-6 py-4 text-xs text-gray-400">&copy; 2024 ClimAct</div>
          </aside>
          {/* Main Content */}
          <main className="flex-1 min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

// Add fade-in animation
// In globals.css or a CSS module:
// .animate-fade-in { animation: fadeIn 0.2s ease; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
