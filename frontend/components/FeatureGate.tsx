import React from "react"
import { useUserRole } from "@/hooks/useUserRole"

export function FeatureGate({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) {
  const { role, loading, error } = useUserRole()
  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800 text-center">
        This feature is for premium users. <a href="/pricing" className="underline text-green-700">Upgrade now</a>
      </div>
    )
  }
  return <>{children}</>
} 